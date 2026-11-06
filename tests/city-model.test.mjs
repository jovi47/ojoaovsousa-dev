import test from 'node:test';
import assert from 'node:assert/strict';

// Empty or overlapping geometry breaks the visible physical-brick inventory.
test('city is a deterministic inventory of distinct, physically separate small bricks', async () => {
  const { CITY_BUILDINGS, createCityPieces } = await import('../public/city-model.js');
  const pieces = createCityPieces();
  assert.deepEqual(CITY_BUILDINGS.map(b => b.id), ['experience', 'projects', 'contact']);
  assert.deepEqual(createCityPieces(), pieces);
  assert.equal(new Set(pieces.map(p => p.id)).size, pieces.length);
  assert.ok(pieces.filter(p => p.building === 'experience').length >= 500);
  assert.ok(pieces.filter(p => p.building === 'projects').length >= 200);
  assert.ok(pieces.filter(p => p.building === 'contact').length >= 120);
  const geometry = new Set();
  for (const p of pieces) {
    assert.ok(CITY_BUILDINGS.some(b => b.id === p.building));
    assert.ok(p.position.every(Number.isFinite));
    assert.ok(p.rotation.every(Number.isFinite));
    assert.ok(p.size.every(v => Number.isFinite(v) && v > 0));
    assert.ok(p.position[1] - p.size[1] / 2 >= -1e-8);
    assert.ok(Math.max(...p.size) <= 1.6, `giant slab: ${p.id}`);
    assert.ok(Number.isInteger(p.order) && Number.isInteger(p.floor));
    assert.ok(p.studs.length > 0);
    for (const [x, z] of p.studs) {
      assert.ok(Math.abs(x) <= p.size[0] / 2);
      assert.ok(Math.abs(z) <= p.size[2] / 2);
    }
    const key = JSON.stringify([p.position, p.size]);
    assert.ok(!geometry.has(key), `duplicate brick: ${p.id}`);
    geometry.add(key);
  }
  // Interiors may touch at their faces; solid volumes must never intersect.
  for (let i = 0; i < pieces.length; i++) {
    const a = pieces[i];
    for (let j = i + 1; j < pieces.length; j++) {
      const b = pieces[j];
      const extent = p => [Math.abs(Math.cos(p.rotation[1])) * p.size[0] + Math.abs(Math.sin(p.rotation[1])) * p.size[2], p.size[1], Math.abs(Math.sin(p.rotation[1])) * p.size[0] + Math.abs(Math.cos(p.rotation[1])) * p.size[2]];
      const aSize = extent(a), bSize = extent(b);
      const overlap = a.position.every((v, axis) =>
        Math.abs(v - b.position[axis]) < (aSize[axis] + bSize[axis]) / 2 - 1e-7);
      assert.ok(!overlap, `intersecting solids: ${a.id} / ${b.id}`);
    }
  }
});

// Stateful arrival animation would give different poses when scrubbing backwards.
test('assembly is absolute, reversible, and completes each chapter on time', async () => {
  const { createCityPieces, getPiecePose } = await import('../public/city-model.js');
  const pieces = createCityPieces();
  for (const [building, progress] of [['experience', 0.4], ['projects', 0.7], ['contact', 0.88]]) {
    for (const piece of pieces.filter(p => p.building === building)) {
      const pose = getPiecePose(piece, progress);
      assert.equal(pose.visible, true);
      assert.equal(pose.scale, 1);
      assert.deepEqual(pose.position, piece.position);
      assert.deepEqual(pose.rotation, piece.rotation);
    }
  }
  const first = pieces.findLast(p => p.building === 'experience' && p.floor === 7);
  const before = getPiecePose(first, 0.3);
  getPiecePose(first, 1);
  assert.deepEqual(getPiecePose(first, 0.3), before);
  assert.notDeepEqual(before.position, first.position);
  assert.equal(before.scale, 1);
  for (const piece of pieces) {
    assert.deepEqual(getPiecePose(piece, 1).position, piece.position);
    assert.deepEqual(getPiecePose(piece, 1).rotation, piece.rotation);
    assert.equal(getPiecePose(piece, 1).scale, 1);
  }
  const exp = pieces.filter(p => p.building === 'experience');
  const initial = exp.filter(p => getPiecePose(p, 0).visible).length / exp.length;
  assert.equal(initial,0,'the construction-first tour starts without a prebuilt tower');
  for (const piece of pieces.filter(p => p.building !== 'experience' && p.floor > 0)) {
    assert.equal(getPiecePose(piece, 0).visible, false);
  }
  for (const p of pieces.filter((_, i) => i % 67 === 0)) {
    for (const t of [-1, 0, 0.05, 0.2, 0.3, 0.6, 0.85, 1, 2]) {
      const pose = getPiecePose(p, t);
      assert.ok(pose.position.every(Number.isFinite));
      assert.ok(pose.rotation.every(Number.isFinite));
      assert.equal(pose.scale, 1);
    }
  }
});

