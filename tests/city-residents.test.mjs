import test from 'node:test';
import assert from 'node:assert/strict';
import { createResidents, residentVisible } from '../public/city-residents.js';
import * as THREE from '../public/vendor/three.module.js';

test('all original skeletons remain in their exact rest pose even when source clips exist',async()=>{
 const {GLTFLoader}=await import('../public/vendor/GLTFLoader.js'),original=GLTFLoader.prototype.loadAsync;
 for(const assemble of [false,true]){
  const sources=[];
  GLTFLoader.prototype.loadAsync=async()=>{
   const scene=new THREE.Group(),root=new THREE.Bone(),hand=new THREE.Bone();hand.name='Hand';hand.position.set(.2,.5,0);root.add(hand);scene.add(root);
   const geometry=new THREE.PlaneGeometry(.6,1,6,10);geometry.translate(0,.5,0);const p=geometry.attributes.position,indices=[],weights=[];
   for(let i=0;i<p.count;i++){indices.push(0,1,0,0);const w=p.getX(i)>.15&&p.getY(i)>.3&&p.getY(i)<.65?1:0;weights.push(1-w,w,0,0);}
   geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
   const mesh=new THREE.SkinnedMesh(geometry,new THREE.MeshStandardMaterial());scene.add(mesh);scene.updateMatrixWorld(true);mesh.bind(new THREE.Skeleton([root,hand]));
   const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),.5);
   sources.push({scene,mesh,hand,geometry,weights:[...geometry.attributes.skinWeight.array],uv:[...geometry.attributes.uv.array]});
   return{scene,animations:[new THREE.AnimationClip('Wave_One_Hand',1,[new THREE.QuaternionKeyframeTrack('Hand.quaternion',[0,.5,1],[0,0,0,1,...q.toArray(),0,0,0,1])])]};
  };
  const residents=createResidents(THREE,new THREE.Scene(),{assemble});
  try{
   if(!assemble)residents.update({progress:1});
   await Promise.all([residents.loadJovi(),residents.loadHori(),residents.loadAndrea()]);
   const poses=()=>sources.map(source=>source.hand.quaternion.toArray()),rest=poses();
   for(const selectedResident of [null,'jovi','hori','andrea'])for(const flags of [{},{paused:true},{reduced:true},{hidden:true}]){
    for(let i=0;i<15;i++)residents.update({progress:1,dt:.1,time:i/10,selectedResident,...flags});
    assert.deepEqual(poses(),rest);assert.equal(residents.stats.wavingResidents,0);
   }
   for(const [i,item]of residents.interactables.entries()){
    if(assemble){const whole=item.object.getObjectByName(`${item.id} intact original`);assert.equal(whole.children[0],sources[i].scene);}
    const source=sources[i];assert.equal(source.mesh.skeleton.bones[1],source.hand);assert.equal(source.mesh.geometry,source.geometry);
    assert.deepEqual([...source.mesh.geometry.attributes.skinWeight.array],source.weights);assert.deepEqual([...source.mesh.geometry.attributes.uv.array],source.uv);
    assert.equal(residents.stats[`${item.id}Animated`],false);
   }
   residents.update({progress:.44,dt:.1});residents.update({progress:1,dt:.1});assert.deepEqual(poses(),rest);
   let released=0;for(const source of sources){source.mesh.skeleton.computeBoneTexture();source.mesh.skeleton.boneTexture.addEventListener('dispose',()=>released++);}
   residents.dispose();residents.dispose();assert.equal(released,3);
  }finally{residents.dispose();GLTFLoader.prototype.loadAsync=original;}
 }
});

