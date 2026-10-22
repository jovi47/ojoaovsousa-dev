import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../public/vendor/three.module.js';
import {createRigidHumanoid} from '../public/city-humanoid.js';

test('posing a Meshy figure preserves every source triangle, UV and material without altering the master',()=>{
 const source=new THREE.Group(),geometry=new THREE.BoxGeometry(.5,1,.3),materials=[new THREE.MeshBasicMaterial({color:'blue'}),new THREE.MeshBasicMaterial({color:'white'})];
 geometry.groups.forEach((group,i)=>group.materialIndex=i%2);
 source.add(new THREE.Mesh(geometry,materials));
 const original=geometry.attributes.position.array.slice(),flat=geometry.toNonIndexed();
 const sourceUV=[...flat.attributes.uv.array].sort((a,b)=>a-b);
 const rig=createRigidHumanoid(THREE,source,{height:1.05,relaxArms:true});
 const uv=[],used=new Set();let vertices=0,disposed=0;
 rig.group.traverse(object=>{if(!object.isMesh)return;vertices+=object.geometry.attributes.position.count;uv.push(...object.geometry.attributes.uv.array);used.add(object.material);object.geometry.addEventListener('dispose',()=>disposed++);});
 assert.equal(vertices,flat.attributes.position.count);
 assert.deepEqual(uv.sort((a,b)=>a-b),sourceUV);
 assert.deepEqual(used,new Set(materials));
 rig.joints.leftArm.rotateX(-.8);rig.joints.rightLeg.rotateX(-Math.PI/2);
 assert.deepEqual(geometry.attributes.position.array,original);
 rig.dispose();assert.equal(disposed,rig.stats.parts);
 geometry.dispose();flat.dispose();materials.forEach(material=>material.dispose());
});
