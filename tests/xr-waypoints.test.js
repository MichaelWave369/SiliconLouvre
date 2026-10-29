import test from 'node:test';
import assert from 'node:assert/strict';
import { REALM_WAYPOINTS, waypointAt, waypointIndex, stepWaypoint, canStepWaypoint } from '../src/xr/waypoints.js';

test('XR visitor destinations are reviewed, distinct, and within floor bounds', () => {
  assert.equal(REALM_WAYPOINTS.length, 4);
  assert.equal(new Set(REALM_WAYPOINTS.map((x) => x.id)).size, 4);
  for (const item of REALM_WAYPOINTS) {
    assert(Number.isFinite(item.x) && Number.isFinite(item.z));
    assert(Math.abs(item.x) < 4 && item.z >= -35 && item.z <= 8);
    assert(item.label.length > 0);
  }
});
test('visitor locomotion is discrete, bounded, and fails closed', () => {
  assert.equal(stepWaypoint(0, -1), 0);
  assert.equal(stepWaypoint(3, 1), 3);
  assert.equal(stepWaypoint(2, -1), 1);
  assert.equal(stepWaypoint(1, 1), 2);
  assert.equal(stepWaypoint(1, 900), 1);
  assert.equal(waypointIndex(NaN), 0);
  assert.equal(waypointAt(999).id, 'threshold');
});
test('no travel while outside realm or while wrist has captured controller input', () => {
  assert.equal(canStepWaypoint(0, 1, true, false), true);
  assert.equal(canStepWaypoint(0, -1, true, false), false);
  assert.equal(canStepWaypoint(0, 1, false, false), false);
  assert.equal(canStepWaypoint(0, 1, true, true), false);
});

test('entry wiring invokes the approved blueprint renderer in live XR', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../src/xr/main.js', import.meta.url), 'utf8');
  assert.match(source, /import\s*\{\s*realmBlueprintFor\s*\}.*realmBlueprint\.js/);
  assert.match(source, /import\s*\{\s*mountRealmSculptures\s*\}.*realmMeshes\.js/);
  assert.match(source, /realmBlueprintFor\(stop\.id\)/);
  assert.match(source, /mountRealmSculptures\(worldGroup,\s*blueprint\)/);
  assert.doesNotMatch(source, /const paletteSets\s*=/);
  assert.match(source, /stepWaypoint\(/);
  assert.match(source, /function\s+moveWaypoint\(/);
});
