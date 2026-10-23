// Physical bricks only: studs belong to their brick and never affect this inventory.
const INK = 0x252b32;
const RED = 0xa82732;
const IVORY = 0xe9dfc7;
const GOLD = 0xd7a846;
const STONE = 0x848e96;
export const TECH_FLOORS = Object.freeze([
  {id:'java', name:'Java', wall:0xf6f2e8, pillar:0xb6b0a5, trim:0xaf493e},
  {id:'elixir', name:'Elixir', wall:0xd5c2e4, pillar:0x704789, trim:0xc6a7dc},
  {id:'ai', name:'IA aplicada', wall:0xc1d8d9, pillar:0x447c82, trim:GOLD},
  {id:'rag', name:'RAG', wall:0xe1d4bc, pillar:0x936d45, trim:GOLD},
  {id:'agents', name:'Harnesses e agentes', wall:0xc4cddd, pillar:0x435a84, trim:GOLD},
  {id:'web', name:'Web', wall:0xc8dbcc, pillar:0x48795f, trim:GOLD},
  {id:'3d', name:'3D', wall:0xdbc9cd, pillar:0x8a505c, trim:GOLD},
].map(floor => Object.freeze({...floor, roof:0x263c48})));
export const PROFILE_STOREY = Object.freeze({id:'profile', name:'João Victor', floor:8, portrait:'/portrait.jpg',
  wall:0xf2dfc9, pillar:0xb47143, trim:0xe7b77b, roof:0x263c48});
const BUILDINGS = [
  { id: 'experience', center: [-4, 0], rotationY: Math.PI / 2, width: 3.3, depth: 4.2 },
  { id: 'projects', center: [4, 0], rotationY: -Math.PI / 2, width: 2.8, depth: 4.5 },
  { id: 'contact', center: [-4, 5], rotationY: Math.PI / 2, width: 2.3, depth: 2.8 },
];
const clamp = value => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

