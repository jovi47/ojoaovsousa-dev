import * as T from '../../vendor/three.module.js';
import { GLTFLoader } from '../../vendor/GLTFLoader.js';
import { createPart } from './vehicle-parts.js';

const vehicles = {
  coupe: {
    file: 'coupe.glb',
    overview: { point: [0,.24,0], offset: [1.83,.88,2.52] },
    hood: { node: 'BodyHood', angle: -1.14 },
    engine: { node: 'IllustrativeEngine', reveal: [0,.10,0], offset: [-.10,.23,.16] },
    xrayMaterial: 'Paint 1 Toro',
    materials: { Material: { color: 0x232d3c, metalness: .15, roughness: .34 } },
    wheels: {
      front: { node: 'WheelFrontL', offset: [.35,.04,-.10] },
      rear: { node: 'WheelRearL', offset: [.35,.04,-.10] }
    },
    battery: [.255,.235,.66],
    services: {
      battery: { point: [.255,.255,.66], size: .21, view: [.6,.72,1], engine: true },
      belt: { point: [0,.24,.778], size: .33, view: [.41,.37,1], engine: true },
      oil: { point: [-.165,.225,.68], size: .19, view: [-.71,.74,1], engine: true },
      wipers: { point: [.014,.472,.233], size: .67, view: [.33,1,1], rotation: [-.85,0,0] },
      exhaust: { point: [-.115,.095,-.29], size: 1.19, view: [-1,.36,-.62], framing: 2.4, rotation: [0,Math.PI / 2,0] },
      spark: { point: [.105,.295,.64], size: .24, view: [.63,.66,1], engine: true },
      alignment: { point: [0,.15,-.545], size: .95, view: [.25,.68,-1], framing: 2.37 },
      injection: { point: [-.09,.31,.60], size: .33, view: [-.45,.65,1], engine: true },
      ac: { point: [.21,.19,.78], size: .23, view: [.65,.35,1], engine: true },
      lights: { point: [.008,.259,.814], size: .765, view: [.21,.40,1], framing: 2.43 },
      brakes: { point: [.345,.155,.592], size: .257, view: [1,.26,.55], rotation: [0,Math.PI / 2,0], wheel: 'front' },
      suspension: { point: [.323,.211,-.544], size: .38, view: [1,.21,-.56], rotation: [0,1.75,0], wheel: 'rear' }
    }
  },
  motorcycle: {
    file: 'moto.glb',
    overview: { point: [0,.49,0], offset: [-2.03,.96,2.43] },
    material: { color: 0x535a69, metalness: .17, roughness: .41, clearcoat: .28, side: T.DoubleSide },
    services: {
      'moto-battery': { point: [.16,.58,.08], size: .27, view: [1,.5,.64], rotation: [0,.85,0] }
    }
  }
};
const loader = new GLTFLoader();
const hiddenSurface = new T.MeshBasicMaterial({ visible: false });

function addBox(parent, color, size, location, metalness = .3) {
  const mesh = new T.Mesh(new T.BoxGeometry(...size), new T.MeshStandardMaterial({ color, metalness, roughness: .5 }));
  mesh.position.set(...location);
  parent.add(mesh);
  return mesh;
}

function illustrativeBattery(parent, location) {
  const box = new T.Group();
  box.position.set(...location);
  addBox(box, 0x22252b, [.123,.068,.12], [0,0,0]);
  addBox(box, 0xb98e31, [.115,.012,.112], [0,.038,0]);
  addBox(box, 0xbb3827, [.024,.017,.025], [-.033,.05,.029]);
  addBox(box, 0xbcc1cb, [.019,.017,.022], [.031,.05,-.033]);
  parent.add(box);
}

