const {test}=require('node:test');const assert=require('node:assert/strict');
const {catalog,detect}=require('../guides-data.js');
test('all nine supplied filenames select the right guide and platform',()=>{
 const expected=[['GBA슈퍼로봇대전OG.gba','og','GBA'],['GBA슈퍼로봇대전OG2.gba','og2','GBA'],['GBA시리즈1슈퍼로봇대전A.gba','a','GBA'],['GBA시리즈2슈퍼로봇대전R.gba','r','GBA'],['GBA시리즈3슈퍼로봇대전D.gba','d','GBA'],['GBA시리즈4슈퍼로봇대전J.gba','j','GBA'],['NDS시리즈1슈퍼로봇대전W.nds','w','NDS'],['NDS시리즈2슈퍼로봇대전K.nds','k','NDS'],['NDS시리즈3슈퍼로봇대전L.nds','l','NDS']];
 for(const [filename,id,platform] of expected){assert.equal(detect(filename)?.id,id,filename);assert.equal(detect(filename)?.platform,platform);}
});
test('names tolerate spacing and patch tags without confusing remakes or unknown games',()=>{
 assert.equal(detect('슈퍼 로봇 대전 OG2 (한글패치).gba')?.id,'og2');
 assert.equal(detect('Super Robot Wars J.gba')?.id,'j');
 for(const name of ['슈퍼로봇대전 AP.gba','슈퍼로봇대전 OGs.gba','슈퍼로봇대전 UX.nds','GBA슈퍼로봇대전OG.nds','NDS시리즈1슈퍼로봇대전W.gba','파이어엠블렘.gba'])assert.equal(detect(name),null,name);
});
test('every game includes substantive summaries, secrets, traceable sources and GBA edition notes',()=>{
 assert.equal(catalog.length,9);assert.equal(new Set(catalog.map(g=>g.id)).size,9);
 for(const g of catalog){assert(g.sections.flatMap(s=>s.items).length>=3);assert(g.secrets.length>=2);
  for(const s of g.sources){assert(s.author);assert(s.checkedAt);assert.equal(new URL(s.readUrl).protocol,'https:');}
  for(const item of g.secrets)assert(g.sources[item.source]);
 }
 assert(catalog.find(g=>g.id==='og').notice.includes('PS2'));
 assert(catalog.find(g=>g.id==='og2').notice.includes('GBA'));
});