test('completed figures keep their literal original meshes through every ambient frame',async()=>{
 const {GLTFLoader}=await import('../public/vendor/GLTFLoader.js'),original=GLTFLoader.prototype.loadAsync,assets=[];
 GLTFLoader.prototype.loadAsync=async()=>{const geometry=new THREE.PlaneGeometry(.6,1,6,10);geometry.translate(0,.5,0);assets.push(geometry);const scene=new THREE.Group();scene.add(new THREE.Mesh(geometry,new THREE.MeshStandardMaterial()));return{scene,animations:[]};};
 const residents=createResidents(THREE,new THREE.Scene(),{assemble:true});
 try{
  await Promise.all([residents.loadJovi(),residents.loadHori(),residents.loadAndrea()]);
  residents.update({progress:1,dt:.1});
  const poses=()=>residents.interactables.map((item,index)=>{
   const whole=item.object.getObjectByName(`${item.id} intact original`),mesh=whole.getObjectByProperty('isMesh',true);
   assert.equal(mesh.isSkinnedMesh,undefined);assert.equal(mesh.geometry,assets[index]);assert.equal(mesh.geometry.hasAttribute('skinWeight'),false);
   const visible=[];item.object.traverseVisible(object=>{if(object.isMesh)visible.push(object);});assert.deepEqual(visible,[mesh]);
   return [...mesh.geometry.attributes.position.array];
  });
  const rest=poses();for(let i=0;i<30;i++)residents.update({progress:1,dt:.1});assert.deepEqual(poses(),rest);assert.equal(residents.stats.wavingResidents,0);
  for(const flags of [{paused:true},{reduced:true},{hidden:true}]){residents.update({progress:1,dt:.1,...flags});assert.deepEqual(poses(),rest);}
  residents.update({progress:.44,dt:.1});assert.equal(residents.interactables[1].object.getObjectByName('hori intact original').visible,true);
  residents.update({progress:1,dt:.1});assert.deepEqual(poses(),rest);
 }finally{residents.dispose();GLTFLoader.prototype.loadAsync=original;}
});

test('the intact original keeps exact normalized vertices under translated and rotated parents',async()=>{
 const {createResidentAssembly}=await import('../public/city-residents.js');
 const source=new THREE.Group(),geometry=new THREE.BoxGeometry(.5,1,.25),mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial());source.add(mesh);
 source.position.set(.2,.3,-.1);source.rotation.set(.1,.3,0);source.scale.setScalar(.9);source.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(source),center=bounds.getCenter(new THREE.Vector3()),scale=1.15/bounds.getSize(new THREE.Vector3()).y;
 const normalized=[];for(let i=0;i<geometry.attributes.position.count;i++)normalized.push(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position,i).applyMatrix4(mesh.matrixWorld).sub(new THREE.Vector3(center.x,bounds.min.y,center.z)).multiplyScalar(scale));
 const assembly=createResidentAssembly(THREE,source,{id:'hori'}),parent=new THREE.Group();parent.position.set(-2,0,1.4);parent.rotation.y=Math.PI/2;parent.add(assembly.group);assembly.pose(.47);parent.updateMatrixWorld(true);
 const intact=assembly.whole.getObjectByProperty('isMesh',true);
 for(let i=0;i<normalized.length;i++)assert.ok(intact.localToWorld(new THREE.Vector3().fromBufferAttribute(intact.geometry.attributes.position,i)).distanceTo(parent.localToWorld(normalized[i].clone()))<1e-7);
 const box=new THREE.Box3().setFromObject(assembly.whole);assert.ok(Math.abs(box.min.y)<1e-7);assert.ok(Math.abs(box.max.y-1.15)<1e-7);
 assembly.dispose();geometry.dispose();mesh.material.dispose();
});

