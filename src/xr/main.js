import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { domistikaDialoguePairs } from '../data/domistikaDialogues.js';
import { createPortalStops, portalAt } from './portalModel.js';
import { createWrist } from '@phi369/genewrist/src/core.js';
import { createXRSurface } from '@phi369/genewrist/src/xr-surface.js';
import { mountWorldPanel } from '@phi369/genewrist/src/presentation.js';
import { createLouvreWorldAdapter } from './louvreWorldAdapter.js';
import { realmBlueprintFor } from './realmBlueprint.js';
import { mountRealmSculptures } from './realmMeshes.js';
import { waypointAt, stepWaypoint, canStepWaypoint } from './waypoints.js';
import { resolveXRTarget, isActionableTarget } from './interactionRouting.js';
import './styles.css';

const stops = createPortalStops(domistikaDialoguePairs);
const imageFiles = import.meta.glob('../assets/dialogues/*.webp', {
  eager: true, query: '?url', import: 'default',
});
const el = (id) => document.getElementById(id);
const stage = el('stage');
let renderer, camera, rig, scene, museumGroup, worldGroup;
let activeIndex = 0;
let inside = false;
let stations = [];
let portalTargets = [];
let returnTargets = [];
let returnPanel = null;
const controllerBeams = [];
let rotating = [];
let currentWaypoint = 0;
let travelSigns = [];
const sceneListeners = new Set();
let wrist, wristSurface, wristTexture, wristPanelMesh, wristLauncher, desktopPanel;
let wristOpen = false, wristCaptured = false, wristDirty = true;
let stopWristUpdates = () => {};
const keys = new Set();
const clock = new THREE.Clock();
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
const raycaster = new THREE.Raycaster();
const origin = new THREE.Vector3();
const direction = new THREE.Vector3();
const controllerQuaternion = new THREE.Quaternion();
const pointer = new THREE.Vector2();

