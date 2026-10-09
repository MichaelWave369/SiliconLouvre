import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { normalizeComparisonMode, revealClipStyle, blendOpacityStyle } from './comparison.js';

test('comparison mode is retained at gallery scope, even across pair navigation', async()=>{
  const gallery = await readFile(new URL('../DomistikaDialogues.jsx',import.meta.url),'utf8');
  const station = await readFile(new URL('../DialogueComparisonStation.jsx',import.meta.url),'utf8');
  assert.match(gallery,/const \[compareMode,setCompareMode\]=useState\('side-by-side'\)/);
  assert.match(gallery,/<DialogueViewer pair=\{selected\} compareMode=\{compareMode\} onCompareModeChange=\{setCompareMode\}/);
  assert.match(station,/mode:requestedMode,onModeChange/);
  assert.match(station,/onClick=\{\(\)=>onModeChange\(choice\)\}/);
  assert.equal(normalizeComparisonMode('blend'),'blend');
});

test('blend background is opaque beneath a possibly alpha-transparent inspired image',async()=>{
  const ui=await readFile(new URL('../DialogueComparisonStation.jsx',import.meta.url),'utf8');
  const css=await readFile(new URL('../styles/dialogueComparison.css',import.meta.url),'utf8');
  assert.match(ui,/<div className="dialogue-compare__layered-inspired" aria-hidden="true"/);
  assert.match(ui,/<img src=\{inspiredUrl\} alt="" decoding="async"\/>/);
  assert.match(css,/\.dialogue-compare__layered-inspired \{[^}]*background:#0e0c15;/);
  assert.deepEqual(blendOpacityStyle(0),{opacity:0});
  assert.deepEqual(blendOpacityStyle(50),{opacity:0.5});
  assert.deepEqual(blendOpacityStyle(100),{opacity:1});
});

test('reveal endpoints do not invert the original-left / response-right layout',()=>{
  assert.deepEqual(revealClipStyle(0),{clipPath:'inset(0 100% 0 0)'});
  assert.deepEqual(revealClipStyle(50),{clipPath:'inset(0 50% 0 0)'});
  assert.deepEqual(revealClipStyle(100),{clipPath:'inset(0 0% 0 0)'});
});
