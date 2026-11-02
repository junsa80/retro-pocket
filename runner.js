/* Only accept messages from the hosting app on this origin. */
(() => {
  "use strict";
  const HOST_ORIGIN = location.origin;
  function updateGamepad() {
    let connected=false;
    try { connected=Array.from(navigator.getGamepads?.()||[]).some(pad=>pad&&pad.connected); } catch {}
    document.documentElement.classList.toggle("physical-gamepad",connected);
  }
  addEventListener("gamepadconnected",updateGamepad);
  addEventListener("gamepaddisconnected",updateGamepad);
  setInterval(updateGamepad,1000);updateGamepad();
  let loading = false;
  let started = false;
  const notify = (type, payload = {}) => parent.postMessage({app:"retro-pocket",type,...payload}, HOST_ORIGIN);
  function bytesOf(data) {
    if (data instanceof Uint8Array) return data;
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    if (Array.isArray(data)) return new Uint8Array(data);
    throw Error("저장 상태 형식이 올바르지 않습니다.");
  }
  async function command(cmd, message) {
    const manager = window.EJS_emulator && window.EJS_emulator.gameManager;
    if (!manager || !started) throw Error("게임 실행이 완료된 후 이용해 주세요.");
    if (cmd === "save") {
      const result = await manager.getState();
      const bytes = bytesOf(result);
      if (!bytes.byteLength) throw Error("저장 상태 데이터가 비어 있습니다.");
      notify("STATE_DATA", {state:bytes,requestId:message.requestId});
    } else if (cmd === "load") {
      const bytes = bytesOf(message.state);
      await manager.loadState(bytes);
      notify("STATE_LOADED");
    } else if (cmd === "fullscreen") {
      window.EJS_emulator.toggleFullscreen();
    }
  }
  window.addEventListener("message", async (event) => {
    if (event.source !== parent || event.origin !== HOST_ORIGIN || event.data?.app !== "retro-pocket") return;
    const data = event.data;
    try {
      if (data.type === "LOAD_ROM") {
        if (loading) return;
        loading = true;
        // Blob URLs are created on the same origin, from the user's local file.
        const rom = new URL(data.url, location.href);
        if (rom.protocol !== "blob:" || rom.origin !== HOST_ORIGIN) throw Error("로컬 ROM 주소를 확인할 수 없습니다.");
        if (!["gba","snes","nds","gb","nes"].includes(data.core)) throw Error("지원하지 않는 게임기입니다.");
        window.EJS_player = "#game";
        window.EJS_core = data.core;
        window.EJS_gameUrl = data.url;
        window.EJS_gameName = `rp-${data.core}-${data.romKey}`;
        window.EJS_threads = false;
        window.EJS_Buttons = {saveState:false,loadState:false,quickSave:false,quickLoad:false,fullscreen:false};
        window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
        window.EJS_startOnLoaded = true;
        window.EJS_language = "ko-KR";
        window.EJS_color = "#60e1e7";
        window.EJS_backgroundColor = "#000000";
        window.EJS_onGameStart = () => {started = true;notify("GAME_READY");};
        window.EJS_ready = () => notify("EMULATOR_READY");
        const script = document.createElement("script");
        script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
        script.onerror = () => notify("ERROR",{message:"에뮬레이터를 다운로드하지 못했습니다. 인터넷 연결과 광고 차단 설정을 확인하세요."});
        document.body.append(script);
        notify("ROM_ACCEPTED");
      } else if (data.type === "COMMAND") {
        await command(data.command, data);
      }
    } catch (e) {
      notify("ERROR",{message:String(e.message || e)});
    }
  });
  notify("RUNNER_READY");
})();
