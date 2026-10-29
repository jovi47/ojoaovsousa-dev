import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../public/vendor/three.module.js';
import {initContactCharacters,fitContactCamera,disposeContactModel} from '../public/contact-character.js';

class Target extends EventTarget{
 listeners=new Map();
 addEventListener(type,callback){super.addEventListener(type,callback);if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(callback);}
 removeEventListener(type,callback){super.removeEventListener(type,callback);this.listeners.get(type)?.delete(callback);}
 get listenerCount(){return [...this.listeners.values()].reduce((n,set)=>n+set.size,0);}
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function fixture({reduced=false,deferred=false,reject=false}={}){
 const media=Object.assign(new Target(),{matches:reduced}),rafs=new Map(),intersections=[],resizes=[];
 let time=0,id=0,calls=0,disposals=0,resolveView,signal;
 const renders=[],sizes=[],graphics={render:yaw=>renders.push(yaw),resize:(...size)=>sizes.push(size),dispose:()=>disposals++};
 const view=Object.assign(new Target(),{devicePixelRatio:3,performance:{now:()=>time},matchMedia:()=>media,requestAnimationFrame:fn=>{rafs.set(++id,fn);return id;},cancelAnimationFrame:id=>rafs.delete(id)});
 view.IntersectionObserver=class{constructor(callback){this.callback=callback;intersections.push(this);}observe(){}disconnect(){this.disconnected=true;}};
 view.ResizeObserver=class{constructor(callback){this.callback=callback;resizes.push(this);}observe(){}disconnect(){this.disconnected=true;}};
 const doc=Object.assign(new Target(),{defaultView:view,hidden:false}),canvas=new Target();
 const figure={ownerDocument:doc,dataset:{},querySelector:()=>canvas,getBoundingClientRect:()=>({width:110,height:180})};
 const root={querySelectorAll:()=>[figure]};
 const createView=async(_,options)=>{calls++;signal=options.signal;if(reject)throw Error('no WebGL');if(deferred)return new Promise(resolve=>{resolveView=resolve;});return graphics;};
 function intersect(value){intersections[0].callback([{isIntersecting:value,intersectionRatio:value?1:0}]);}
 function visibility(value){doc.hidden=value;doc.dispatchEvent(new Event('visibilitychange'));}
 function motion(value){media.matches=value;media.dispatchEvent(new Event('change'));}
 function frame(ms){time+=ms;const pending=[...rafs.values()];rafs.clear();pending.forEach(fn=>fn(time));}
 return {root,figure,canvas,view,doc,media,rafs,intersections,resizes,renders,sizes,graphics,createView,intersect,visibility,motion,frame,resolve:()=>resolveView(graphics),get calls(){return calls;},get disposals(){return disposals;},get signal(){return signal;}};
}

test('contact figure loads on visibility, renders at most 24fps and stops outside the page',async()=>{
 const f=fixture(),cleanup=initContactCharacters(f.root,{createView:f.createView});
 assert.equal(f.calls,0);f.visibility(true);f.intersect(true);assert.equal(f.calls,0);
 f.visibility(false);await flush();assert.equal(f.calls,1);assert.equal(f.figure.dataset.characterReady,'true');assert.equal(f.renders.length,1);assert.deepEqual(f.sizes[0],[110,180,1.5]);
 f.frame(20);f.frame(20);assert.equal(f.renders.length,1);f.frame(4);assert.equal(f.renders.length,2);assert.ok(f.renders[1]>f.renders[0]);
 f.intersect(false);assert.equal(f.rafs.size,0);f.frame(1000);assert.equal(f.renders.length,2);
 f.intersect(true);assert.equal(f.rafs.size,1);assert.equal(f.calls,1);
 f.visibility(true);assert.equal(f.rafs.size,0);f.visibility(false);assert.equal(f.rafs.size,1);
 cleanup();assert.equal(f.disposals,1);assert.equal(f.rafs.size,0);assert.equal(f.figure.dataset.characterReady,undefined);
 for(const target of [f.canvas,f.doc,f.media,f.view])assert.equal(target.listenerCount,0);
 assert.equal(f.intersections[0].disconnected,true);assert.equal(f.resizes[0].disconnected,true);assert.equal(f.signal.aborted,true);
});

test('reduced motion paints a static model, resizes once and can resume rotation',async()=>{
 const f=fixture({reduced:true}),cleanup=initContactCharacters(f.root,{createView:f.createView});f.intersect(true);await flush();
 assert.equal(f.renders.length,1);assert.equal(f.rafs.size,0);f.resizes[0].callback();assert.equal(f.renders.length,2);assert.equal(f.rafs.size,0);
 f.motion(false);assert.equal(f.rafs.size,1);f.frame(50);f.motion(true);assert.equal(f.rafs.size,0);
 const last=f.renders.at(-1);f.frame(1000);assert.equal(f.renders.at(-1),last);cleanup();
});

test('cleanup during loading aborts and disposes a late view without showing its canvas',async()=>{
 const f=fixture({deferred:true}),cleanup=initContactCharacters(f.root,{createView:f.createView});
 f.intersect(true);assert.equal(f.calls,1);cleanup();assert.equal(f.signal.aborted,true);f.resolve();await flush();
 assert.equal(f.disposals,1);assert.equal(f.renders.length,0);assert.equal(f.rafs.size,0);assert.equal(f.figure.dataset.characterReady,undefined);
});

test('load errors and context loss retain the poster and never retry in a loop',async()=>{
 const bad=fixture({reject:true}),disposeBad=initContactCharacters(bad.root,{createView:bad.createView});bad.intersect(true);await flush();bad.intersect(false);bad.intersect(true);
 assert.equal(bad.calls,1);assert.equal(bad.figure.dataset.characterReady,undefined);assert.equal(bad.rafs.size,0);disposeBad();
 const f=fixture(),cleanup=initContactCharacters(f.root,{createView:f.createView});f.intersect(true);await flush();
 const event=new Event('webglcontextlost',{cancelable:true});f.canvas.dispatchEvent(event);
 assert.equal(event.defaultPrevented,true);assert.equal(f.figure.dataset.characterReady,undefined);assert.equal(f.disposals,1);assert.equal(f.rafs.size,0);
 f.intersect(false);f.intersect(true);assert.equal(f.calls,1);cleanup();assert.equal(f.disposals,1);
});

test('initialization is idempotent and a late hidden load waits before painting',async()=>{
 const f=fixture({deferred:true}),cleanup=initContactCharacters(f.root,{createView:f.createView}),duplicate=initContactCharacters(f.root,{createView:f.createView});duplicate();
 assert.equal(f.intersections.length,1);f.intersect(true);f.intersect(false);f.resolve();await flush();
 assert.equal(f.renders.length,0);assert.equal(f.rafs.size,0);f.intersect(true);assert.equal(f.renders.length,1);cleanup();
});

test('camera covers the full turning silhouette in narrow and wide frames',()=>{
 const size=new THREE.Vector3(1,2,.8),radius=Math.hypot(size.x,size.z)/2;
 for(const [width,height] of [[64,190],[140,190],[300,100]]){
  const camera=new THREE.OrthographicCamera();fitContactCamera(camera,size,width,height);
  assert.ok(camera.right>radius);assert.ok(camera.top>size.y/2);assert.equal(camera.left,-camera.right);assert.equal(camera.bottom,-camera.top);assert.ok(Math.abs(camera.right/camera.top-width/height)<1e-12);
 }
});

test('model disposal releases shared geometry, material, texture and bitmap exactly once',()=>{
 let closed=0;const texture=new THREE.Texture({close(){closed++;}}),material=new THREE.MeshStandardMaterial({map:texture}),geometry=new THREE.BoxGeometry(),model=new THREE.Group();
 const counts={geometry:0,material:0,texture:0};for(const [key,resource] of Object.entries({geometry,material,texture}))resource.addEventListener('dispose',()=>counts[key]++);
 model.add(new THREE.Mesh(geometry,material),new THREE.Mesh(geometry,material));disposeContactModel(model);
 assert.deepEqual(counts,{geometry:1,material:1,texture:1});assert.equal(closed,1);
});
