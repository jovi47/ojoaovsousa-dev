import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {createMobileTour} from '../public/city-autoplay.js';

async function fixture(){
 const source=await readFile(new URL('../public/city.js',import.meta.url),'utf8');
 const slice=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end));
 const root={rotation:{set(){}}},selections=[];
 const context={createMobileTour,VIEWER_BUILDINGS:['stack','horagora','andrea'],construction:1,selected:null,mobileEntry:true,reduced:false,
  localReplay:null,landmarkIdleTime:0,motionFinished:false,manualReturn:false,returnDelay:0,spinVelocity:0,coastTime:0,lastPaint:-1,
  landmarkRanges:{stack:[0,.4],horagora:[.4,.55],andrea:[.55,.74],challenge:[.74,1]},landmarkRoots:new Map(['stack','horagora','andrea','challenge'].map(id=>[id,root])),
  canvas:{style:{},dataset:{}},document:{hidden:false,querySelector:()=>null,querySelectorAll:()=>[]},residents:{setSelected(id){selections.push(id);}},
  currentLandmark:()=>root,showPanel(){},usesViewerFlow:()=>true,innerWidth:390,stackX:-5.6,stackZ:0,cardOffset:()=>0,
  village:{places:[{id:'horagora',x:-1.5,z:0},{id:'andrea',x:2.2,z:0}]},camera:{updateProjectionMatrix(){}},invalidate(){},
  THREE:{Vector3:class{constructor(x,y,z){Object.assign(this,{x,y,z});}},MathUtils:{lerp:(from,to,t)=>from+(to-from)*t}},
  clamp:(n,min,max)=>Math.max(min,Math.min(max,n)),disposed:false,reading:false,inView:true,last:0,drag:null,raf:0,
  dialogPaused:false,annotationPaused:false,ambientTime:0,visualConstruction:1,desired:null,
 };
 // Exercise the actual shared callback, selection/replay functions and frame progress calculation.
 const functions=runInNewContext(`${slice(' const mobileTour=createMobileTour(', ' inspection=createInspection(')}
 ${slice(' function resetMotion(){',' function enter(')}
 ${slice(' function setSelection(', ' function paint(')}
 ${slice(' function frame(ms){','  const motion=landmarkMotion(dt,paused);')}
 return {progress:visualConstruction,replaying:localReplay?.id||'',selected};}
 ({mobileTour,chooseLandmark,frame});`,context);
 let ms=1;
 function frame(){const result=functions.frame(ms);ms+=40;return result;}
 function finish(){let result;for(let n=0;n<108;n++)result=frame();assert.equal(result.replaying,'');return result;}
 return {context,selections,...functions,frame,finish};
}

test('a selector click starts the real chapter replay on its first visit and revisits show the built model',async()=>{
 const f=await fixture();
 f.chooseLandmark('horagora');let render=f.frame();assert.equal(render.selected,'horagora');assert.equal(render.replaying,'horagora');assert.equal(render.progress,.4);
 render=f.frame();assert.ok(render.progress>.4&&render.progress<.55);f.finish();
 f.chooseLandmark('andrea');render=f.frame();assert.equal(render.replaying,'andrea');assert.ok(render.progress>=.55&&render.progress<.74);f.finish();
 f.chooseLandmark('horagora');render=f.frame();assert.equal(render.replaying,'');assert.equal(render.progress,1);assert.equal(f.mobileTour.running,false);
});

test('automatic visits use the same replay path, keep current dwell times, and do not rebuild on later cycles',async()=>{
 const f=await fixture();let render=f.frame();assert.equal(render.selected,'challenge');assert.equal(render.replaying,'challenge');assert.equal(render.progress,.74);f.finish();
 f.context.landmarkIdleTime=9.99;render=f.frame();assert.equal(render.selected,'challenge');
 f.context.landmarkIdleTime=10;render=f.frame();assert.equal(render.selected,'stack');assert.equal(render.replaying,'stack');f.finish();
 for(const id of ['horagora','andrea']){f.context.landmarkIdleTime=10;render=f.frame();assert.equal(render.selected,id);assert.equal(render.replaying,id);f.finish();}
 f.context.landmarkIdleTime=10;render=f.frame();assert.equal(render.selected,'challenge');assert.equal(render.replaying,'');assert.equal(render.progress,1);
 f.context.landmarkIdleTime=10;render=f.frame();assert.equal(render.selected,'stack');assert.equal(render.replaying,'');
});
