// Rigid triangle partitions preserve source identity; this is procedural articulation, not skinning.
export function createRigidHumanoid(THREE, source, options = {}) {
  source.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(source), center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3()), h = size.y;
  if (!(h > 0)) throw new Error('Empty character geometry');
  const p = { hip: .44, knee: .22, ankle: .08, shoulder: .68, shoulderX: .14, hipX: .075, head: .70, ...options.proportions };
  const defaultPivots = { torso: [0,0,0], head: [0,p.head,0], leftArm: [-p.shoulderX,p.shoulder,0], rightArm: [p.shoulderX,p.shoulder,0],
    leftLeg: [-p.hipX,p.hip,0], rightLeg: [p.hipX,p.hip,0], leftShin: [-p.hipX,p.knee,0], rightShin: [p.hipX,p.knee,0],
    leftFoot: [-p.hipX,p.ankle,0], rightFoot: [p.hipX,p.ankle,0] };
  const pivots = typeof options.pivots === 'function' ? options.pivots({ width:size.x/h, depth:size.z/h }) : options.pivots || defaultPivots;
  const parents = options.parents || (options.pivots ? {} : { leftShin:'leftLeg',rightShin:'rightLeg',leftFoot:'leftShin',rightFoot:'rightShin' });
  const classify = options.classify || ((x,y) => y > .82 || (y > p.head && Math.abs(x) < .17) ? 'head' : y < p.hip ? `${x<0?'left':'right'}Leg`
    : y < .82 && Math.abs(x) > p.shoulderX * .9 ? `${x<0?'left':'right'}Arm` : 'torso');
  const group = new THREE.Group(), joints = {}, geometries = new Set(), armPoints = { left:[0,0,0,0],right:[0,0,0,0] };
  for (const [name, pivot] of Object.entries(pivots)) {
    joints[name] = new THREE.Group(); joints[name].name = name; joints[name].position.set(...pivot); group.add(joints[name]);
  }
  for (const [child,parent] of Object.entries(parents)) {
    joints[parent].add(joints[child]); joints[child].position.fromArray(pivots[child]).sub(new THREE.Vector3(...pivots[parent]));
  }
  let triangles = 0;
  source.traverse(mesh => {
    if (!mesh.isMesh) return;
    const transformed = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
    transformed.translate(-center.x,-bounds.min.y,-center.z).scale(1/h,1/h,1/h);
    const flat = transformed.index ? transformed.toNonIndexed() : transformed, positions = flat.attributes.position, batches = new Map();
    for (let i=0;i<positions.count;i+=3) {
      const x=(positions.getX(i)+positions.getX(i+1)+positions.getX(i+2))/3;
      const y=(positions.getY(i)+positions.getY(i+1)+positions.getY(i+2))/3;
      const z=(positions.getZ(i)+positions.getZ(i+1)+positions.getZ(i+2))/3;
      let name=classify(x,y,z);
      if (!options.pivots && name.endsWith('Leg') && y<p.knee) name=name.replace('Leg',y<p.ankle?'Foot':'Shin');
      if (!joints[name]) name='torso';
      const entry = flat.groups.find(entry=>i>=entry.start&&i<entry.start+entry.count);
      const material=Array.isArray(mesh.material)?mesh.material[entry?.materialIndex||0]:mesh.material;
      let byMaterial=batches.get(name); if(!byMaterial){byMaterial=new Map();batches.set(name,byMaterial);}
      let indices=byMaterial.get(material);if(!indices){indices=[];byMaterial.set(material,indices);}indices.push(i);triangles++;
      if(name.endsWith('Arm')){const a=armPoints[name.startsWith('left')?'left':'right'];a[0]+=x;a[1]+=y;a[2]+=z;a[3]++;}
    }
    for (const [name,byMaterial] of batches) for (const [material,indices] of byMaterial) {
      const geometry = new THREE.BufferGeometry(); geometries.add(geometry); options.own?.(geometry);
      for(const [key,attribute] of Object.entries(flat.attributes)) {
        const data=[];
        for(const i of indices)for(let v=0;v<3;v++)for(let c=0;c<attribute.itemSize;c++){
          data.push(attribute.getComponent(i+v,c)-(key==='position'?pivots[name][c]:0));
        }
        geometry.setAttribute(key,new THREE.Float32BufferAttribute(data,attribute.itemSize));
      }
      geometry.computeBoundingSphere();const part=new THREE.Mesh(geometry,material);part.castShadow=options.shadows??false;
      part.receiveShadow=options.shadows??false;joints[name].add(part);
    }
    transformed.dispose();if(flat!==transformed)flat.dispose();
  });
  const restArmZ={},restRotation={};
  for(const side of ['left','right']){
    const a=armPoints[side],pivot=pivots[`${side}Arm`];
    restArmZ[side]=a[3]&&pivot?Math.atan2(-(a[0]/a[3]-pivot[0]),-(a[1]/a[3]-pivot[1])):0;
    const rotation=new THREE.Quaternion();
    if(options.relaxArms&&a[3]&&pivot){
      const direction=new THREE.Vector3(a[0]/a[3]-pivot[0],a[1]/a[3]-pivot[1],a[2]/a[3]-pivot[2]);
      if(direction.lengthSq()>1e-8)rotation.setFromUnitVectors(direction.normalize(),new THREE.Vector3(0,-1,0));
      joints[`${side}Arm`].quaternion.copy(rotation);
    }
    restRotation[side]=rotation;
  }
  group.scale.setScalar(options.height??1);
  return { group,joints,restArmZ,restRotation,stats:{triangles,parts:geometries.size},dispose(){for(const g of geometries)g.dispose();geometries.clear();} };
}
