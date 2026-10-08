import test from 'node:test';
import assert from 'node:assert/strict';
import { artworks, categories, exhibition } from './artworks.js';

test('the inaugural exhibition has six unique, complete artworks', () => {
  assert.equal(exhibition.id, '001');
  assert.equal(artworks.length, 6);
  assert.equal(new Set(artworks.map((art) => art.id)).size, artworks.length);
  assert.equal(new Set(artworks.map((art) => art.variant)).size, artworks.length);
  for (const art of artworks) {
    for (const field of ['id', 'title', 'description', 'technique', 'medium', 'lookFor', 'category']) {
      assert.ok(art[field]?.trim(), `Missing ${field} on ${art.id}`);
    }
    assert.ok(categories.includes(art.category), `Unknown category: ${art.category}`);
  }
});

test('the perception exhibit makes no medical claim', () => {
  assert.match(exhibition.curatorialNote, /not medical or stress tests/i);
});
