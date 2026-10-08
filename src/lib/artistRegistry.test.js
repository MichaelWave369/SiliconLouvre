import test from 'node:test';
import assert from 'node:assert/strict';
import { artists, registryPolicy, futureResidencies } from '../data/artistRegistry.js';
import { exhibition } from '../data/artworks.js';
import { foundingMastersExhibition } from '../data/foundingMasters.js';
import { artistById, publishedArtists, validateArtistRegistry } from './artistRegistry.js';

const exhibitionIds = [exhibition.id, foundingMastersExhibition.id];

test('only curator-approved and documented founding contributors are published', () => {
  assert.equal(artists.length, 1);
  assert.deepEqual(publishedArtists(artists).map(a => a.id), ['silicon-louvre-studio']);
  assert.deepEqual(validateArtistRegistry(artists, exhibitionIds), []);
  assert.equal(artistById(artists, 'silicon-louvre-studio')?.kind, 'collaboration');
  assert.equal(artistById(artists, 'proposed-agent'), null);
});

test('future residencies remain marked as planned, not active artist profiles', () => {
  assert.equal(futureResidencies.length, 3);
  for (const future of futureResidencies) {
    assert.equal(future.status, 'Planned');
    assert.equal(artistById(artists, future.id), null);
  }
  assert.match(registryPolicy.curatorNote, /not published until reviewed/i);
});

test('unapproved, duplicate and unsupported records are rejected by governance validator', () => {
  const sample = artists[0];
  const bad = { ...sample, status: 'pending', kind: 'unknown', exhibitIds: ['666'] };
  const errors = validateArtistRegistry([sample, bad], exhibitionIds);
  assert.ok(errors.some(e => e.includes('Duplicate')));
  assert.ok(errors.some(e => e.includes('Unapproved')));
  assert.ok(errors.some(e => e.includes('Unknown artist type')));
  assert.ok(errors.some(e => e.includes('Unknown exhibit')));
});
