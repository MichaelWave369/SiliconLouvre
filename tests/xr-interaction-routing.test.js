import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { resolveXRTarget, isActionableTarget } from '../src/xr/interactionRouting.js';

function plane(x, z, metadata = {}, width = 1.4) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, 1), new THREE.MeshBasicMaterial());
  mesh.position.set(x, 1.6, z);
  mesh.userData = metadata;
  mesh.updateMatrixWorld(true);
  return mesh;
}
function ray(x = 0) {
  return new THREE.Raycaster(new THREE.Vector3(x, 1.6, 0), new THREE.Vector3(0, 0, -1), .01, 20);
}
test('paintings are reachable only in atrium, independently of behind-them art', () => {
  const painting = plane(0, -5, { stopIndex: 2 });
  assert.deepEqual(resolveXRTarget(ray(), { portalTargets: [painting] }), { type: 'painting', index: 2 });
  assert.deepEqual(resolveXRTarget(ray(), { inside: true, portalTargets: [painting] }), { type: 'none' });
});
test('return controls are always selected by nearest ray hit wherever the visitor travels', () => {
  const exit = plane(0, -2, { returnToAtrium: true });
  const next = plane(0, -4, { direction: 1 });
  assert.deepEqual(resolveXRTarget(ray(), { inside: true, returnTargets: [exit], travelSigns: [next] }), { type: 'return' });
  exit.visible = false;
  assert.deepEqual(resolveXRTarget(ray(), { inside: true, returnTargets: [exit], travelSigns: [next] }), { type: 'waypoint', direction: 1 });
  next.visible = false;
  assert.deepEqual(resolveXRTarget(ray(), { inside: true, returnTargets: [exit], travelSigns: [next] }), { type: 'none' });
});
test('wrist input capture blocks all portal and movement fallthrough, even off its screen', () => {
  const painting = plane(0, -3, { stopIndex: 0 });
  assert.deepEqual(resolveXRTarget(ray(), { wristOpen: true, portalTargets: [painting] }), { type: 'blocked' });
  assert.deepEqual(resolveXRTarget(ray(), { wristCaptured: true, portalTargets: [painting] }), { type: 'blocked' });
});
test('active wrist only selects a real reviewed Canvas target under the pointer', () => {
  const panel = plane(0, -1, {}, 1);
  const action = () => true;
  const screen = { canvas: { width: 1024, height: 768 }, targets: [{ id: 'world', x: 450, y: 340, w: 130, h: 90, action }] };
  const found = resolveXRTarget(ray(), { wristOpen: true, wristPanel: panel, wristSurface: screen });
  assert.equal(found.type, 'wrist-control');
  assert.equal(found.target.action, action);
  assert.deepEqual(resolveXRTarget(ray(), { wristOpen: true, wristPanel: panel, wristSurface: { ...screen, targets: [] } }), { type: 'blocked' });
});
test('wrist launcher wins over paintings, invalid metadata never triggers entry', () => {
  const launcher = plane(0, -1);
  const painting = plane(0, -3, { stopIndex: 1 });
  assert.deepEqual(resolveXRTarget(ray(), { wristLauncher: launcher, portalTargets: [painting] }), { type: 'wrist-launcher' });
  assert.equal(isActionableTarget({ type: 'wrist-launcher' }), true);
  assert.equal(isActionableTarget({ type: 'blocked' }), false);
  assert.deepEqual(resolveXRTarget(ray(), { portalTargets: [plane(0, -3, { stopIndex: '../../hack' })] }), { type: 'none' });
});
test('live app mounts a return panel to the player rig rather than a distant world wall', async () => {
  const { readFile } = await import('node:fs/promises');
  const text = await readFile(new URL('../src/xr/main.js', import.meta.url), 'utf8');
  assert.match(text, /returnPanel\s*=\s*plaque\(rig,/);
  assert.match(text, /returnTargets\s*=\s*\[returnPanel\]/);
  assert.doesNotMatch(text, /returnTargets\s*=\s*\[\s*\]/g);
  assert.doesNotMatch(text, /plaque\(worldGroup,\s*\['RETURN TO ATRIUM'/);
  assert.match(text, /resolveXRTarget\(/);
});
