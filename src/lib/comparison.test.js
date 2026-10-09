import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPARISON_MODES, normalizeComparisonMode, clampComparisonValue,
  revealClipStyle, blendOpacityStyle, comparisonStatus } from './comparison.js';

test('three static viewing modes are allowed and unknown modes are rejected',()=>{
  assert.deepEqual(COMPARISON_MODES,['side-by-side','reveal','blend']);
  assert.equal(normalizeComparisonMode('reveal'),'reveal');
  assert.equal(normalizeComparisonMode('blend'),'blend');
  assert.equal(normalizeComparisonMode('javascript:alert(1)'),'side-by-side');
});
test('compare slider is bounded and keeps intuitive endpoints',()=>{
  assert.equal(clampComparisonValue(-999),0);
  assert.equal(clampComparisonValue(999),100);
  assert.equal(clampComparisonValue('55.6'),56);
  assert.equal(clampComparisonValue('NaN'),50);
  assert.equal(clampComparisonValue(Infinity),50);
  assert.deepEqual(revealClipStyle(0),{clipPath:'inset(0 100% 0 0)'});
  assert.deepEqual(revealClipStyle(50),{clipPath:'inset(0 50% 0 0)'});
  assert.deepEqual(revealClipStyle(100),{clipPath:'inset(0 0% 0 0)'});
  assert.deepEqual(blendOpacityStyle(0),{opacity:0});
  assert.deepEqual(blendOpacityStyle(50),{opacity:0.5});
  assert.deepEqual(blendOpacityStyle(100),{opacity:1});
});
test('screen-reader instructions identify the actual displayed image arrangement',()=>{
  assert.match(comparisonStatus('reveal',35),/35% original.*left.*65% AI-inspired.*right/);
  assert.match(comparisonStatus('blend',85),/opacity 85%/);
  assert.match(comparisonStatus('side-by-side',50),/side by side/);
});
