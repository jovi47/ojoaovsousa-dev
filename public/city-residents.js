import { createRigidHumanoid } from './city-humanoid.js';

const assemblyChapters = { jovi: [0, .1], hori: [.4, .47], andrea: [.55, .62] };
const clamp = value => Math.max(0, Math.min(1, value));

// Only the approved source triangles move: no substitute figure or generated body.
export function createResidentAssembly(THREE, source, { id = 'jovi', height = 1.15, own } = {}) {
  source.updateMatrixWorld(true);
  if(id==='hori'){
    // The finished mascot enters intact: arbitrary triangle cuts damage his face and paint.
    const bounds=new THREE.Box3().setFromObject(source),center=bounds.getCenter(new THREE.Vector3());
    const scale=height/bounds.getSize(new THREE.Vector3()).y,whole=new THREE.Group(),group=new THREE.Group(),partsGroup=new THREE.Group();
    whole.name='hori intact original';whole.add(source);group.add(whole,partsGroup);partsGroup.visible=false;
    function pose(progress=0,reduced=false){const local=clamp((progress-.4)/.07),ease=reduced?1:local*local*(3-2*local);
      whole.visible=local>0;whole.scale.setScalar(scale*(.94+.06*ease));
      whole.position.set(-center.x*scale,-bounds.min.y*scale+.2*(1-ease),-center.z*scale);return local;}
    pose(0);return {group,whole,partsGroup,parts:[],pose,stats:{parts:0,triangles:0},dispose(){}};
  }
  const skinned=source.getObjectByProperty('isSkinnedMesh',true),temporary=[];
  let assemblySource=source;
  if(skinned){
    assemblySource=new THREE.Group();
    source.traverse(mesh=>{
      if(!mesh.isMesh)return;
      const geometry=mesh.geometry.clone();temporary.push(geometry);
      if(mesh.isSkinnedMesh){
        const p=geometry.attributes.position,point=new THREE.Vector3();
        for(let i=0;i<p.count;i++){mesh.getVertexPosition(i,point);p.setXYZ(i,point.x,point.y,point.z);}
        geometry.computeVertexNormals();mesh.computeBoundingBox();mesh.computeBoundingSphere();
      }
      geometry.applyMatrix4(mesh.matrixWorld);assemblySource.add(new THREE.Mesh(geometry,mesh.material));
    });
  }
  let rig;
  try { rig = createRigidHumanoid(THREE, assemblySource, { height, own,
    pivots: { torso: [0,.48,0], head: [0,.74,0], leftArm: [-.18,.58,0], rightArm: [.18,.58,0],
      leftLeg: [-.085,.34,0], rightLeg: [.085,.34,0], leftShin: [-.085,.14,0], rightShin: [.085,.14,0] },
    classify: (x,y) => y > .7 ? 'head' : y < .18 ? `${x < 0 ? 'left' : 'right'}Shin`
      : y < .34 ? `${x < 0 ? 'left' : 'right'}Leg` : Math.abs(x) > .17 ? `${x < 0 ? 'left' : 'right'}Arm` : 'torso' });
  } finally { for(const geometry of temporary)geometry.dispose(); }
  const parts = Object.entries(rig.joints).map(([name, object], index) => ({ name, object,
    anchor: object.position.clone(), rest: object.quaternion.clone(),
    offset: new THREE.Vector3((index % 2 ? -1 : 1) * (.38 + index * .035), .55 + (index % 3) * .16, .24 * Math.sin(index * 2)),
    loose: new THREE.Quaternion().setFromEuler(new THREE.Euler(.18 * Math.cos(index), (index % 2 ? -1 : 1) * .4, .24 * Math.sin(index))) }));
  const bounds=new THREE.Box3().setFromObject(source),center=bounds.getCenter(new THREE.Vector3());
  const scale=height/bounds.getSize(new THREE.Vector3()).y;
  const whole=new THREE.Group();whole.name=`${id} intact original`;whole.scale.setScalar(scale);
  whole.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
  // A skinned scene must retain its actual bones; Object3D.clone does not rebind skeletons.
  if(skinned)whole.add(source);
  else { const intact=source.clone(true);intact.matrix.copy(source.matrixWorld);intact.matrixAutoUpdate=false;intact.matrixWorldNeedsUpdate=true;whole.add(intact); }
  const group = new THREE.Group(); group.add(rig.group, whole);
  const [start, end] = assemblyChapters[id] || assemblyChapters.jovi;
  function pose(progress = 0, reduced = false) {
    const local = clamp((progress - start) / (end - start));
    rig.group.visible = local > 0 && local < 1;
    whole.visible = local === 1;
    for (const [index, part] of parts.entries()) {
      const t = reduced ? 1 : clamp(local * 1.4 - index * .055), ease = t * t * (3 - 2 * t);
      part.object.visible = local > 0 && (reduced || t > 0);
      part.object.position.copy(part.anchor).addScaledVector(part.offset, 1 - ease);
      part.object.quaternion.copy(part.loose).slerp(part.rest, ease);
    }
    return local;
  }
  pose(0);
  return { group, partsGroup: rig.group, whole, parts, pose, stats: rig.stats, dispose: rig.dispose };
}

