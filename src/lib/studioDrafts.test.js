import test from 'node:test';
import assert from 'node:assert/strict';
import { DRAFTS_STORAGE_KEY, MAX_DRAFTS, asRecipe, normalizeDraftName, parseDrafts, parseRecipe, removeDraft, saveDraft } from './studioDrafts.js';
import { PRESETS } from './studio.js';

test('copied recipes round-trip into identical constrained settings',()=>{
  const recipe=asRecipe(PRESETS.iris);
  const parsed=parseRecipe(recipe);
  assert.equal(parsed.ok,true);
  assert.deepEqual(parsed.config,PRESETS.iris);
  assert.equal(DRAFTS_STORAGE_KEY,'silicon-louvre-studio-drafts-v1');
});

test('untrusted recipes cannot add executable markup or unchecked configuration',()=>{
  assert.equal(parseRecipe('{').ok,false);
  assert.equal(parseRecipe(JSON.stringify({...PRESETS.bloom})).ok,false);
  assert.equal(parseRecipe(JSON.stringify({format:'silicon-louvre-studio/v2',...PRESETS.bloom})).ok,false);
  assert.equal(parseRecipe(JSON.stringify({format:'silicon-louvre-studio/v1',...PRESETS.bloom,extra:'<script>'})).ok,false);
  assert.equal(parseRecipe(JSON.stringify({format:'silicon-louvre-studio/v1',...PRESETS.bloom,segments:999})).ok,false);
  assert.equal(parseRecipe('x'.repeat(2050)).ok,false);
});

test('bounded local draft shelf loads valid items and drops corrupted data',()=>{
  const draft=(n)=>({
    id:'draft-'+n,
    name:'  Gallery work '+n+'  ',
    savedAt:1700000000000+n,
    recipe:{format:'silicon-louvre-studio/v1',...PRESETS.bloom},
  });
  const initial=[draft(1),draft(1),{...draft(2),name:''},{...draft(3),recipe:{format:'evil'}},...Array.from({length:20},(_,i)=>draft(i+5))];
  const clean=parseDrafts(JSON.stringify(initial));
  assert.equal(clean.length,MAX_DRAFTS);
  assert.equal(clean[0].name,'Gallery work 1');
  assert.equal(new Set(clean.map(x=>x.id)).size,MAX_DRAFTS);
  assert.deepEqual(parseDrafts('{invalid'),[]);
  assert.deepEqual(parseDrafts('{}'),[]);
  assert.equal(normalizeDraftName(' Hello\nWorld '),'Hello World');
  const updated=saveDraft(clean,draft(100));
  assert.equal(updated.length,MAX_DRAFTS);
  assert.equal(updated[0].id,'draft-100');
  assert.equal(removeDraft(updated,'draft-100').length,MAX_DRAFTS-1);
});
