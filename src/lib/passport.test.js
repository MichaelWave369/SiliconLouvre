import test from 'node:test';
import assert from 'node:assert/strict';
import { artworks } from '../data/artworks.js';
import { addVisit, parseVisited, sanitizeVisited, visitedCount } from './passport.js';

test('a visit is recorded only for a genuine exhibit work', () => {
  const first = artworks[0].id;
  const next = addVisit([], first, artworks);
  assert.deepEqual(next, [first]);
  assert.deepEqual(addVisit(next, first, artworks), next);
  assert.deepEqual(addVisit(next, 'unknown', artworks), next);
  assert.deepEqual(addVisit(next, artworks[1].id, artworks), [first, artworks[1].id]);
});

test('visitor progress sanitizes stale, duplicate and corrupted browser data', () => {
  const [first, second] = artworks.map((art) => art.id);
  assert.deepEqual(parseVisited(JSON.stringify([first, first, second, 'unknown', 8]), artworks), [first, second]);
  assert.deepEqual(parseVisited('not JSON', artworks), []);
  assert.deepEqual(parseVisited('{}', artworks), []);
  assert.deepEqual(parseVisited(null, artworks), []);
  assert.deepEqual(sanitizeVisited(['bad', first], artworks), [first]);
});

test('completion reflects six real artworks, not a behavioral assessment', () => {
  assert.equal(visitedCount([], artworks), 0);
  assert.equal(visitedCount(artworks.map((art) => art.id), artworks), 6);
  assert.equal(visitedCount(['invented', ...artworks.map((art) => art.id)], artworks), 6);
});