function prepareModel(model, profile) {
  const bounds = new T.Box3().setFromObject(model);
  model.position.y = -bounds.min.y;
  const finish = profile.material ? new T.MeshPhysicalMaterial(profile.material) : null;
  const panels = [];
  const traced = [];
  const outline = new T.LineBasicMaterial({ color: 0xd2d9e4, transparent: true, opacity: .13, depthWrite: false });
  const ghostPaint = new T.MeshBasicMaterial({ color: 0xb5bbc8, transparent: true, opacity: .035, depthWrite: false });
  const hood = profile.hood && model.getObjectByName(profile.hood.node);
  const materials = new Set();
  model.traverse(part => {
    if (!part.isMesh) return;
    if (!part.geometry.attributes.normal) part.geometry.computeVertexNormals();
    if (finish) part.material = finish;
    const material = part.material;
    const settings = profile.materials?.[material.name];
    if (settings && !materials.has(material)) {
      material.color.setHex(settings.color);
      material.metalness = settings.metalness;
      material.roughness = settings.roughness;
      materials.add(material);
    }
    const solid = part.material;
    const painted = solid.name === profile.xrayMaterial;
    const wheel = /^(Wheel(Front|Rear)L_)?Object_28$/.test(part.name);
    let trace;
    if (painted || wheel || profile.material) {
      trace = new T.LineSegments(new T.EdgesGeometry(part.geometry, wheel ? 44 : 34), outline);
      trace.visible = false;
      part.add(trace);
    }
    traced.push({ part, solid, trace, painted });
    if (painted && part !== hood) {
      const xray = solid.clone();
      xray.transparent = true;
      xray.opacity = .25;
      xray.depthWrite = false;
      panels.push({ part, solid, xray });
    }
  });
  const wheels = Object.entries(profile.wheels || {}).flatMap(([key, spec]) => {
    const node = model.getObjectByName(spec.node);
    if (!node) return [];
    const closed = node.position.clone();
    return [{ key, node, closed, exploded: closed.clone().add(new T.Vector3(...spec.offset)) }];
  });
  const engine = profile.engine && model.getObjectByName(profile.engine.node);
  const engineRest = engine?.position.clone();
  const engineRevealed = engineRest?.clone().add(new T.Vector3(...profile.engine.reveal));
  const engineExploded = engineRest?.clone().add(new T.Vector3(...profile.engine.offset));
  const battery = profile.battery ? new T.Group() : null;
  if (battery) illustrativeBattery(battery, profile.battery);
  return { hood, wheels, panels, traced, ghostPaint, battery, engine, engineRest, engineRevealed, engineExploded };
}

