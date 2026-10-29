import test from 'node:test';
import assert from 'node:assert/strict';
import { domistikaDialoguePairs } from '../src/data/domistikaDialogues.js';
import { realmBlueprintFor, realmBudget } from '../src/xr/realmBlueprint.js';

const approved = domistikaDialoguePairs.filter((work) => work.status === 'approved').map((work) => work.id);
test('the four curated works have genuinely distinct themed spatial compositions', () => {
  assert.equal(approved.length, 4);
  const plans = approved.map(realmBlueprintFor);
  assert(plans.every(Boolean));
  assert.equal(new Set(plans.map((p) => p.motif)).size, 4);
  assert.equal(new Set(plans.map((p) => p.landmark)).size, 4);
  assert.equal(new Set(plans.map((p) => p.background)).size, 4);
  assert.equal(new Set(plans.map((p) => p.description)).size, 4);
});
test('realm plans use deterministic instanced primitives with conservative Quest budgets', () => {
  for (const id of approved) {
    const plan = realmBlueprintFor(id);
    assert.deepEqual(realmBlueprintFor(id), plan);
    const budget = realmBudget(plan);
    assert(budget.instances >= 50 && budget.instances <= 400, id + ' instance budget');
    assert(budget.batches <= 6 && budget.hoops <= 5, id + ' draw call budget');
    for (const batch of plan.batches) {
      assert(['box', 'sphere', 'octahedron', 'tetrahedron', 'cone'].includes(batch.shape));
      assert.match(batch.color, /^#[0-9a-f]{6}$/i);
      for (const object of batch.instances) {
        assert(object.position.every(Number.isFinite));
        assert(object.rotation.every(Number.isFinite));
        assert(object.scale.every((x) => Number.isFinite(x) && x > 0));
        assert(object.position[2] <= -11, 'leave visible passage near the entrance');
      }
    }
    for (const h of plan.hoops) {
      assert(h.radius > 0 && h.radius < 6);
      assert(h.position.every(Number.isFinite));
      assert(Math.abs(h.speed) <= 0.02);
    }
  }
});
test('no realm is synthesized for uncurated arbitrary user IDs', () => {
  assert.equal(realmBlueprintFor('user-upload'), null);
  assert.deepEqual(realmBudget(null), { instances: 0, batches: 0, hoops: 0 });
});