test('all three loaded residents appear after construction independent of selection', () => {
  assert.equal(residentVisible('hori',null,1,true),true);
  assert.equal(residentVisible('jovi','andrea',1,true),true);
  assert.equal(residentVisible('andrea','hori',1,true),true);
  assert.equal(residentVisible('hori','andrea',1,true),true);
  assert.equal(residentVisible('hori','hori',.79,true),false);
  assert.equal(residentVisible('hori','hori',1,false),false);
  assert.equal(residentVisible('hori','hori',.8,true),true);
});
test('residents begin empty and hidden with no invented figure or poster fallback', () => {
  const scene=new THREE.Scene(),residents=createResidents(THREE,scene);
  assert.deepEqual(residents.interactables.map(item=>item.id),['jovi','hori','andrea']);
  assert.ok(residents.interactables.every(item=>item.object.isGroup&&!item.object.visible&&item.object.children.length===0));
  residents.update({progress:1,dt:.1});
  assert.equal(residents.stats.visibleResidents,0);
  assert.equal(residents.stats.meshes,0);
  residents.setSelected('horagora');
  assert.equal(residents.stats.selectedResident,'hori');
  assert.equal(residents.stats.horiVisible,false);
  residents.update({selectedResident:'andrea',progress:1});
  assert.equal(residents.stats.selectedResident,'andrea');
  residents.update({progress:1,paused:true});
  assert.equal(residents.stats.selectedResident,'andrea');
  residents.setSelected(null);
  assert.equal(residents.stats.selectedResident,null);
  assert.equal(residents.stats.visibleResidents,0);
  residents.dispose();assert.equal(scene.children.length,0);residents.dispose();
});
test('all three original character loaders stop after disposal', async () => {
  const residents=createResidents(THREE,new THREE.Scene());residents.dispose();
  assert.equal(await residents.loadJovi(),false);assert.equal(await residents.loadHori(),false);assert.equal(await residents.loadAndrea(),false);
});
test('named residents stand beside the rotated entrance approaches', () => {
  const places=[{id:'horagora',approach:{x:-2.25,z:-5}},{id:'andrea',approach:{x:2.25,z:-5}}];
  const residents=createResidents(THREE,new THREE.Scene(),{places});
  assert.deepEqual(residents.interactables.map(x=>x.object.position.toArray()),[[-1.8,0,.7],[-2.25,0,-4.55],[2.25,0,-4.55]]);
  residents.dispose();
});

test('Jovi uses the current stack entrance metadata in either viewer layout', () => {
  const residents=createResidents(THREE,new THREE.Scene(),{places:[{id:'stack',approach:{x:-5.6,z:1.6}}],assemble:true});
  assert.ok(residents.interactables.find(item=>item.id==='jovi').object.position.distanceTo(new THREE.Vector3(-5.6,0,2.05))<1e-10);
  residents.dispose();
});


test('all three loaded Meshy roots stay visible and still while selection chooses the explanation', async () => {
  const {GLTFLoader}=await import('../public/vendor/GLTFLoader.js');
  const original=GLTFLoader.prototype.loadAsync;const geometries=[];
  // Image decoding and network loading require a browser; only that external boundary is replaced.
  GLTFLoader.prototype.loadAsync=async()=>{
    const geometry=new THREE.BoxGeometry(.3,1,.2),material=new THREE.MeshStandardMaterial();geometries.push(geometry);
    const scene=new THREE.Group();scene.add(new THREE.Mesh(geometry,material));
    return{scene,animations:[new THREE.AnimationClip('Wave',1,[new THREE.NumberKeyframeTrack('.rotation[y]',[0,1],[0,.5])])]};
  };
  const scene=new THREE.Scene(),residents=createResidents(THREE,scene);
  try{
    assert.equal(await residents.loadJovi(),false);
    residents.update({progress:1});
    assert.deepEqual(await Promise.all([residents.loadJovi(),residents.loadHori(),residents.loadAndrea()]),[true,true,true]);
    assert.equal(residents.stats.visibleResidents,3);assert.equal(residents.stats.meshes,3);
    assert.ok(residents.interactables.every(item=>item.object.visible&&item.object.children.length===1));
    for(const item of residents.interactables)assert.ok(Math.abs(new THREE.Box3().setFromObject(item.object).min.y)<1e-8);
    residents.setSelected('stack');assert.equal(residents.stats.selectedResident,'jovi');assert.equal(residents.stats.visibleResidents,3);
    residents.update({dt:.1,progress:1});
    const model=id=>residents.interactables.find(item=>item.id===id).object.children[0].children[0];
    assert.equal(model('jovi').rotation.y,0);assert.equal(model('hori').rotation.y,0);assert.equal(model('andrea').rotation.y,0);
    residents.setSelected(null);assert.equal(residents.stats.visibleResidents,3);assert.equal(model('jovi').rotation.y,0);
    residents.update({progress:.7});assert.equal(residents.stats.visibleResidents,0);
    residents.update({progress:1});assert.equal(residents.stats.visibleResidents,3);
    let released=0;for(const geometry of geometries)geometry.addEventListener('dispose',()=>released++);
    residents.dispose();assert.equal(released,3);assert.equal(residents.stats.visibleResidents,0);assert.equal(residents.stats.joviVisible,false);
    assert.ok(residents.interactables.every(item=>!item.object.visible&&item.object.children.length===0));
  }finally{residents.dispose();GLTFLoader.prototype.loadAsync=original;}
});

