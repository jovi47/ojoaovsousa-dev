const instances=new WeakMap();

// Keep the complete approved silhouette inside the frame at every yaw.
export function fitContactCamera(camera,size,width,height){
 const aspect=Math.max(1,width)/Math.max(1,height),radius=Math.hypot(size.x,size.z)/2;
 const halfHeight=Math.max(size.y/2,radius/aspect)*1.12;
 camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();
}

// Same ownership pattern as city-residents: shared GLTF resources are released once.
export function disposeContactModel(model){
 const resources=new Set(),images=new Set();
 model?.traverse(object=>{
  if(!object.isMesh)return;
  resources.add(object.geometry);if(object.skeleton)resources.add(object.skeleton);
  for(const material of Array.isArray(object.material)?object.material:[object.material]){
   if(!material)continue;resources.add(material);
   for(const value of Object.values(material))if(value?.isTexture){resources.add(value);for(const image of [value.source?.data].flat())if(image?.close)images.add(image);}
  }
 });
 for(const resource of resources)resource?.dispose();for(const image of images)image.close();
}

async function createContactCharacterView(canvas,{signal}){
 let renderer=null,source=null;
 function dispose(){disposeContactModel(source);source=null;if(renderer){renderer.dispose();renderer.forceContextLoss();renderer=null;}}
 try{
  const [THREE,{GLTFLoader}]=await Promise.all([import('./vendor/three.module.js'),import('./vendor/GLTFLoader.js')]);
  signal.throwIfAborted();
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
  const response=await fetch('/jovi-character.glb',{signal});if(!response.ok)throw Error('Character unavailable');
  const gltf=await new GLTFLoader().parseAsync(await response.arrayBuffer(),'/');source=gltf.scene;signal.throwIfAborted();
  source.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(source),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  if(!(size.y>0)||![size.x,size.y,size.z].every(Number.isFinite))throw Error('Empty character');
  // Retain original bones/materials and rest pose; only the parent group turns.
  const model=new THREE.Group();model.scale.setScalar(2/size.y);source.position.sub(center);model.add(source);size.multiplyScalar(2/size.y);
  const scene=new THREE.Scene();scene.add(model,new THREE.HemisphereLight(0xf0f6ff,0x637e8b,2.6));
  const key=new THREE.DirectionalLight(0xffe7bf,3.5);key.position.set(-3,5,6);scene.add(key);
  const rim=new THREE.DirectionalLight(0xc5dcff,1.3);rim.position.set(3,2,-4);scene.add(rim);
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,.01,20);camera.position.set(0,0,6);camera.lookAt(0,0,0);
  let previous='';
  return {
   resize(width,height,dpr){const next=[width,height,dpr].join(':');if(next===previous)return;previous=next;renderer.setPixelRatio(dpr);renderer.setSize(width,height,false);fitContactCamera(camera,size,width,height);},
   render(yaw){model.rotation.y=yaw;renderer.render(scene,camera);},
   dispose,
  };
 }catch(error){dispose();throw error;}
}

export function initContactCharacters(root=document,{createView=createContactCharacterView}={}){
 const cleanups=[];
 for(const figure of root.querySelectorAll('[data-contact-character]')){
  if(instances.has(figure))continue;
  const canvas=figure.querySelector('[data-contact-character-canvas]');if(!canvas)continue;
  const doc=figure.ownerDocument,view=doc.defaultView,reduced=view.matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController(),listeners=[];
  let near=false,disposed=false,failed=false,pending=false,graphics=null,raf=0,last=0,seconds=0;
  function listen(target,type,fn){target.addEventListener(type,fn);listeners.push(()=>target.removeEventListener(type,fn));}
  function stop(){if(raf)view.cancelAnimationFrame(raf);raf=0;}
  function release(){const current=graphics;graphics=null;current?.dispose();}
  function fail(){if(failed||disposed)return;failed=true;stop();abort.abort();delete figure.dataset.characterReady;release();}
  const visible=()=>near&&!doc.hidden&&!disposed&&!failed;
  function paint(){try{graphics.render(Math.PI/2+seconds*Math.PI/8);figure.dataset.characterReady='true';return true;}catch{fail();return false;}}
  function frame(time){
   raf=0;if(!visible()||reduced.matches||!graphics)return;
   if(time-last>=1000/24){seconds+=Math.min((time-last)/1000,.1);last=time;if(!paint())return;}
   raf=view.requestAnimationFrame(frame);
  }
  async function load(){
   if(pending||graphics||!visible())return;pending=true;
   try{const loaded=await createView(canvas,{signal:abort.signal});if(disposed||failed){loaded.dispose();return;}graphics=loaded;sync();}
   catch{fail();}finally{pending=false;}
  }
  function sync(){
   stop();if(!visible())return;if(!graphics){void load();return;}
   try{const rect=figure.getBoundingClientRect();if(!(rect.width>0&&rect.height>0))return;graphics.resize(rect.width,rect.height,Math.min(view.devicePixelRatio||1,1.5));}
   catch{fail();return;}
   last=view.performance.now();if(paint()&&!reduced.matches)raf=view.requestAnimationFrame(frame);
  }
  listen(doc,'visibilitychange',sync);listen(reduced,'change',sync);
  listen(canvas,'webglcontextlost',event=>{event.preventDefault();fail();});
  const observer=view.IntersectionObserver?new view.IntersectionObserver(entries=>{for(const entry of entries){near=entry.isIntersecting;sync();}},{threshold:0}):null;
  const resize=view.ResizeObserver?new view.ResizeObserver(sync):null;
  resize?.observe(figure);if(!resize)listen(view,'resize',sync);observer?.observe(figure);
  // Without visibility observation the poster remains a complete fallback.
  const cleanup=()=>{if(disposed)return;disposed=true;stop();abort.abort();observer?.disconnect();resize?.disconnect();listeners.forEach(remove=>remove());delete figure.dataset.characterReady;release();instances.delete(figure);};
  instances.set(figure,cleanup);cleanups.push(cleanup);
 }
 return ()=>cleanups.forEach(cleanup=>cleanup());
}
