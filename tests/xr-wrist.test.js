import test from 'node:test';
import assert from 'node:assert/strict';
import { createWrist } from '@phi369/genewrist/src/core.js';
import { createLouvreWorldAdapter } from '../src/xr/louvreWorldAdapter.js';

function setup() {
  let scene = { inside: false, index: 0, title: 'Chromatic Gear Cathedral', total: 4 };
  const listeners = new Set(), captures = [], calls = [];
  const notify = () => { for (const fn of [...listeners]) fn(); };
  const commands = {
    previous: () => { calls.push('previous'); scene = { ...scene, index: 3 }; notify(); },
    next: () => { calls.push('next'); scene = { ...scene, index: 1 }; notify(); },
    enter: () => { calls.push('enter'); scene = { ...scene, inside: true }; notify(); },
    return: () => { calls.push('return'); scene = { ...scene, inside: false }; notify(); },
    recenter: () => { calls.push('recenter'); },
  };
  const adapter = createLouvreWorldAdapter({
    readScene: () => scene,
    subscribeScene: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    commands,
    onCapture: (value) => captures.push(value),
  });
  const wrist = createWrist({ worlds: [], storage: null });
  wrist.connectWorld(adapter);
  wrist.setMode('field');
  wrist.navigate('world');
  return { wrist, calls, captures, listeners };
}
test('host registers only real museum state and retains Gen.E.Wrist universal structure', () => {
  const { wrist } = setup();
  assert.equal(wrist.snapshot().worldHost.manifest.apiVersion, 1);
  assert.equal(wrist.snapshot().worldHost.manifest.id, 'silicon-louvre');
  assert.equal(wrist.snapshot().worldHost.status.title, 'Chromatic Gear Cathedral');
  assert.equal(wrist.snapshot().worldHost.contextId, 'atrium');
  assert.equal(wrist.snapshot().worldHost.grants.length, 0);
  wrist.navigate('universal');
  assert.equal(wrist.snapshot().destination, 'universal');
  wrist.home();
  assert.equal(wrist.snapshot().destination, 'home');
  wrist.dispose();
});
test('all actions require deliberate grant and context changes remove old controls', async () => {
  const { wrist, calls } = setup();
  await assert.rejects(wrist.requestWorldAction('enter-portal'));
  assert.deepEqual(calls, []);
  wrist.setWorldGrants(['enter-portals', 'navigate-paintings']);
  await wrist.requestWorldAction('next-painting');
  await wrist.requestWorldAction('enter-portal');
  assert.deepEqual(calls, ['next', 'enter']);
  assert.equal(wrist.snapshot().worldHost.contextId, 'artwork');
  await assert.rejects(wrist.requestWorldAction('next-painting'));
  await wrist.requestWorldAction('return-to-atrium');
  assert.equal(wrist.snapshot().worldHost.contextId, 'atrium');
  wrist.setWorldGrants([]);
  await assert.rejects(wrist.requestWorldAction('previous-painting'));
  wrist.dispose();
});
test('disconnect releases subscriptions, captures and the action permissions', async () => {
  const { wrist, captures, listeners } = setup();
  assert.equal(listeners.size, 1);
  wrist.setWorldGrants(['enter-portals']);
  wrist.setInputCaptured(true);
  wrist.disconnectWorld();
  assert.equal(listeners.size, 0);
  assert.equal(wrist.snapshot().worldHost, null);
  assert.equal(wrist.snapshot().destination, 'universal');
  assert.equal(captures.at(-1), false);
  await assert.rejects(wrist.requestWorldAction('enter-portal'));
  wrist.dispose();
});
test('host refuses fake no-op command registration', () => {
  assert.throws(() => createLouvreWorldAdapter({ readScene: () => ({}), subscribeScene: () => () => {}, commands: {} }), /real host state/);
});
