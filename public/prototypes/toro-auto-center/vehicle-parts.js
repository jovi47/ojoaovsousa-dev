import * as T from '../../vendor/three.module.js';

const steel = new T.MeshStandardMaterial({ color: 0xa1a9b3, metalness: .65, roughness: .32 });
const alloy = new T.MeshStandardMaterial({ color: 0x59616d, metalness: .55, roughness: .38 });
const rubber = new T.MeshStandardMaterial({ color: 0x202128, roughness: .78 });
const beltRubber = new T.MeshStandardMaterial({ color: 0x3e4148, roughness: .77 });
const black = new T.MeshStandardMaterial({ color: 0x141922, roughness: .46 });
const brass = new T.MeshStandardMaterial({ color: 0x997046, metalness: .56, roughness: .35 });
const red = new T.MeshStandardMaterial({ color: 0xa11f27, metalness: .3, roughness: .29 });
const yellow = new T.MeshStandardMaterial({ color: 0xe3a928, metalness: .3, roughness: .39 });
const ceramic = new T.MeshStandardMaterial({ color: 0xe4e2dc, roughness: .34 });
const glass = new T.MeshPhysicalMaterial({ color: 0x5f90b2, transparent: true, opacity: .43, depthWrite: false, roughness: .19, clearcoat: .55 });
const amber = new T.MeshBasicMaterial({ color: 0xf4ab33 });

function mesh(group, geometry, material, at) {
  const item = new T.Mesh(geometry, material);
  item.position.set(...at);
  group.add(item);
  return item;
}

function box(group, material, size, at) {
  return mesh(group, new T.BoxGeometry(...size), material, at);
}

function cylinder(group, material, radius, length, at, sides = 48) {
  return mesh(group, new T.CylinderGeometry(radius, radius, length, sides), material, at);
}

function disk(group, material, radius, depth, [x,y,z], sides) {
  const item = cylinder(group, material, radius, depth, [x,y,z], sides);
  item.rotation.x = Math.PI / 2;
  return item;
}

function ring(group, material, radius, thickness, at) {
  return mesh(group, new T.TorusGeometry(radius, thickness, 8, 56), material, at);
}

function pipe(group, material, radius, coordinates) {
  const curve = new T.CatmullRomCurve3(coordinates.map(point => new T.Vector3(...point)));
  return mesh(group, new T.TubeGeometry(curve, Math.max(16, coordinates.length * 6), radius, 8),
    material, [0,0,0]);
}

function boltCircle(group, radius, depth, count) {
  for (let i = 0; i < count; i++) {
    const angle = 2 * Math.PI * i / count;
    disk(group, steel, radius * .18, .023, [radius * Math.cos(angle), radius * Math.sin(angle), depth], 6);
  }
}

function battery(group) {
  box(group, rubber, [.71,.43,.47], [0,0,0]);
  box(group, alloy, [.73,.06,.49], [0,.216,0]);
  const clamps = [];
  for (const side of [-1,1]) {
    const terminal = side > 0 ? red : steel;
    cylinder(group, terminal, .064,.022, [side * .25,.25,.12], 24);
    cylinder(group, terminal, .037,.059, [side * .25,.284,.12], 24);
    box(group, alloy, [.035,.023,.29], [side * .35,.25,-.025]);
    const clamp = new T.Group();
    clamp.position.set(side * .25,.32,.12);
    group.add(clamp);
    ring(clamp, terminal, .041,.009, [0,0,0]).rotation.x = Math.PI / 2;
    box(clamp, terminal, [.042,.022,.08], [0,0,-.056]);
    pipe(clamp, rubber, .012, [[0,0,-.09],[.021,.014,-.16],[side * .051,.012,-.24]]);
    clamps.push(clamp);
  }
  for (let x = -.27; x < .3; x += .09) box(group, black, [.022,.3,.018], [x,-.02,.239]);
  box(group, yellow, [.33,.096,.012], [0,.04,.25]);
  box(group, black, [.08,.012,.015], [.08,.04,.259]);
  box(group, black, [.014,.052,.015], [.08,.04,.259]);
  box(group, black, [.08,.012,.015], [-.08,.04,.259]);
  const charge = Array.from({ length: 4 }, (_,i) => box(group, amber, [.048,.019,.014], [-.089 + i * .059,-.064,.246]));
  return time => {
    const phase = time % 4.8;
    clamps.forEach((clamp,i) => {
      const connected = T.MathUtils.smoothstep(phase, .15 + i * .28, .95 + i * .28)
        * (1 - T.MathUtils.smoothstep(phase, 3.8, 4.6));
      clamp.position.y = .414 - .107 * connected;
    });
    charge.forEach((bar,i) => { bar.visible = phase > 1.3 + i * .33 && phase < 4.02; });
  };
}

