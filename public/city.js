import * as THREE from './vendor/three.module.js';
import {createCityPieces,getPiecePose} from './city-model.js';
import {createVillage} from './city-village.js';
import {createTechSigns} from './city-tech.js';
import {createResidents} from './city-residents.js';
import {STORY_BANDS,storyScrollFrame,chapterTrackLengths,readingOffset,storyTrackHeight} from './city-story.js';
import {buildMotion,coastStep} from './city-motion.js';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export const VIEWER_BUILDINGS=['stack','horagora','andrea'];
export const buildProgress=(scroll,top,span,started=true)=>!started?0:span>0?clamp((scroll-top)/span,0,1):1;
export const buildingAt=progress=>progress<.4?'stack':progress<.55?'horagora':progress<.74?'andrea':null;
export const landmarkIdleYaw=seconds=>seconds*Math.PI/15;
export const touchDragAxis=(x,y)=>Math.hypot(x,y)<6?null:Math.abs(x)>Math.abs(y)?'horizontal':'vertical';
export function constructionFrame(scroll){
 const p=clamp(scroll,0,1);
 if(p<.22)return {progress:p/.22*.4,building:'stack',phase:'building'};
 if(p<.34)return {progress:.4,building:'stack',phase:'reading'};
 if(p<.46)return {progress:.4+(p-.34)/.12*.15,building:'horagora',phase:'building'};
 if(p<.6)return {progress:.55,building:'horagora',phase:'reading'};
 if(p<.72)return {progress:.55+(p-.6)/.12*.19,building:'andrea',phase:'building'};
 if(p<.86)return {progress:.74,building:'andrea',phase:'reading'};
 return {progress:.74+(p-.86)/.14*.26,building:null,phase:'challenge'};
}
export function selectionForHash(hash){return hash==='experience'?'stack':hash==='projects'?'horagora':hash==='andrea'?'andrea':null;}
export async function createCity(canvas,copy,openInquiry){
 const stackX=-5.6,stackZ=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const introDescription=document.querySelector('.viewer-intro-description')?.textContent||copy.intro;
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 renderer.shadowMap.enabled=false;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xf7f5ee);scene.fog=new THREE.Fog(0xf7f5ee,80,160);
 function syncTheme(){const color=getComputedStyle(canvas).getPropertyValue('--scene-background').trim()||'#f7f5ee';scene.background.set(color);scene.fog.color.set(color);invalidate();}
 const camera=new THREE.PerspectiveCamera(38,1,.1,190);
 scene.add(new THREE.HemisphereLight(0xf0f6ff,0x637e8b,2.6));
 const sun=new THREE.DirectionalLight(0xffe7bf,3.5);sun.position.set(-10,18,12);scene.add(sun);
 const rim=new THREE.DirectionalLight(0xc5dcff,1.3);rim.position.set(12,6,-12);scene.add(rim);
 const geometry={box:new THREE.BoxGeometry(1,1,1),stud:new THREE.CylinderGeometry(1,1,1,8)};
 const resources=new Set(),materials=new Map(),dummy=new THREE.Object3D(),offset=new THREE.Vector3();
 let disposed=false,raf=0,last=0,ambientTime=0,construction=reduced?1:0,storyProgress=0,chapter='stack',assembled=false,inView=true,selected=null,reading=false,dialogPaused=false,drag=null,pinch=0,lastPaint=-1;
 let constructionStarted=false,scrollIntent=false,touchStartY=null,visualConstruction=0,layoutRaf=0,localReplay=null,landmarkIdleTime=0,motionId=null,motionFinished=false,manualReturn=false,returnDelay=0,spinVelocity=0,coastTime=0,mobileEntry=innerWidth<=700;
 let lastStoryScroll=scrollY,storyLengths=chapterTrackLengths(innerHeight),storyOverflows={stack:0,horagora:0,andrea:0};
 const cleanups=[],pointers=new Map(),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
 const view={azimuth:0,elevation:.43,distance:30},target=new THREE.Vector3(-2,2,0);let desired={azimuth:0,elevation:.43,distance:30,target:new THREE.Vector3(-2,2,0)};
 function invalidate(){if(!raf&&!disposed&&!reading&&inView&&!document.hidden)raf=requestAnimationFrame(frame);}
 const material=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.38}));return materials.get(color);};
 const experienceRoot=new THREE.Group();experienceRoot.position.set(stackX,0,stackZ+2.96);experienceRoot.rotation.y=-Math.PI/2;experienceRoot.scale.setScalar(.74);scene.add(experienceRoot);
 const pieces=createCityPieces().filter(p=>p.building==='experience'),batches=new Map();
 function bucket(kind,color){const key=kind+String(color);if(!batches.has(key))batches.set(key,{kind,color,items:[]});return batches.get(key);}
 for(const piece of pieces){bucket('box',piece.color).items.push({piece});for(const stud of piece.studs||[])bucket('stud',piece.color).items.push({piece,stud});}
 for(const b of batches.values()){b.mesh=new THREE.InstancedMesh(geometry[b.kind],material(b.color),b.items.length);b.mesh.frustumCulled=false;b.mesh.userData.building='stack';b.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);experienceRoot.add(b.mesh);}
 const village=createVillage(THREE,scene,{boxGeometry:geometry.box,studGeometry:geometry.stud,layout:{horagora:[-1.5,0],andrea:[2.2,0]}});
 const residents=createResidents(THREE,scene,{places:village.places,onAsset:invalidate,assemble:true});for(const r of residents.interactables){r.object.rotation.y=0;if(r.id==='jovi')r.object.position.set(stackX+1.15,0,stackZ+2.05);}
 const tech=createTechSigns(THREE,scene,{pieces,onAsset:invalidate});experienceRoot.add(tech.group);for(const sign of tech.signs)sign.object.userData.building='stack';
 const plinths=[{id:'stack',x:stackX,z:.6,w:3.4,d:4.4,start:0,end:.025},{id:'horagora',x:-1.5,z:.9,w:3.1,d:3.8,start:.4,end:.415},{id:'andrea',x:2.2,z:.9,w:3.1,d:3.8,start:.55,end:.565},{id:'challenge',x:6.5,z:1.4,w:3.8,d:2.8,start:.74,end:.78}].map(spec=>{
  const root=new THREE.Group();root.position.set(spec.x,0,spec.z);scene.add(root);
  const edge=new THREE.Mesh(geometry.box,material(0x18212b));edge.position.y=-.19;edge.scale.set(spec.w,.14,spec.d);root.add(edge);
  const plate=new THREE.Mesh(geometry.box,material(0x2c3945));plate.position.y=-.09;plate.scale.set(spec.w-.08,.12,spec.d-.08);root.add(plate);
  const columns=Math.floor((spec.w-.2)/.36),rows=Math.floor((spec.d-.2)/.36),studs=new THREE.InstancedMesh(geometry.stud,material(0x354552),columns*rows);resources.add(studs);
  for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){dummy.position.set((col-(columns-1)/2)*.36,-.015,(row-(rows-1)/2)*.36);dummy.rotation.set(0,0,0);dummy.scale.set(.055,.035,.055);dummy.updateMatrix();studs.setMatrixAt(row*columns+col,dummy.matrix);}root.add(studs);return {...spec,root};
 });
 const logosLoaded=new Set(),logoObjects=[];
 for(const [id,url] of [['horagora','/horagora-logo.png'],['andrea','/asc-logo.png']]){
  const place=village.interactables.find(p=>p.id===id);if(!place)continue;
  const texture=new THREE.TextureLoader().load(url,loaded=>{if(disposed){loaded.dispose();return;}const aspect=loaded.image.width/loaded.image.height;
   const g=new THREE.PlaneGeometry(1.8,1.8/aspect),m=new THREE.MeshBasicMaterial({map:loaded,transparent:true,alphaTest:.05});resources.add(g);resources.add(m);
   const logo=new THREE.Mesh(g,m);logo.position.fromArray(place.logoAnchor);logo.position.z+=.018;place.object.add(logo);logoObjects.push({id,object:logo});logosLoaded.add(id);invalidate();});
  texture.colorSpace=THREE.SRGBColorSpace;resources.add(texture);
 }
 const question=new THREE.Group();question.name='Clickable question mark';question.userData.inquiry=true;
 question.position.set(6.5,.32,1.4);question.scale.setScalar(2.2);scene.add(question);
 const cells=['01110','11011','00011','00110','00100','00000','00100'];
 for(let y=0;y<cells.length;y++)for(let x=0;x<5;x++)if(cells[y][x]==='1'){
  const brick=new THREE.Mesh(geometry.box,material(0xff6b24));brick.position.set((x-2)*.29,(6-y)*.29,.02);brick.scale.set(.28,.28,.35);question.add(brick);
  const stud=new THREE.Mesh(geometry.stud,material(0xff6b24));stud.position.copy(brick.position);stud.position.y+=.16;stud.scale.set(.07,.05,.07);question.add(stud);
 }
 for(const part of question.children){part.userData.anchor=part.position.clone();part.userData.finalScale=part.scale.clone();}
 const landmarkRoots=new Map();
 for(const plinth of plinths){
  const pivot=new THREE.Group();pivot.name=plinth.id+' inspection pivot';pivot.position.set(plinth.x,0,plinth.z);scene.add(pivot);pivot.attach(plinth.root);
  if(plinth.id==='stack')pivot.attach(experienceRoot);
  else if(plinth.id==='challenge')pivot.attach(question);
  else pivot.attach(village.interactables.find(place=>place.id===plinth.id).object);
  const resident=residents.interactables.find(item=>item.id===(plinth.id==='stack'?'jovi':plinth.id==='horagora'?'hori':plinth.id));if(resident)pivot.attach(resident.object);
  landmarkRoots.set(plinth.id,pivot);
 }
 const landmarkRanges={stack:[0,.4],horagora:[.4,.55],andrea:[.55,.74],challenge:[.74,1]};
 const activeLandmark=()=>construction<1?(chapter||'challenge'):(selected==='about'?'stack':selected);
 const currentLandmark=()=>landmarkRoots.get(activeLandmark());
 function resetMotion(){landmarkIdleTime=0;motionFinished=false;manualReturn=false;returnDelay=0;spinVelocity=0;coastTime=0;}
 function enter(node,duration=550){if(reduced||!node?.animate)return;for(const animation of node.getAnimations())animation.cancel();node.animate([{opacity:.15},{opacity:1}],{duration,easing:'cubic-bezier(.22,1,.36,1)'});}
 function interruptReplay(){if(localReplay){localReplay=null;visualConstruction=construction;motionFinished=true;lastPaint=-1;}}
 function resumeAfterGesture(velocity=0){manualReturn=true;returnDelay=Math.abs(velocity)>1.5?0:.7;spinVelocity=Math.abs(velocity)>1.5?velocity:0;coastTime=0;landmarkIdleTime=0;invalidate();}
 function landmarkMotion(dt,paused){
  const id=activeLandmark(),root=landmarkRoots.get(id);if(!root)return {zoom:1,active:false};
  if(id!==motionId){motionId=id;resetMotion();root.rotation.set(0,0,0);if(construction>0)enter(canvas,700);}
  const [from,to]=landmarkRanges[id],build=buildMotion(visualConstruction,from,to);
  if(!build.complete){resetMotion();root.rotation.set(0,build.yaw,0);}
  else if(!motionFinished){motionFinished=true;root.rotation.set(0,0,0);}
  const active=build.complete&&!reduced&&!paused&&!drag;
  if(active){
   if(manualReturn){
    if(spinVelocity){const coast=coastStep(spinVelocity,dt);root.rotation.y+=coast.deltaYaw;spinVelocity=coast.velocity;coastTime+=dt;if(Math.abs(spinVelocity)<.25||coastTime>=2.6)spinVelocity=0;}
    else if(returnDelay>0)returnDelay=Math.max(0,returnDelay-dt);
    else{const delta=Math.atan2(Math.sin(-root.rotation.y),Math.cos(-root.rotation.y)),blend=1-Math.exp(-dt*4);root.rotation.y+=delta*blend;root.rotation.x*=1-blend;if(Math.abs(delta)<.005&&Math.abs(root.rotation.x)<.005){root.rotation.set(0,0,0);manualReturn=false;}}
   }else{landmarkIdleTime+=dt;root.rotation.y=landmarkIdleYaw(landmarkIdleTime);}
  }
  return {zoom:build.zoom,active};
 }
 const hitObjects=[...Array.from(batches.values(),b=>b.mesh),...village.interactables.map(p=>p.object),...tech.signs.map(p=>p.object),...residents.interactables.map(p=>p.object),question];
 function on(node,event,fn,opts){if(!node)return;node.addEventListener(event,fn,opts);cleanups.push(()=>node.removeEventListener(event,fn,opts));}
 const storyTop=()=>{const tour=document.querySelector('.viewer-tour'),header=document.querySelector('.site-header');return tour?tour.getBoundingClientRect().top+scrollY-(header?.offsetHeight||0):0;};
 function measureStory(preserve=false){
  const tour=document.querySelector('.viewer-tour'),board=document.querySelector('.viewer-board'),card=document.querySelector('#viewer-card');
  if(!tour||!board||!card||disposed)return;
  if(assembled||reading||reduced){tour.style.removeProperty('height');return;}
  const old=storyScrollFrame(Math.max(0,scrollY-storyTop()),storyLengths);
  const probe=card.cloneNode(true);probe.hidden=false;probe.inert=true;probe.setAttribute('aria-hidden','true');
  for(const node of [probe,...probe.querySelectorAll('[id]')])node.removeAttribute('id');
  const cardWidth=innerWidth<=1100?board.clientWidth-24:parseFloat(getComputedStyle(card).width);
  Object.assign(probe.style,{visibility:'hidden',pointerEvents:'none',left:'-10000px',right:'auto',top:'0',transform:'none',transition:'none',width:cardWidth+'px'});
  board.append(probe);
  for(const id of VIEWER_BUILDINGS){for(const panel of probe.querySelectorAll('[data-viewer-card]'))panel.hidden=panel.dataset.viewerCard!==id;storyOverflows[id]=Math.max(0,probe.scrollHeight-probe.clientHeight);}
  probe.remove();storyLengths=chapterTrackLengths(innerHeight,storyOverflows);
  tour.style.height=storyTrackHeight(innerHeight,document.querySelector('.site-header')?.offsetHeight,board.offsetHeight,storyLengths)+'px';
  canvas.dataset.storyLengths=storyLengths.map(Math.round).join(',');
  if(preserve&&constructionStarted){const within=old.segment%2?Math.min(old.within,storyLengths[old.segment]):old.within/old.length*storyLengths[old.segment];window.scrollTo({top:storyTop()+storyLengths.slice(0,old.segment).reduce((sum,n)=>sum+n,0)+within,behavior:'instant'});}
 }
 function scheduleStoryLayout(){if(!layoutRaf&&!assembled&&!reading)layoutRaf=requestAnimationFrame(()=>{layoutRaf=0;measureStory(true);syncConstruction();});}
 function cardOffset(distance){return innerWidth<=1100?0:Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*distance*camera.aspect*.42;}
 function showPanel(id,guided=false){const card=document.querySelector('#viewer-card'),intro=document.querySelector('.viewer-intro'),changed=card&&card.dataset.active!==(id||'');if(card){if(changed)card.scrollTop=0;card.dataset.active=id||'';card.hidden=mobileEntry||!id;}if(intro)intro.hidden=!mobileEntry&&!!id;for(const panel of document.querySelectorAll('[data-viewer-card]'))panel.hidden=mobileEntry||panel.dataset.viewerCard!==id;if(changed&&!mobileEntry)enter(id?card:intro);}
 function setSelection(id,focus=true){
  if(id&&construction<1)return;if(mobileEntry&&id==='about')id='stack';const next=VIEWER_BUILDINGS.includes(id)||id==='about'||id==='challenge'?id:construction>=1?'challenge':null;if(next!==selected){localReplay=null;resetMotion();selected=next;currentLandmark()?.rotation.set(0,0,0);}canvas.style.touchAction=mobileEntry?'pan-y pinch-zoom':construction<1?'pan-y':'none';residents.setSelected(selected==='stack'||selected==='about'?'jovi':selected);
  showPanel(selected||(construction<1&&construction>.015?(chapter||'challenge'):null),construction<1);
  for(const b of document.querySelectorAll('[data-select-about]'))b.setAttribute('aria-pressed',String(selected==='about'));
  for(const b of document.querySelectorAll('[data-select-building]'))b.setAttribute('aria-pressed',String(b.dataset.selectBuilding===selected));
  const mobile=innerWidth<=1100;
  if(selected==='stack')desired={azimuth:0,elevation:.22,distance:mobile?13.2:17.6,target:new THREE.Vector3(stackX-cardOffset(mobile?13.2:17.6),3.7,stackZ)};
  else if(selected==='about')desired={azimuth:.12,elevation:.18,distance:mobile?7.48:6.6,target:new THREE.Vector3(stackX+1.15,1.1,stackZ+2.05)};
  else if(selected==='challenge')desired={azimuth:0,elevation:.2,distance:mobile?8.4:11.2,target:new THREE.Vector3(6.5-cardOffset(mobile?8.4:11.2),1.8,1.4)};
  else if(selected){const place=village.places.find(p=>p.id===selected);desired={azimuth:0,elevation:.23,distance:mobile?7.26:9.9,target:new THREE.Vector3(place.x-cardOffset(mobile?7.26:9.9),1.25,place.z+.5)};}
  else desired=construction<1?guidedView(construction):overview();
  camera.near=.1;camera.updateProjectionMatrix();
  if(focus&&selected&&!mobileEntry){window.scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>document.querySelector('[data-viewer-card="'+selected+'"] h2')?.focus({preventScroll:true}));}
  canvas.dataset.selected=selected||'';invalidate();
 }
 function paint(progress){
  if(lastPaint===progress)return;
  for(const b of batches.values()){
   for(let i=0;i<b.items.length;i++){const {piece,stud}=b.items[i],pose=getPiecePose(piece,progress,0);const scale=pose.visible?pose.scale:0;dummy.position.fromArray(pose.position);dummy.rotation.set(...pose.rotation);
    if(stud){offset.set(stud[0],piece.size[1]/2+.0175,stud[1]).applyEuler(dummy.rotation);dummy.position.add(offset);const radius=Math.min(.055,piece.size[0]*.32,piece.size[2]*.32);dummy.scale.set(radius,.035,radius).multiplyScalar(scale);}
    else dummy.scale.fromArray(piece.size).multiplyScalar(scale);dummy.updateMatrix();b.mesh.setMatrixAt(i,dummy.matrix);
   }b.mesh.instanceMatrix.needsUpdate=true;
  }lastPaint=progress;
 }
 function frame(ms){
  raf=0;if(disposed||reading||!inView||document.hidden)return;
  if(last&&!drag&&ms-last<1000/30){raf=requestAnimationFrame(frame);return;}
  const dt=Math.min(.05,last?(ms-last)/1000:0);last=ms;
  const paused=dialogPaused||!!document.querySelector('dialog[open]');
  if(!paused&&!reduced)ambientTime+=dt;
  let frameProgress=construction;
  if(localReplay){if(!paused)localReplay.elapsed+=dt;const elapsed=clamp(localReplay.elapsed/4.2,0,1);frameProgress=THREE.MathUtils.lerp(localReplay.from,localReplay.to,elapsed);if(elapsed===1)localReplay=null;}
  visualConstruction=reduced||localReplay||construction===0||construction===1?frameProgress:THREE.MathUtils.lerp(visualConstruction,frameProgress,1-Math.exp(-dt*10));
  if(Math.abs(visualConstruction-frameProgress)<.0001)visualConstruction=frameProgress;
  const motion=landmarkMotion(dt,paused);
  paint(visualConstruction);village.update({time:ambientTime,progress:visualConstruction,reduced});tech.update({progress:visualConstruction,explodeOverride:0,reduced});
  for(const logo of logoObjects)logo.object.visible=visualConstruction>=(logo.id==='horagora'?.53:.68);
  residents.update({time:ambientTime,dt,progress:visualConstruction,reduced,paused:true});
  const focus=construction<1?(chapter||'challenge'):selected?(selected==='about'?'stack':selected):null;experienceRoot.visible=construction>0&&(!focus||focus==='stack');for(const place of village.interactables)place.object.visible=construction>(place.id==='horagora'?.4:.55)&&(!focus||focus===place.id);for(const resident of residents.interactables)resident.object.visible=resident.object.visible&&(!focus||focus===(resident.id==='jovi'?'stack':resident.id==='hori'?'horagora':'andrea'));
  for(const plinth of plinths){plinth.root.visible=visualConstruction>plinth.start&&(!focus||focus===plinth.id);plinth.root.scale.y=clamp((visualConstruction-plinth.start)/(plinth.end-plinth.start),0,1);}
  const arrival=clamp((visualConstruction-.74)/.26,0,1);question.visible=arrival>0&&(!focus||focus==='challenge');for(const [i,part] of question.children.entries()){const t=clamp(arrival*(question.children.length/2+2)-Math.floor(i/2),0,1);part.position.copy(part.userData.anchor);part.position.y+=(1-t)*1.2;part.rotation.z=(1-t)*.3;part.scale.copy(part.userData.finalScale).multiplyScalar(t);}
  const blend=reduced||drag?1:1-Math.exp(-dt*4.5),frameDistance=desired.distance*motion.zoom,frameElevation=desired.elevation+(motion.zoom-1)*.85,frameTarget=desired.target.clone();frameTarget.x-=cardOffset(frameDistance)-cardOffset(desired.distance);target.lerp(frameTarget,blend);
  view.azimuth=THREE.MathUtils.lerp(view.azimuth,desired.azimuth,blend);view.elevation=THREE.MathUtils.lerp(view.elevation,frameElevation,blend);view.distance=THREE.MathUtils.lerp(view.distance,frameDistance,blend);
  camera.position.set(target.x+Math.sin(view.azimuth)*Math.cos(view.elevation)*view.distance,target.y+Math.sin(view.elevation)*view.distance,target.z+Math.cos(view.azimuth)*Math.cos(view.elevation)*view.distance);camera.lookAt(target);
  renderer.render(scene,camera);
  Object.assign(canvas.dataset,{engine:'three.js r186',placeCount:'3',experiencePieces:String(pieces.length),cityPieces:String(pieces.length+village.stats.bricks),technologyStoreys:String(tech.stats.technologyStoreys),profileStoreys:String(tech.stats.profileStoreys),techSigns:String(tech.stats.signs),logosLoaded:String(logosLoaded.size),mode:'viewer',progress:construction.toFixed(3),replaying:localReplay?.id||'',rotationY:String(currentLandmark()?.rotation.y||0),rotationMode:drag?'manual':!motionFinished?'building':manualReturn?(spinVelocity?'coasting':'returning'):'auto',viewDistance:view.distance.toFixed(3),viewElevation:view.elevation.toFixed(3),horiLoaded:String(residents.stats.horiLoaded),andreaLoaded:String(residents.stats.andreaLoaded),joviLoaded:String(residents.stats.joviLoaded||false),visibleResidents:String(residents.interactables.filter(r=>r.object.visible).length),wavingResidents:String(residents.stats.wavingResidents||0),triangles:String(renderer.info.render.triangles),drawCalls:String(renderer.info.render.calls)});
  const moving=target.distanceTo(frameTarget)>.005||Math.abs(view.distance-frameDistance)>.005||Math.abs(view.azimuth-desired.azimuth)>.001||Math.abs(view.elevation-frameElevation)>.001;
  if(!paused&&(moving||localReplay||motion.active||visualConstruction!==construction))raf=requestAnimationFrame(frame);
 }
 function overview(){return {azimuth:0,elevation:.25,distance:innerWidth<=1100?40:22,target:new THREE.Vector3(innerWidth<=1100?-.5:-3.2,2.5,.6)};}
 function guidedView(progress){
  const mobile=innerWidth<=1100,stage=chapter||'challenge';
  if(stage==='stack'){const distance=mobile?13.2:17.6;return {azimuth:0,elevation:.22,distance,target:new THREE.Vector3(stackX-cardOffset(distance),Math.max(.35,Math.min(1,progress/.4)*3.7),stackZ)};}
  if(stage==='challenge'){const distance=mobile?8.4:11.2;return {azimuth:0,elevation:.2,distance,target:new THREE.Vector3(6.5-cardOffset(distance),1.8,1.4)};}
  const place=village.places.find(p=>p.id===stage),distance=mobile?7.26:9.9,[from,to]=landmarkRanges[stage],built=clamp((progress-from)/(to-from),0,1);return {azimuth:0,elevation:.23,distance,target:new THREE.Vector3(place.x-cardOffset(distance),.2+built*1.05,place.z+.5)};
 }
 function scrollToBuild(progress){constructionStarted=true;document.body.classList.add('construction-started');const segment=Math.min(6,STORY_BANDS.findIndex((band,i)=>i<7&&progress>=band&&progress<STORY_BANDS[i+1]));const index=Math.max(0,segment),within=(progress-STORY_BANDS[index])/(STORY_BANDS[index+1]-STORY_BANDS[index])*storyLengths[index];window.scrollTo({top:storyTop()+storyLengths.slice(0,index).reduce((sum,n)=>sum+n,0)+within,behavior:reduced?'instant':'smooth'});}
 function syncConstruction(){
  if(reading||disposed)return;
  const tour=document.querySelector('.viewer-tour'),board=document.querySelector('.viewer-board'),before=construction;
  const scrollFrame=storyScrollFrame(Math.max(0,scrollY-storyTop()),storyLengths);
  storyProgress=assembled||reduced||!tour?1:constructionStarted?scrollFrame.progress:0;
  const story=constructionFrame(storyProgress);construction=story.progress;chapter=story.building;canvas.dataset.chapterPhase=story.phase;canvas.dataset.storyProgress=storyProgress.toFixed(3);if(board){board.dataset.chapterPhase=story.phase;board.dataset.chapter=chapter||'challenge';}
  const justCompleted=construction>=1&&!assembled;
  if(justCompleted){assembled=true;tour?.style.removeProperty('height');document.body.classList.add('tour-complete');if(!reduced)window.scrollTo({top:0,behavior:'instant'});}
  const locked=construction<1;const status=document.querySelector('#world-status'),message=locked?(story.phase==='reading'?copy.readPause:chapter==='stack'?copy.constructionStack:chapter==='horagora'?copy.constructionHoragora:chapter==='andrea'?copy.constructionAndrea:copy.constructionChallenge||copy.constructionAndrea):(copy.readySea||copy.ready);if(status&&message&&status.textContent!==message)status.textContent=message;canvas.dataset.exploreReady=String(!locked);document.querySelector('.viewer-board')?.classList.toggle('is-building',locked);
  for(const node of document.querySelectorAll('.viewer-intro-hint,.viewer-scroll-hint'))node.textContent=locked?copy.help:(copy.readySea||copy.ready);
  const introCopy=document.querySelector('.viewer-intro-description');if(introCopy)introCopy.textContent=mobileEntry?introDescription:locked?copy.intro:copy.projectTitle;
  canvas.style.touchAction=mobileEntry?'pan-y pinch-zoom':locked?'pan-y':'none';for(const button of document.querySelectorAll('[data-select-building],[data-select-about],[data-building-step],[data-replay-landmark],[data-question]'))button.disabled=locked||(reduced&&button.matches('[data-replay-landmark]'));
  for(const link of document.querySelectorAll('[data-tour-link]')){if(locked){link.setAttribute('aria-disabled','true');link.tabIndex=-1;}else{link.removeAttribute('aria-disabled');link.removeAttribute('tabindex');}}
  if(locked){release();if(selected)setSelection(null,false);showPanel(construction>.015?(chapter||'challenge'):null,true);const card=document.querySelector('#viewer-card');if(card)card.scrollTop=story.phase==='reading'?readingOffset(scrollFrame.within,storyOverflows[chapter]):0;desired=guidedView(construction);}else{if(before<1)showPanel(null);if(before<1||!selected)desired=overview();}
  if(!selected){camera.near=.1;camera.updateProjectionMatrix();}
  if(justCompleted)setSelection('challenge',false);
  invalidate();
 }
 function storyScroll(){
  const returningToStart=scrollY<lastStoryScroll&&scrollY<=storyTop()+2;lastStoryScroll=scrollY;
  if(constructionStarted&&!assembled&&!reading&&!reduced&&returningToStart){constructionStarted=false;scrollIntent=false;visualConstruction=0;motionId=null;resetMotion();document.body.classList.remove('construction-started');}
  if(!constructionStarted&&!assembled&&!reading&&!reduced){
   if(scrollIntent&&scrollY>2){constructionStarted=true;document.body.classList.add('construction-started');}
   else if(scrollY>2){window.scrollTo({top:0,behavior:'instant'});}
  }
  syncConstruction();
 }
 function resize(){
  mobileEntry=innerWidth<=700;document.body.classList.toggle('mobile-entry',mobileEntry);
  if(mobileEntry){assembled=true;construction=1;document.body.classList.add('tour-complete');document.body.classList.remove('construction-started');}
  canvas.setAttribute('aria-describedby',mobileEntry?'viewer-mobile-help':'viewer-help');
  for(const button of document.querySelectorAll('[data-select-building],[data-building-step]'))button.setAttribute('aria-controls',mobileEntry?'city-canvas':'viewer-card');
  const mobile=innerWidth<=1100,rect=canvas.getBoundingClientRect(),width=rect.width||innerWidth,height=rect.height||innerHeight;renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.15:1.4));renderer.setSize(width,height,false);camera.aspect=width/height;camera.fov=mobile?54:38;camera.updateProjectionMatrix();measureStory(true);syncConstruction();if(construction>=1)setSelection(selected||(mobileEntry?'stack':'challenge'),false);invalidate();
 }
 function release(){if(drag?.active&&construction>=1&&(drag.moved>=5||drag.interrupted))resumeAfterGesture(drag.moved>=5&&performance.now()-drag.lastMove<100?drag.velocity:0);for(const id of pointers.keys())if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);drag=null;pointers.clear();pinch=0;canvas.classList.remove('dragging');invalidate();}
 function stepBuilding(direction){
  if(construction<1)return;const order=[...VIEWER_BUILDINGS,'challenge'],index=order.indexOf(selected==='about'?'stack':selected);
  setSelection(order[(Math.max(0,index)+direction+order.length)%order.length],false);
  const title=document.querySelector(`[data-viewer-card="${selected}"] [data-viewer-title]`),status=document.querySelector('#world-status');if(title&&status)status.textContent=title.textContent.trim();
 }
 on(canvas,'pointerdown',e=>{if(construction<1||reading||document.querySelector('dialog[open]'))return;const interrupted=manualReturn||!!localReplay,touchPan=mobileEntry&&e.pointerType==='touch';pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touchPan&&pointers.size>1){release();return;}drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:0,interrupted,lastMove:performance.now(),velocity:0,touchPan,active:!touchPan};if(!touchPan){interruptReplay();spinVelocity=0;manualReturn=false;canvas.setPointerCapture(e.pointerId);if(pointers.size===2){const [a,b]=[...pointers.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);drag.moved=99;}canvas.classList.add('dragging');}});
 on(canvas,'pointermove',e=>{if(!drag||!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(drag.touchPan&&!drag.active){const axis=touchDragAxis(e.clientX-drag.startX,e.clientY-drag.startY);if(axis==='vertical'){release();return;}if(!axis)return;drag.active=true;interruptReplay();spinVelocity=0;manualReturn=false;canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');}
  if(pointers.size===2){const [a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch&&d)desired.distance=clamp(desired.distance*pinch/d,5,85);pinch=d;drag.moved=99;}
  else{drag.moved=Math.max(drag.moved,Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY));const now=performance.now(),deltaYaw=(e.clientX-drag.x)*.006;drag.velocity=clamp(deltaYaw/Math.max(.008,(now-drag.lastMove)/1000),-20,20);drag.lastMove=now;const root=currentLandmark();if(root){root.rotation.y+=deltaYaw;if(!drag.touchPan)root.rotation.x=clamp(root.rotation.x+(e.clientY-drag.y)*.004,-.55,.65);}}
  drag.x=e.clientX;drag.y=e.clientY;invalidate();});
 on(canvas,'pointerup',e=>{const click=drag&&drag.moved<5&&pointers.size===1;pointers.delete(e.pointerId);if(click){const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);
   const hit=raycaster.intersectObjects(hitObjects,true).find(h=>{let p=h.object;while(p){if(!p.visible)return false;p=p.parent;}return true;});
   let node=hit?.object;while(node){if(node.userData.inquiry){openInquiry(mobileEntry?canvas:document.querySelector('[data-question]')||canvas);break;}const id=node.userData.residentId==='jovi'?'about':node.userData.residentId==='hori'?'horagora':node.userData.residentId==='andrea'?'andrea':node.userData.building||node.userData.caseId;if(id){setSelection(id);break;}node=node.parent;}
  }release();});
 on(canvas,'pointercancel',release);on(window,'blur',release);
 on(canvas,'keydown',e=>{if(construction<1||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)||(mobileEntry&&['ArrowUp','ArrowDown'].includes(e.key)))return;e.preventDefault();interruptReplay();resumeAfterGesture();const root=currentLandmark();if(!root)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight')root.rotation.y+=(e.key==='ArrowLeft'?-.15:.15);else root.rotation.x=clamp(root.rotation.x+(e.key==='ArrowUp'?-.1:.1),-.55,.65);invalidate();});
 on(canvas,'wheel',e=>{if(mobileEntry||construction<1||(!e.ctrlKey&&!e.metaKey))return;e.preventDefault();interruptReplay();resumeAfterGesture();desired.distance=clamp(desired.distance*Math.exp(clamp(e.deltaY,-150,150)*.0015),5,85);invalidate();},{passive:false});
 for(const next of document.querySelectorAll('[data-continue-build]'))on(next,'click',()=>{constructionStarted=true;scrollIntent=true;document.body.classList.add('construction-started');window.scrollBy({top:Math.min(600,innerHeight*.7),behavior:reduced?'instant':'smooth'});});
 for(const cue of document.querySelectorAll('[data-start-build]'))on(cue,'click',()=>scrollToBuild(.035));
 for(const b of document.querySelectorAll('[data-select-about]'))on(b,'click',()=>setSelection('about'));
 for(const skip of document.querySelectorAll('[data-skip-build]'))on(skip,'click',e=>{if(reading)return;e.preventDefault();assembled=true;document.body.classList.add('tour-complete');construction=1;selected=null;showPanel(null);window.scrollTo({top:0,behavior:'instant'});resize();requestAnimationFrame(()=>{const heading=selected&&document.querySelector(`[data-viewer-card="${selected}"] [data-viewer-title]`);(heading||canvas).focus({preventScroll:true});});});
 for(const b of document.querySelectorAll('[data-select-building]'))on(b,'click',()=>setSelection(b.dataset.selectBuilding));
 for(const b of document.querySelectorAll('[data-building-step]'))on(b,'click',()=>stepBuilding(Number(b.dataset.buildingStep)));
 for(const b of document.querySelectorAll('[data-replay-landmark]'))on(b,'click',()=>{if(construction<1||reduced)return;const id=selected==='about'?'stack':selected||'stack',range=landmarkRanges[id];resetMotion();currentLandmark()?.rotation.set(0,0,0);localReplay={id,from:range[0],to:range[1],elapsed:0};lastPaint=-1;invalidate();});
 on(document,'toggle',e=>{if(e.target.matches('.project-detail,.career-details'))scheduleStoryLayout();},true);
 on(window,'wheel',e=>{if(e.deltaY>0&&!e.ctrlKey&&!e.metaKey)scrollIntent=true;},{passive:true});
 on(window,'pointerdown',e=>{if(e.pointerType==='touch')touchStartY=e.clientY;else if(e.clientX>=document.documentElement.clientWidth-20)scrollIntent=true;},{passive:true});
 on(window,'pointermove',e=>{if(touchStartY!==null&&e.clientY<touchStartY-3)scrollIntent=true;},{passive:true});on(window,'pointerup',()=>{touchStartY=null;},{passive:true});
 on(window,'keydown',e=>{if(e.target.closest('input,textarea,select,dialog'))return;if(['ArrowDown','PageDown',' ','End'].includes(e.key))scrollIntent=true;if(e.key==='End'&&!assembled&&!reading&&!reduced){e.preventDefault();constructionStarted=true;document.body.classList.add('construction-started');window.scrollTo({top:storyTop()+storyLengths.reduce((sum,n)=>sum+n,0)+1,behavior:'instant'});}});
 on(window,'resize',resize);on(window,'scroll',storyScroll,{passive:true});on(document,'citydialog',e=>{dialogPaused=!!e.detail;release();last=0;invalidate();});on(document,'citypause',()=>{release();invalidate();});
 on(document,'visibilitychange',()=>{release();if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0;}else invalidate();});
 on(document,'click',e=>{if(reading||assembled)return;const a=e.target.closest('a[href]');if(!a||!a.hash||new URL(a.href).pathname!==location.pathname)return;if(a.matches('[data-tour-link]')){e.preventDefault();return;}const id=selectionForHash(a.hash.slice(1));if(id||a.hash==='#contact'){e.preventDefault();if(id)scrollToBuild(id==='stack'?.12:id==='horagora'?.47:.62);else openInquiry(a);}});
 on(canvas,'webglcontextlost',e=>{e.preventDefault();document.dispatchEvent(new CustomEvent('cityreading'));});
 function goTo(id){if(mobileEntry&&!reading&&id==='intro')id='main';if(reading||assembled){document.getElementById(id)?.scrollIntoView({behavior:'instant'});return;}if(id==='intro')setSelection(null,false);}
 function dispose(){disposed=true;for(const node of [canvas,document.querySelector('#viewer-card'),document.querySelector('.viewer-intro')])for(const animation of node?.getAnimations?.()||[])animation.cancel();cancelAnimationFrame(raf);cancelAnimationFrame(layoutRaf);document.querySelector('.viewer-tour')?.style.removeProperty('height');release();cleanups.forEach(fn=>fn());residents.dispose();village.dispose();tech.dispose();for(const b of batches.values())b.mesh.dispose();for(const r of resources)r.dispose();for(const g of Object.values(geometry))g.dispose();for(const m of materials.values())m.dispose();renderer.dispose();}
 const visibility=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;last=0;if(inView)invalidate();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'0px'});visibility.observe(canvas);cleanups.push(()=>visibility.disconnect());
 const themeObserver=new MutationObserver(syncTheme);themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});cleanups.push(()=>themeObserver.disconnect());
 document.body.classList.add('world-loaded');if(!mobileEntry){history.scrollRestoration='manual';window.scrollTo({top:0,behavior:'instant'});}syncTheme();resize();syncConstruction();invalidate();
 document.fonts?.ready.then(()=>{if(!disposed)scheduleStoryLayout();});
 return {goTo,dispose,setSeason(){},setReading(value){reading=value;release();last=0;if(value){document.querySelector('.viewer-tour')?.style.removeProperty('height');cancelAnimationFrame(raf);raf=0;}else{resize();invalidate();}}};
}
