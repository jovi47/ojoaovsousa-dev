import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createProcessFlight} from '../public/process-flight.js';

function fixture(){
 const animation={currentTime:0,plays:0,pauses:0,cancelled:false,play(){this.plays++;},pause(){this.pauses++;},cancel(){this.cancelled=true;},effect:{setKeyframes(frames){animation.frames=frames;}}};
 const styles=new Map(),lane={hidden:true,style:{setProperty:(key,value)=>styles.set(key,value)}},plane={animate(frames,options){animation.frames=frames;animation.options=options;return animation;}};
 const balls=[55,155,255,355].map(left=>({left,top:240,width:28,height:28}));
 let observer;
 const doc={documentElement:{clientWidth:430},defaultView:{ResizeObserver:class{constructor(callback){this.callback=callback;observer=this;}observe(target){this.target=target;}disconnect(){this.disconnected=true;}}}},block={ownerDocument:doc,getBoundingClientRect:()=>({left:24,top:100}),querySelector:selector=>selector==='[data-process-flight]'?lane:plane,querySelectorAll:()=>balls.map(rect=>({getBoundingClientRect:()=>rect}))};
 return {animation,lane,styles,doc,block,balls,get observer(){return observer;}};
}

test('flight follows the construction clock, pauses without a timer and releases its animation',()=>{
 const f=fixture(),flight=createProcessFlight(f.block);
 flight.sync({count:4,active:true,reduced:false});
 assert.equal(f.animation.currentTime,1680);assert.equal(f.animation.plays,1);assert.equal(f.lane.hidden,false);
 flight.sync({count:4,active:false,reduced:false});assert.equal(f.lane.hidden,true);assert.equal(f.animation.currentTime,1680);
 flight.sync({count:0,active:true,reduced:false});assert.equal(f.animation.currentTime,0);
 flight.sync({count:16,active:true,reduced:false});assert.equal(f.lane.hidden,true);assert.equal(f.animation.currentTime,6720);
 flight.sync({count:0,active:true,reduced:true});assert.equal(f.lane.hidden,true);
 flight.destroy();assert.equal(f.animation.cancelled,true);assert.equal(f.lane.hidden,true);
});

test('flight weaves above and below the actual stage centers with slower edge passages and no flips',()=>{
 const f=fixture(),flight=createProcessFlight(f.block);
 for(let stage=0;stage<4;stage++){
  const peak=f.animation.frames.find(frame=>Math.abs(frame.offset-(stage/4+.125))<1e-8);
  const [,x,y]=peak.transform.match(/translate\(([^p]+)px, ([^p]+)px/);
  assert.equal(Number(x),f.balls[stage].left+14);assert.equal(Number(y),stage%2?188:120);
 }
 assert.equal(f.animation.frames[40].offset,.125);assert.equal(f.animation.frames.at(-41).offset,.875);
 assert.ok(f.animation.frames.every(frame=>Math.abs(Number(frame.transform.match(/rotate\(([^d]+)deg/)[1]))<=45));
 flight.sync({count:8,active:true,reduced:false});
 f.balls[0].left=35;f.balls[0].top=280;
 f.doc.documentElement.clientWidth=320;f.observer.callback();assert.equal(f.observer.target,f.block);
 assert.equal(f.animation.currentTime,3360);assert.equal(f.styles.get('--flight-width'),'320px');assert.equal(f.styles.get('--flight-left'),'-24px');
 assert.match(f.animation.frames[0].transform,/translate\(-80px/);
 assert.match(f.animation.frames.at(-1).transform,/translate\(400px/);
 assert.match(f.animation.frames.at(-1).transform,/rotate\(0deg\)/);
 assert.equal(f.animation.frames.find(frame=>Math.abs(frame.offset-.125)<1e-8).transform,'translate(49px, 160px) rotate(0deg)');
 flight.destroy();assert.equal(f.observer.disconnected,true);
});

test('unsupported animation and missing decoration retain the static accessible process',()=>{
 assert.doesNotThrow(()=>{const flight=createProcessFlight({querySelector:()=>null});flight.sync({count:0,active:true,reduced:false});flight.resize();flight.destroy();});
 const lane={hidden:true},flight=createProcessFlight({querySelector:selector=>selector==='[data-process-flight]'?lane:{}});
 flight.sync({count:0,active:true,reduced:false});assert.equal(lane.hidden,true);flight.destroy();
});

test('the flight layer stays out of flow and behind the unchanged title and stage content',async()=>{
 const css=await readFile(new URL('../public/process-flight.css',import.meta.url),'utf8');
 assert.match(css,/\.process-flight\{position:absolute/);
 assert.match(css,/\.project-process>\.project-process-title,\.project-process>\.project-process-pin\{position:relative;z-index:1\}/);
 assert.doesNotMatch(css,/padding|margin-top/);
});