function belt(group) {
  const pulleys = [[-.25,.155,.15],[.24,.13,.115],[.055,-.245,.17]];
  const shape = new T.Shape();
  const inner = new T.Path();
  const outline = (path, gap) => {
    for (let i = 0; i < pulleys.length; i++) {
      const [x,y,radius] = pulleys[i];
      const [nextX,nextY,nextRadius] = pulleys[(i + 1) % pulleys.length];
      const [prevX,prevY,prevRadius] = pulleys[(i + pulleys.length - 1) % pulleys.length];
      const entry = Math.atan2(y - prevY, x - prevX) + Math.acos((prevRadius - radius) / Math.hypot(x - prevX, y - prevY));
      const exit = Math.atan2(nextY - y, nextX - x) + Math.acos((radius - nextRadius) / Math.hypot(nextX - x, nextY - y));
      const r = radius + gap;
      const start = [x + Math.cos(entry) * r, y + Math.sin(entry) * r];
      if (i === 0) path.moveTo(...start);
      else path.lineTo(...start);
      path.absarc(x, y, r, entry, exit, true);
    }
    path.closePath();
  };
  outline(shape, .029);
  outline(inner, .003);
  shape.holes.push(inner);
  const geometry = new T.ExtrudeGeometry(shape, { depth: .087, curveSegments: 24, bevelThickness: .004, bevelSize: .004, bevelSegments: 2 });
  mesh(group, geometry, beltRubber, [0,0,-.022]);
  const profile = inner.getPoints(20).map(({ x,y }) => [x,y,0]);
  for (const z of [-.004,.015,.034,.053]) {
    pipe(group, black, .0042, profile.map(([x,y]) => [x,y,z]));
  }
  const rotating = pulleys.map(([x,y,r]) => {
    const pulley = new T.Group();
    pulley.position.set(x,y,0);
    group.add(pulley);
    disk(pulley, alloy, r,.08, [0,0,.018]);
    disk(pulley, steel, r * .88,.014, [0,0,.063]);
    ring(pulley, alloy, r * .68,.009, [0,0,.072]);
    disk(pulley, alloy, r * .49,.016, [0,0,.074]);
    disk(pulley, brass, r * .23,.024, [0,0,.089], 6);
    boltCircle(pulley, r * .53,.076, 4);
    return [pulley, r];
  });
  const track = new T.Path();
  outline(track, .018);
  const stamps = Array.from({ length: 3 }, () => box(group, steel, [.021,.004,.002], [0,0,.066]));
  const speed = .39;
  const length = track.getLength();
  return time => {
    for (const [pulley, radius] of rotating) pulley.rotation.z = -time * speed / radius;
    stamps.forEach((stamp, index) => {
      const progress = (time * speed / length + index * .019 + .07) % 1;
      const point = track.getPointAt(progress);
      const tangent = track.getTangentAt(progress);
      stamp.position.set(point.x,point.y,.066);
      stamp.rotation.z = Math.atan2(tangent.y,tangent.x);
    });
  };
}

