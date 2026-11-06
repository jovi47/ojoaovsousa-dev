import { createCityPieces, getPiecePose, TECH_FLOORS, PROFILE_STOREY, CITY_BUILDINGS } from './city-model.js';

// Native canvas marks identify existing repertoire items without remote fonts or images.
function signTexture(THREE, tech) {
  if (typeof document === 'undefined') {
    const texture = new THREE.DataTexture(new Uint8Array([240, 236, 224, 255]), 1, 1);
    texture.needsUpdate = true; return texture;
  }
  const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f6f2e8';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#3c515b';
  ctx.lineWidth = 4; ctx.strokeRect(4, 4, 248, 120);
  ctx.save(); ctx.translate(52, 61); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const line = (points, close = false) => {
    ctx.beginPath(); points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    if (close) ctx.closePath(); ctx.stroke();
  };
  const circle = (x, y, radius) => { ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke(); };
  if (['java', 'elixir', 'web'].includes(tech.id)) {
    // Canonical marks are loaded below as mosaics from the actual local SVG assets.
  } else if (tech.id === 'ai' || tech.id === 'agents') {
    ctx.strokeStyle = tech.id === 'ai' ? '#447c82' : '#435a84';
    const nodes = tech.id === 'ai' ? [[0, -31], [-27, -7], [27, -7], [-21, 29], [21, 29], [0, 0]] : [[0, -25], [-26, 22], [26, 22]];
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) line([nodes[i], nodes[j]]);
    ctx.fillStyle = '#f6f2e8';
    for (const [x, y] of nodes) { ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
  } else if (tech.id === 'rag') {
    ctx.strokeStyle = '#936d45'; line([[-31, -27], [-4, -22], [-4, 29], [-31, 24], [-31, -27]]);
    line([[-4, -22], [20, -28], [20, 10]]); line([[-23, -11], [-12, -9]]); line([[-23, 0], [-12, 2]]);
    circle(18, 17, 15); line([[28, 28], [39, 39]]);
  } else {
    ctx.strokeStyle = '#8a505c'; line([[0, -36], [31, -18], [31, 20], [0, 38], [-31, 20], [-31, -18]], true);
    line([[-31, -18], [0, 0], [31, -18]]); line([[0, 0], [0, 38]]); line([[0, -36], [0, 0]]);
  }
  ctx.restore();
  ctx.fillStyle = '#253d4b';
  ctx.font = '700 23px sans-serif'; ctx.textBaseline = 'middle';
  if (tech.id === 'agents') { ctx.fillText('Harnesses', 103, 51); ctx.font = '600 20px sans-serif'; ctx.fillText('e agentes', 103, 79); }
  else if (tech.id === 'ai') { ctx.fillText('IA', 110, 50); ctx.font = '600 20px sans-serif'; ctx.fillText('aplicada', 110, 78); }
  else ctx.fillText(tech.name, tech.id === 'web' ? 185 : 111, 65);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter; return texture;
}

