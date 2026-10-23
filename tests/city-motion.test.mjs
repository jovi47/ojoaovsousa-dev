import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMotion,coastStep} from '../public/city-motion.js';

const close=(actual,want,tolerance=1e-12)=>assert.ok(Math.abs(actual-want)<=tolerance,`${actual} differs from ${want}`);

test('construction clamps before its range and finishes exactly facing front at normal zoom',()=>{
 for(const progress of [-1,0,.22]){
  const pose=buildMotion(progress,.22,.34);
  close(pose.yaw,-Math.PI*.75);
  assert.equal(pose.zoom,1.18);
  assert.equal(pose.complete,false);
 }
 for(const progress of [.34,.8,2])assert.deepEqual(buildMotion(progress,.22,.34),{yaw:0,zoom:1,complete:true});
});

test('construction eases rotation while zoom decreases continuously toward the finished pose',()=>{
 const quarter=buildMotion(.25,0,1),half=buildMotion(.5,0,1);
 close(quarter.zoom,1.151875);
 close(half.yaw,-Math.PI*.375);
 close(half.zoom,1.09);
 let previous=buildMotion(0,0,1);
 for(let i=1;i<=100;i++){
  const pose=buildMotion(i/100,0,1);
  assert.ok(pose.yaw>=previous.yaw&&pose.yaw<=0);
  assert.ok(pose.zoom<=previous.zoom&&pose.zoom>=1);
  previous=pose;
 }
});

test('an instantaneous construction has a finite before and after pose',()=>{
 assert.equal(buildMotion(.49,.5,.5).complete,false);
 assert.deepEqual(buildMotion(.5,.5,.5),{yaw:0,zoom:1,complete:true});
 for(const invalid of [NaN,Infinity,-Infinity,undefined,null,'0.5']){
  for(const args of [[invalid,0,1],[.5,invalid,1],[.5,0,invalid]]){
   const pose=buildMotion(...args);
   assert.ok(Number.isFinite(pose.yaw)&&Number.isFinite(pose.zoom));
   assert.equal(pose.complete,false);
  }
 }
});

test('coasting does not advance on zero, negative or invalid elapsed time',()=>{
 for(const dt of [0,-1,NaN,Infinity,-Infinity,undefined,null,'1'])assert.deepEqual(coastStep(20,dt),{deltaYaw:0,velocity:20});
 for(const velocity of [NaN,Infinity,-Infinity,undefined,null,'20'])assert.deepEqual(coastStep(velocity,1),{deltaYaw:0,velocity:0});
});

test('coasting integrates exponential velocity loss rather than applying one frame of the initial speed',()=>{
 const step=coastStep(20,1);
 close(step.deltaYaw,9.976293525066807);
 close(step.velocity,4.037930359893108);
});

test('coasting covers the same angle and final speed at different frame rates',()=>{
 const whole=coastStep(20,1);
 for(const frames of [10,30,60,120]){
  let velocity=20,yaw=0;
  for(let frame=0;frame<frames;frame++){
   const next=coastStep(velocity,1/frames);
   yaw+=next.deltaYaw;
   velocity=next.velocity;
  }
  close(yaw,whole.deltaYaw);
  close(velocity,whole.velocity);
 }
});

test('coasting preserves clockwise and counterclockwise direction without reversing',()=>{
 const positive=coastStep(20,.5),negative=coastStep(-20,.5);
 assert.ok(positive.deltaYaw>0&&positive.velocity>0&&positive.velocity<20);
 assert.equal(negative.deltaYaw,-positive.deltaYaw);
 assert.equal(negative.velocity,-positive.velocity);
 assert.deepEqual(coastStep(0,1),{deltaYaw:0,velocity:0});
});

test('a fast 20 radian per second flick approaches two turns and settles without nonfinite output',()=>{
 const step=coastStep(20,10),settled=coastStep(20,1e9);
 assert.ok(step.deltaYaw>12.49&&step.deltaYaw<12.5);
 assert.ok(step.velocity>0&&step.velocity<1e-5);
 assert.ok(step.deltaYaw/(2*Math.PI)>1.98&&step.deltaYaw/(2*Math.PI)<2);
 assert.deepEqual(settled,{deltaYaw:12.5,velocity:0});
});