function buildCity() {
  const pieces = [];
  const orders = { experience: 0, projects: 0, contact: 0 };
  function brick(building, floor, color, x, y, z, w, h, d) {
    const order = orders[building]++;
    const studs = [];
    const nx = Math.max(1, Math.round(w / 0.24));
    const nz = Math.max(1, Math.round(d / 0.24));
    for (let iz = 0; iz < nz; iz++) {
      for (let ix = 0; ix < nx; ix++) {
        studs.push([(ix + 0.5) * w / nx - w / 2, (iz + 0.5) * d / nz - d / 2]);
      }
    }
    pieces.push({ id: `${building}-${order}`, building, color,
      position: [x, y, z], size: [w, h, d], rotation: [0, 0, 0], studs, order, floor });
  }
  // Four disjoint courses form a perimeter. Side courses exclude both corners.
  function ring(building, floor, color, cx, y, cz, w, d, thickness, height, length = 0.58, lift = 0) {
    for (const side of [-1, 1]) {
      const nx = Math.ceil(w / length);
      for (let i = 0; i < nx; i++) {
        const x = (i + 0.5) * w / nx - w / 2;
        const raised = (i === 0 || i === nx - 1) ? lift : 0;
        brick(building, floor, color, cx + x, y + raised, cz + side * (d - thickness) / 2,
          w / nx - 0.012, height, thickness - 0.008);
      }
      const span = d - 2 * thickness;
      const nz = Math.ceil(span / length);
      for (let i = 0; i < nz; i++) {
        brick(building, floor, color, cx + side * (w - thickness) / 2, y,
          cz + (i + 0.5) * span / nz - span / 2,
          thickness - 0.008, height, span / nz - 0.012);
      }
    }
  }
  function foundation(building, cx, cz, w, d) {
    const nx = Math.ceil(w / 0.62), nz = Math.ceil(d / 0.62);
    for (let z = 0; z < nz; z++) {
      for (let x = 0; x < nx; x++) {
        brick(building, 0, (x + z) % 4 ? STONE : INK,
          cx + (x + 0.5) * w / nx - w / 2, 0.08,
          cz + (z + 0.5) * d / nz - d / 2, w / nx - 0.012, 0.16, d / nz - 0.012);
      }
    }
  }
  function tier(building, floor, cx, cz, base, w, d, tall = 0.66, palette = {}) {
    const wall = palette.wall ?? IVORY, pillar = palette.pillar ?? RED;
    const roof = palette.roof ?? INK, trim = palette.trim ?? GOLD;
    ring(building, floor, pillar, cx, base + 0.06, cz, w, d, 0.22, 0.12, 0.65);
    // Four stacked red corner pillars, separate from the inset ivory wall courses.
    for (const x of [-1, 1]) {
      for (const z of [-1, 1]) {
        for (let row = 0; row < 3; row++) {
          brick(building, floor, row === 2 ? trim : pillar,
            cx + x * (w - 0.18) / 2, base + 0.12 + (row + 0.5) * tall / 3,
            cz + z * (d - 0.18) / 2, 0.18, tall / 3 - 0.012, 0.18);
        }
      }
    }
    for (const side of [-1, 1]) {
      for (const axis of [0, 2]) {
        const span = (axis === 0 ? w : d) - 0.42;
        const n = Math.ceil(span / 0.43);
        for (let i = 0; i < n; i++) {
          const along = (i + 0.5) * span / n - span / 2;
          const x = axis === 0 ? cx + along : cx + side * (w - 0.18) / 2;
          const z = axis === 0 ? cz + side * (d - 0.18) / 2 : cz + along;
          // The entrance remains open at the front of the lowest storey.
          if (floor === 1 && axis === 0 && side === 1 && Math.abs(along) < 0.4) continue;
          for (const row of [0, 2]) {
            brick(building, floor, wall, x, base + 0.12 + (row + 0.5) * tall / 3, z,
              axis === 0 ? span / n - 0.014 : 0.16, tall / 3 - 0.018,
              axis === 0 ? 0.16 : span / n - 0.014);
          }
          // Narrow upright lattice bricks leave real window openings between them.
          brick(building, floor, pillar, x, base + 0.12 + tall / 2, z,
            axis === 0 ? 0.065 : 0.16, tall / 3 - 0.018, axis === 0 ? 0.16 : 0.065);
        }
      }
    }
    const eave = base + 0.12 + tall;
    // Cantilever brackets reach beneath the lifted roof corners.
    for (const x of [-1, 1]) {
      for (const z of [-1, 1]) {
        brick(building, floor, pillar, cx + x * (w - 0.18) / 2, eave + 0.02,
          cz + z * d / 2, 0.12, 0.04, 0.6);
      }
    }
    // Stepped, projecting roof courses: small lifted corner plates form the silhouette.
    ring(building, floor, roof, cx, eave + 0.07, cz, w + 0.62, d + 0.62, 0.32, 0.1, 0.56, 0.055);
    ring(building, floor, roof, cx, eave + 0.21, cz, w + 0.16, d + 0.16, 0.3, 0.1, 0.56, 0.045);
    // Segmented crossbeams carry the next storey, and four risers make the join explicit.
    const span = w - 0.44, segments = Math.ceil(span / 0.64);
    for (const side of [-1, 1]) {
      const z = cz + side * (d - 0.68) / 2;
      for (let i = 0; i < segments; i++) {
        brick(building, floor, pillar, cx + (i + 0.5) * span / segments - span / 2,
          eave + 0.21, z, span / segments - 0.012, 0.1, 0.18);
      }
      for (const x of [-1, 1]) {
        brick(building, floor, trim, cx + x * (w - 0.68) / 2, eave + 0.31, z, 0.16, 0.1, 0.16);
      }
    }
    // Gold balcony rails and red support struts live beyond the wall, below the eaves.
    for (const side of [-1, 1]) {
      const n = Math.ceil(w / 0.67);
      for (let i = 0; i < n; i++) {
        const x = cx + (i + 0.5) * w / n - w / 2;
        brick(building, floor, pillar, x, base + 0.32, cz + side * (d / 2 + 0.2), 0.08, 0.3, 0.08);
        brick(building, floor, trim, x, base + 0.51, cz + side * (d / 2 + 0.2), w / n - 0.016, 0.07, 0.08);
      }
    }
  }
  foundation('experience', -2, 0, 4, 3);
  for (let level = 0; level < 7; level++) {
    tier('experience', level + 1, -2, 0, 0.16 + level * 1.14, 3.5 - level * 0.25, 2.5 - level * 0.17, 0.66, TECH_FLOORS[level]);
  }
  // An eighth general storey identifies the person behind the seven technology floors.
  tier('experience', PROFILE_STOREY.floor, -2, 0, 0.16 + 7 * 1.14, 1.75, 1.31, 0.66, PROFILE_STOREY);
  // Crown tiles close the final roof; their rising courses create a compact ridge.
  for (let row = 0; row < 3; row++) {
    const w = 1.3 - row * 0.32, d = 0.88 - row * 0.24;
    const nx = Math.ceil(w / 0.4), nz = Math.ceil(d / 0.3);
    for (let iz = 0; iz < nz; iz++) {
      for (let ix = 0; ix < nx; ix++) {
        brick('experience', 8, row === 2 ? GOLD : INK,
          -2 + (ix + 0.5) * w / nx - w / 2, 9.33 + row * 0.12,
          (iz + 0.5) * d / nz - d / 2, w / nx - 0.012, 0.1, d / nz - 0.012);
      }
    }
  }
  brick('experience', 8, GOLD, -2, 9.79, 0, 0.16, 0.26, 0.16);
  // Two independent wings share the projects courtyard, with a clear space between them.
  for (const side of [-1, 1]) {
    const cx = 4 + side * 1.2;
    foundation('projects', cx, -2, 2.12, 2.35);
    for (let level = 0; level < 2; level++) {
      tier('projects', level + 1, cx, -2, 0.16 + level * 1.14, 1.55 - level * 0.22, 1.8 - level * 0.2, 0.66, {wall:0xe6e6da, pillar:0x254b57, roof:0x1b3943, trim:0x8bc2bf});
    }
    for (let row = 0; row < 4; row++) {
      brick('projects', 2, 0x254b57, cx, 2.68 + row * 0.2, -2, 0.08, 0.19, 0.08);
    }
    brick('projects', 2, 0x8bc2bf, cx, 3.45, -2, 0.64, 0.12, 0.1);
    brick('projects', 1, 0x254b57, cx, 0.46, -2.35, 0.42, 0.6, 0.4);
    for (let row = 0; row < 3; row++) {
      brick('projects', 1, 0x8bc2bf, cx + 0.1, 0.28 + row * 0.16, -2.13, 0.05, 0.04, 0.04);
    }
    for (let i = 0; i < 3; i++) {
      brick('projects', 2, GOLD, cx + (i - 1) * 0.32, 2.5, -2, 0.3, 0.12, 0.34);
    }
  }
  foundation('contact', 4, 3, 2.6, 2);
  tier('contact', 1, 4, 3, 0.16, 2.05, 1.45, 1.18);
  for (let row = 0; row < 3; row++) {
    const w = 1.78 - row * 0.32;
    for (let i = 0; i < 4; i++) {
      brick('contact', 1, row === 2 ? GOLD : INK,
        4 + (i + 0.5) * w / 4 - w / 2, 1.87 + row * 0.13, 3,
        w / 4 - 0.012, 0.1, 0.62 - row * 0.15);
    }
  }
  brick('contact', 1, GOLD, 4, 2.32, 3, 0.18, 0.28, 0.18);
  // Reuse the complete original inventories, rotating each finished building as one placement.
  const sourceCenters = {experience: [-2, 0], projects: [4, -2], contact: [4, 3]};
  for (const piece of pieces) {
    const placement = BUILDINGS.find(building => building.id === piece.building);
    const source = sourceCenters[piece.building], [x, y, z] = piece.position;
    const dx = x - source[0], dz = z - source[1], angle = placement.rotationY;
    piece.position = [placement.center[0] + Math.cos(angle) * dx + Math.sin(angle) * dz, y,
      placement.center[1] - Math.sin(angle) * dx + Math.cos(angle) * dz];
    piece.rotation[1] += angle;
  }
  return pieces;
}

