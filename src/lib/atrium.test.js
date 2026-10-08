import test from 'node:test';
import assert from 'node:assert/strict';
import { artworks } from '../data/artworks.js';
import { atriumNeighbors, atriumWorkAt, wrapAtriumIndex } from './atrium.js';

test('virtual room wraps through curator order in both directions', () => {
  assert.equal(wrapAtriumIndex(6, -1), 5);
  assert.equal(wrapAtriumIndex(6, 6), 0);
  assert.equal(wrapAtriumIndex(6, 14), 2);
  assert.equal(wrapAtriumIndex(0, 0), -1);
  assert.equal(wrapAtriumIndex(6, 2.1), -1);
  assert.equal(atriumWorkAt([], 0), null);
});

test('all six works can become the center of the room', () => {
  assert.equal(artworks.length, 6);
  artworks.forEach((work, index) => {
    const neighbors = atriumNeighbors(artworks, index);
    assert.deepEqual(neighbors.map(item => item.position), ['left', 'center', 'right']);
    assert.equal(neighbors[1].work.id, work.id);
    assert.equal(neighbors[0].work.id, artworks[(index + 5) % 6].id);
    assert.equal(neighbors[2].work.id, artworks[(index + 1) % 6].id);
  });
});

test('small collections do not duplicate interactive artworks', () => {
  const single = atriumNeighbors(artworks.slice(0, 1), 0);
  const pair = atriumNeighbors(artworks.slice(0, 2), 1);
  assert.equal(single.length, 1);
  assert.equal(single[0].position, 'center');
  assert.equal(pair.length, 2);
  assert.deepEqual(pair.map(item => item.position), ['center', 'right']);
});
