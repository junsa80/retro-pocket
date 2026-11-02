(() => {
'use strict';
const api=window.RetroGuides;if(!api)return;
const $=id=>document.getElementById(id),select=$('guide-game-select'),content=$('guide-content');
let currentName='',currentKey='',currentMode='preview';
function element(tag,text,className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
function link(text,href){const a=element('a',text);a.href=href;a.target='_blank';a.rel='noopener noreferrer';return a;}
for(const g of api.catalog){const o=element('option',`${g.platform} · ${g.title}`);o.value=g.id;select.append(o);}
function bindKey(){return 'retro-pocket-guide:'+currentKey;}
function render(id,mode){
 currentMode=mode;select.value=id||'';content.replaceChildren();
 const game=api.catalog.find(g=>g.id===id);
 $('guide-reset').disabled=!currentName;
 $('guide-match').textContent=mode==='auto'?`파일명 자동 연결 · ${currentName}`:mode==='manual'?`직접 선택 · ${currentName||'ROM 실행 전 미리보기'}`:currentName?`파일명으로 찾지 못했어요 · ${currentName}`:'ROM을 불러오거나 아래에서 게임을 선택하세요.';
 if(!game){
  content.append(element('p',currentName?'이 파일에 연결된 공략이 없습니다. 위에서 게임을 선택하면 다음에도 같은 ROM에 연결됩니다.':'테스트 목록의 9개 게임 공략을 준비했습니다. ROM 없이도 위에서 게임을 선택해 읽을 수 있습니다.','hint'));
  return;
 }
 content.append(element('h3',`${game.title} · ${game.platform}`,'guide-game-title'));
 content.append(element('p','기본 운용·육성 요약과 주요 숨겨진 요소입니다. 회차별 전체 공략은 원문에서 확인하세요.','hint'));
 if(game.notice)content.append(element('p',game.notice,'guide-notice'));
 for(const group of game.sections){
  const section=element('section',undefined,'guide-section');section.append(element('h4',group.title));const ul=element('ul');
  for(const text of group.items)ul.append(element('li',text));section.append(ul);content.append(section);
 }
 const secrets=element('details',undefined,'guide-secrets');secrets.append(element('summary',`숨겨진 요소 ${game.secrets.length}건 · 스포일러 펼치기`));
 secrets.append(element('p','아래는 확인한 조건 중 일부입니다. 분기·회차·격추 담당을 함께 확인하세요.','hint'));
 for(const item of game.secrets){
  const card=element('section',undefined,'secret-card');card.append(element('h4',item.title),element('p',item.text));
  const source=game.sources[item.source];card.append(link(`조건 출처 · ${source.title}`,source.readUrl));secrets.append(card);
 }
 content.append(secrets);
 const sources=element('details',undefined,'guide-sources');sources.append(element('summary',`출처·확인일 · ${api.checkedAt}`));
 sources.append(element('p','나무위키 본문을 직접 열 수 없어 공개 미러에서 확인한 내용을 짧게 요약·재구성했습니다. 실시간 갱신이 아니며 패치·문서 개정에 따라 차이가 있을 수 있습니다.','hint'));
 for(const s of game.sources){const box=element('section',undefined,'source-card');box.append(element('b',s.title),element('p',`${s.author} · ${s.note}`));
  if(s.originalUrl){box.append(link('나무위키 원문·기여 이력 확인',s.originalUrl),document.createTextNode(' · '));}
  box.append(link('요약에 사용한 열람본',s.readUrl));sources.append(box);
 }
 sources.append(element('p','원문 기여자에게 출처를 표시합니다. 요약은 Retro Pocket에서 문장을 줄이고 재구성했습니다.','hint'));
 sources.append(link('요약 데이터: CC BY-NC-SA 2.0 KR','https://creativecommons.org/licenses/by-nc-sa/2.0/kr/'));content.append(sources);
}
function selectRom(name,key,ignoreSaved=false){
 currentName=name||'';currentKey=key||'';let saved;
 if(!ignoreSaved&&currentKey){try{saved=localStorage.getItem(bindKey());}catch{}}
 if(saved&&api.catalog.some(g=>g.id===saved)){render(saved,'manual');return;}
 const detected=api.detect(currentName);render(detected?.id,detected?'auto':'unknown');
}
select.addEventListener('change',()=>{const id=select.value;if(currentKey){try{if(id)localStorage.setItem(bindKey(),id);else localStorage.removeItem(bindKey());}catch{}}
 render(id,'manual');});
$('guide-reset').addEventListener('click',()=>{if(currentKey){try{localStorage.removeItem(bindKey());}catch{}}selectRom(currentName,currentKey,true);});
window.RetroGuideUI={selectRom};render(null,'preview');
})();
