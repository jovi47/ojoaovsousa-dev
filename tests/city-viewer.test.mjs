import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {content} from '../src/content.mjs';
import {cityCopy} from '../src/city-copy.mjs';
import {storyScrollFrame,chapterTrackLengths,readingOffset} from '../public/city-story.js';
import {VIEWER_BUILDINGS,selectionForHash,buildProgress,buildingAt,constructionFrame,landmarkIdleYaw,touchDragAxis,usesViewerFlow} from '../public/city.js';

test('only phone widths use autoplay flow; medium and large screens remain guided by scroll',()=>{
 for(const width of [320,430,700])assert.equal(usesViewerFlow(width),true);
 for(const width of [701,768,853,1024,1100,1101,1280,1920])assert.equal(usesViewerFlow(width),false);
});

test('touch rotation waits for an intentional horizontal gesture and leaves vertical or diagonal pans to the page',()=>{
 for(const [x,y] of [[0,0],[3,4],[-4,3]])assert.equal(touchDragAxis(x,y),null);
 for(const [x,y] of [[6,0],[-12,2],[20,-8]])assert.equal(touchDragAxis(x,y),'horizontal');
 for(const [x,y] of [[0,6],[2,-12],[20,20],[-8,20]])assert.equal(touchDragAxis(x,y),'vertical');
});

test('renderer resize preserves Retina detail for fine hover pointers and keeps existing touch limits',async()=>{
 const cases=[
  ...[390,1084,1100,1101,1280].map(width=>({width,dpr:2,fine:true,hover:true,want:2})),
  {width:1084,dpr:3,fine:true,hover:true,want:2},
  {width:1084,dpr:1.25,fine:true,hover:true,want:1.25},
  {width:1280,dpr:1,fine:true,hover:true,want:1},
  {width:1084,dpr:2,fine:true,hover:false,want:1.15},
  {width:1084,dpr:2,fine:false,hover:true,want:1.15},
  {width:390,dpr:2,fine:false,hover:false,want:1.15},
  {width:1100,dpr:2,fine:false,hover:false,want:1.15},
  {width:1101,dpr:2,fine:false,hover:false,want:1.4},
  {width:1280,dpr:1,fine:false,hover:false,want:1},
 ];
 for(const {width,dpr,fine,hover,want} of cases){
  const f=await selectionContextFixture(),ratios=[],sizes=[],cssWidth=width===1084?1012:width,height=339.109375;
  Object.assign(f.context,{innerWidth:width,devicePixelRatio:dpr,matchMedia:query=>{
   const features={'(pointer: fine)':fine,'(hover: hover)':hover,'(pointer: fine) and (hover: hover)':fine&&hover};
   assert.ok(Object.hasOwn(features,query));return {matches:features[query]};
  }});
  f.context.canvas.getBoundingClientRect=()=>({width:cssWidth,height});
  f.context.renderer={setPixelRatio:value=>ratios.push(value),setSize:(...args)=>sizes.push(args)};
  f.resize();
  assert.deepEqual(ratios,[want],`${width}px, DPR${dpr}, fine=${fine}, hover=${hover}`);
  assert.deepEqual(sizes,[[cssWidth,height,false]],'CSS geometry stays unchanged');
  assert.equal(f.context.camera.aspect,cssWidth/height);
 }
});

