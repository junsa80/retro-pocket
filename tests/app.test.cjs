const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');const {webcrypto}=require('node:crypto');
const tick=()=>new Promise(r=>setImmediate(r));
function setup(){
 const nodes=new Map(),listeners={},posted=[],writes=[],commits=[],storage=new Map();
 function node(id){if(!nodes.has(id))nodes.set(id,{value:id==='core-select'?'gba':'',style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(n,f){this[n]=f},click(){},contentWindow:{postMessage:m=>posted.push(m)}});return nodes.get(id)}
 const db={transaction(){const tx={objectStore:()=>({put(value,key){const req={};writes.push({key,value});queueMicrotask(()=>{req.result=key;req.onsuccess();commits.push(()=>tx.oncomplete())});return req},get(){const req={};queueMicrotask(()=>{req.onsuccess();queueMicrotask(()=>tx.oncomplete())});return req}})};return tx}};
 const context={document:{getElementById:node,querySelectorAll:()=>[],addEventListener(){},documentElement:{}},location:{origin:'https://test.example',protocol:'https:'},crypto:webcrypto,Blob,Uint8Array,DataView,URL:{createObjectURL:()=> 'blob:https://test.example/id',revokeObjectURL(){}},matchMedia:()=>({matches:true}),localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},indexedDB:{open(){const req={result:db};queueMicrotask(()=>req.onsuccess());return req}},setTimeout:()=>1,clearTimeout(){},addEventListener:(n,f)=>listeners[n]=f};context.window=context;
 vm.runInNewContext(fs.readFileSync(__dirname+'/../app.js','utf8'),context);
 return {node,listeners,posted,writes,commits,storage,send:data=>listeners.message({origin:context.location.origin,source:node('emulator-frame').contentWindow,data:{app:'retro-pocket',...data}})};
}
test('slot change during save keeps original destination and waits for committed storage',async()=>{
 const h=setup(),rom=new Blob([new Uint8Array([1,2,3])]);rom.name='demo.gba';
 h.node('rom-input').change({target:{files:[rom]}});for(let i=0;i<5;i++)await tick();
 await h.send({type:'RUNNER_READY'});assert.equal(h.posted.at(-1).type,'LOAD_ROM');
 await h.send({type:'GAME_READY'});await h.node('save-btn').click();
 const request=h.posted.at(-1);assert.equal(request.command,'save');
 h.node('slot-select').change({target:{value:'2'}});
 const pending=h.send({type:'STATE_DATA',requestId:request.requestId,state:new Uint8Array([9,8,7])});
 await tick();assert.equal(h.writes.length,1);assert(h.writes[0].key.endsWith(':slot:1'));
 assert(!h.node('toast').textContent.includes('저장 완료'));
 h.commits[0]();await pending;assert.equal(h.node('toast').textContent,'슬롯 1 강제 저장 완료');
 // Duplicate or late responses cannot write into another slot.
 await h.send({type:'STATE_DATA',requestId:request.requestId,state:new Uint8Array([0])});assert.equal(h.writes.length,1);
});