test('a late Meshy load is discarded after resident disposal', async () => {
  const {GLTFLoader}=await import('../public/vendor/GLTFLoader.js');const original=GLTFLoader.prototype.loadAsync;
  let complete,start;const started=new Promise(resolve=>{start=resolve;});
  GLTFLoader.prototype.loadAsync=()=>new Promise(resolve=>{complete=resolve;start();});
  const residents=createResidents(THREE,new THREE.Scene());
  try{
    residents.update({progress:1});const loading=residents.loadHori();await started;residents.dispose();
    const geometry=new THREE.BoxGeometry(1,1,1),material=new THREE.MeshStandardMaterial(),scene=new THREE.Group();
    let released=0;geometry.addEventListener('dispose',()=>released++);scene.add(new THREE.Mesh(geometry,material));
    complete({scene,animations:[]});assert.equal(await loading,false);assert.equal(released,1);
    assert.equal(residents.stats.horiLoaded,false);assert.equal(residents.stats.visibleResidents,0);
  }finally{residents.dispose();GLTFLoader.prototype.loadAsync=original;}
});

test('Meshy resident parts assemble reversibly in their building chapter with source UVs intact',async()=>{
 const {createResidentAssembly}=await import('../public/city-residents.js');
 const source=new THREE.Group(),geometry=new THREE.BoxGeometry(.5,1,.25),material=new THREE.MeshBasicMaterial();source.add(new THREE.Mesh(geometry,material));
 const original=geometry.toNonIndexed(),rig=createResidentAssembly(THREE,source,{id:'andrea'});
 const uv=[];let vertices=0,released=0;
 rig.partsGroup.traverse(mesh=>{if(!mesh.isMesh)return;uv.push(...mesh.geometry.attributes.uv.array);vertices+=mesh.geometry.attributes.position.count;mesh.geometry.addEventListener('dispose',()=>released++);});
 assert.equal(vertices,original.attributes.position.count);assert.deepEqual(uv.sort((a,b)=>a-b),[...original.attributes.uv.array].sort((a,b)=>a-b));
 assert.ok(rig.parts.length>=7&&rig.parts.length<=9);
 rig.pose(.55);assert.ok(rig.parts.every(part=>!part.object.visible));assert.equal(rig.whole.visible,false);
 rig.pose(.59);const middle=rig.parts.map(part=>[...part.object.position.toArray(),...part.object.quaternion.toArray(),part.object.visible]);
 assert.ok(rig.parts.some(part=>part.object.visible&&part.object.position.distanceTo(part.anchor)>.01));assert.equal(rig.partsGroup.visible,true);assert.equal(rig.whole.visible,false);
 rig.pose(.62);assert.ok(rig.parts.every(part=>part.object.position.equals(part.anchor)));assert.equal(rig.partsGroup.visible,false);assert.equal(rig.whole.visible,true);
 const wholeMesh=rig.whole.getObjectByProperty('isMesh',true);assert.equal(wholeMesh.isSkinnedMesh,undefined);assert.equal(wholeMesh.geometry,geometry);assert.equal(wholeMesh.material,material);
 assert.deepEqual([...wholeMesh.geometry.index.array],[...geometry.index.array]);assert.deepEqual([...wholeMesh.geometry.attributes.uv.array],[...geometry.attributes.uv.array]);
 rig.pose(.59);assert.equal(rig.partsGroup.visible,true);assert.equal(rig.whole.visible,false);assert.deepEqual(rig.parts.map(part=>[...part.object.position.toArray(),...part.object.quaternion.toArray(),part.object.visible]),middle);
 rig.pose(.59,true);assert.ok(rig.parts.every(part=>part.object.position.equals(part.anchor)));
 for(const [id,start,end]of [['jovi',0,.1],['hori',.4,.47],['andrea',.55,.62]]){
  const figure=createResidentAssembly(THREE,source,{id});figure.pose(start);assert.ok(figure.parts.every(part=>!part.object.visible));
  figure.pose(end);assert.equal(figure.whole.visible,true);assert.equal(figure.partsGroup.visible,false);
  const box=new THREE.Box3().setFromObject(figure.whole);assert.ok(Math.abs(box.min.y)<1e-7);assert.ok(Math.abs(box.max.y-1.15)<1e-7);figure.dispose();
 }
 rig.dispose();rig.dispose();assert.equal(released,rig.stats.parts);geometry.dispose();material.dispose();original.dispose();
});