export function createTechSigns(THREE, scene, { pieces = createCityPieces(), icons = {}, onAsset = () => {} } = {}) {
  const group = new THREE.Group(); group.name = 'technology-storey-signs'; scene.add(group);
  const box = new THREE.BoxGeometry(1, 1, 1), plane = new THREE.PlaneGeometry(1, 1);
  const stud = new THREE.CylinderGeometry(1, 1, 1, 6);
  const materials = [], textures = [], signs = [], mosaicMeshes = [], images = [];
  const stats = { signs: 0, technologyStoreys: TECH_FLOORS.length, profileStoreys: 0, portraitLoaded: false, mosaics: 0, mosaicTiles: 0, assetFailures: [] };
  let disposed = false;
  function addMosaic(item, id, center, width) {
    if (typeof Image === 'undefined' || typeof document === 'undefined') return;
    const image = new Image(); images.push(image);
    image.onload = () => {
      if (disposed) return;
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 20;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const ratio = Math.min(20 / image.width, 20 / image.height);
      ctx.clearRect(0, 0, 20, 20);
      ctx.drawImage(image, (20 - image.width * ratio) / 2, (20 - image.height * ratio) / 2, image.width * ratio, image.height * ratio);
      const pixels = ctx.getImageData(0, 0, 20, 20).data, cells = [];
      for (let y = 0; y < 20; y++) for (let x = 0; x < 20; x++) {
        const i = (y * 20 + x) * 4;
        if (pixels[i + 3] > 70) cells.push({ x, y, rgb: [pixels[i], pixels[i + 1], pixels[i + 2]] });
      }
      if (!cells.length) { stats.assetFailures.push(id); onAsset(); return; }
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.36 }); materials.push(material);
      const tiles = new THREE.InstancedMesh(box, material, cells.length);
      const studs = new THREE.InstancedMesh(stud, material, cells.length);
      const dummy = new THREE.Object3D(), color = new THREE.Color(), pitch = width / 20;
      cells.forEach((cell, index) => {
        const x = center + (cell.x - 9.5) * pitch, y = (9.5 - cell.y) * pitch;
        color.setRGB(...cell.rgb.map(channel => channel / 255), THREE.SRGBColorSpace);
        dummy.position.set(x, y, 0.063); dummy.rotation.set(0, 0, 0); dummy.scale.set(pitch * 0.96, pitch * 0.96, 0.05); dummy.updateMatrix();
        tiles.setMatrixAt(index, dummy.matrix); tiles.setColorAt(index, color);
        dummy.position.z = 0.094; dummy.rotation.x = Math.PI / 2; dummy.scale.set(pitch * 0.23, 0.012, pitch * 0.23); dummy.updateMatrix();
        studs.setMatrixAt(index, dummy.matrix); studs.setColorAt(index, color);
      });
      for (const mesh of [tiles, studs]) { mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true; mesh.computeBoundingSphere(); item.add(mesh); mosaicMeshes.push(mesh); }
      stats.mosaics++; stats.mosaicTiles += cells.length; onAsset();
    };
    image.onerror = () => { if (!disposed) { stats.assetFailures.push(id); onAsset(); } };
    image.src = typeof icons[id] === 'string' ? icons[id] : `/icons/${id}.svg`;
  }
  function portraitTexture() {
    if (typeof document === 'undefined') {
      const texture = new THREE.DataTexture(new Uint8Array([242, 223, 201, 255]), 1, 1);
      texture.needsUpdate = true; textures.push(texture); return texture;
    }
    const texture = new THREE.TextureLoader().load(PROFILE_STOREY.portrait, loaded => {
      if (disposed) { loaded.image = null; loaded.dispose(); return; }
      const image = loaded.image, ratio = image.width / image.height;
      if (ratio > 1) { loaded.repeat.x = 1 / ratio; loaded.offset.x = (1 - loaded.repeat.x) / 2; }
      else { loaded.repeat.y = ratio; loaded.offset.y = (1 - ratio) / 2; }
      stats.portraitLoaded = true; onAsset();
    }, undefined, () => {
      if (!disposed) { stats.assetFailures.push('profile'); onAsset(); }
    });
    texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture); return texture;
  }
  function portraitFrame(item, material) {
    const tiles = new THREE.InstancedMesh(box, material, 12);
    const studs = new THREE.InstancedMesh(stud, material, 12);
    tiles.name = 'profile-photo-brick-frame'; studs.name = 'profile-photo-frame-studs';
    const dummy = new THREE.Object3D(); let index = 0;
    for (const side of [-1, 1]) for (let segment = -1; segment <= 1; segment++) {
      for (const horizontal of [true, false]) {
        const x = horizontal ? segment * 0.22 : side * 0.32;
        const y = horizontal ? side * 0.32 : segment * 0.19;
        dummy.position.set(x, y, 0.055); dummy.rotation.set(0, 0, 0);
        dummy.scale.set(horizontal ? 0.21 : 0.06, horizontal ? 0.06 : 0.18, 0.065);
        dummy.updateMatrix(); tiles.setMatrixAt(index, dummy.matrix);
        dummy.position.z = 0.096; dummy.rotation.x = Math.PI / 2;
        dummy.scale.set(0.019, 0.016, 0.019); dummy.updateMatrix(); studs.setMatrixAt(index++, dummy.matrix);
      }
    }
    for (const mesh of [tiles, studs]) {
      mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); item.add(mesh); mosaicMeshes.push(mesh);
    }
  }
  const placement = CITY_BUILDINGS.find(building => building.id === 'experience');
  const storeys = [...TECH_FLOORS, PROFILE_STOREY];
  for (let index = 0; index < storeys.length; index++) {
    const tech = storeys[index], floor = index + 1, profile = tech.id === 'profile';
    const candidates = pieces.filter(piece => piece.building === 'experience' && piece.floor === floor);
    const anchor = candidates.reduce((last, piece) => !last || piece.order > last.order ? piece : last, null);
    if (!anchor) continue;
    const local = [0, 0.16 + index * 1.14 + 0.48, (2.5 - index * 0.17) / 2 + 0.36];
    const angle = placement.rotationY, location = [
      placement.center[0] + Math.cos(angle) * local[0] + Math.sin(angle) * local[2], local[1],
      placement.center[1] - Math.sin(angle) * local[0] + Math.cos(angle) * local[2],
    ];
    const item = new THREE.Group(); item.name = `sign-${tech.id}`;
    const edge = new THREE.MeshStandardMaterial({ color: tech.pillar, roughness: 0.4 }); materials.push(edge);
    const texture = profile ? portraitTexture() : icons[tech.id]?.isTexture ? icons[tech.id] : signTexture(THREE, tech);
    if (!profile && !icons[tech.id]?.isTexture) textures.push(texture);
    const face = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }); materials.push(face);
    const backing = new THREE.Mesh(box, edge); backing.scale.set(profile ? 0.74 : tech.id === 'web' ? 1.4 : 1.02, profile ? 0.74 : 0.51, 0.06); backing.castShadow = true; item.add(backing);
    const front = new THREE.Mesh(plane, face); front.scale.set(profile ? 0.58 : tech.id === 'web' ? 1.36 : 0.98, profile ? 0.58 : 0.47, 1); front.position.z = 0.035; if (profile) front.name = 'profile-photo'; item.add(front);
    const bracket = new THREE.Mesh(box, edge); bracket.scale.set(0.06, 0.08, 0.4); bracket.position.set(0, -0.15, -0.21); item.add(bracket);
    if (profile) portraitFrame(item, edge);
    if (tech.id === 'java' || tech.id === 'elixir') addMosaic(item, tech.id, -0.29, 0.36);
    if (tech.id === 'web') { addMosaic(item, 'javascript', -0.47, 0.29); addMosaic(item, 'react', -0.12, 0.29); }
    group.add(item); signs.push({ object: item, anchor: { ...anchor, position: location }, id: tech.id, floor, ...(profile ? { portraitUrl: PROFILE_STOREY.portrait } : {}) });
  }
  stats.signs = signs.length; stats.profileStoreys = signs.filter(sign => sign.id === 'profile').length;
  function update({ progress = 0, explodeOverride = 0, explode = 0, reduced = false } = {}) {
    if (disposed) return;
    for (const sign of signs) {
      const pose = getPiecePose(sign.anchor, reduced ? 1 : progress, reduced ? 0 : Math.max(explodeOverride, explode));
      sign.object.visible = pose.visible;
      sign.object.position.fromArray(pose.position); sign.object.rotation.set(...pose.rotation);
    }
  }
  update();
  function dispose() {
    if (disposed) return; disposed = true; group.removeFromParent(); group.clear();
    for (const image of images) { image.onload = null; image.onerror = null; }
    for (const mesh of mosaicMeshes) mesh.dispose();
    box.dispose(); plane.dispose(); stud.dispose(); for (const material of materials) material.dispose();
    for (const texture of textures) texture.dispose();
  }
  return { group, signs, update, dispose, stats };
}
