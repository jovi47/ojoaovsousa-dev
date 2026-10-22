// Original toy-brick village: all signs and ornaments are geometry, with no external assets.
export function createVillage(THREE, scene, { boxGeometry, studGeometry, layout = {} } = {}) {
  const group = new THREE.Group(); group.name = 'japanese-village'; scene.add(group);
  const ownGeometries = [];
  const own = geometry => { ownGeometries.push(geometry); return geometry; };
  const geometries = {
    box: boxGeometry || own(new THREE.BoxGeometry(1, 1, 1)),
    stud: studGeometry || own(new THREE.CylinderGeometry(1, 1, 1, 8)),
    round: own(new THREE.CylinderGeometry(1, 1, 1, 12)),
  };
  const materials = [], meshes = [], houses = [], interactables = [], obstacles = [], places = [];
  const stats = { bricks: 0, studs: 0, houses: 0, places: 0, trainCars: 0, drawCalls: 0 };
  const dummy = new THREE.Object3D(), offset = new THREE.Vector3(), rotation = new THREE.Euler();
  const C = { ivory: 0xf1e7cc, stone: 0xb4ada0, wood: 0x7c4939, red: 0xba4142,
    gold: 0xe2b75e, blue: 0x408ac4, royal: 0x315bff, ascNavy: 0x00205b, mint: 0xb1fcba, navy: 0x244969, teal: 0x337e7b,
  };
  function context(parent, id) { return { parent, id, buckets: new Map(), materials: [], nextBrick: 0, owners: [] }; }
  const environment = context(group);
  function part(ctx, kind, color, position, size, angles = [0, 0, 0], glow = false, owner = 0) {
    const key = `${kind}-${color}-${glow}`;
    if (!ctx.buckets.has(key)) ctx.buckets.set(key, { kind, color, glow, parts: [] });
    ctx.buckets.get(key).parts.push({ position, size, angles, owner });
  }
  function brick(ctx, color, x, y, z, w, h, d, { studs = true, angles = [0, 0, 0], glow = false } = {}) {
    stats.bricks++;
    const owner = ctx.nextBrick++;
    if (ctx.id) ctx.owners.push({ owner, y });
    part(ctx, 'box', color, [x, y, z], [w, h, d], angles, glow, owner);
    if (!studs) return;
    const nx = Math.max(1, Math.round(w / 0.26)), nz = Math.max(1, Math.round(d / 0.26));
    const radius = Math.min(0.052, w * 0.3, d * 0.3);
    rotation.set(...angles);
    for (let ix = 0; ix < nx; ix++) for (let iz = 0; iz < nz; iz++) {
      offset.set((ix + 0.5) * w / nx - w / 2, h / 2 + 0.018, (iz + 0.5) * d / nz - d / 2).applyEuler(rotation);
      part(ctx, 'stud', color, [x + offset.x, y + offset.y, z + offset.z], [radius, 0.036, radius], angles, false, owner);
      stats.studs++;
    }
  }
  function round(ctx, color, x, y, z, radius, height, angles = [0, 0, 0]) {
    stats.bricks++;
    const owner = ctx.nextBrick++;
    if (ctx.id) ctx.owners.push({ owner, y });
    part(ctx, 'round', color, [x, y, z], [radius, height, radius], angles, false, owner);
  }
  function finish(ctx) {
    if (ctx.id) {
      ctx.ownerCount = ctx.owners.length;
      ctx.order = new Map(ctx.owners.sort((a, b) => a.y - b.y || a.owner - b.owner).map((brick, index) => [brick.owner, index]));
      ctx.assembly = []; ctx.owners = [];
    }
    for (const bucket of ctx.buckets.values()) {
      const material = new THREE.MeshStandardMaterial({ color: bucket.color, roughness: 0.45,
        metalness: bucket.color === C.gold ? 0.16 : 0,
        emissive: bucket.glow ? bucket.color : 0, emissiveIntensity: bucket.glow ? 0.28 : 0 });
      materials.push(material); ctx.materials.push(material);
      const mesh = new THREE.InstancedMesh(geometries[bucket.kind], material, bucket.parts.length);
      mesh.castShadow = bucket.kind !== 'stud'; mesh.receiveShadow = true;
      if (ctx.id) {
        ctx.assembly.push({ mesh, parts: bucket.parts });
        mesh.frustumCulled = false; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      }
      if (ctx.id) mesh.userData.caseId = ctx.id;
      bucket.parts.forEach((piece, index) => {
        dummy.position.fromArray(piece.position); dummy.rotation.set(...piece.angles);
        dummy.scale.fromArray(piece.size); dummy.updateMatrix(); mesh.setMatrixAt(index, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere();
      meshes.push(mesh); ctx.parent.add(mesh); stats.drawCalls++;
    }
    ctx.buckets.clear();
  }
  // LEGO crests sampled from the symbols in the unmodified public project logos.
  const brandCrests = {
    "horagora": [
        " BBBBBBB",
        "BBBBBBBBB",
        "BBBBBBBBB",
        "BBBBBBBBB",
        "BBBBBBBBB",
        "BBBBBBBBB",
        "BBBBBBBBB   BBBBBBBB",
        "BBBBBBBBB  BBBBBBBBB",
        "BBBBBBBB  BBBBBBBBBB",
        "BBBBBBB  BBBBBBBBBBB",
        "BBBBBBBB  BBBBBBBBBB",
        "BBBBBBBBB  BBBBBBBBB",
        "BBBBBBBBB   BBBBBBBB",
        "BBBBBBBBB   BBBBBBBB",
        "BBBBBBBBBBBBBBBBBBBB",
        "BBBBBBBBBBBBBBBBBBBB",
        "BBBBBBBBB   BBBBBBBB",
        "BBBBBBBBB   BBBBBBBB",
        "BBBBBBBBB   BBBBBBBB",
        " BBBBBBB    BBBBBBB"
    ],
    "andrea": [
        "           BBBBB",
        "          BBBB   BB",
        "         BBB   BBB",
        "        BBBB   BB",
        "       BBBB    B",
        "      BBBB     B",
        "      BBBB B   B",
        "     BBBB  BB  B",
        "    BBBBB BBBB",
        "    BBBBM  BBBB",
        "   BBBB M  BBBBBB",
        "  BBBB MM   BBBBBB",
        " BBBB MMM     BBBB",
        " BB  MMM M     BBBB",
        "   MMMM  MM     BBB",
        " MMMMM   MMM     BB",
        "         MMMM    BB",
        "          MMMMM  BB",
        "           MMMM BB",
        "            MMM B"
    ]
};
  function house(id, x, z, accent, start, end, yaw) {
    const object = new THREE.Group(); object.position.set(x, 0, z); object.rotation.y = yaw;
    object.name = `${id}-house`; object.userData.caseId = id; group.add(object);
    const ctx = context(object, id), w = 1.9, d = 1.45;
    const trim = id === 'andrea' ? C.mint : 0xffffff;
    for (let ix = 0; ix < 4; ix++) for (let iz = 0; iz < 3; iz++) brick(ctx,
      (ix + iz) % 2 ? C.stone : trim, (ix - 1.5) * 0.48, 0.1,
      (iz - 1) * 0.48, 0.46, 0.2, 0.46);
    for (let row = 0; row < 4; row++) {
      const y = 0.32 + row * 0.22;
      for (const side of [-1, 1]) {
        for (const edge of [-1, 1]) brick(ctx, accent, edge * (w - 0.12) / 2,
          y, side * (d - 0.12) / 2, 0.12, 0.21, 0.12);
        for (let column = 0; column < 6; column++) {
          const px = (column - 2.5) * 0.29;
          if (side === 1 && Math.abs(px) < 0.34) continue;
          const window = side === 1 && (row === 1 || row === 2);
          brick(ctx, window ? trim : 0xffffff, px, y, side * d / 2,
            0.275, 0.21, 0.11);
          if (window) brick(ctx, accent, px, y, side * (d / 2 + 0.06),
            0.025, 0.21, 0.025, { studs: false });
        }
        for (let column = 0; column < 4; column++) brick(ctx,
          row === 2 ? trim : 0xffffff, side * w / 2, y, (column - 1.5) * 0.3,
          0.1, 0.21, 0.285);
      }
    }
    if (id === 'horagora') {
      // The offset uprights echo the cut H in HorAgora's symbol around the entrance.
      brick(ctx, C.royal, -0.37, 0.78, 0.78, 0.14, 1.14, 0.16);
      brick(ctx, C.royal, 0.37, 0.69, 0.78, 0.14, 0.96, 0.16);
      brick(ctx, C.royal, 0, 1.2, 0.78, 0.88, 0.14, 0.18);
      brick(ctx, 0xffffff, -0.02, 1.2, 0.885, 0.19, 0.075, 0.035, { studs: false });
      brick(ctx, C.royal, -0.02, 1.2, 0.91, 0.11, 0.027, 0.02, { studs: false });
    } else {
      for (const side of [-1, 1]) brick(ctx, C.ascNavy, side * 0.33, 0.65, 0.78, 0.07, 0.9, 0.14);
      brick(ctx, C.mint, 0, 1.13, 0.78, 0.73, 0.12, 0.17);
    }
    brick(ctx, trim, 0, 0.22, 0.86, 0.74, 0.08, 0.27);
    // Small Japanese eaves assembled from individual toy-brick roof tiles.
    for (const side of [-1, 1]) for (let row = 0; row < 5; row++) {
      const span = 2.24 - row * 0.07;
      for (let column = 0; column < 8; column++) {
        const wing = id === 'andrea' ? Math.abs(column - 3.5) / 3.5 : 0;
        const color = row === 0 || (id === 'andrea' && row === 1 && wing > 0.7) ? trim : accent;
        brick(ctx, color, (column - 3.5) * span / 8,
          1.3 + row * 0.09 + wing * 0.09, side * (0.84 - row * 0.17), span / 8 - 0.012,
          0.1, 0.23, { angles: [side * -0.13, 0, 0] });
      }
    }
    for (let column = 0; column < 8; column++) brick(ctx, accent,
      (column - 3.5) * 0.27, 1.79, 0, 0.255, 0.12, 0.25);
    for (const side of [-1, 1]) brick(ctx, accent, side * 1.08, 1.82, 0,
      0.25, 0.12, 0.26, { angles: [0, 0, side * 0.2] });
    if (id === 'andrea') {
      // Mint feather tips lift the two navy eaves into the wings of the ASC bird.
      for (const side of [-1, 1]) for (let feather = 0; feather < 3; feather++) brick(ctx,
        C.mint, side * (0.62 + feather * 0.17), 1.38 + feather * 0.035,
        0.91, 0.21, 0.065, 0.13, { angles: [0, 0, side * 0.12] });
    }
    // The unmodified official logo is mounted on this white rooftop sign by the controller.
    brick(ctx, 0xffffff, 0, 2.1, 0, 1.95, 0.59, 0.1, { studs: false });
    for (const side of [-1, 1]) brick(ctx, accent, side * 0.94, 2.1, 0.035,
      0.055, 0.64, 0.13, { studs: false });
    brick(ctx, accent, 0, 2.41, 0.02, 1.98, 0.055, 0.13);
    brick(ctx, accent, 0, 2.453, 0, 0.42, 0.035, 0.11, { studs: false });
    const crest = brandCrests[id], cell = 0.019;
    for (let row = 0; row < crest.length; row++) for (let column = 0; column < crest[row].length; column++) {
      const pixel = crest[row][column]; if (pixel === ' ') continue;
      brick(ctx, pixel === 'M' ? C.mint : accent, (column - 9.5) * cell,
        2.47 + (19 - row) * cell, 0, cell * 0.94, cell * 0.94, 0.08, { studs: false });
    }
    finish(ctx);
    houses.push({ object, ctx, start, end, amount: -1 });
    const world = (localX, localZ) => ({x: x + Math.cos(yaw) * localX + Math.sin(yaw) * localZ,
      z: z - Math.sin(yaw) * localX + Math.cos(yaw) * localZ});
    const label = world(0, 0.65);
    interactables.push({ id, position: [label.x, 2.9, label.z],
      logoAnchor: [0, 2.1, 0.065], object });
    obstacles.push({ x, z, width: 2.42, depth: 2 });
    places.push({ id, x, z, floorY: 0.2, door: world(0, 0.87), interior: world(0, 0.05),
      work: world(0, 0.05), approach: world(0, 1.25) });
    stats.houses++; stats.places++;
  }
  house('horagora', ...(layout.horagora || [-2.1, 1.4]), C.royal, 0.4, 0.54, 0);
  house('andrea', ...(layout.andrea || [.4, 1.7]), C.ascNavy, 0.55, 0.69, 0);

  finish(environment);
  let disposed = false;

  function update({ time = 0, progress = 0, reduced = false } = {}) {
    if (disposed) return false;
    let changed = false;
    for (const house of houses) {
      const value = reduced ? 1 : Math.max(0, Math.min(1, (progress - house.start) / (house.end - house.start)));
      const amount = value * value * (3 - 2 * value);
      if (house.amount === amount) continue;
      house.amount = amount; changed = true;
      house.object.visible = amount > 0;
      house.object.scale.setScalar(1); house.object.position.y = 0;
      for (const batch of house.ctx.assembly) {
        batch.parts.forEach((part, index) => {
          const order = house.ctx.order.get(part.owner);
          const arrival = Math.max(0, Math.min(1, (amount * (house.ctx.ownerCount + 8) - order) / 8));
          const t = arrival * arrival * (3 - 2 * arrival), flying = 1 - t, angle = order * 2.399963;
          dummy.position.fromArray(part.position);
          dummy.position.x += Math.cos(angle) * flying * 0.75;
          dummy.position.y += flying * (0.65 + order % 3 * 0.07) + Math.sin(t * Math.PI) * 0.12;
          dummy.position.z += Math.sin(angle) * flying * 0.75;
          dummy.rotation.set(...part.angles); dummy.scale.fromArray(part.size).multiplyScalar(arrival > 0 ? 1 : 0);
          dummy.updateMatrix(); batch.mesh.setMatrixAt(index, dummy.matrix);
        });
        batch.mesh.instanceMatrix.needsUpdate = true;
      }
    }
    return changed;
  }
  update();
  function dispose() {
    if (disposed) return;
    disposed = true; group.removeFromParent();
    for (const mesh of meshes) mesh.dispose();
    for (const material of materials) material.dispose();
    for (const geometry of ownGeometries) geometry.dispose();
    group.clear();
  }
  return { group, interactables, obstacles, places, update, dispose, stats };
}