test('renderer startup preserves mobile scroll without a fragment while honoring explicit anchors and the desktop introduction',async()=>{
 const source=await readFile(new URL('../public/city-app.js',import.meta.url),'utf8');
 const start=source.slice(source.indexOf('async function start(){'),source.indexOf("document.querySelector('[data-retry]')?.addEventListener"));
 // Exercise the real startup glue with only the WebGL module replaced.
 for(const [width,hash,want] of [[700,'',[]],[701,'',['intro']],[1100,'',['intro']],[1101,'',['intro']],[853,'#main',['main']],[853,'#intro',['intro']],[1280,'#projects',['projects']]]){
  const mobile=usesViewerFlow(width);
  const calls=[],classes=new Set(mobile?['mobile-entry']:[]),world={setReading(){},goTo(id){calls.push(id);}};
  const context={canvas:{dataset:{}},starting:false,world:null,location:{hash},labels:{},reduced:{matches:false},worldStatus:{},applySeason(){},openInquiry(){},openResident(){},
   body:{classList:{contains:name=>classes.has(name),add:(...names)=>names.forEach(name=>classes.add(name)),remove:name=>classes.delete(name)}},
   document:{querySelector:()=>({hidden:false})},console:{error(error){throw error;}},loadCity:async()=>({createCity:async()=>world})};
  await runInNewContext(`(${start.replace("await import('./city.js')","await loadCity()")})`,context)();
  assert.deepEqual(calls,want,`${width}px ${hash||'without fragment'}`);
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

test('physical scroll advances directly between construction chapters without separate reading holds',()=>{
 const lengths=chapterTrackLengths(600),total=lengths.reduce((sum,n)=>sum+n,0);
 let previous=0;
 for(let offset=0;offset<=total;offset++){
  const frame=constructionFrame(storyScrollFrame(offset,lengths).progress);
  assert.notEqual(frame.phase,'reading');assert.ok(frame.progress>=previous);previous=frame.progress;
 }
 assert.equal(previous,1);
 for(const [offset,building] of [[0,'stack'],[849,'stack'],[850,'horagora'],[1449,'horagora'],[1450,'andrea'],[2049,'andrea'],[2050,null]]){
  assert.equal(constructionFrame(storyScrollFrame(offset,lengths).progress).building,building);
 }
});


async function selectionContextFixture(key='pt-br'){
 const source=await readFile(new URL('../public/city.js',import.meta.url),'utf8'),c=content[key],u=cityCopy[key];
 const offer={textContent:u.offer},description={textContent:c.hero.description},intro={hidden:false},card={dataset:{active:''},hidden:true,scrollTop:12};
 const entries=[['stack',c.about.title,'Chapter marker'],...c.work.cases.map(item=>[item.id,item.name,item.description]),['challenge',c.contact.title,c.contact.description]];
 const panels=entries.map(([id,title,body])=>({dataset:{viewerCard:id},hidden:true,querySelector(selector){return selector==='[data-viewer-title]'?{textContent:title}:selector===':scope > p'?{textContent:body}:selector==='p'?{textContent:'Nested text that is not the project introduction'}:null;}}));
 const statusWrites=[],animations=[],attributes=new Map(),buttons=Array.from({length:2},()=>({attributes:new Map(),setAttribute(name,value){this.attributes.set(name,value);}}));
 let statusText='Ready';const status={get textContent(){return statusText;},set textContent(value){statusWrites.push(value);statusText=value;}};
 const board={dataset:{},classList:{toggle(){}}},tour={style:{removeProperty(){}}};
 const nodes={'#viewer-card':card,'.viewer-intro':intro,'.viewer-offer':offer,'.viewer-intro-description':description,'#world-status':status,'.viewer-board':board,'.viewer-tour':tour};
 const document={body:{classList:{toggle(){},add(){},remove(){}}},querySelector:selector=>nodes[selector]||null,querySelectorAll:selector=>selector==='[data-viewer-card]'?panels:selector==='[data-select-building],[data-building-step]'?buttons:[]};
 const context={document,inspection:null,mobileEntry:true,introOffer:u.offer,introDescription:c.hero.description,enter:node=>animations.push(node),reading:false,disposed:false,lastPaint:0,construction:1,assembled:true,reduced:false,selected:'stack',storyProgress:1,chapter:null,constructionStarted:false,scrollY:100,storyLengths:[],storyTop:()=>0,storyScrollFrame:()=>({}),constructionFrame:()=>({progress:1,building:null,phase:'complete'}),copy:{...u,ready:'Ready',projectTitle:'Desktop completed introduction'},invalidate(){},syncMore(){},usesViewerFlow,innerWidth:430,innerHeight:740,devicePixelRatio:1,measureStory(){},renderer:{setPixelRatio(){},setSize(){}},camera:{updateProjectionMatrix(){}},canvas:{dataset:{},style:{},getBoundingClientRect:()=>({width:430,height:270}),setAttribute:(name,value)=>attributes.set(name,value)}};
 context.matchMedia=()=>({matches:false});
 const functionSource=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end));
 const functions=runInNewContext(`${functionSource('function showPanel(', 'function setSelection(')}
${functionSource('function syncConstruction(){','function storyScroll(){')}
${functionSource('function resize(){','function release(){')}
({showPanel,syncConstruction,resize});`,context);
 context.showPanel=functions.showPanel;context.syncConstruction=functions.syncConstruction;
 context.setSelection=id=>{context.selected=id;functions.showPanel(id);};
 return {c,u,context,offer,description,intro,card,panels,status,statusWrites,animations,attributes,buttons,...functions};
}

test('mobile selection reuses each rendered project or challenge introduction and restores the exact biography',async()=>{
 for(const key of Object.keys(content)){
  const f=await selectionContextFixture(key);
  for(const [id,title,body] of [...f.c.work.cases.map(item=>[item.id,item.name,item.description]),['challenge',f.c.contact.title,f.c.contact.description]]){
   f.context.selected=id;f.showPanel(id);
   assert.equal(f.offer.textContent,title,`${key}: ${id} title`);assert.equal(f.description.textContent,body,`${key}: first direct paragraph`);
   assert.equal(f.intro.hidden,false);assert.equal(f.card.hidden,true);assert.ok(f.panels.every(panel=>panel.hidden));
   assert.equal(f.status.textContent,title);const writes=f.statusWrites.length;f.showPanel(id);assert.equal(f.statusWrites.length,writes,`${key}: unchanged selection is not announced again`);
  }
  for(const id of ['stack',null]){f.showPanel(id);assert.equal(f.offer.textContent,f.u.offer);assert.equal(f.description.textContent,f.c.hero.description);}
  assert.equal(f.animations.length,0,'mobile selection does not start desktop panel motion');
 }
});

test('scroll and mobile-desktop-mobile resize preserve selection while desktop keeps its original introduction semantics',async()=>{
 const f=await selectionContextFixture(),item=f.c.work.cases[0];f.context.selected=item.id;f.showPanel(item.id);
 const writes=f.statusWrites.length;f.syncConstruction();assert.equal(f.offer.textContent,item.name);assert.equal(f.description.textContent,item.description);assert.equal(f.statusWrites.length,writes,'scroll does not replace selection announcement with generic ready text');
 f.resize();assert.equal(f.attributes.get('aria-describedby'),'viewer-mobile-help');for(const button of f.buttons)assert.equal(button.attributes.get('aria-controls'),'viewer-intro city-canvas');
 f.context.innerWidth=1280;f.resize();assert.equal(f.offer.textContent,f.u.offer);assert.equal(f.description.textContent,'Desktop completed introduction');assert.equal(f.intro.hidden,true);assert.equal(f.card.hidden,false);assert.equal(f.panels.find(panel=>panel.dataset.viewerCard===item.id).hidden,false);for(const button of f.buttons)assert.equal(button.attributes.get('aria-controls'),'viewer-card');
 f.context.innerWidth=430;f.resize();assert.equal(f.context.selected,item.id);assert.equal(f.offer.textContent,item.name);assert.equal(f.description.textContent,item.description);assert.equal(f.intro.hidden,false);assert.equal(f.card.hidden,true);assert.ok(f.panels.every(panel=>panel.hidden));
 f.context.selected='stack';f.showPanel('stack');f.syncConstruction();assert.equal(f.offer.textContent,f.u.offer);assert.equal(f.description.textContent,f.c.hero.description);
});


test('the runtime scrolls the visible desktop card during construction and resets when a new building starts',async()=>{
 const f=await selectionContextFixture();
 Object.assign(f.context,{mobileEntry:false,innerWidth:1280,assembled:false,constructionStarted:true,selected:null,construction:0,
  storyLengths:chapterTrackLengths(600),storyOverflows:{stack:900,horagora:300,andrea:200},storyScrollFrame,constructionFrame,readingOffset,
  release(){},guidedView(progress){return {progress};}});
 for(const [scroll,chapter,offset] of [[85,'stack',90],[425,'stack',450],[765,'stack',810],[425,'stack',450],[850,'horagora',0],[1150,'horagora',150],[1450,'andrea',0],[1750,'andrea',100]]){
  f.context.scrollY=scroll;f.syncConstruction();
  assert.equal(f.context.chapter,chapter);assert.equal(f.card.scrollTop,offset);assert.equal(f.card.hidden,false);
  assert.equal(f.context.canvas.dataset.chapterPhase,'building');
 }
});