const MODEL = buildCity();
export const CITY_BUILDINGS = Object.freeze(BUILDINGS.map(building => Object.freeze({
  ...building, center: Object.freeze(building.center),
  pieceCount: MODEL.filter(piece => piece.building === building.id).length,
})));
const COUNTS = Object.fromEntries(CITY_BUILDINGS.map(building => [building.id, building.pieceCount]));

export function createCityPieces() {
  return MODEL.map(piece => ({ ...piece, position: [...piece.position], size: [...piece.size],
    rotation: [...piece.rotation], studs: piece.studs.map(stud => [...stud]) }));
}

function explosion(progress) {
  return smooth((progress - 0.245) / 0.045) * (1 - smooth((progress - 0.325) / 0.065));
}

// Angles are radians; distance is in model units. Interpolate targets before adding user orbit.
const FRAMES = [
  [0, [-4, 1.1, 0], 10, 0.29, 0.9],
  [0.22, [-4, 5.8, 0], 13.1, 0.26, 0.95],
  [0.3, [-4, 6.1, 0], 15, 0.35, 1.08],
  [0.39, [-4, 4.7, 0], 13.5, 0.34, 0.9],
  [0.4, [-4, 1.6, -5], 8.7, 0.4, 0.9],
  [0.49, [-4, 1.6, -5], 8.2, 0.38, 0.9],
  [0.51, [-4, 1.6, -5], 8.7, 0.4, 0.9],
  [0.55, [4, 1.6, -5], 9, 0.4, -0.9],
  [0.65, [4, 1.6, -5], 9.2, 0.38, -0.9],
  [0.7, [-4, 1, 5], 9.5, 0.4, 0.9],
  [0.82, [-4, 1.4, 5], 10, 0.4, 0.9],
  [0.88, [0, 2, -1], 26, 0.35, 0],
  [1, [0, 2, -1], 26, 0.35, 0],
];

