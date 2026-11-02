/* Short, paraphrased guide summaries. Source attribution travels with each entry. */
(function(root){
'use strict';
const wiki=(title)=>'https://namu.wiki/w/'+encodeURIComponent(title);
const source=(title,readUrl,note='나무위키 문서를 공개 미러에서 확인')=>({title,originalUrl:wiki(title),readUrl,note,author:'나무위키 기여자',checkedAt:'2026-11-02'});
const section=(title,items)=>({title,items});
const catalog=[
 {id:'og',title:'슈퍼로봇대전 OG',platform:'GBA',file:'GBA슈퍼로봇대전OG.gba',
  notice:'GBA 원작용 요약입니다. 연결된 OG1 공략 문서는 PS2판 중심이므로 트윈·특수탄 등 PS2 전용 설명은 적용하지 않습니다.',
  sections:[section('육성·자금',[
   '무기를 각각 개조하는 방식입니다. 초반부터 모든 무기에 투자하기보다 저렴한 M950 머신건과 보스 격파용 주력 무기를 구분해 투자하세요.',
   '현재 선택한 루트에서 일찍 합류하는 멤버를 우선 육성하세요. 반대 루트의 멤버만 기다리면 초중반 전력이 부족해집니다.',
   'GBA판에서는 전멸 후 재도전 과정에서도 PP를 얻습니다. PS2판 공략의 PP 제한과 혼동하지 마세요.'
  ])],
  secrets:[{title:'길리엄의 게슈펜스트 R',text:'쿄스케 루트에서 20화 클리어 시 길리엄 Lv.23 이상. 류세이 루트에서는 입수할 수 없습니다.',source:1},
   {title:'시시오 블레이드',text:'26화 클리어 전 숙련도 23 이상. 추가로 류세이 루트는 류세이 50격추 이상, 쿄스케 루트는 쿄스케 70격추 이상이 필요합니다.',source:1}],
  sources:[source('슈퍼로봇대전 OG1/공략','https://seore.org/w/'+encodeURIComponent('슈퍼로봇대전 OG1/공략')),
   {title:'단바인27 · OG(GBA) 공략·숨겨진 요소',readUrl:'https://danbain.tistory.com/m/595',note:'GBA판 조건 교차 확인. 게시글은 나무위키를 출처로 명시.',author:'단바인27 / 나무위키 기여자',checkedAt:'2026-11-02'}]},
 {id:'og2',title:'슈퍼로봇대전 OG2',platform:'GBA',file:'GBA슈퍼로봇대전OG2.gba',
  notice:'GBA판과 PS2판의 시스템·숨겨진 조건이 다릅니다. GBA판 명시 내용만 추렸으며 트윈·특수탄 운용은 제외했습니다.',
  sections:[section('GBA판 핵심 운용',[
   '연속공격 스킬과 C 속성 고정 무기가 있으면 일렬로 선 적 여러 기를 공격할 수 있습니다. 범용 무기에는 C 무기가 없습니다.',
   '선천 스킬을 지울 수 없고 기존 스킬을 추가 육성할 때도 칸이 필요합니다. PP를 쓰기 전에 빈 스킬 칸부터 확인하세요.',
   '공격력만 높이려면 격투·사격 능력치 투자가 효율적입니다. 인파이트·건파이트는 이동력·사거리 보너스도 함께 보고 선택하세요.'
  ])],
  secrets:[{title:'바이사가: 첫 회차에서는 입수 불가',text:'PS2판과 달리 GBA판 바이사가는 2회차부터 가능합니다. 1회차에 해당 조건만 따라가며 격추수를 몰아주지 마세요.',source:0},
   {title:'시시오 블레이드',text:'14화 클리어 전 브릿트 Lv.18 이상·45격추 이상을 맞추면 17화 클리어 후 입수합니다.',source:1},
   {title:'부스트 해머',text:'16화에서 4턴 안에 아라드로 모든 건섹트를 격추하면 클리어 후 입수합니다.',source:1}],
  sources:[source('슈퍼로봇대전 OG2/공략','https://www.namu.moe/w/'+encodeURIComponent('슈퍼로봇대전 OG2/공략')),
   {title:'단바인27 · OG2(GBA) 공략·숨겨진 요소',readUrl:'https://danbain.tistory.com/entry/'+encodeURIComponent('슈퍼로봇대전OG2-공략-후기-및-숨겨진요소'),note:'GBA판 조건 교차 확인. 게시글은 나무위키를 출처로 명시.',author:'단바인27 / 나무위키 기여자',checkedAt:'2026-11-02'}]},
 {id:'a',title:'슈퍼로봇대전 A',platform:'GBA',file:'GBA시리즈1슈퍼로봇대전A.gba',
  notice:'GBA A 기준입니다. PSP의 A 포터블(AP) 공략과 조건을 섞지 마세요.',
  sections:[section('전투·개조',[
   '무기는 개별 개조입니다. 이동 후 사용할 수 있는 주력 무기와 보스용 무기를 먼저 정하고 투자하세요.',
   '기체를 전 항목 끝까지 개조해도 풀개조 보너스가 없습니다. 보너스를 노린 일괄 개조보다 필요한 성능을 먼저 보완하세요.',
   '일부 설득 동료와 격추 보상 파츠는 양자택일입니다. 설득 가능한 적을 처치하기 전에 영입 여부부터 정하세요.'
  ])],
  secrets:[{title:'초반: 리사',text:'슈퍼계 4화 클리어 시 료마 5격추 이상이면 합류합니다. 실제 출격은 겟타Q 입수 및 지상 루트 10화 이후를 기다려야 합니다.',source:0},
   {title:'7화 종료: G파이터 / 풀아머 건담',text:'세이라 격추수가 아무로 이상이면 G파이터, 아무로가 더 높으면 풀아머 건담입니다. GBA판의 선택 조건입니다.',source:0}],
  sources:[source('슈퍼로봇대전 A/공략','https://seore.org/w/'+encodeURIComponent('슈퍼로봇대전 A/공략'))]},
 {id:'r',title:'슈퍼로봇대전 R',platform:'GBA',file:'GBA시리즈2슈퍼로봇대전R.gba',
  sections:[section('전투·육성',[
   '좋아하는 기체 위주로 진행할 수 있지만 슈퍼계도 무개조 상태로 버티기 어렵습니다. 장갑·강화파츠와 철벽·불굴을 함께 활용하세요.',
   '슈퍼건담은 사격계 파일럿의 초중반 주력 후보입니다. Z와 ZZ를 함께 기르면 합체기 더블 메가 런처를 활용할 수 있습니다.',
   '50격추부터 출격 기력 +5, 100격추부터 +10입니다. 다회차를 고려한다면 주력 여러 명의 격추수도 관리하세요.'
  ])],
  secrets:[{title:'1화 분기가 31화 보상에 영향',text:'나데시코 루트는 고기동형 블랙 사레나, 역습의 샤아 루트는 양산형 뉴건담 입수와 연결됩니다.',source:0},
   {title:'엘피 플: 22화',text:'21화 후 콜로니 낙하 저지 루트로 진행. 22화에서 쥬도로 플을 설득하고 그레미를 격추한 뒤 다시 설득하세요. 그레미를 먼저 격추해도 됩니다. 쥬도로 플을 공격하면 안 됩니다.',source:0}],
  sources:[source('슈퍼로봇대전 R/공략','https://namu.moe/w/'+encodeURIComponent('슈퍼로봇대전 R/공략'))]},
 {id:'d',title:'슈퍼로봇대전 D',platform:'GBA',file:'GBA시리즈3슈퍼로봇대전D.gba',
  sections:[section('생존·보스전',[
   '적 레벨은 상위 20명 평균의 영향을 받습니다. 초반 보급 반복으로 일부 파일럿만 과하게 올리면 다음 맵이 더 어려워질 수 있습니다.',
   '저력의 장갑 보정 버그 때문에 슈퍼계도 저력만 믿으면 위험합니다. 철벽·체력 유지·원호방어를 함께 준비하세요.',
   '중반 이후 적이 확정 격파 공격에 방어를 선택합니다. 원호공격·크리티컬·적 턴 반격을 활용해 막타 계획을 세우세요.'
  ])],
  secrets:[{title:'풀아머 ZZ',text:'분기에 따라 26~28화인 「전장의 아버지, 전장의 아들」 개시 시 쥬도와 루의 격추수 합계 40 이상이 필요합니다.',source:0},
   {title:'V2 어설트 버스터',text:'「전장의 아버지, 전장의 아들」 종료 후 엔젤 하이로 공략을 선택하면 「광기의 엔젤 하이로」에서 출격합니다. 분기에 따라 화수가 달라지므로 시나리오명으로 확인하세요.',source:0}],
  sources:[source('슈퍼로봇대전 D/공략','https://namu.moe/w/'+encodeURIComponent('슈퍼로봇대전 D/공략'))]},
 {id:'j',title:'슈퍼로봇대전 J',platform:'GBA',file:'GBA시리즈4슈퍼로봇대전J.gba',
  sections:[section('전투·투자',[
   '적 명중률이 능력치·운동성 등으로 0%가 된 유닛은 일반 공격 대상에서 제외될 수 있습니다. 회피만 올린 기체로 적을 끌어모으기 어렵습니다.',
   '합체기는 화력과 EN 효율이 좋지만 원호공격이 붙지 않습니다. 보스전에서 일반 공격+원호와 비교하세요.',
   '실드방어는 발동해도 피해 경감이 적용되지 않는 버그가 있습니다. 생존을 실드에만 맡기지 마세요.'
  ])],
  secrets:[{title:'그레이트 제오라이머: 초반부터 결정',text:'선택출격에서 제오라이머를 한 번이라도 출격시키면 실패합니다. 10화 후 나데시코 → 20화 후 아크엔젤 → 31화 후 아크엔젤 분기 및 지정 적 격파가 모두 필요합니다. 아래 원문의 전체 조건을 먼저 확인하세요.',source:1},
   {title:'본타군',text:'24화 타쿠마, 29화 자이드, 30화 가우룽을 각각 소스케로 격추하면 34화에 본타군으로 등장합니다. 지정 파일럿 격추는 원호·맵병기로 대신하지 마세요.',source:1}],
  sources:[source('슈퍼로봇대전 J/공략','https://seore.org/w/'+encodeURIComponent('슈퍼로봇대전 J/공략')),
   source('슈퍼로봇대전 J/숨겨진 요소','https://seore.org/w/'+encodeURIComponent('슈퍼로봇대전 J/숨겨진 요소'))]},
 {id:'w',title:'슈퍼로봇대전 W',platform:'NDS',file:'NDS시리즈1슈퍼로봇대전W.nds',
  sections:[section('육성·자금',[
   '장갑 저하·공격력 저하·배리어 해제 무기를 확인하세요. 보스에게 상태이상을 걸고 주력이 공격하면 부담을 줄일 수 있습니다.',
   '개조가 후속기나 여러 기체에 이어지는 경우가 있습니다. 윙제로→알트론, 프리덤→일부 SEED 기체 등 개조 전승·공유를 활용하세요.',
   '자금이 많은 적에게 행운·축복을 쓰고 다인승 기체에는 응원으로 보스 경험치를 배분하세요. 2부 재합류 레벨은 현재 부대 평균에 맞춰집니다.'
  ])],
  secrets:[{title:'본타군',text:'8화 2격추 이상, 1회차 12화(2회차 13화) 2격추 이상, 32화 3격추 이상을 본타군으로 달성하면 46화에 입수합니다.',source:0},
   {title:'라이트닝 스트라이크 팩',text:'10화 종료 시 무우 10격추 이상을 맞추면 46화에 입수합니다.',source:0}],
  sources:[source('슈퍼로봇대전 W/공략','https://d.namu.moe/w/'+encodeURIComponent('슈퍼로봇대전 W/공략'))]},
 {id:'k',title:'슈퍼로봇대전 K',platform:'NDS',file:'NDS시리즈2슈퍼로봇대전K.nds',
  sections:[section('편성·전투',[
   '어택콤보는 싱글 유닛(SU) 전용입니다. 콤보가 강한 기체까지 전부 파트너(PU)로 묶지 마세요.',
   'PU는 원호와 보조 정신기를 활용하는 편성입니다. 메인·파트너의 지형이 다르면 원호가 막힐 수 있어 이동 후 지형도 확인하세요.',
   '우주 B 기체가 많습니다. 스러스터 모듈 등으로 보완하고, 월면에서는 착륙 시 지상 판정인지 확인하세요.',
   '적 레벨은 서브 파일럿을 제외한 상위 20명 평균을 따릅니다. SU만으로 격추를 독점하기보다 사용할 멤버의 성장도 살피세요.'
  ])],
  secrets:[{title:'하이네: 19-2화',text:'아스란으로 하이네와 전투회화를 본 뒤 아스란으로 설득하면 현장에서 합류합니다.',source:0},
   {title:'페르미',text:'25화 후 대공마룡·소라 시티 루트 선택. 27화 시작 전 레·미이+코토나 합계 150격추 이상, 해당 화에서 소우타·레·미이·코토나 전원과 페르미의 교전이 필요합니다.',source:0}],
  sources:[source('슈퍼로봇대전 K','https://d.namu.moe/w/'+encodeURIComponent('슈퍼로봇대전 K'))]},
 {id:'l',title:'슈퍼로봇대전 L',platform:'NDS',file:'NDS시리즈3슈퍼로봇대전L.nds',
  sections:[section('편성·육성',[
   '강화파츠가 없고 기체 보너스가 그 역할을 합니다. 지형·이동력·사거리·자금 보너스를 주력의 부족한 부분에 맞추세요.',
   'PU에서는 두 기체의 보너스를 함께 받습니다. 5단·10단 개조 시 보너스가 강화되므로 먼저 5단 달성 효과를 비교하세요.',
   '싱글 유닛은 적 PU에게 두 번 집중 공격받을 수 있습니다. 전작 K의 SU 중심 운용을 그대로 적용하지 마세요.',
   '맵에서 PU를 결성한 뒤에는 다시 SU로 분리할 수 없습니다. 맵상 파트너 교환은 두 유닛의 행동을 끝냅니다.'
  ])],
  secrets:[{title:'기력한계돌파: 17화',text:'4턴째 에바의 이벤트 격추 전에 제6사도를 직접 격추하면 보너스를 얻습니다. 사도는 다시 부활하므로 이후 방어도 준비하세요.',source:0},
   {title:'입수·생존 선택',text:'코스모다이버·가이아 건담은 조건 없이 입수합니다. 반면 스텔라·소우비·미셸은 분기 관계상 한 회차에 세 명 모두 살릴 수 없습니다.',source:0}],
  sources:[source('슈퍼로봇대전 L','https://d.namu.moe/w/'+encodeURIComponent('슈퍼로봇대전 L'))]}
];
function normalize(name){return String(name||'').normalize('NFKC').toLowerCase().replace(/\.(gba|nds|zip)$/i,'').replace(/[\s._-]/g,'');}
function detect(name){
 const ext=String(name).split('.').pop().toLowerCase();
 const n=normalize(name);
 const exact=catalog.find(g=>normalize(g.file)===n);
 if(exact){if((ext==='nds'&&exact.platform!=='NDS')||(ext==='gba'&&exact.platform!=='GBA'))return null;return exact;}
 const short=n.replace(/^(gba|nds)(시리즈\d+)?/,'').replace(/[\[（(].*$/,'');
 const m=short.match(/^(?:슈퍼로봇대전|superrobotwars|superrobottaisen|srw)(og2|og1|og|a|r|d|j|w|k|l)$/);
 if(!m)return null;
 const id=m[1]==='og1'?'og':m[1], game=catalog.find(g=>g.id===id);
 if((ext==='nds'&&game.platform!=='NDS')||(ext==='gba'&&game.platform!=='GBA'))return null;
 return game;
}
const api={catalog,detect,normalize,version:'0.2.0',checkedAt:'2026-11-02'};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else root.RetroGuides=api;
})(typeof globalThis!=='undefined'?globalThis:this);