function oilFilter(group) {
  const filter = new T.Group();
  filter.position.set(.22,-.04,0);
  filter.rotation.z = -.20;
  group.add(filter);
  cylinder(filter, black, .187,.39, [0,-.015,0]);
  cylinder(filter, steel, .192,.043, [0,.194,0]);
  cylinder(filter, alloy, .139,.018, [0,.223,0]);
  cylinder(filter, rubber, .057,.02, [0,.231,0]);
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    cylinder(filter, black, .018,.009, [.106 * Math.cos(angle),.234,.106 * Math.sin(angle)], 12);
  }
  const seal = ring(filter, rubber, .157,.011, [0,.219,0]);
  seal.rotation.x = Math.PI / 2;
  cylinder(filter, yellow, .188,.074, [0,.006,0]);
  for (let i = 0; i < 16; i++) {
    const angle = i * Math.PI / 8;
    const grip = box(filter, alloy, [.031,.056,.012], [.186 * Math.sin(angle),-.175,.186 * Math.cos(angle)]);
    grip.rotation.y = angle;
  }

  const oil = new T.MeshPhysicalMaterial({ color: 0xe29722, roughness: .23, clearcoat: .65 });
  const bottle = new T.Group();
  bottle.position.set(-.35,.40,0);
  group.add(bottle);
  box(bottle, alloy, [.23,.23,.16], [-.105,.038,0]);
  box(bottle, yellow, [.113,.117,.012], [-.113,.03,.084]);
  cylinder(bottle, steel, .05,.084, [.031,-.006,0], 24).rotation.z = Math.PI / 2;
  const spout = new T.Vector3(.08,-.006,0);
  const start = new T.Vector3();
  const end = new T.Vector3(-.26,.105,0);
  const stream = cylinder(group, oil, .012, 1, [0,0,0], 16);
  const up = new T.Vector3(0,1,0);
  const vertical = new T.Vector3(0,0,1);
  const direction = new T.Vector3();
  cylinder(group, glass, .14,.29, [-.26,-.062,0], 40).renderOrder = 2;
  cylinder(group, alloy, .141,.024, [-.26,-.218,0], 40);
  ring(group, steel, .133,.011, [-.26,.081,0]).rotation.x = Math.PI / 2;
  const level = cylinder(group, oil, .128,.252, [-.26,-.08,0], 40);
  return time => {
    const phase = time % 5.8;
    const tilt = T.MathUtils.smoothstep(phase, .15,.95) * (1 - T.MathUtils.smoothstep(phase, 3.7,4.5));
    bottle.rotation.z = -.96 * tilt;
    start.copy(spout).applyAxisAngle(vertical, bottle.rotation.z).add(bottle.position);
    direction.subVectors(start,end);
    stream.visible = phase > .8 && phase < 4.02;
    stream.position.copy(start).lerp(end,.5);
    stream.scale.y = direction.length();
    stream.quaternion.setFromUnitVectors(up,direction.normalize());
    const fill = .09 + .88 * T.MathUtils.smoothstep(phase,.85,4.04)
      * (1 - T.MathUtils.smoothstep(phase,5.02,5.79));
    level.scale.y = fill;
    level.position.y = -.205 + .126 * fill;
  };
}


function wipers(group) {
  const shape = new T.Shape();
  shape.moveTo(-.53,-.28);
  shape.quadraticCurveTo(-.51,-.05,-.39,.28);
  shape.quadraticCurveTo(0,.32,.39,.28);
  shape.quadraticCurveTo(.51,-.05,.53,-.28);
  shape.quadraticCurveTo(0,-.32,-.53,-.28);
  const pane = new T.ExtrudeGeometry(shape, { depth: .016, bevelEnabled: false });
  mesh(group, pane, glass, [0,0,-.033]);
  pipe(group, alloy, .009, shape.getPoints(14).map(point => [point.x,point.y,-.01]));
  const arms = [[-.39,-.248,.46], [.075,-.237,.40]].map(([x,y,length]) => {
    const pivot = new T.Group();
    pivot.position.set(x,y,.026);
    group.add(pivot);
    disk(group, steel, .023,.027, [x,y,.005], 20);
    pipe(pivot, steel, .012, [[0,0,0],[.11,.02,.005],[length * .62,.074,.014]]);
    pipe(pivot, black, .016, [[length * .30,.066,0],[length * .62,.078,.009],[length * .93,.092,0]]);
    pipe(pivot, rubber, .009, [[length * .30,.057,-.008],[length * .62,.069,-.008],[length * .93,.083,-.008]]);
    return pivot;
  });
  return time => {
    const phase = Math.min(time % 2.65 / 1.8, 1);
    const sweep = .5 - .5 * Math.cos(phase * Math.PI * 2);
    arms[0].rotation.z = 1.22 * sweep;
    arms[1].rotation.z = 1.02 * sweep;
  };
}

function exhaust(group) {
  pipe(group, steel, .052, [[-.78,.075,0],[-.63,.075,0],[-.52,0,0],[.14,0,0],[.42,0,0],[.55,.072,0],[.73,.072,0]]);
  for (const [x,r,length,material] of [[-.36,.113,.25,brass],[.225,.154,.38,alloy]]) {
    const body = cylinder(group, material, r,length, [x,0,0]);
    body.rotation.z = Math.PI / 2;
    for (const side of [-1,1]) {
      ring(group, steel, r * .99,.013, [x + side * length / 2,0,0]).rotation.y = Math.PI / 2;
    }
  }
  const outlet = disk(group, black, .042,.01, [.737,.072,0]);
  outlet.rotation.y = Math.PI / 2;
  ring(group, steel, .049,.01, [.741,.072,0]).rotation.y = Math.PI / 2;
  return time => {
    group.position.y = Math.sin(time * 35) * .0035;
    group.rotation.x = Math.sin(time * 39) * .009;
    group.rotation.z = Math.sin(time * 33) * .005;
  };
}

