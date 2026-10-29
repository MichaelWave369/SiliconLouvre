import test from 'node:test';
import assert from 'node:assert/strict';
import { domistikaDialoguePairs } from '../src/data/domistikaDialogues.js';
import { createPortalStops, portalAt, portalById } from '../src/xr/portalModel.js';

test('only approved Domistika dialogue pairs become stations, preserving both attributions', () => {
  const stops = createPortalStops(domistikaDialoguePairs);
  assert.equal(stops.length, 4);
  assert.equal(stops[0].id, 'chromatic-gear-cathedral');
  assert(stops.every((stop) => stop.originalCredit && stop.inspiredCredit && stop.note));
  assert(stops.every((stop) => stop.originalFile.endsWith('-original.webp') && stop.inspiredFile.endsWith('-inspired.webp')));
});
test('reject unapproved, duplicate, unauthorized, and escaping asset paths', () => {
  const base = domistikaDialoguePairs[0];
  const stops = createPortalStops([
    base, base,
    { ...base, id: 'draft', status: 'draft' },
    { ...base, id: '../escape' },
    { ...base, id: 'bad-file', original: { file: '../../hack.webp' } },
    { ...base, id: 'unauthorized', provenance: { ...base.provenance, originalOwnerApproved: false } },
  ]);
  assert.deepEqual(stops.map((stop) => stop.id), [base.id]);
});
test('wraparound selection and unknown artwork ids are safe', () => {
  const stops = createPortalStops(domistikaDialoguePairs);
  assert.equal(portalAt(stops, -1).id, stops[3].id);
  assert.equal(portalAt(stops, 4).id, stops[0].id);
  assert.equal(portalById(stops, 'missing'), null);
  assert.equal(portalAt([], 2), null);
});
