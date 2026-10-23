import test from 'node:test';
import assert from 'node:assert/strict';
import {initViewerOverflow} from '../public/viewer-overflow.js';

function fixture(lang='pt-BR'){
 const sizes={left:12,top:90,bottom:290,width:296,height:200};
 const callbacks={resize:[],mutation:[]},frames=new Map();let next=0;
 const view=Object.assign(new EventTarget(),{
  requestAnimationFrame(fn){frames.set(++next,fn);return next;},cancelAnimationFrame(id){frames.delete(id);},
  getComputedStyle:()=>({visibility:'visible'}),
  ResizeObserver:class{constructor(fn){callbacks.resize.push(this);this.fn=fn;}observe(){}disconnect(){this.disconnected=true;}},
  MutationObserver:class{constructor(fn){callbacks.mutation.push(this);this.fn=fn;}observe(){}disconnect(){this.disconnected=true;}},
 });
 const body={},documentElement={lang};
 const doc=Object.assign(new EventTarget(),{defaultView:view,body,documentElement,hidden:false,
  createElement(){return {style:{},hidden:false,setAttribute(name,value){this[name]=value;},remove(){this.removed=true;}};},
  fonts:{ready:Promise.resolve()},
 });
 const board={clientLeft:0,clientTop:0,scrollLeft:0,scrollTop:0,getBoundingClientRect:()=>({left:0,top:20}),append(node){this.indicator=node;}};
 const card=Object.assign(new EventTarget(),{ownerDocument:doc,hidden:false,clientHeight:200,scrollHeight:700,scrollTop:0,
  closest:()=>board,getClientRects(){return this.hidden?[]:[sizes];},getBoundingClientRect:()=>sizes,querySelectorAll:()=>[],
 });
 doc.querySelector=selector=>selector==='#viewer-card'?card:null;
 return {doc,view,card,board,callbacks,frames,flush(){const queued=[...frames.values()];frames.clear();queued.forEach(fn=>fn());}};
}

test('the sibling hint appears only for a visible card with unread overflow and does not change card content',()=>{
 const f=fixture(),cleanup=initViewerOverflow(f.doc),hint=f.board.indicator;
 assert.equal(hint.hidden,false);assert.equal(hint.textContent,'Mais conteúdo abaixo ↓');assert.equal(hint['aria-hidden'],'true');
 assert.equal(hint.style.left,'12px');assert.equal(hint.style.top,'270px');assert.equal(hint.style.width,'296px');
 assert.equal(f.card.scrollHeight,700);
 f.card.scrollTop=499;f.card.dispatchEvent(new Event('scroll'));f.flush();assert.equal(hint.hidden,true);
 f.card.scrollTop=240;f.card.dispatchEvent(new Event('scroll'));f.flush();assert.equal(hint.hidden,false);
 f.card.hidden=true;f.callbacks.mutation[0].fn();f.flush();assert.equal(hint.hidden,true);
 f.card.hidden=false;f.card.scrollHeight=200;f.callbacks.resize[0].fn();f.flush();assert.equal(hint.hidden,true);
 cleanup();
});

test('layout, expanded details, selection and page visibility refresh the hint with one scheduled update',()=>{
 const f=fixture('en'),cleanup=initViewerOverflow(f.doc),hint=f.board.indicator;
 assert.equal(hint.textContent,'More content below ↓');
 f.card.scrollHeight=200;f.callbacks.mutation[0].fn();f.callbacks.resize[0].fn();f.card.dispatchEvent(new Event('load'));assert.equal(f.frames.size,1);
 f.flush();assert.equal(hint.hidden,true);
 f.card.scrollHeight=600;f.card.dispatchEvent(new Event('toggle'));f.flush();assert.equal(hint.hidden,false);
 f.doc.hidden=true;f.doc.dispatchEvent(new Event('visibilitychange'));f.flush();assert.equal(hint.hidden,true);
 f.doc.hidden=false;f.doc.documentElement.lang='es';f.doc.dispatchEvent(new Event('visibilitychange'));f.flush();assert.equal(hint.textContent,'Más contenido abajo ↓');assert.equal(hint.hidden,false);
 cleanup();assert.equal(hint.removed,true);assert.ok(f.callbacks.resize.every(item=>item.disconnected));assert.ok(f.callbacks.mutation.every(item=>item.disconnected));
 f.card.dispatchEvent(new Event('scroll'));f.view.dispatchEvent(new Event('resize'));assert.equal(f.frames.size,0);
});

test('initialization is idempotent and absence of the viewer is a safe no-op',()=>{
 const f=fixture(),cleanup=initViewerOverflow(f.doc),hint=f.board.indicator;
 const duplicate=initViewerOverflow(f.doc);assert.equal(f.board.indicator,hint);assert.equal(f.callbacks.resize.length,1);
 duplicate();assert.notEqual(hint.removed,true);cleanup();
 assert.doesNotThrow(()=>initViewerOverflow({querySelector:()=>null})());
});
