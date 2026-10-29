import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuestFieldCheck, formatQuestFieldReport } from '../src/xr/questFieldCheck.js';

test('Quest field check requires explicit opt in and records no desktop frames', () => {
  const check = createQuestFieldCheck();
  assert.equal(check.note('xr-start'), false);
  assert.equal(check.frame(10, { memory: { geometries: 3 } }, true), false);
  assert.equal(check.snapshot().state, 'idle');
  check.start();
  assert.equal(check.frame(20, null, false), false);
  assert.equal(check.snapshot().xrFramesObserved, 0);
  check.stop();
  assert.equal(check.snapshot().state, 'stopped');
  assert.equal(check.note('xr-start'), false);
});
test('frame callback intervals use un-clamped wall timestamps and skip pauses', () => {
  const check = createQuestFieldCheck();
  check.start();
  const info = { memory: { geometries: 21, textures: 8 }, render: { calls: 17 } };
  [1000, 1012, 1025, 1041].forEach((ms) => check.frame(ms, info, true));
  assert.equal(check.snapshot().cadenceIntervals, 3);
  assert.equal(check.snapshot().avgFrameIntervalMs, 13.7);
  assert.equal(check.snapshot().maxFrameIntervalMs, 16);
  check.note('xr-hidden');
  check.frame(9999, info, true);
  assert.equal(check.snapshot().cadenceIntervals, 3);
  check.frame(10011, info, true);
  assert.equal(check.snapshot().cadenceIntervals, 4);
  check.stop();
});
test('only bounded finite WebGL numbers contribute to peak and latest stats', () => {
  const check = createQuestFieldCheck();
  check.start();
  check.frame(10, { memory: { geometries: 4, textures: 6 }, render: { calls: 8 } }, true);
  check.frame(20, { memory: { geometries: 9, textures: NaN }, render: { calls: -1 } }, true);
  const s = check.snapshot();
  assert.deepEqual(s.webgl.peak, { geometries: 9, textures: 6, drawCalls: 8 });
  assert.deepEqual(s.webgl.latest, { geometries: 9, textures: null, drawCalls: null });
});
test('event model avoids freeform logs and stores only bounded reviewed realm labels', () => {
  const check = createQuestFieldCheck();
  check.start();
  assert.equal(check.note('passive-mic'), false);
  check.note('portal-enter', '../../private');
  assert.equal(check.snapshot().lastCuratedRealm, null);
  check.note('portal-enter', 'the-eye-that-blooms');
  check.note('portal-return');
  const report = formatQuestFieldReport(check.snapshot());
  assert.match(report, /Portal enters\/returns: 2 \/ 1/);
  assert.match(report, /the-eye-that-blooms/);
  assert.doesNotMatch(report, /private|passive-mic|refresh rate:/);
});
test('a new run resets stats instead of persisting across visitors', () => {
  const check = createQuestFieldCheck();
  check.start();
  check.note('xr-start');
  check.frame(200, null, true);
  check.stop();
  check.start();
  assert.equal(check.snapshot().xrFramesObserved, 0);
  assert.equal(check.snapshot().events['xr-start'], 0);
  assert.equal(check.snapshot().webgl.latest.geometries, null);
});
test('live XR entry attaches field check to actual render and lifecycle', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../src/xr/main.js', import.meta.url), 'utf8');
  assert.match(source, /import\s*\{\s*createQuestFieldCheck/);
  assert.match(source, /fieldCheck\.frame\(/);
  assert.match(source, /fieldCheck\.note\('portal-enter'/);
  assert.match(source, /fieldCheck\.note\('portal-return'/);
  assert.match(source, /fieldCheck\.note\('xr-start'/);
  assert.match(source, /fieldCheck\.note\('xr-end'/);
});