// Losing lateral targets or vertical ascent would flatten the scroll choreography.
test('story frames lift the focus, traverse the city, and expose a reversible explosion', async () => {
  const { getStoryFrame } = await import('../public/city-model.js');
  assert.equal(getStoryFrame(0).chapter, 0);
  assert.equal(getStoryFrame(0.5).chapter, 1);
  assert.equal(getStoryFrame(0.8).chapter, 2);
  assert.equal(getStoryFrame(1).chapter, 3);
  assert.ok(getStoryFrame(0.2).target[1] > getStoryFrame(0).target[1] + 1);
  assert.deepEqual(getStoryFrame(0.49).target, [-4, 1.6, -5]);
  assert.deepEqual(getStoryFrame(0.65).target, [4, 1.6, -5]);
  assert.deepEqual(getStoryFrame(0.88).target, [0, 2, -1]);
  assert.equal(getStoryFrame(0.88).distance, 26);
  assert.ok(getStoryFrame(0.3).explode > 0.8);
  assert.equal(getStoryFrame(0.4).explode, 0);
  assert.ok(getStoryFrame(1).distance > getStoryFrame(0.8).distance);
  for (let i = 0; i <= 100; i++) {
    const f = getStoryFrame(i / 100);
    assert.ok(f.target.every(Number.isFinite));
    assert.ok([f.distance, f.elevation, f.azimuth, f.explode].every(Number.isFinite));
    assert.ok(f.distance > 0 && f.elevation > 0);
  }
});

// A missing themed storey would lose one of the existing seven repertoire items.
test('seven technology storeys have distinct wall palettes and infrastructure stays physical', async () => {
  const {createCityPieces, TECH_FLOORS} = await import('../public/city-model.js');
  assert.deepEqual(TECH_FLOORS?.map(f=>f.id), ['java','elixir','ai','rag','agents','web','3d']);
  const pieces=createCityPieces();
  for(let floor=1;floor<=7;floor++) {
    assert.ok(pieces.some(p=>p.building==='experience'&&p.floor===floor&&p.color===TECH_FLOORS[floor-1].wall));
  }
  assert.ok(Math.max(...pieces.filter(p=>p.building==='experience').map(p=>p.position[1]+p.size[1]/2)) < 10);
  assert.ok(pieces.some(p=>p.building==='projects'&&p.position[1]>3));
});

// The transformed landmarks must preserve a single unobstructed street and face it.
test('core placements face the single central street without entering its sidewalks',async()=>{
 const {CITY_BUILDINGS,createCityPieces}=await import('../public/city-model.js');
 assert.deepEqual(CITY_BUILDINGS.map(b=>b.center),[[-4,0],[4,0],[-4,5]]);
 for(const p of createCityPieces()) {
  const halfX=(Math.abs(Math.cos(p.rotation[1]))*p.size[0]+Math.abs(Math.sin(p.rotation[1]))*p.size[2])/2;
  assert.ok(p.position[0]+halfX<=-1.8||p.position[0]-halfX>=1.8);
 }
});

