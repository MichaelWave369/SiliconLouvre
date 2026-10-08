import test from 'node:test';
import assert from 'node:assert/strict';
import { artworks } from '../data/artworks.js';
import { artworkIdFromHash, artworkPosition, artworkShareUrl, nextArtworkId } from './gallery.js';

test('self-paced gallery walk advances through all six works in exhibit order', () => {
  assert.equal(artworks.length, 6);
  const sequence = [artworks[0].id];
  for (let i = 0; i < artworks.length - 1; i += 1) {
    sequence.push(nextArtworkId(artworks, sequence.at(-1), 1));
  }
  assert.deepEqual(sequence, artworks.map((art) => art.id));
  assert.equal(nextArtworkId(artworks, artworks.at(-1).id, 1), artworks[0].id);
  assert.equal(nextArtworkId(artworks, artworks[0].id, -1), artworks.at(-1).id);
  assert.equal(nextArtworkId(artworks, 'unknown', 1), artworks[0].id);
  assert.equal(nextArtworkId([], 'unknown', 1), null);
});

test('tour position stays meaningful for artwork labels', () => {
  assert.equal(artworkPosition(artworks, artworks[0].id), 1);
  assert.equal(artworkPosition(artworks, artworks.at(-1).id), 6);
  assert.equal(artworkPosition(artworks, 'unknown'), 0);
});

test('only real artwork hashes become deep links', () => {
  const id = artworks[2].id;
  assert.equal(artworkIdFromHash(artworks, '#work-' + id), id);
  assert.equal(artworkIdFromHash(artworks, '#work-invented-piece'), null);
  assert.equal(artworkIdFromHash(artworks, '#vision'), null);
  assert.equal(artworkIdFromHash(artworks, '#work-../../evil'), null);
});

test('share links retain GitHub Pages project pathname', () => {
  assert.equal(
    artworkShareUrl('https://michaelwave369.github.io', '/SiliconLouvre/', 'undertow'),
    'https://michaelwave369.github.io/SiliconLouvre/#work-undertow'
  );
});