function spark(group) {
  const sparkLight = new T.MeshBasicMaterial({ color: 0xb1eaff });
  const arcs = [];
  for (const side of [-1,1]) {
    const plug = new T.Group();
    plug.position.set(.12 * side,.02,-side * .03);
    plug.rotation.z = -side * .23;
    group.add(plug);
    cylinder(plug, ceramic, .06,.255, [0,.09,0], 24);
    for (let i = 0; i < 5; i++) {
      cylinder(plug, ceramic, .069,.014, [0,.02 + i * .037,0], 24);
    }
    cylinder(plug, steel, .092,.065, [0,-.064,0], 6);
    cylinder(plug, alloy, .061,.13, [0,-.157,0], 24);
    for (let i = 0; i < 7; i++) {
      cylinder(plug, steel, .069,.007, [0,-.103 - i * .018,0], 24);
    }
    cylinder(plug, brass, .023,.03, [0,-.235,0], 16);
    box(plug, steel, [.012,.041,.038], [.038,-.245,0]);
    const arc = pipe(plug, sparkLight, .0045, [[.017,-.248,0],[.023,-.252,.006],[.025,-.244,-.004],[.032,-.25,0]]);
    arcs.push(arc);
    cylinder(plug, black, .07,.064, [0,.22,0], 24);
    pipe(plug, red, .021, [[0,.25,0],[0,.324,-.024],[side * .06,.37,-.10],[side * .11,.35,-.2]]);
  }
  return time => {
    arcs.forEach((arc, index) => {
      arc.visible = (time + index * .51) % 1.18 < .14;
    });
  };
}

function wheel(group) {
  ring(group, rubber, .284,.075, [0,0,-.065]);
  ring(group, black, .302,.046, [0,0,.024]);
  ring(group, steel, .239,.019, [0,0,.04]);
  disk(group, alloy, .234,.105, [0,0,-.065]);
  for (let i = 0; i < 10; i++) {
    const angle = i * Math.PI / 5;
    const spoke = box(group, steel, [.031,.166,.046], [-.141 * Math.sin(angle),.141 * Math.cos(angle),.032]);
    spoke.rotation.z = angle;
  }
  disk(group, alloy, .085,.033, [0,0,.054]);
  boltCircle(group, .053,.075, 5);
  for (let i = 0; i < 28; i++) {
    const angle = i * Math.PI / 14;
    const tread = box(group, black, [.02,.014,.095], [-.347 * Math.sin(angle),.347 * Math.cos(angle),-.077]);
    tread.rotation.z = angle;
  }
}

function axle(group) {
  const shaft = cylinder(group, steel, .067, 1.83, [0,0,0]);
  shaft.rotation.z = Math.PI / 2;
  const differential = mesh(group, new T.SphereGeometry(.225, 32, 18), alloy, [0,0,0]);
  differential.scale.set(1,.76,.86);
  disk(group, steel, .137,.071, [0,0,-.17]);
  boltCircle(group, .101,-.209, 6);
  const wheels = [];
  for (const side of [-1,1]) {
    const hub = new T.Group();
    hub.position.x = side * 1.05;
    group.add(hub);
    const tire = new T.Group();
    tire.rotation.y = side * Math.PI / 2;
    hub.add(tire);
    wheels.push({ hub, tire, side });
    wheel(tire);
    for (const offset of [.35,.75]) {
      for (let i = 0; i < 5; i++) {
        const boot = ring(group, rubber, .10 - i * .006,.018, [side * (offset + i * .025),0,0]);
        boot.rotation.y = Math.PI / 2;
      }
    }
  }
  return time => {
    const phase = time % 5.3;
    const centered = T.MathUtils.smoothstep(phase,.38,1.85)
      * (1 - T.MathUtils.smoothstep(phase,4.25,5.3));
    for (const { hub, tire, side } of wheels) {
      hub.rotation.y = side * .23 * (1 - centered);
      tire.rotation.z = side * time * 1.45;
    }
  };
}