test('the active village contains only the two project headquarters and reverses their assembly', async () => {
  const THREE = await import('../public/vendor/three.module.js');
  const { createVillage } = await import('../public/city-village.js');
  const scene = new THREE.Scene(), village = createVillage(THREE, scene);
  assert.deepEqual(village.places.map(place => place.id), ['horagora', 'andrea']);
  assert.deepEqual(village.interactables.map(place => place.id), ['horagora', 'andrea']);
  assert.equal(village.stats.houses, 2);
  assert.equal(village.stats.places, 2);
  assert.ok(village.stats.drawCalls <= 32, 'brand details must remain instanced');
  for (const [id, color] of [['horagora', 0x315bff], ['andrea', 0xb1fcba]]) {
    const object = village.interactables.find(item => item.id === id).object;
    const colored = object.children.filter(mesh => mesh.material?.color?.getHex() === color);
    assert.ok(colored.reduce((count, mesh) => count + mesh.count, 0) > 10, `${id} needs its real brand colors`);
  }
  for (const place of village.places) {
    assert.equal(place.approach.x, place.x);
    assert.ok(place.approach.z > place.z);
    assert.equal(village.interactables.find(item => item.id === place.id).object.rotation.y, 0);
  }
  const matrices = () => village.interactables.flatMap(({ object }) => object.children.map(mesh => Array.from(mesh.instanceMatrix.array)));
  village.update({ progress: 0.47 });
  const partial = matrices();
  village.update({ progress: 1 });
  assert.ok(village.interactables.every(({ object }) => object.visible));
  for (const place of village.interactables) {
    const size = new THREE.Box3().setFromObject(place.object).getSize(new THREE.Vector3());
    assert.ok(size.x < 2.45 && size.z < 2.04 && size.y < 3, 'logo details must retain the small house footprint');
    assert.deepEqual(place.logoAnchor, [0, 2.1, 0.065]);
  }
  village.update({ progress: 0.47 });
  assert.deepEqual(matrices(), partial);
  village.update({ progress: 0 });
  assert.ok(village.interactables.every(({ object }) => !object.visible));
  village.dispose();
  assert.equal(scene.children.length, 0);
});

test('technology signs preserve seven technology floors and add a separate eighth portrait storey', async () => {
  const THREE = await import('../public/vendor/three.module.js');
  const { createCityPieces, TECH_FLOORS, PROFILE_STOREY } = await import('../public/city-model.js');
  const { createTechSigns } = await import('../public/city-tech.js');
  const scene = new THREE.Scene();
  const technology = createTechSigns(THREE, scene, { pieces: createCityPieces() });
  assert.deepEqual(technology.signs.filter(sign => sign.id !== 'profile').map(sign => sign.id), TECH_FLOORS.map(floor => floor.id));
  assert.equal(technology.stats.signs, 8);
  assert.equal(technology.stats.technologyStoreys, 7);
  assert.equal(technology.stats.profileStoreys, 1);
  const profile = technology.signs.find(sign => sign.id === 'profile');
  assert.equal(profile.floor, 8);
  assert.equal(profile.portraitUrl, '/portrait.jpg');
  assert.equal(PROFILE_STOREY.floor, 8);
  assert.ok(createCityPieces().some(piece => piece.building === 'experience' && piece.floor === 8 && piece.color === PROFILE_STOREY.wall));
  assert.ok(profile.object.getObjectByName('profile-photo'));
  assert.ok(profile.object.getObjectByName('profile-photo-brick-frame'));
  const { access } = await import('node:fs/promises');
  await access(new URL('../public/portrait.jpg', import.meta.url));
  technology.update({ progress: 1 });
  for (const [index, sign] of technology.signs.entries()) {
    assert.equal(sign.floor, index + 1);
    assert.equal(sign.anchor.building, 'experience');
    assert.equal(sign.object.visible, true);
    assert.ok(sign.object.position.toArray().every(Number.isFinite));
  }
  technology.dispose();
  assert.equal(scene.children.length, 0);
});

// The portrait loader can complete after navigation has already disposed the WebGL scene.
test('the profile portrait loads locally and a late completion releases its texture without waking the disposed scene', async () => {
  const THREE = await import('../public/vendor/three.module.js');
  const { TECH_FLOORS } = await import('../public/city-model.js');
  const { createTechSigns } = await import('../public/city-tech.js');
  const previousDocument = globalThis.document, loaded = new THREE.Texture();
  loaded.image = { width: 300, height: 400 };
  let requested, complete, assets = 0, released = 0;
  const originalDispose = loaded.dispose.bind(loaded);
  loaded.dispose = () => { released++; originalDispose(); };
  const icons = Object.fromEntries(TECH_FLOORS.map(floor => [floor.id, new THREE.Texture()]));
  class DeferredTextureLoader {
    load(url, onLoad) { requested = url; complete = onLoad; return loaded; }
  }
  globalThis.document = {};
  try {
    const signs = createTechSigns({ ...THREE, TextureLoader: DeferredTextureLoader }, new THREE.Scene(), { icons, onAsset: () => assets++ });
    assert.equal(requested, '/portrait.jpg');
    assert.equal(signs.stats.portraitLoaded, false);
    signs.dispose();
    complete(loaded);
    assert.ok(released > 0);
    assert.equal(loaded.image, null);
    assert.equal(signs.stats.portraitLoaded, false);
    assert.equal(assets, 0);
  } finally {
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
    for (const texture of Object.values(icons)) texture.dispose();
  }
});
