const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');const api=require('../guides-data.js');
function setup(){
 const nodes=new Map(),stored=new Map();
 function el(tag){return {tag,children:[],value:'',textContent:'',append(...items){this.children.push(...items)},replaceChildren(...items){this.children=items},addEventListener(n,f){this[n]=f}}}
 const document={getElementById(id){if(!nodes.has(id))nodes.set(id,el('div'));return nodes.get(id)},createElement:el,createTextNode:text=>({textContent:text})};
 const context={RetroGuides:api,document,localStorage:{getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v),removeItem:k=>stored.delete(k)}};context.window=context;
 vm.runInNewContext(fs.readFileSync(__dirname+'/../guides-ui.js','utf8'),context);
 return {ui:context.RetroGuideUI,node:id=>document.getElementById(id),stored};
}
test('loading a ROM switches the guide immediately; unsupported ROM does not retain old content',()=>{
 const h=setup();for(const g of api.catalog){h.ui.selectRom(g.file,'hash-'+g.id);assert.equal(h.node('guide-game-select').value,g.id);assert(h.node('guide-match').textContent.includes('자동 연결'));assert(h.node('guide-content').children.some(n=>n.textContent===g.title+' · '+g.platform));}
 h.ui.selectRom('other.gba','other-hash');assert.equal(h.node('guide-game-select').value,'');assert(h.node('guide-match').textContent.includes('찾지 못했어요'));assert.equal(h.node('guide-content').children.length,1);
});
test('manual override persists per ROM and automatic reset restores detection',()=>{
 const h=setup();h.ui.selectRom(api.catalog[0].file,'one');const select=h.node('guide-game-select');select.value='og2';select.change();
 h.ui.selectRom(api.catalog[0].file,'one');assert.equal(select.value,'og2');assert(h.node('guide-match').textContent.includes('직접 선택'));
 h.ui.selectRom(api.catalog[0].file,'two');assert.equal(select.value,'og');
 h.ui.selectRom(api.catalog[0].file,'one');h.node('guide-reset').click();assert.equal(select.value,'og');assert(!h.stored.has('retro-pocket-guide:one'));
});
