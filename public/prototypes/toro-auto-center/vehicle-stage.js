import * as T from '../../vendor/three.module.js';
import { GLTFLoader } from '../../vendor/GLTFLoader.js';

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
      battery: { point: [.255,.28,.66], engine: true, liftBattery: true },
      belt: { point: [0,.26,.77], engine: true },
      oil: { point: [-.16,.24,.71], engine: true },
      wipers: { point: [.04,.42,.32] },
      exhaust: { point: [-.29,.14,-.91], offset: [1.34,.43,-1.67] },
      spark: { point: [.09,.29,.64], engine: true },
      alignment: { point: [.35,.16,.61], wheel: 'front' },
      injection: { point: [-.11,.29,.64], engine: true },
      ac: { point: [.13,.22,.82], engine: true },
      lights: { point: [.30,.27,.85] },
      brakes: { point: [.36,.15,.61], wheel: 'front' },
      suspension: { point: [.33,.18,-.55], wheel: 'rear', offset: [1.8,.77,-1.2] }
    }
  },
  motorcycle: {
    file: 'moto.glb',
    overview: { point: [0,.49,0], offset: [-2.03,.96,2.43] },
    material: { color: 0x535a69, metalness: .17, roughness: .41, clearcoat: .28, side: T.DoubleSide },
    services: {
      'moto-battery': { point: [.2,.66,.14], offset: [1.1,.63,1.45] }
    }
  }
};
const loader = new GLTFLoader();

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
    if (part !== hood && part.material.name === profile.xrayMaterial) {
      const solid = part.material;
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
  return { hood, wheels, panels, battery, engine, engineRest, engineRevealed, engineExploded };
}

export function createVehicleStage(stage, rotationButton) {
  const canvas = stage.querySelector('canvas');
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.03;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(34, 1, .025, 20);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  scene.add(new T.HemisphereLight(0xfff4dd, 0x66616d, 1.55));
  for (const [color, intensity, position] of [
    [0xfff0ce, 3.4, [-3, 6, 4]], [0xd6dfff, 2.8, [2, 2, -5]], [0xffd34d, 1.6, [3, 3, 2]]
  ]) {
    const light = new T.DirectionalLight(color, intensity);
    light.position.set(...position);
    scene.add(light);
  }

  const platform = new T.Mesh(new T.CylinderGeometry(1.12, 1.16, .08, 64),
    new T.MeshStandardMaterial({ color: 0x232124, metalness: .2, roughness: .5 }));
  platform.position.y = -.046;
  scene.add(platform);
  const rim = new T.Mesh(new T.TorusGeometry(1.113, .007, 8, 64), new T.MeshBasicMaterial({ color: 0xdbaa3b }));
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = -.007;
  scene.add(rim);
  const holder = new T.Group();
  scene.add(holder);
  const marker = new T.Mesh(new T.SphereGeometry(.028, 16, 10),
    new T.MeshBasicMaterial({ color: 0xffd34d, depthTest: false }));
  marker.renderOrder = 10;
  holder.add(marker);

  let request = 0, last = 0, vehicle = '', desiredVehicle = '', model, parts;
  let visible = false, lost = false, paused = reduced.matches, turn = -.18, focus = null, mode = '';
  const target = new T.Vector3(0,.35,0), offset = new T.Vector3(-2.32,1.25,2.68);
  const nextTarget = new T.Vector3(), nextOffset = new T.Vector3();
  const loaded = new Map();
  const prepared = new WeakMap();
  const reflect = new T.PMREMGenerator(renderer);
  const lighting = new T.Scene();
  lighting.background = new T.Color(0x222026);
  for (const [position, size, color] of [
    [[-2.7,2.8,1.8], [2.4,.55,.1], 0xead8b2],
    [[1.5,3.4,-1], [2.8,.5,.1], 0xb8c6f0],
    [[2.4,1.7,1.4], [1.8,.26,.1], 0xffdc91]
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
    const spinning = !focus && !mode && !paused && !reduced.matches;
    const easing = reduced.matches ? 1 : 1 - Math.exp(-6.5 * seconds);
    const frame = Math.max(1, 1.25 / camera.aspect);
    if (focus) {
      nextTarget.set(...focus.point);
      nextOffset.set(...(focus.offset || (focus.engine ? [1.03,1.05,1.22] : [1.56,.58,1.15]))).multiplyScalar(frame);
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
      const lift = (focus?.liftBattery || mode === 'exploded' ? .16 : 0) - parts.battery.position.y;
      parts.battery.position.y += lift * easing;
      partMotion = Math.max(partMotion, Math.abs(lift));
      parts.battery.visible = Boolean(focus?.liftBattery) || mode === 'exploded';
    }
    for (const { part, solid, xray } of parts.panels) part.material = focus?.engine || mode === 'xray' ? xray : solid;
    target.lerp(nextTarget, easing);
    offset.lerp(nextOffset, easing);
    camera.position.copy(target).add(offset);
    camera.lookAt(target);
    marker.visible = Boolean(focus);
    if (focus) {
      marker.position.set(...focus.point);
      if (focus.liftBattery) marker.position.y += parts.battery?.position.y ?? 0;
    }
    renderer.render(scene, camera);
    if (spinning || target.distanceToSquared(nextTarget) + offset.distanceToSquared(nextOffset) > .00003
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
    rotationButton.hidden = Boolean(focus || mode) || reduced.matches || !model || lost;
    rotationButton.textContent = paused ? 'Girar veículo' : 'Pausar rotação';
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
    focus = vehicles[desiredVehicle]?.services[service] || null;
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