function injection(group) {
  box(group, alloy, [.77,.072,.105], [0,.14,0]);
  const sprays = [];
  for (let i = 0; i < 4; i++) {
    const x = -.28 + i * .186;
    cylinder(group, black, .046,.228, [x,-.007,0], 24);
    cylinder(group, steel, .04,.057, [x,.084,0], 24);
    cylinder(group, steel, .03,.07, [x,-.127,0], 24);
    cylinder(group, brass, .021,.039, [x,-.18,0], 18);
    box(group, yellow, [.057,.044,.061], [x,.018,.045]);
    const spray = new T.Group();
    spray.position.set(x,-.20,0);
    group.add(spray);
    for (const side of [-1,0,1]) {
      pipe(spray, amber, .0035, [[0,-.012,0],[side * .018,-.065,0],[side * .035,-.12,.004]]);
    }
    sprays.push(spray);
  }
  disk(group, steel, .042,.024, [.383,.14,0], 6).rotation.y = Math.PI / 2;
  return time => {
    sprays.forEach((spray,i) => {
      const phase = (time + (3 - i) * .36) % 1.44;
      spray.visible = phase < .28;
      spray.scale.setScalar(.18 + .82 * Math.min(1,phase / .19));
    });
  };
}

function compressor(group) {
  disk(group, alloy, .215,.26, [0,0,-.055]);
  for (const z of [-.159,-.111,-.063,-.015,.028]) ring(group, steel, .203,.014, [0,0,z]);
  disk(group, steel, .178,.024, [0,0,.09]);
  const pulley = new T.Group();
  group.add(pulley);
  disk(pulley, black, .152,.082, [0,0,.143]);
  for (const z of [.117,.136,.155,.174]) ring(pulley, rubber, .15,.008, [0,0,z]);
  disk(pulley, steel, .09,.02, [0,0,.194]);
  boltCircle(pulley, .058,.207, 3);
  for (const x of [-.1,.1]) {
    cylinder(group, steel, .055,.086, [x,.208,-.08], 6);
    cylinder(group, black, .026,.012, [x,.256,-.08], 24);
  }
  const pulse = new T.MeshBasicMaterial({ color: 0x7fdbff, transparent: true, opacity: 0 });
  for (const x of [-.1,.1]) {
    ring(group, pulse, .034,.006, [x,.265,-.08]).rotation.x = Math.PI / 2;
  }
  return time => {
    pulley.rotation.z = -time * 3.8;
    pulse.opacity = .16 + .68 * Math.pow(.5 + .5 * Math.sin(time * 7.5), 2);
  };
}

function headlight(group, led, glow) {
  const shape = new T.Shape();
  shape.moveTo(-.41,-.054);
  shape.quadraticCurveTo(-.43,.029,-.33,.073);
  shape.quadraticCurveTo(-.06,.21,.35,.143);
  shape.quadraticCurveTo(.46,.103,.33,.021);
  shape.lineTo(-.36,-.085);
  shape.closePath();
  mesh(group, new T.ExtrudeGeometry(shape, { depth: .15, bevelSize: .019, bevelThickness: .019, bevelSegments: 3 }), black, [0,0,-.14]);
  pipe(group, led, .014, [[-.365,.008,.035],[-.28,.075,.042],[-.04,.136,.042],[.25,.133,.042],[.34,.112,.033]]);
  for (const [x,y] of [[-.18,.025],[.015,.049],[.206,.073]]) {
    disk(group, alloy, .062,.036, [x,y,.037]);
    ring(group, steel, .042,.011, [x,y,.061]);
    disk(group, led, .033,.016, [x,y,.064]);
    const halo = new T.Sprite(glow);
    halo.position.set(x,y,.081);
    halo.scale.setScalar(.24);
    group.add(halo);
  }
}

function headlights(group) {
  const led = new T.MeshStandardMaterial({ color: 0x40536b, emissive: 0xc6e5ff, roughness: .24 });
  const pixels = new Uint8Array(32 * 32 * 4);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const falloff = Math.max(0, 1 - Math.hypot(x - 15.5,y - 15.5) / 15.5);
      pixels.set([255,255,255,Math.round(falloff ** 2 * 255)], (y * 32 + x) * 4);
    }
  }
  const map = new T.DataTexture(pixels,32,32);
  map.magFilter = T.LinearFilter;
  map.needsUpdate = true;
  const glow = new T.SpriteMaterial({ map, color: 0x8bcbff, blending: T.AdditiveBlending, depthWrite: false, opacity: .55 });
  for (const side of [-1,1]) {
    const lamp = new T.Group();
    lamp.position.x = side * .67;
    lamp.rotation.y = side * .36;
    lamp.scale.x = side;
    group.add(lamp);
    headlight(lamp,led,glow);
  }
  return time => {
    const phase = time % 5.2;
    const light = T.MathUtils.smoothstep(phase,.35,1.05) * (1 - T.MathUtils.smoothstep(phase,3.65,4.45));
    led.emissiveIntensity = .06 + light * 2.3;
    glow.opacity = light * .8;
  };
}