export function getStoryFrame(progress) {
  const p = clamp(progress);
  let index = FRAMES.findIndex(frame => frame[0] >= p);
  if (index < 1) index = 1;
  const a = FRAMES[index - 1], b = FRAMES[index];
  const t = smooth((p - a[0]) / (b[0] - a[0]));
  const mix = (from, to) => from + (to - from) * t;
  return {
    chapter: p < 0.4 ? 0 : p < 0.7 ? 1 : p < 0.88 ? 2 : 3,
    target: a[1].map((value, axis) => mix(value, b[1][axis])),
    distance: mix(a[2], b[2]), elevation: mix(a[3], b[3]), azimuth: mix(a[4], b[4]),
    explode: explosion(p),
  };
}

export function getPiecePose(piece, progress, explodeOverride = 0) {
  const p = clamp(progress);
  const isExperience = piece.building === 'experience';
  const start = isExperience ? 0 : piece.building === 'projects' ? 0.4 : 0.7;
  const end = isExperience ? 0.4 : piece.building === 'projects' ? 0.675 : 0.865;
  const built = smooth((p - start) / (end - start));
  const arrival = piece.floor === 0 && !isExperience ? 1 : clamp((built * (COUNTS[piece.building] + 4) - piece.order) / 4);
  const t = smooth(arrival);
  const flying = 1 - t;
  const angle = piece.order * 2.399963;
  const center = BUILDINGS.find(building => building.id === piece.building).center;
  const exploded = clamp(explodeOverride);
  const spread = exploded * (0.22 + piece.floor * 0.055);
  const position = [...piece.position];
  if (exploded > 0 && piece.floor > 0) {
    position[0] += (position[0] - center[0]) * spread;
    position[1] += piece.floor * 0.37 * exploded;
    position[2] += (position[2] - center[1]) * spread;
  }
  if (flying > 0) {
    position[0] += Math.cos(angle) * flying * 1.5;
    position[1] += flying * (1.4 + (piece.order % 5) * 0.13);
    position[2] += Math.sin(angle) * flying * 1.5;
  }
  return { position, rotation: piece.rotation.map((value, axis) => value + flying * (axis === 1 ? 0.7 : 0.25)),
    scale: 1, visible: arrival > 0 };
}
