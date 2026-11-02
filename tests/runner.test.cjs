const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function setup(){
 const listeners={},messages=[],scripts=[];const classes=new Set();
 const parent={postMessage:m=>messages.push(m)};
 const context={location:{origin:'https://test.example',href:'https://test.example/runner.html'},parent,URL,Uint8Array,ArrayBuffer,console,
 navigator:{getGamepads:()=>[]},setInterval:()=>{},addEventListener:(n,f)=>listeners[n]=f,
 document:{documentElement:{classList:{toggle:(n,on)=>on?classes.add(n):classes.delete(n)}},createElement:()=>({}),body:{append:s=>scripts.push(s)}}};
 context.window=context;vm.runInNewContext(fs.readFileSync(__dirname+'/../runner.js','utf8'),context);
 const send=data=>listeners.message({source:parent,origin:context.location.origin,data:{app:'retro-pocket',...data}});
 return {context,messages,scripts,send,listeners,classes};
}
test('runner rejects foreign messages and nonlocal ROM addresses',async()=>{
 const h=setup();await h.listeners.message({source:{},origin:'https://other.example',data:{app:'retro-pocket',type:'LOAD_ROM'}});
 assert.equal(h.scripts.length,0);
 await h.send({type:'LOAD_ROM',url:'https://other.example/game.gba',core:'gba'});
 assert.equal(h.messages.at(-1).type,'ERROR');assert.equal(h.scripts.length,0);
});
test('ROM handshake, request-bound save, load and CDN error',async()=>{
 const h=setup();await h.send({type:'LOAD_ROM',url:'blob:https://test.example/id',core:'gba',name:'한글.gba',romKey:'abc123'});
 assert.equal(h.scripts.length,1);assert.equal(h.context.EJS_gameName,'rp-gba-abc123');
 let loaded;h.context.EJS_emulator={gameManager:{getState:()=>new Uint8Array([1,2,3]),loadState:bytes=>{loaded=bytes}}};
 h.context.EJS_onGameStart();await h.send({type:'COMMAND',command:'save',requestId:7});
 assert.equal(h.messages.at(-1).requestId,7);assert.deepEqual(Array.from(h.messages.at(-1).state),[1,2,3]);
 await h.send({type:'COMMAND',command:'load',state:[4,5]});assert.deepEqual(Array.from(loaded),[4,5]);
 h.scripts[0].onerror();assert.equal(h.messages.at(-1).type,'ERROR');
});
test('physical gamepad hides touch overlay and disconnect restores defaults',()=>{
 const h=setup();h.context.navigator.getGamepads=()=>[{connected:true}];h.listeners.gamepadconnected();assert(h.classes.has('physical-gamepad'));
 h.context.navigator.getGamepads=()=>[];h.listeners.gamepaddisconnected();assert(!h.classes.has('physical-gamepad'));
});