function material(hex, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color: hex, roughness: .55, metalness });
}
function box(parent, size, position, color, metalness = 0) {
  const object = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, metalness));
  object.position.set(...position);
  parent.add(object);
  return object;
}
function plaque(parent, lines, x, y, z, width = 3.4, height = .54) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#101522'; ctx.fillRect(0, 0, 1024, 256);
  ctx.strokeStyle = '#c7a474'; ctx.lineWidth = 8; ctx.strokeRect(6, 6, 1012, 244);
  lines.forEach((line, i) => {
    ctx.fillStyle = i === 0 ? '#f3d298' : '#d9e7ed';
    ctx.font = i === 0 ? 'bold 43px Georgia' : '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String(line).slice(0, 53), 512, 87 + i * 69, 960);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
  mesh.position.set(x, y, z); parent.add(mesh);
  return mesh;
}
function picture(parent, file, x, y, z, size, role, stop) {
  const frame = box(parent, [size + .19, size + .19, .09], [x, y, z - .06], '#be9b66', .6);
  box(parent, [size + .08, size + .08, .04], [x, y, z + .01], '#151a2b');
  const image = new THREE.Mesh(new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ color: '#8792a5', side: THREE.DoubleSide }));
  image.position.set(x, y, z + .043);
  image.userData = { stopIndex: stop.index, role };
  parent.add(image);
  const url = imageFiles['../assets/dialogues/' + file];
  if (url) {
    new THREE.TextureLoader().load(url, (texture) => {
      // A user may leave the portal before its image finishes loading.
      // Never attach a late image texture to a disposed scene.
      if (parent.userData.disposed) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;
      image.material.dispose();
      image.material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    }, undefined, () => {
      if (!parent.userData.disposed) image.material.color.set('#9c5361');
    });
  } else {
    image.material.color.set('#9c5361');
  }
  return { frame, image };
}
function reportWrist(message) {
  const status = el('wrist-notice');
  if (status) status.textContent = String(message || '').slice(0, 240);
}
function notifyScene() {
  for (const listener of [...sceneListeners]) listener();
}
function toggleWrist(force = !wristOpen) {
  if (!wrist) return;
  wristOpen = Boolean(force);
  if (wristOpen) keys.clear(); // stale desktop movement must not resume after input capture
  if (wristOpen) {
    wrist.setMode('field');
    wrist.navigate('world', { remember: false });
  }
  wrist.setInputCaptured(wristOpen);
  wristPanelMesh.visible = wristOpen;
  wristLauncher.visible = !wristOpen;
  el('wrist-panel').hidden = !wristOpen;
  el('wrist-toggle').setAttribute('aria-expanded', String(wristOpen));
  el('wrist-toggle').textContent = wristOpen ? 'CLOSE GEN.E.WRIST' : 'OPEN GEN.E.WRIST / WORLD';
  wristDirty = true;
  updateTravelUi();
}
function initializeWrist() {
  // Uses a reviewed, exact Gen.E.Wrist Git commit. This is not a second local wrist implementation.
  wrist = createWrist({ worlds: [], storage: null });
  const adapter = createLouvreWorldAdapter({
    readScene: () => ({
      inside,
      index: activeIndex,
      title: portalAt(stops, activeIndex)?.title || 'Unknown artwork',
      total: stops.length,
      realm: realmBlueprintFor(portalAt(stops, activeIndex)?.id)?.name || 'Curated gallery',
    }),
    subscribeScene: (notify) => {
      sceneListeners.add(notify);
      return () => sceneListeners.delete(notify);
    },
    commands: {
      previous: () => choose(activeIndex - 1),
      next: () => choose(activeIndex + 1),
      enter: () => enter(),
      return: () => leave(),
      recenter: () => recenter(),
    },
    onCapture: (captured) => { wristCaptured = captured; updateTravelUi(); },
  });
  stopWristUpdates = wrist.subscribe(() => { wristDirty = true; });
  wrist.connectWorld(adapter); // No action grants by default. Visitors grant capabilities inside the wrist.
  wrist.setMode('field');
  wrist.navigate('world', { remember: false });
  wrist.setInputCaptured(false);
  wristSurface = createXRSurface({
    wrist,
    onExit: () => renderer.xr.getSession()?.end(),
    onRecenter: () => recenter(),
    onNotice: reportWrist,
  });
  wristTexture = new THREE.CanvasTexture(wristSurface.canvas);
  wristTexture.colorSpace = THREE.SRGBColorSpace;
  wristPanelMesh = new THREE.Mesh(new THREE.PlaneGeometry(.99, .7425),
    new THREE.MeshBasicMaterial({ map: wristTexture, depthTest: false, side: THREE.DoubleSide }));
  wristPanelMesh.position.set(.15, 1.66, -1.12);
  wristPanelMesh.renderOrder = 100;
  wristPanelMesh.visible = false;
  rig.add(wristPanelMesh);
  wristLauncher = plaque(rig, ['GEN.E.WRIST', 'WORLD CONTROLS'], .8, 1.12, -1.3, .98, .38);
  wristLauncher.renderOrder = 90;
  wristLauncher.material.depthTest = false;
  desktopPanel = mountWorldPanel({ root: el('wrist-panel'), wrist, onNotice: reportWrist });
  el('wrist-toggle').addEventListener('click', () => toggleWrist());
  window.addEventListener('pagehide', () => {
    toggleWrist(false);
    stopWristUpdates();
    desktopPanel?.dispose();
    wristSurface?.destroy();
    wristTexture?.dispose();
    wrist?.dispose();
  }, { once: true });
  renderer.xr.addEventListener('sessionend', () => toggleWrist(false));
  wristDirty = true;
}
function selectionOptions() {
  return {
    inside,
    wristOpen,
    wristCaptured,
    wristPanel: wristPanelMesh,
    wristLauncher,
    wristSurface,
    returnTargets,
    travelSigns,
    portalTargets,
  };
}
function selectXRTarget(ray) {
  const target = resolveXRTarget(ray, selectionOptions());
  switch (target.type) {
    case 'wrist-launcher':
      toggleWrist(true);
      return true;
    case 'wrist-control':
      try {
        Promise.resolve(target.target.action()).catch((error) => reportWrist(error.message));
      } catch (error) { reportWrist(error.message); }
      wristDirty = true;
      return true;
    case 'waypoint':
      return moveWaypoint(target.direction);
    case 'return':
      leave();
      return true;
    case 'painting':
      enter(target.index);
      return true;
    default:
      // Expanded wrist and input capture always block scene click-through.
      return target.type === 'blocked';
  }
}
function updateControllerFeedback() {
  if (!renderer.xr.isPresenting) return;
  for (const entry of controllerBeams) {
    if (!entry.connected) continue;
    entry.controller.updateWorldMatrix(true, false);
    origin.setFromMatrixPosition(entry.controller.matrixWorld);
    entry.controller.getWorldQuaternion(controllerQuaternion);
    direction.set(0, 0, -1).applyQuaternion(controllerQuaternion);
    raycaster.set(origin, direction);
    raycaster.far = 20;
    const target = resolveXRTarget(raycaster, selectionOptions());
    const actionable = isActionableTarget(target);
    if (actionable !== entry.actionable) {
      entry.actionable = actionable;
      entry.beam.material.color.setHex(actionable ? 0x83f8d2 : 0xf4d5a4);
    }
  }
}
function makeMuseum() {
  museumGroup = new THREE.Group();
  scene.add(museumGroup);
  box(museumGroup, [25, .18, 31], [0, -.13, -2], '#202333');
  box(museumGroup, [25, 9, .4], [0, 3.8, -10.2], '#293040');
  box(museumGroup, [.4, 9, 31], [-12.5, 3.8, -2], '#222b3c');
  box(museumGroup, [.4, 9, 31], [12.5, 3.8, -2], '#222b3c');
  box(museumGroup, [25, .18, 31], [0, 8.5, -2], '#171c2a');
  for (let i = -5; i <= 5; i++) {
    box(museumGroup, [.045, .02, 29], [i * 2.15, -.01, -2], '#b79a65');
  }
  for (let i = -7; i < 7; i++) {
    box(museumGroup, [23, .02, .04], [0, 0, i * 1.9], '#9c805b');
  }
  const stationX = [-8.55, -2.85, 2.85, 8.55];
  stops.forEach((stop, i) => {
    const station = new THREE.Group();
    station.position.set(stationX[i], 0, -9.75);
    museumGroup.add(station);
    const back = box(station, [4.4, 3.5, .2], [0, 2.25, -.13], '#121929');
    back.material.emissive = new THREE.Color('#000000');
    const left = picture(station, stop.originalFile, -.95, 2.47, .11, 1.68, 'original', stop);
    const right = picture(station, stop.inspiredFile, .95, 2.47, .11, 1.68, 'inspired', stop);
    portalTargets.push(left.image, right.image);
    plaque(station, [stop.title, 'ORIGINAL  /  INSPIRED'], 0, .69, .08, 4.16, .69);
    stations.push(back);
    box(station, [.08, 4.6, .08], [-2.4, 2.3, 0], '#ad8c62');
    box(station, [.08, 4.6, .08], [2.4, 2.3, 0], '#ad8c62');
  });
  plaque(museumGroup, ['THE SILICON LOUVRE', 'DOMISTIKA DIALOGUES  /  XR WING'], 0, 6.3, -9.87, 9, 1.15);
}
function makeRealm(stop) {
  const blueprint = realmBlueprintFor(stop.id);
  if (!blueprint) throw new Error('This curator-approved work has no reviewed XR realm');
  worldGroup = new THREE.Group();
  scene.add(worldGroup);
  scene.background = new THREE.Color(blueprint.background);
  scene.fog.color.set(blueprint.background);
  const floor = box(worldGroup, [28, .1, 58], [0, -.15, -17], '#101727');
  floor.material.metalness = .25;
  // Real scene integration of the four separate, bounded interpretations.
  rotating = mountRealmSculptures(worldGroup, blueprint).rotating;

  // Artist-created originals stay intact and separately credited from inspired works.
  picture(worldGroup, stop.originalFile, -4.8, 2.2, -7.6, 3.0, 'original', stop);
  picture(worldGroup, stop.inspiredFile, 4.8, 2.2, -7.6, 3.0, 'inspired', stop);
  plaque(worldGroup, ['ORIGINAL HUMAN DRAWING', stop.originalCredit], -4.8, .13, -7.4, 4, .68);
  plaque(worldGroup, ['SEPARATE INSPIRED RESPONSE', stop.inspiredCredit], 4.8, .13, -7.4, 4, .68);
  plaque(worldGroup, [blueprint.landmark, stop.title], 0, 6.05, -11.5, 8.7, .98);
  plaque(worldGroup, ['PROCEDURAL INTERPRETATION', 'NOT A 2D-TO-3D CONVERSION'], 0, 1.0, -13, 5.4, .8);
  // Persistent visitor-relative return panel was mounted at startup, not here.
  // A realm transition only changes its visibility in updateTravelUi().
}
function cleanupWorld() {
  if (!worldGroup) return;
  worldGroup.userData.disposed = true;
  scene.remove(worldGroup);
  worldGroup.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    const mats = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
    mats.forEach((mat) => {
      if (mat.map) mat.map.dispose();
      mat.dispose();
    });
  });
  worldGroup = null;
  rotating = [];
  scene.background = new THREE.Color('#070b19');
  scene.fog.color.set('#070b19');
}
function recenter() {
  // Recenter at the *current* approved stop. Never overwrite headset head pose.
  const waypoint = inside ? waypointAt(currentWaypoint) : waypointAt(0);
  rig.position.set(waypoint.x, 0, waypoint.z);
  rig.updateMatrixWorld(true); // make visitor-relative ray targets valid immediately after teleport
  if (!renderer.xr.isPresenting) camera.rotation.set(0, 0, 0);
}
function updateTravelUi() {
  const previous = el('previous-stop');
  const next = el('next-stop');
  const controls = el('travel-controls');
  const label = el('stop-info');
  if (!controls || !previous || !next) return;
  controls.hidden = !inside;
  el('previous').disabled = inside || wristCaptured;
  el('next').disabled = inside || wristCaptured;
  el('enter').disabled = inside || wristCaptured;
  el('return').disabled = !inside || wristCaptured;
  el('recenter').disabled = wristCaptured;
  previous.disabled = !canStepWaypoint(currentWaypoint, -1, inside, wristCaptured);
  next.disabled = !canStepWaypoint(currentWaypoint, 1, inside, wristCaptured);
  label.textContent = inside ? 'CHAMBER / ' + waypointAt(currentWaypoint).label.toUpperCase() : '';
  travelSigns.forEach((sign) => {
    sign.visible = canStepWaypoint(currentWaypoint, sign.userData.direction, inside, wristCaptured) && !wristOpen;
  });
  if (returnPanel) returnPanel.visible = inside && !wristCaptured && !wristOpen;
}
function moveWaypoint(direction) {
  if (!canStepWaypoint(currentWaypoint, direction, inside, wristCaptured)) return false;
  currentWaypoint = stepWaypoint(currentWaypoint, direction);
  recenter();
  updateTravelUi();
  return true;
}
function makeReturnPanel() {
  // Follow the *visitor rig*, not the artwork geometry, so visitors can
  // always exit from the deep sculpture chamber or inner horizon.
  returnPanel = plaque(rig, ['RETURN TO ATRIUM', 'CONTROLLER TRIGGER'], -3.15, 1.55, -3.8, 2.55, .77);
  returnPanel.userData.returnToAtrium = true;
  returnPanel.renderOrder = 91;
  returnPanel.material.depthTest = false;
  returnTargets = [returnPanel];
  returnPanel.visible = false;
}
function makeTravelSigns() {
  const previous = plaque(rig, ['PREVIOUS STOP', 'CONTROLLER TRIGGER'], -1.5, .75, -2.6, 1.85, .67);
  previous.userData.direction = -1;
  const next = plaque(rig, ['NEXT STOP', 'CONTROLLER TRIGGER'], 1.5, .75, -2.6, 1.85, .67);
  next.userData.direction = 1;
  travelSigns = [previous, next];
  updateTravelUi();
}
function updateUi() {
  const stop = portalAt(stops, activeIndex);
  if (!stop) return;
  el('portal-status').textContent = inside ? 'INSIDE ARTWORK / PROCEDURAL WORLD' : 'ATRIUM / 004 · STATION ' + (activeIndex + 1) + ' OF ' + stops.length;
  el('portal-title').textContent = stop.title;
  el('portal-credit').textContent = 'Original: ' + stop.originalCredit + '  |  Response: ' + stop.inspiredCredit;
  const blueprint = realmBlueprintFor(stop.id);
  el('portal-note').textContent = inside && blueprint
    ? blueprint.name + ': ' + blueprint.description + ' Not an extrusion of the source image.'
    : stop.note;
  el('enter').hidden = inside;
  el('return').hidden = !inside;
  el('previous').disabled = inside;
  el('next').disabled = inside;
  stations.forEach((station, i) => station.material.emissive.set(i === activeIndex ? '#655035' : '#000000'));
  updateTravelUi();
  notifyScene();
}
function choose(index) {
  if (inside || !stops.length) return;
  activeIndex = ((index % stops.length) + stops.length) % stops.length;
  updateUi();
}
function enter(index = activeIndex) {
  if (inside || !stops.length) return;
  activeIndex = index;
  currentWaypoint = 0;
  inside = true;
  museumGroup.visible = false;
  makeRealm(stops[activeIndex]);
  recenter();
  updateUi();
}
function leave() {
  if (!inside) return;
  cleanupWorld();
  currentWaypoint = 0;
  inside = false;
  museumGroup.visible = true;
  recenter();
  updateUi();
}
function controllerSelect(controller) {
  controller.updateWorldMatrix(true, false);
  origin.setFromMatrixPosition(controller.matrixWorld);
  controller.getWorldQuaternion(controllerQuaternion);
  direction.set(0, 0, -1).applyQuaternion(controllerQuaternion);
  raycaster.set(origin, direction);
  raycaster.far = 20;
  selectXRTarget(raycaster);
}
function addControllers() {
  for (let i = 0; i < 2; i++) {
    const controller = renderer.xr.getController(i);
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -12)];
    const beam = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: '#f4d5a4' }));
    controller.add(beam);
    beam.visible = false;
    const entry = { controller, beam, actionable: false, connected: false };
    controllerBeams.push(entry);
    controller.addEventListener('connected', () => { entry.connected = true; beam.visible = true; });
    controller.addEventListener('disconnected', () => {
      entry.connected = false;
      entry.actionable = false;
      beam.material.color.setHex(0xf4d5a4);
      beam.visible = false;
    });
    controller.addEventListener('select', () => controllerSelect(controller));
    controller.addEventListener('squeezestart', () => toggleWrist());
    rig.add(controller);
  }
}
function setupInput() {
  stage.addEventListener('pointerup', (event) => {
    if (renderer.xr.isPresenting) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    raycaster.far = 30;
    selectXRTarget(raycaster);
  });
  el('previous').addEventListener('click', () => choose(activeIndex - 1));
  el('next').addEventListener('click', () => choose(activeIndex + 1));
  el('enter').addEventListener('click', () => enter());
  el('return').addEventListener('click', leave);
  el('previous-stop').addEventListener('click', () => moveWaypoint(-1));
  el('next-stop').addEventListener('click', () => moveWaypoint(1));
  el('recenter').addEventListener('click', recenter);
  window.addEventListener('keydown', (event) => {
    if (event.altKey || event.metaKey || event.ctrlKey || event.repeat) return;
    const tag = event.target?.tagName;
    if (['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(tag)) return;
    const key = event.key.toLowerCase();
    if (key === 'g') { event.preventDefault(); toggleWrist(); return; }
    if (wristOpen) { if (key === 'escape') toggleWrist(false); return; }
    keys.add(key);
    if (key === 'arrowleft' && !inside) { event.preventDefault(); choose(activeIndex - 1); }
    if (key === 'arrowright' && !inside) { event.preventDefault(); choose(activeIndex + 1); }
    if (key === 'e' || key === 'enter') enter();
    if (key === 'escape') leave();
    if (key === '[') moveWaypoint(-1);
    if (key === ']') moveWaypoint(1);
    if (key === 'r') recenter();
  });
  window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));
  window.addEventListener('blur', () => keys.clear());
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
function start() {
  if (!stops.length) throw new Error('No approved local artworks are available for XR.');
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#070b19');
  scene.fog = new THREE.FogExp2('#070b19', .022);
  scene.add(new THREE.HemisphereLight('#b7d5ff', '#332138', 2));
  const keyLight = new THREE.DirectionalLight('#ffe4b4', 2);
  keyLight.position.set(-3, 9, 8);
  scene.add(keyLight);
  rig = new THREE.Group();
  scene.add(rig);
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .05, 100);
  camera.position.set(0, 1.65, 0);
  rig.add(camera);
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local-floor');
  renderer.xr.addEventListener('sessionstart', () => {
    const session = renderer.xr.getSession();
    if (!session) return;
    const onVisibility = () => {
      if (session.visibilityState === 'hidden') {
        keys.clear();
        toggleWrist(false); // release captured controls when headset tracking is interrupted
      }
    };
    session.addEventListener('visibilitychange', onVisibility);
    session.addEventListener('end', () => session.removeEventListener('visibilitychange', onVisibility), { once: true });
  });
  stage.appendChild(renderer.domElement);
  el('vr-dock').appendChild(VRButton.createButton(renderer, { optionalFeatures: ['local-floor', 'bounded-floor'] }));
  makeMuseum();
  makeReturnPanel();
  makeTravelSigns();
  addControllers();
  initializeWrist();
  setupInput();
  recenter();
  updateUi();
  renderer.setAnimationLoop(() => {
    const delta = Math.min(clock.getDelta(), .04);
    if (wristDirty && wristSurface) {
      wristSurface.render();
      wristTexture.needsUpdate = true;
      wristDirty = false;
    }
    if (!renderer.xr.isPresenting && !wristCaptured) {
      let dx = Number(keys.has('d')) - Number(keys.has('a'));
      let dz = Number(keys.has('s')) - Number(keys.has('w'));
      const length = Math.hypot(dx, dz) || 1;
      rig.position.x = THREE.MathUtils.clamp(rig.position.x + (dx / length) * delta * 3.3, -11, 11);
      rig.position.z = THREE.MathUtils.clamp(rig.position.z + (dz / length) * delta * 3.3, inside ? -29 : -8, 8);
    }
    if (!still.matches && !wristOpen) rotating.forEach((mesh, i) => {
      mesh.rotation.z += delta * (mesh.userData.spinSpeed || 0);
    });
    updateControllerFeedback();
    renderer.render(scene, camera);
  });
}
try { start(); }
catch (error) {
  const notice = el('error');
  notice.hidden = false;
  notice.textContent = 'This XR room could not start: ' + (error?.message || 'WebGL is unavailable') + '. The regular museum remains available.';
}
