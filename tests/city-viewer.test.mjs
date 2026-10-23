import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {VIEWER_BUILDINGS,selectionForHash,buildProgress,buildingAt,constructionFrame,landmarkIdleYaw,touchDragAxis} from '../public/city.js';

test('touch rotation waits for an intentional horizontal gesture and leaves vertical or diagonal pans to the page',()=>{
 for(const [x,y] of [[0,0],[3,4],[-4,3]])assert.equal(touchDragAxis(x,y),null);
 for(const [x,y] of [[6,0],[-12,2],[20,-8]])assert.equal(touchDragAxis(x,y),'horizontal');
 for(const [x,y] of [[0,6],[2,-12],[20,20],[-8,20]])assert.equal(touchDragAxis(x,y),'vertical');
});

test('renderer startup preserves mobile scroll without a fragment while honoring explicit anchors and the desktop introduction',async()=>{
 const source=await readFile(new URL('../public/city-app.js',import.meta.url),'utf8');
 const start=source.slice(source.indexOf('async function start(){'),source.indexOf("document.querySelector('[data-retry]')?.addEventListener"));
 // Exercise the real startup glue with only the WebGL module replaced.
 for(const [mobile,hash,want] of [[true,'',[]],[true,'#main',['main']],[true,'#intro',['intro']],[false,'',['intro']],[false,'#projects',['projects']]]){
  const calls=[],classes=new Set(mobile?['mobile-entry']:[]),world={setReading(){},goTo(id){calls.push(id);}};
  const context={canvas:{dataset:{}},starting:false,world:null,location:{hash},labels:{},reduced:{matches:false},worldStatus:{},applySeason(){},openInquiry(){},openResident(){},
   body:{classList:{contains:name=>classes.has(name),add:(...names)=>names.forEach(name=>classes.add(name)),remove:name=>classes.delete(name)}},
   document:{querySelector:()=>({hidden:false})},console:{error(error){throw error;}},loadCity:async()=>({createCity:async()=>world})};
  await runInNewContext(`(${start.replace("await import('./city.js')","await loadCity()")})`,context)();
  assert.deepEqual(calls,want,`${mobile?'mobile':'desktop'} ${hash||'without fragment'}`);
  assert.equal(context.starting,false);
 }
});

test('intro navigation uses the visible main anchor only for active mobile 3D and preserves reading and desktop targets',async()=>{
 const source=await readFile(new URL('../public/city.js',import.meta.url),'utf8');
 const goTo=source.slice(source.indexOf('function goTo(id){'),source.indexOf('function dispose(){'));
 for(const [mobileEntry,reading,assembled,id,want] of [[true,false,true,'intro','main'],[true,false,true,'main','main'],[true,true,true,'intro','intro'],[false,false,true,'intro','intro'],[false,false,false,'intro','selection']]){
  const targets=[],context={mobileEntry,reading,assembled,document:{getElementById:target=>({scrollIntoView(){targets.push(target);}})},setSelection(){targets.push('selection');}};
  runInNewContext(`(${goTo})`,context)(id);
  assert.deepEqual(targets,[want]);
 }
});

test('each landmark can complete a steady full turn in thirty seconds',()=>{
 assert.equal(landmarkIdleYaw(0),0);
 assert.ok(Math.abs(landmarkIdleYaw(30)-Math.PI*2)<1e-12);
 assert.ok(Math.abs(landmarkIdleYaw(15)-Math.PI)<1e-12);
 assert.ok(Math.abs(landmarkIdleYaw(60)-Math.PI*4)<1e-12);
});
test('the viewer imports without a DOM and exposes exactly three building selections',()=>{
  assert.equal(typeof document,'undefined');
  assert.deepEqual(VIEWER_BUILDINGS,['stack','horagora','andrea']);
  assert.equal(new Set(VIEWER_BUILDINGS).size,3);
});
test('only supported navigation hashes resolve to safe building identifiers',()=>{
  assert.equal(selectionForHash('experience'),'stack');
  assert.equal(selectionForHash('projects'),'horagora');
  assert.equal(selectionForHash('andrea'),'andrea');
  for(const hash of ['', 'contact', 'stack', '#experience', '__proto__', 'constructor', '../andrea', 'javascript:alert(1)', undefined, null, 0, {}, ['experience']]){
    assert.equal(selectionForHash(hash),null);
  }
});
test('scroll assembly clamps its range and reverses when the visitor scrolls back',()=>{
  assert.equal(buildProgress(0,76,1200),0);
  assert.equal(buildProgress(676,76,1200),.5);
  assert.equal(buildProgress(2000,76,1200),1);
  assert.equal(buildProgress(376,76,1200),.25);
  assert.equal(buildProgress(76,76,0),1);
});
test('an unopened tour stays empty even if the browser restores a scroll position or the layout is not measured yet',()=>{
 for(const [scroll,top,span] of [[12,0,2500],[1200,0,2500],[0,0,0]])assert.equal(buildProgress(scroll,top,span,false),0);
 assert.ok(buildProgress(120,0,2500,true)>0);
});
test('the active viewer does not import or instantiate the removed robot and driving game',async()=>{
  const source=await readFile(new URL('../public/city.js',import.meta.url),'utf8');
  assert.doesNotMatch(source,/\b(?:createActors|createCar|boardingStep|safeEgress)\b|city-(?:actors|vehicle|state)\.js/);
});

test('the guided explanation follows each building before the final overview',()=>{assert.equal(buildingAt(0),'stack');assert.equal(buildingAt(.39),'stack');assert.equal(buildingAt(.4),'horagora');assert.equal(buildingAt(.55),'andrea');assert.equal(buildingAt(.74),null);assert.equal(buildingAt(1),null);});

test('each complete landmark keeps its explanation through a separate scroll reading interval',()=>{
 for(const [start,end,building,progress] of [[.22,.34,'stack',.4],[.46,.6,'horagora',.55],[.72,.86,'andrea',.74]]){
  for(const raw of [start,(start+end)/2,end-.0001])assert.deepEqual(constructionFrame(raw),{progress,building,phase:'reading'});
  const next=constructionFrame(end+.0001);assert.equal(next.phase,end===.86?'challenge':'building');assert.ok(next.progress>progress);
 }
 assert.equal(constructionFrame(0).progress,0);assert.equal(constructionFrame(1).progress,1);
 const samples=Array.from({length:101},(_,i)=>constructionFrame(i/100).progress);
 for(let i=1;i<samples.length;i++)assert.ok(samples[i]>=samples[i-1]);
});