function softShadow(width, length, height, opacity) {
  const source = document.createElement('canvas');
  source.width = source.height = 64;
  const paint = source.getContext('2d');
  const shade = paint.createRadialGradient(32, 32, 4, 32, 32, 31);
  shade.addColorStop(0, 'rgba(0,0,0,0.9)');
  shade.addColorStop(.63, 'rgba(0,0,0,0.48)');
  shade.addColorStop(1, 'rgba(0,0,0,0)');
  paint.fillStyle = shade;
  paint.fillRect(0, 0, 64, 64);
  const shadow = new T.Mesh(new T.PlaneGeometry(width, length),
    new T.MeshBasicMaterial({ map: new T.CanvasTexture(source), transparent: true, depthWrite: false, opacity }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = height;
  return shadow;
}

export function createVehicleStage(stage, rotationButton) {
  const canvas = stage.querySelector('canvas');
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.03;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(34, 1, .025, 20);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fill = new T.HemisphereLight(0xf5f7ff, 0x68616b, 1.65);
  fill.layers.enable(1);
  scene.add(fill);
  for (const [color, intensity, position] of [
    [0xfff8f1, 3.25, [-3, 6, 4]], [0xd6e4ff, 2.8, [2, 2, -5]], [0xf1f4ff, 1.8, [3, 3, 2]]
  ]) {
    const light = new T.DirectionalLight(color, intensity);
    light.position.set(...position);
    light.layers.enable(1);
    scene.add(light);
  }

  const platform = new T.Mesh(new T.CylinderGeometry(1.12, 1.14, .046, 64),
    new T.MeshStandardMaterial({ color: 0x28292c, metalness: .24, roughness: .53 }));
  platform.position.y = -.029;
  scene.add(platform);
  const rim = new T.Mesh(new T.TorusGeometry(1.116, .0035, 8, 72), new T.MeshBasicMaterial({ color: 0xc69836 }));
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = -.007;
  scene.add(rim);
  const holder = new T.Group();
  scene.add(holder);
  const floorShadow = softShadow(3.3, 2.8, -.059, .72);
  const contactShadow = softShadow(1.23, 2.19, -.003, .94);
  scene.add(floorShadow);
  holder.add(contactShadow);
  const detail = new T.Group();
  holder.add(detail);
  const components = new Map();
  let activePart, partTime = 0;

  let request = 0, last = 0, vehicle = '', desiredVehicle = '', model, parts;
  let visible = false, lost = false, paused = reduced.matches, turn = -.18, focus = null, mode = '';
  const target = new T.Vector3(0,.35,0), offset = new T.Vector3(-2.32,1.25,2.68);
  const nextTarget = new T.Vector3(), nextOffset = new T.Vector3();
  const orbit = new T.Spherical(), nextOrbit = new T.Spherical();
  const loaded = new Map();
  const prepared = new WeakMap();
  const reflect = new T.PMREMGenerator(renderer);
  const lighting = new T.Scene();
  lighting.background = new T.Color(0x222026);
  for (const [position, size, color] of [
    [[-2.7,2.8,1.8], [2.4,.55,.1], 0xf1ede6],
    [[1.5,3.4,-1], [2.8,.5,.1], 0xb8c6f0],
    [[2.4,1.7,1.4], [1.8,.26,.1], 0xe9edf9]
  ]) {
    const geometry = new T.BoxGeometry(...size);
    const material = new T.MeshBasicMaterial({ color });
    const panel = new T.Mesh(geometry, material);
    panel.position.set(...position);
    lighting.add(panel);
  }
  scene.environment = reflect.fromScene(lighting, .07).texture;
  scene.environmentIntensity = .75;
  lighting.traverse(item => {
    if (!item.isMesh) return;
    item.geometry.dispose();
    item.material.dispose();
  });
  reflect.dispose();

  function invalidate() {
    if (!request && visible && !document.hidden && !lost && model) request = requestAnimationFrame(draw);
  }

  function draw(now) {
    request = 0;
    const seconds = Math.min((now - last) / 1000, .045);
    last = now;
    const animating = activePart?.animate && !paused && !reduced.matches;
    if (animating) {
      partTime += seconds;
      activePart.animate(partTime);
    }
    const spinning = !focus && !mode && !paused && !reduced.matches;
    const easing = reduced.matches ? 1 : 1 - Math.exp(-6.5 * seconds);
    const frame = Math.max(1, 1.25 / camera.aspect);
    if (focus) {
      nextTarget.set(...focus.point);
      const distance = focus.size * (focus.framing || 2.77);
      nextOffset.set(...focus.view).setLength(distance * Math.max(1, 1.05 / camera.aspect));
    } else {
      if (spinning) turn = (turn + .27 * seconds) % (Math.PI * 2);
      const overview = vehicles[vehicle].overview;
      nextTarget.set(...overview.point);
      nextOffset.set(...overview.offset).multiplyScalar(frame * (mode === 'exploded' ? 1.19 : 1));
    }
    const desiredTurn = focus || mode ? 0 : turn;
    const yaw = Math.atan2(Math.sin(desiredTurn - holder.rotation.y), Math.cos(desiredTurn - holder.rotation.y));
    holder.rotation.y += yaw * easing;
    let partMotion = 0;
    if (parts.hood) {
      const hoodAngle = focus?.engine || mode ? vehicles[vehicle].hood.angle : 0;
      const hoodDelta = hoodAngle - parts.hood.rotation.x;
      parts.hood.rotation.x += hoodDelta * easing;
      partMotion = Math.abs(hoodDelta);
    }
    for (const { key, node, closed, exploded } of parts.wheels) {
      const destination = focus?.wheel === key || mode === 'exploded' ? exploded : closed;
      partMotion = Math.max(partMotion, node.position.distanceTo(destination));
      node.position.lerp(destination, easing);
    }
    if (parts.engine) {
      const destination = mode === 'exploded' ? parts.engineExploded
        : focus?.engine || mode === 'xray' ? parts.engineRevealed : parts.engineRest;
      partMotion = Math.max(partMotion, parts.engine.position.distanceTo(destination));
      parts.engine.position.lerp(destination, easing);
    }
    if (parts.battery) {
      const lift = (mode === 'exploded' ? .16 : 0) - parts.battery.position.y;
      parts.battery.position.y += lift * easing;
      partMotion = Math.max(partMotion, Math.abs(lift));
      parts.battery.visible = mode === 'exploded';
    }
    for (const { part, solid, trace, painted } of parts.traced) {
      part.visible = !focus || Boolean(trace);
      if (trace) trace.visible = Boolean(focus);
      part.material = focus && painted ? parts.ghostPaint : solid;
      if (focus && !painted && trace) part.material = hiddenSurface;
    }
    if (mode === 'xray') {
      for (const { part, xray } of parts.panels) part.material = xray;
    }
    platform.visible = rim.visible = floorShadow.visible = contactShadow.visible = !focus;
    target.lerp(nextTarget, easing);
    orbit.setFromVector3(offset);
    nextOrbit.setFromVector3(nextOffset);
    const angle = nextOrbit.theta - orbit.theta;
    orbit.theta += Math.atan2(Math.sin(angle), Math.cos(angle)) * easing;
    orbit.phi = T.MathUtils.lerp(orbit.phi, nextOrbit.phi, easing);
    orbit.radius = T.MathUtils.lerp(orbit.radius, nextOrbit.radius, easing);
    offset.setFromSpherical(orbit);
    camera.position.copy(target).add(offset);
    camera.lookAt(target);
    renderer.render(scene, camera);
    if (focus) {
      // Draw the component in place with its own depth, so the ghost shell never masks it.
      camera.layers.set(1);
      renderer.autoClear = false;
      renderer.clearDepth();
      renderer.render(scene, camera);
      renderer.autoClear = true;
      camera.layers.set(0);
    }
    if (spinning || animating || target.distanceToSquared(nextTarget) + offset.distanceToSquared(nextOffset) > .00003
      || partMotion > .005 || Math.abs(yaw) > .005) invalidate();
  }

  function resize() {
    if (!stage.clientHeight) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.3));
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    camera.aspect = stage.clientWidth / stage.clientHeight;
    camera.updateProjectionMatrix();
    invalidate();
  }

  function updateControls() {
    rotationButton.hidden = (focus ? !activePart?.animate : Boolean(mode)) || reduced.matches || !model || lost;
    rotationButton.textContent = focus
      ? paused ? 'Retomar animação' : 'Pausar animação'
      : paused ? 'Girar veículo' : 'Pausar rotação';
  }

  async function showVehicle(name) {
    desiredVehicle = name;
    delete stage.dataset.ready;
    rotationButton.hidden = true;
    if (!loaded.has(name)) {
      const load = loader.loadAsync(new URL('assets/' + vehicles[name].file, import.meta.url).href);
      loaded.set(name, load);
      load.catch(() => loaded.delete(name));
    }
    const { scene: vehicleScene } = await loaded.get(name);
    if (desiredVehicle !== name) return;
    if (model) holder.remove(model);
    vehicle = name;
    model = vehicleScene;
    if (!prepared.has(model)) prepared.set(model, prepareModel(model, vehicles[name]));
    if (parts?.battery) holder.remove(parts.battery);
    parts = prepared.get(model);
    if (parts.battery) holder.add(parts.battery);
    holder.add(model);
    stage.dataset.ready = '';
    updateControls();
    resize();
  }

  function showService(service) {
    const next = vehicles[desiredVehicle]?.services[service] || null;
    if (next && next !== focus) {
      if (!components.has(service)) {
        const component = createPart(service);
        component.node.traverse(item => item.layers.set(1));
        components.set(service, component);
      }
      detail.clear();
      activePart = components.get(service);
      activePart.animate?.(0);
      partTime = 0;
      detail.add(activePart.node);
      detail.position.set(...next.point);
      detail.rotation.set(...(next.rotation || [0,0,0]));
      detail.scale.setScalar(next.size);
    }
    if (!next) activePart = undefined;
    focus = next;
    updateControls();
    invalidate();
  }
  function showMode(value) {
    mode = value;
    updateControls();
    invalidate();
  }

  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) invalidate();
    else { cancelAnimationFrame(request); request = 0; }
  });
  visibility.observe(stage);
  new ResizeObserver(resize).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(request); request = 0; }
    else invalidate();
  });
  reduced.addEventListener('change', () => {
    paused = reduced.matches;
    if (reduced.matches) activePart?.animate?.(0);
    updateControls();
    invalidate();
  });
  rotationButton.addEventListener('click', () => {
    paused = !paused;
    updateControls();
    invalidate();
  });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    lost = true;
    delete stage.dataset.ready;
    updateControls();
  });
  canvas.addEventListener('webglcontextrestored', () => {
    lost = false;
    if (model && vehicle === desiredVehicle) stage.dataset.ready = '';
    updateControls();
    invalidate();
  });
  return { showVehicle, showService, showMode };
}
