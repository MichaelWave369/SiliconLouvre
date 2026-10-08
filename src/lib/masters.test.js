import test from 'node:test';
import assert from 'node:assert/strict';
import { foundingMasters, foundingMastersExhibition, foundingMastersProvenance } from '../data/foundingMasters.js';
import { masterFromHash, masterNextId } from './masters.js';

test('six founding masters have valid unique asset mappings and provenance', () => {
  assert.equal(foundingMastersExhibition.id, '002');
  assert.equal(foundingMasters.length, 6);
  assert.equal(new Set(foundingMasters.map(m => m.id)).size, 6);
  assert.equal(new Set(foundingMasters.map(m => m.file)).size, 6);
  for (const m of foundingMasters) {
    assert.equal(m.file, m.id + '.webp');
    assert.match(m.sha256, /^[a-f0-9]{64}$/);
    for (const field of ['title', 'description', 'alt', 'technique', 'original']) {
      assert.ok(m[field]?.trim(), `Missing ${field} for ${m.id}`);
    }
  }
  assert.match(foundingMastersProvenance.generation, /OpenAI image generation/);
  assert.match(foundingMastersProvenance.disclaimer, /not stress tests/i);
});

test('master deep links only resolve listed artworks', () => {
  assert.equal(masterFromHash(foundingMasters, '#master-undertow')?.id, 'undertow');
  assert.equal(masterFromHash(foundingMasters, '#master-fabricated'), null);
  assert.equal(masterFromHash(foundingMasters, '#work-undertow'), null);
  assert.equal(masterFromHash(foundingMasters, '#master-../../etc'), null);
});

test('master navigation wraps in both directions', () => {
  const first = foundingMasters[0].id;
  const last = foundingMasters.at(-1).id;
  assert.equal(masterNextId(foundingMasters, first, -1), last);
  assert.equal(masterNextId(foundingMasters, last, 1), first);
  assert.equal(masterNextId([], first), null);
});