function brakes(group) {
  const rotor = new T.Group();
  group.add(rotor);
  disk(rotor, alloy, .279,.052, [0,0,-.024]);
  disk(rotor, steel, .273,.019, [0,0,.016]);
  disk(rotor, alloy, .119,.036, [0,0,.039]);
  ring(rotor, steel, .259,.006, [0,0,.027]);
  boltCircle(rotor, .077,.065, 5);
  for (let i = 0; i < 20; i++) {
    const angle = i * Math.PI / 10;
    for (const radius of [.188,.232]) {
      const turn = angle + radius * 2;
      disk(rotor, black, .009,.003, [radius * Math.cos(turn),radius * Math.sin(turn),.027], 10);
    }
  }
  const caliper = box(group, red, [.161,.245,.139], [.245,.055,.005]);
  caliper.rotation.z = .24;
  box(group, red, [.15,.093,.15], [.238,.017,.025]).rotation.z = .24;
  const pad = box(group, black, [.064,.183,.021], [.188,.042,.115]);
  pad.rotation.z = .24;
  return time => {
    const phase = time % 4.8;
    const grip = T.MathUtils.smoothstep(phase,.9,1.8) * (1 - T.MathUtils.smoothstep(phase,2.8,3.5));
    const roll = 1.6 * T.MathUtils.smoothstep(phase,0,1.85)
      + (Math.PI * 2 - 1.6) * T.MathUtils.smoothstep(phase,2.8,4.8);
    rotor.rotation.z = -roll;
    pad.position.z = .115 - .076 * grip;
  };
}


function suspension(group) {
  cylinder(group, alloy, .078,.38, [0,-.19,0], 36);
  const top = new T.Group();
  group.add(top);
  cylinder(top, steel, .038,.51, [0,.13,0], 24);
  cylinder(top, black, .117,.036, [0,.343,0], 36);
  cylinder(group, steel, .119,.034, [0,-.235,0], 36);
  cylinder(group, alloy, .096,.046, [0,-.197,0], 36);
  const points = [];
  for (let i = 0; i <= 144; i++) {
    const angle = i * Math.PI / 12;
    points.push(new T.Vector3(Math.cos(angle) * .103, i * .00366, Math.sin(angle) * .103));
  }
  const spring = new T.TubeGeometry(new T.CatmullRomCurve3(points), 144,.017,8);
  const coil = mesh(group, spring, red, [0,-.205,0]);
  ring(group, alloy, .069,.022, [0,-.381,0]);
  ring(group, steel, .029,.013, [0,-.381,0]);
  group.rotation.z = -.22;
  return time => {
    const phase = time % 3.8;
    const compression = T.MathUtils.smoothstep(phase,.3,1.04) * (1 - T.MathUtils.smoothstep(phase,1.12,1.95));
    const rebound = T.MathUtils.smoothstep(phase,1.55,1.95) * (1 - T.MathUtils.smoothstep(phase,1.95,2.7));
    const travel = .148 * compression - .030 * rebound;
    coil.scale.y = 1 - travel / .527;
    top.position.y = -travel;
  };
}

const builders = {
  battery, belt, oil: oilFilter, wipers, exhaust, spark, alignment: axle, injection,
  ac: compressor, lights: headlights, brakes, suspension, 'moto-battery': battery
};

export function createPart(service) {
  const group = new T.Group();
  const animate = builders[service](group);
  const centered = new T.Group();
  const bounds = new T.Box3().setFromObject(group, true);
  centered.position.sub(bounds.getCenter(new T.Vector3()));
  centered.add(group);
  const node = new T.Group();
  node.add(centered);
  const { x,y,z } = bounds.getSize(new T.Vector3());
  node.scale.setScalar(1 / Math.max(x,y,z));
  animate?.(0);
  return { node, animate };
}