test('assemble mode loads from the start and selection cannot skip its reversible construction',async()=>{
 const {GLTFLoader}=await import('../public/vendor/GLTFLoader.js');const original=GLTFLoader.prototype.loadAsync;
 const assets=[];GLTFLoader.prototype.loadAsync=async()=>{const scene=new THREE.Group(),geometry=new THREE.BoxGeometry(.5,1,.25);assets.push(geometry);scene.add(new THREE.Mesh(geometry,new THREE.MeshBasicMaterial()));return{scene,animations:[]};};
 const residents=createResidents(THREE,new THREE.Scene(),{assemble:true});
 try{
  assert.deepEqual(await Promise.all([residents.loadJovi(),residents.loadHori(),residents.loadAndrea()]),[true,true,true]);
  residents.update({progress:.05});residents.setSelected('andrea');assert.equal(residents.stats.andreaVisible,false);
  assert.ok(residents.getParts('jovi').some(part=>part.object.visible));assert.ok(residents.getParts('hori').every(part=>!part.object.visible));
  residents.update({progress:.65});assert.equal(residents.stats.visibleResidents,3);
  assert.ok(residents.getParts('andrea').every(part=>part.object.position.equals(part.anchor)));
  for(const item of residents.interactables){
   assert.equal(item.object.getObjectByName(`${item.id} intact original`).visible,true);
   assert.ok(residents.getParts(item.id).every(part=>part.object.parent.visible===false));
  }
  residents.update({progress:.44});
  const hori=residents.interactables.find(item=>item.id==='hori').object;
  assert.equal(hori.getObjectByName('hori intact original').visible,true);
  assert.equal(residents.getParts('hori').length,0);
  residents.update({progress:.65});assert.equal(hori.getObjectByName('hori intact original').visible,true);
  residents.update({progress:.05});assert.equal(residents.stats.visibleResidents,1);
  let sourceDisposed=0;for(const geometry of assets)geometry.addEventListener('dispose',()=>sourceDisposed++);
  const derived=new Set();for(const item of residents.interactables)item.object.traverse(mesh=>{if(mesh.isMesh)derived.add(mesh.geometry);});
  let derivedDisposed=0;for(const geometry of derived)geometry.addEventListener('dispose',()=>derivedDisposed++);
  residents.dispose();residents.dispose();assert.equal(sourceDisposed,3);assert.equal(derivedDisposed,derived.size);
 }finally{residents.dispose();GLTFLoader.prototype.loadAsync=original;}
});
