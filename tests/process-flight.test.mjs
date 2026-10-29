import test from 'node:test';
import assert from 'node:assert/strict';
import {createProcessFlight} from '../public/process-flight.js';

function fixture(){
 const animation={currentTime:0,plays:0,pauses:0,cancelled:false,play(){this.plays++;},pause(){this.pauses++;},cancel(){this.cancelled=true;},effect:{setKeyframes(frames){animation.frames=frames;}}};
 const styles=new Map(),lane={hidden:true,style:{setProperty:(key,value)=>styles.set(key,value)}},plane={animate(frames,options){animation.frames=frames;animation.options=options;return animation;}};
 const doc={documentElement:{clientWidth:430}},block={ownerDocument:doc,getBoundingClientRect:()=>({left:24}),querySelector:selector=>selector==='[data-process-flight]'?lane:plane};
 return {animation,lane,styles,doc,block};
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

test('resize preserves clock position while keeping all four loops inside the viewport lane',()=>{
 const f=fixture(),flight=createProcessFlight(f.block);
 flight.sync({count:8,active:true,reduced:false});
 f.doc.documentElement.clientWidth=320;flight.resize();
 assert.equal(f.animation.currentTime,3360);assert.equal(f.styles.get('--flight-width'),'320px');assert.equal(f.styles.get('--flight-left'),'-24px');
 assert.match(f.animation.frames[0].transform,/translate\(-80px/);
 assert.match(f.animation.frames.at(-1).transform,/translate\(400px/);
 assert.match(f.animation.frames.at(-1).transform,/rotate\(-1440deg\)/);
 flight.destroy();
});

test('unsupported animation and missing decoration retain the static accessible process',()=>{
 assert.doesNotThrow(()=>{const flight=createProcessFlight({querySelector:()=>null});flight.sync({count:0,active:true,reduced:false});flight.resize();flight.destroy();});
 const lane={hidden:true},flight=createProcessFlight({querySelector:selector=>selector==='[data-process-flight]'?lane:{}});
 flight.sync({count:0,active:true,reduced:false});assert.equal(lane.hidden,true);flight.destroy();
});
