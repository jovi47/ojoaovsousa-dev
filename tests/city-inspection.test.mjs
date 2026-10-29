import test from 'node:test';
import assert from 'node:assert/strict';
import {createInspection} from '../public/city-inspection.js';

class Node extends EventTarget{
 constructor(tag,doc){super();this.tagName=tag;this.ownerDocument=doc;this.children=[];this.attributes={};this.hidden=false;}
 append(...nodes){for(const node of nodes){node.remove();node.parentNode=this;this.children.push(node);}}
 insertBefore(node,before){node.remove();node.parentNode=this;this.children.splice(this.children.indexOf(before),0,node);}
 remove(){if(this.parentNode){const p=this.parentNode;p.children.splice(p.children.indexOf(this),1);this.parentNode=null;}}
 setAttribute(name,value){this.attributes[name]=value;}
 showModal(){if(this.failOpen)throw new Error('Cannot open');this.open=true;}
 close(){this.open=false;this.dispatchEvent(new Event('close'));}
 focus(options){this.focusOptions=options;}
 closest(){return this.world;}
}
function fixture(lang='pt-BR'){
 const frames=new Map();let id=0;
 const doc={documentElement:{lang},defaultView:{requestAnimationFrame(fn){frames.set(++id,fn);return id;},cancelAnimationFrame(n){frames.delete(n);}},createElement(tag){return new Node(tag,this);},createComment(){return new Node('#comment',this);}};
 doc.body=new Node('body',doc);
 const board=new Node('board',doc),before=new Node('before',doc),world=new Node('world',doc),canvas=new Node('canvas',doc),panel=new Node('panel',doc),after=new Node('after',doc);
 canvas.world=world;world.append(canvas);board.append(before,world,panel,after);panel.hidden=true;doc.body.append(board);
 const calls=[],inspection=createInspection({canvas,panel,onOpen(){calls.push('open');},onClose(){calls.push('close');},onResize(){calls.push('resize');}});
 const dialog=doc.body.children[1];
 return {doc,board,before,world,canvas,panel,after,inspection,dialog,calls,frames,flush(){const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn());}};
}

test('inspection moves the existing scene and explanation then restores their exact slots and hidden state',()=>{
 const f=fixture();assert.equal(f.inspection.active,false);
 assert.equal(f.inspection.open('HorAgora'),true);assert.equal(f.inspection.active,true);
 assert.equal(f.world.parentNode,f.dialog);assert.equal(f.canvas.parentNode,f.world);assert.equal(f.panel.parentNode,f.dialog);assert.equal(f.panel.hidden,false);
 assert.equal(f.dialog.attributes['aria-label'],'HorAgora');assert.deepEqual(f.calls,['open']);f.flush();assert.deepEqual(f.calls,['open','resize']);
 f.inspection.open('ASC');assert.equal(f.dialog.attributes['aria-label'],'ASC');assert.deepEqual(f.calls,['open','resize']);
 f.inspection.close();assert.equal(f.inspection.active,false);assert.deepEqual(f.board.children,[f.before,f.world,f.panel,f.after]);assert.equal(f.panel.hidden,true);assert.deepEqual(f.canvas.focusOptions,{preventScroll:true});
 f.flush();assert.deepEqual(f.calls,['open','resize','close','resize']);
});

test('native escape/close restoration is idempotent and disposal cancels pending layout work',()=>{
 const f=fixture();f.inspection.open();f.dialog.close();f.inspection.close();assert.deepEqual(f.calls,['open','close']);
 f.inspection.open();f.inspection.dispose();f.inspection.dispose();assert.equal(f.inspection.active,false);assert.equal(f.frames.size,0);assert.equal(f.dialog.parentNode,null);
 assert.deepEqual(f.board.children,[f.before,f.world,f.panel,f.after]);assert.equal(f.inspection.open(),false);assert.deepEqual(f.calls,['open','close','open','close']);
});

test('closing restores the page viewport after the scene is reinserted',()=>{
 const f=fixture(),positions=[];Object.assign(f.doc.defaultView,{scrollX:0,scrollY:420,scrollTo:position=>positions.push(position)});
 f.inspection.open();f.doc.defaultView.scrollY=180;f.inspection.close();
 assert.deepEqual(positions,[{left:0,top:420,behavior:'instant'}]);
});

test('labels follow page language and failed showModal leaves the live scene in place',()=>{
 for(const [lang,title,close] of [['pt-BR','Explore a construção','Fechar visualização'],['en-GB','Explore the building','Close inspection'],['es','Explora la construcción','Cerrar vista']]){
  const f=fixture(lang);assert.equal(f.dialog.attributes['aria-label'],title);assert.equal(f.dialog.children[0].children[1].attributes['aria-label'],close);
  f.dialog.failOpen=true;assert.throws(()=>f.inspection.open(),/Cannot open/);assert.equal(f.inspection.active,false);assert.equal(f.world.parentNode,f.board);assert.equal(f.panel.parentNode,f.board);assert.equal(f.panel.hidden,true);assert.deepEqual(f.calls,[]);
  f.inspection.dispose();
 }
});
