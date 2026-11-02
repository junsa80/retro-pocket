/* Retro Pocket beta. All game data remains inside this browser session/device. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const dbName = "retro-pocket-v1";
  const state = {file:null,romKey:null,blobUrl:null,core:"gba",ready:false,runnerReady:false,slot:1,manualCore:false,notesTimer:null,toastTimer:null,selection:0,pendingSave:null,requestId:0};
  const coreForExt = {gba:"gba",sfc:"snes",smc:"snes",nds:"nds",gb:"gb",gbc:"gb",nes:"nes"};
  const ratios = {gba:1.5,snes:4/3,nds:2/3,gb:10/9,nes:4/3};
  let dbPromise;
  function showToast(message) {
    const node=$("toast");node.textContent=message;node.classList.add("visible");
    clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>node.classList.remove("visible"),3500);
  }
  function connection(text,active=false){$("connection").textContent=`● ${text}`;$("connection").classList.toggle("active",active);}
  function setReady(v){state.ready=v;for(const id of ["save-btn","load-btn","export-btn","import-btn"])$(id).disabled=!v;}
  function openDB(){
    if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
      if(!('indexedDB' in window))return reject(Error("이 브라우저는 로컬 저장을 지원하지 않습니다."));
      const req=indexedDB.open(dbName,1);
      req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains("states"))db.createObjectStore("states");};
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
    return dbPromise;
  }
  async function dbAction(mode,key,value){
    const db=await openDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction("states",mode);const store=tx.objectStore("states");
      const req=mode==="readwrite"?store.put(value,key):store.get(key);
      let result;req.onsuccess=()=>{result=req.result;};req.onerror=()=>reject(req.error);
      tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(tx.error||Error("저장이 취소되었습니다."));tx.onerror=()=>reject(tx.error);
    });
  }
  function saveKey(){return `${state.romKey}:slot:${state.slot}`;}
  function setButtons(){setReady(false);}
  function detectCore(file){const ext=file.name.split('.').pop().toLowerCase();return coreForExt[ext]||$("core-select").value;}
  function setSize(){
    if(matchMedia("(orientation: portrait)").matches){$("screen-outer").style.width="";return;}
    const area=$("play-grid"), style=getComputedStyle(area);
    const padX=parseFloat(style.paddingLeft)+parseFloat(style.paddingRight);
    const padY=parseFloat(style.paddingTop)+parseFloat(style.paddingBottom);
    const gap=parseFloat(style.columnGap)||0;
    const railWidth=2*52;
    const caption=$("screen-caption").getBoundingClientRect().height;
    const ratio=ratios[state.core]||1.5;
    const h=Math.max(0,area.clientHeight-padY-caption);
    const w=Math.max(0,Math.min(area.clientWidth-padX-railWidth-2*gap,h*ratio));
    $("screen-outer").style.width=`${w}px`;
  }
  let resizeTimer;addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(setSize,40);});
  async function fingerprint(file){
    if(globalThis.crypto?.subtle){
      const hash=await crypto.subtle.digest("SHA-256",await file.arrayBuffer());
      return Array.from(new Uint8Array(hash)).slice(0,16).map(n=>n.toString(16).padStart(2,'0')).join('');
    }
    return `${file.name}-${file.size}`;
  }
  function post(type,payload={}){
    const frame=$("emulator-frame");if(!frame.contentWindow)return false;
    frame.contentWindow.postMessage({app:"retro-pocket",type,...payload},location.origin);return true;
  }
  function pickRom(){$("rom-input").click();}
  async function fileSelected(file){
    if(!file)return;
    const ext=file.name.split('.').pop().toLowerCase();
    if(![...Object.keys(coreForExt),'zip'].includes(ext)){showToast("지원하지 않는 형식입니다. GBA / SFC / NDS / ZIP 등을 선택해 주세요.");return;}
    if(file.size===0){showToast("빈 파일입니다.");return;}
    if(file.size>512*1024*1024){showToast("현재 베타는 최대 512MB 파일까지 지원합니다.");return;}
    const selection=++state.selection;
    try{
      const romKey=await fingerprint(file);
      if(selection!==state.selection)return;
      flushNote();state.pendingSave=null;
      state.core=detectCore(file);$("core-select").value=state.core;
      state.romKey=romKey;state.file=file;
      $("game-label").textContent=file.name;$("screen-caption").textContent=`${file.name} · ${state.core.toUpperCase()} · 파일은 서버에 업로드되지 않습니다`;
      $("play-grid").style.setProperty("--game-ratio",ratios[state.core]);
      $("screen-outer").style.setProperty("--game-ratio",ratios[state.core]);
      setSize();setButtons();connection("로딩 중");
      if(state.blobUrl)URL.revokeObjectURL(state.blobUrl);
      state.blobUrl=URL.createObjectURL(file);
      state.runnerReady=false;
      $("start-screen").hidden=true;
      const frame=$("emulator-frame");frame.hidden=false;
      // New iframe guarantees an isolated clean emulator runtime for every ROM.
      frame.src=`./runner.html?session=${Date.now()}`;
      loadNote();closeDrawers();
      if(ext==='zip')showToast("ZIP 파일은 게임기 종류를 확인해 주세요.");
    }catch(e){showToast(`파일 준비 실패: ${e.message}`);connection("오류");}
  }
  window.addEventListener("message",async(event)=>{
    if(event.origin!==location.origin || event.source!==$("emulator-frame").contentWindow || event.data?.app!=="retro-pocket")return;
    const msg=event.data;
    try{
      switch(msg.type){
        case "RUNNER_READY":state.runnerReady=true;post("LOAD_ROM",{url:state.blobUrl,core:state.core,name:state.file?.name||"game",romKey:state.romKey});break;
        case "ROM_ACCEPTED":connection("에뮬레이터 준비 중");break;
        case "EMULATOR_READY":connection("시작 중");break;
        case "GAME_READY":setReady(true);connection("플레이 중",true);showToast("게임 실행 준비 완료! 🎮");break;
        case "STATE_DATA":{
          const pending=state.pendingSave;
          if(!pending||pending.id!==msg.requestId)break;
          state.pendingSave=null;
          const bytes=msg.state instanceof Uint8Array?msg.state:new Uint8Array(msg.state);
          await dbAction("readwrite",pending.key,{bytes,core:pending.core,name:pending.name,created:Date.now()});
          showToast(`슬롯 ${pending.slot} 강제 저장 완료`);break;
        }
        case "STATE_LOADED":showToast(`강제 불러오기 완료 · 슬롯 ${state.slot}`);break;
        case "ERROR":state.pendingSave=null;connection("확인 필요");showToast(msg.message||"실행 중 오류가 발생했습니다.");break;
      }
    }catch(e){showToast(`저장 처리 실패: ${e.message}`);}
  });
  async function save(){if(!state.ready)return showToast("게임이 실행된 뒤 저장할 수 있습니다.");if(state.pendingSave)return showToast("저장 처리 중입니다.");
    const pending={id:++state.requestId,key:saveKey(),slot:state.slot,core:state.core,name:state.file?.name};
    state.pendingSave=pending;post("COMMAND",{command:"save",requestId:pending.id});
    setTimeout(()=>{if(state.pendingSave===pending){state.pendingSave=null;showToast("저장 응답이 없습니다. 다시 시도해 주세요.");}},15000);}
  async function load(){
    if(!state.ready)return showToast("게임이 실행된 뒤 이용해 주세요.");
    try{
      const key=saveKey(),romKey=state.romKey;
      const rec=await dbAction("readonly",key);
      if(romKey!==state.romKey)return;
      if(!rec?.bytes)return showToast("선택한 슬롯에 저장된 게임이 없습니다.");
      post("COMMAND",{command:"load",state:rec.bytes});
    }catch(e){showToast(`불러오기 실패: ${e.message}`);}
  }
  function openDrawer(id){closeDrawers();$("overlay").hidden=false;$(id).inert=false;$(id).classList.add("open");$(id).setAttribute("aria-hidden","false");}
  function closeDrawers(){$("overlay").hidden=true;for(const id of ["guide-drawer","more-drawer"]){$(id).inert=true;$(id).classList.remove("open");$(id).setAttribute("aria-hidden","true");}}
  function notesKey(){return `retro-pocket-note:${state.romKey||"general"}`;}
  function flushNote(){clearTimeout(state.notesTimer);try{localStorage.setItem(notesKey(),$("stage-note").value);}catch{}}
  function loadNote(){try{$("stage-note").value=localStorage.getItem(notesKey())||"";}catch{$("stage-note").value="";showToast("메모 저장소를 사용할 수 없습니다.");}}
  async function exportState(){
    try{
      const rec=await dbAction("readonly",saveKey());
      if(!rec?.bytes)return showToast("먼저 강제 저장을 해주세요.");
      const blob=new Blob([rec.bytes],{type:"application/octet-stream"});
      const url=URL.createObjectURL(blob);const anchor=document.createElement("a");anchor.href=url;
      anchor.download=`${(state.file?.name||'game').replace(/\.[^.]+$/,'').replace(/[^\w\p{L}.-]/gu,'_')}-slot${state.slot}.state`;
      document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
      showToast("백업 파일을 다운로드했습니다.");
    }catch(e){showToast(`백업 실패: ${e.message}`);}
  }
  async function importState(file){
    if(!file||!state.romKey)return;
    if(file.size>20*1024*1024){showToast("저장 파일이 너무 큽니다.");return;}
    if(!confirm(`슬롯 ${state.slot}의 기존 데이터를 덮어쓰고 백업을 복구할까요?\n같은 게임·패치 버전의 저장 파일만 사용하세요.`))return;
    try{
      const key=saveKey(),romKey=state.romKey;
      const bytes=new Uint8Array(await file.arrayBuffer());
      if(!bytes.length)throw Error("빈 저장 파일입니다.");
      if(romKey!==state.romKey)return;
      await dbAction("readwrite",key,{bytes,core:state.core,name:state.file?.name,created:Date.now()});
      if(romKey!==state.romKey)return;
      post("COMMAND",{command:"load",state:bytes});
      showToast("백업을 저장하고 불러오기를 요청했습니다.");
    }catch(e){showToast(`복구 실패: ${e.message}`);}
  }
  $("pick-btn").addEventListener("click",pickRom);
  $("start-pick").addEventListener("click",pickRom);
  $("rom-input").addEventListener("change",e=>{const file=e.target.files?.[0];e.target.value="";fileSelected(file);});
  $("save-btn").addEventListener("click",save);
  $("load-btn").addEventListener("click",load);
  $("guide-btn").addEventListener("click",()=>openDrawer("guide-drawer"));
  $("more-btn").addEventListener("click",()=>openDrawer("more-drawer"));
  $("fullscreen-btn").addEventListener("click",async()=>{
    try{if(document.fullscreenElement){await document.exitFullscreen();}else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen();}else showToast("이 브라우저는 전체화면을 지원하지 않습니다.");}
    catch{showToast("브라우저에서 전체화면을 허용하지 않았습니다.");}
  });
  $("overlay").addEventListener("click",closeDrawers);
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeDrawers));
  $("stage-note").addEventListener("input",()=>{
    clearTimeout(state.notesTimer);state.notesTimer=setTimeout(()=>{
      try{localStorage.setItem(notesKey(),$("stage-note").value);$("notes-status").textContent="메모 저장 완료";}
      catch{$("notes-status").textContent="저장 공간 부족";}
    },350);
  });
  $("core-select").addEventListener("change",()=>{state.manualCore=true;showToast("다음 ROM 선택 시 새 게임기 설정을 사용합니다.");});
  $("slot-select").addEventListener("change",e=>{state.slot=Number(e.target.value);showToast(`슬롯 ${state.slot} 선택`);});
  $("export-btn").addEventListener("click",exportState);
  $("import-btn").addEventListener("click",()=>$("state-input").click());
  $("state-input").addEventListener("change",e=>{const f=e.target.files?.[0];e.target.value="";importState(f);});
  window.addEventListener("keydown",e=>{if(e.key==='Escape')closeDrawers();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)flushNote();if(document.hidden&&state.file)$("screen-caption").textContent="브라우저 종료 전 강제 저장을 권장합니다.";});
  document.querySelectorAll(".drawer").forEach(node=>node.inert=true);
  addEventListener("pagehide",flushNote);
  loadNote();setSize();
  if(location.protocol==='file:')showToast("index.html 직접 열기는 지원하지 않습니다. GitHub Pages로 배포해 주세요.");
})();