export function residentVisible(id, selectedResident, progress, loaded) {
  return progress >= .8 && loaded === true;
}

export function createResidents(THREE, scene, { places = [], onAsset = () => {}, assemble = false } = {}) {
  const group = new THREE.Group(); group.name = 'Meshy residents at their doors'; group.visible = false; scene.add(group);
  const resources = new Set(), loading = new Map(), assemblies = new Map();
  const own = resource => { resources.add(resource); return resource; };
  const interactables = ['jovi', 'hori', 'andrea'].map(id => {
    const object = new THREE.Group(); object.name = `${id} original Meshy model`; object.visible = false;
    object.userData.residentId = id;
    const place = places.find(place => place.id === (id === 'hori' ? 'horagora' : id === 'jovi' ? 'stack' : id))
      || places.find(place => place.id === id);
    const approach = place?.approach || (id === 'jovi' ? { x:-1.8,z:.25 } : { x: id === 'hori' ? -2.25 : 2.25, z: -5 });
    object.position.set(approach.x, 0, approach.z + .45); object.rotation.y = id === 'andrea' ? -Math.PI/2 : Math.PI/2; group.add(object);
    return { id, object, position: object.position };
  });
  const stats = { residents: 3,joviLoaded:false,joviVisible:false,joviPending:false,joviFailed:false,joviAnimated:false, movingResidents: 0, visibleResidents: 0, selectedResident: null, meshes: 0, triangles: 0,
    horiLoaded: false, horiVisible: false, horiPending: false, horiFailed: false, horiAnimated: false,
    andreaLoaded: false, andreaVisible: false, andreaPending: false, andreaFailed: false, andreaAnimated: false,
    assembling: assemble, assemblyParts: 0, wavingResidents: 0 };
  let disposed = false, progress = 0, selected = null, reducedMotion = false;
  function applyVisibility() {
    group.visible = assemble || progress >= .8;
    stats.visibleResidents = 0;
    for (const item of interactables) {
      const assembly = assemblies.get(item.id);
      if (assembly) assembly.pose(progress, reducedMotion);
      item.object.visible = assemble ? stats[`${item.id}Loaded`] && progress > assemblyChapters[item.id][0]
        : residentVisible(item.id, selected, progress, stats[`${item.id}Loaded`]);
      stats[`${item.id}Visible`] = item.object.visible;
      if (item.object.visible) stats.visibleResidents++;
    }
  }
  function setSelected(id) {
    if (disposed) return;
    const next = id === 'horagora' ? 'hori' : id === 'stack' ? 'jovi' : ['jovi','hori','andrea'].includes(id) ? id : null;
    if (next === selected) return;
    selected = next; stats.selectedResident = selected; applyVisibility();
    if (selected && (assemble || progress >= .8) && typeof document !== 'undefined') void loadOriginal(selected);
    onAsset({ type: 'resident-selection', ...stats });
  }
  function releaseResources() { for (const resource of resources) resource.dispose(); resources.clear(); }
  function loadOriginal(id) {
    if (disposed || (!assemble && progress < .8)) return Promise.resolve(false);
    if (loading.has(id)) return loading.get(id);
    stats[`${id}Pending`] = true;
    const promise = (async () => {
      try {
        const { GLTFLoader } = await import('./vendor/GLTFLoader.js');
        if (disposed) return false;
        const gltf = await new GLTFLoader().loadAsync(`/${id}-character.glb`);
        let sourceTriangles = 0, sourceMeshes = 0;
        gltf.scene.traverse(object => {
          if (!object.isMesh) return;
          own(object.geometry); sourceMeshes++;
          if(object.isSkinnedMesh)own(object.skeleton);
          sourceTriangles += (object.geometry.index?.count ?? object.geometry.attributes.position.count) / 3;
          object.castShadow = false; object.receiveShadow = false;
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
            own(material); for (const value of Object.values(material)) if (value?.isTexture) own(value);
          }
        });
        if (disposed) { releaseResources(); return false; }
        let container;
        if (assemble) {
          const assembly = createResidentAssembly(THREE, gltf.scene, { id, own });
          assemblies.set(id, assembly); container = assembly.group; stats.assemblyParts += assembly.parts.length;
          sourceMeshes += assembly.stats.parts;
        } else {
          gltf.scene.updateMatrixWorld(true);
          const bounds = new THREE.Box3().setFromObject(gltf.scene), size = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          if (!(size.y > 0)) throw new Error(`Empty ${id} model`);
          container = new THREE.Group(); container.scale.setScalar(1.15 / size.y);
          gltf.scene.position.add(new THREE.Vector3(-center.x, -bounds.min.y, -center.z)); container.add(gltf.scene);
        }
        container.name = `${id} original GLB`;
        interactables.find(item => item.id === id).object.add(container);
        stats.meshes += sourceMeshes; stats.triangles += sourceTriangles;
        stats[`${id}SourceTriangles`] = sourceTriangles; stats[`${id}SourceClip`] = gltf.animations[0]?.name ?? null;
        stats[`${id}Loaded`] = true; applyVisibility();
        return true;
      } catch (error) {
        if (!disposed) { stats[`${id}Failed`] = true; onAsset({ type: `${id}-error`, message: error.message, ...stats }); }
        return false;
      } finally {
        stats[`${id}Pending`] = false;
        if (!disposed) onAsset({ type: id, ...stats });
      }
    })();
    loading.set(id, promise); return promise;
  }
  const loadJovi = () => loadOriginal('jovi'), loadHori = () => loadOriginal('hori'), loadAndrea = () => loadOriginal('andrea');
  function update(params = {}) {
    if (disposed) return;
    const { progress: nextProgress = progress, reduced = false } = params;
    progress = nextProgress; reducedMotion = reduced;
    if (Object.hasOwn(params, 'selectedResident')) setSelected(params.selectedResident);
    applyVisibility();
    if ((assemble || progress >= .8) && typeof document !== 'undefined') { void loadJovi(); void loadHori(); void loadAndrea(); }

  }
  function dispose() {
    if (disposed) return; disposed = true; scene.remove(group);
    for (const item of interactables) { item.object.clear(); item.object.visible = false; stats[`${item.id}Visible`] = false; }
    group.clear(); assemblies.clear(); releaseResources();
    stats.visibleResidents = 0; stats.wavingResidents = 0;
  }
  const getParts = id => assemblies.get(id)?.parts || [];
  return { group, interactables, update, setSelected, loadJovi, loadHori, loadAndrea, getParts, dispose, stats };
}
