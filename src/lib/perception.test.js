import test from 'node:test';
import assert from 'node:assert/strict';
import { contrastExperiment, clampContrast, grayHex, perspectiveCrossbars, TARGET_GRAY } from './perception.js';

test('simultaneous-contrast target has identical pixel values on both sides', () => {
  assert.equal(TARGET_GRAY, 146);
  for (const value of [0, 1, 25, 50, 75, 100]) {
    const result = contrastExperiment(value);
    assert.equal(result.target, '#929292');
    assert.equal(result.intensity, value);
  }
});

test('contrast is clamped and contexts remain valid grayscale hexadecimal', () => {
  assert.equal(clampContrast(-10), 0);
  assert.equal(clampContrast(101), 100);
  assert.equal(clampContrast('60'), 60);
  assert.equal(clampContrast(NaN), 0);
  assert.equal(clampContrast(Infinity), 0);
  assert.equal(contrastExperiment(-1).darkContext, contrastExperiment(-1).target);
  assert.equal(contrastExperiment(-1).lightContext, contrastExperiment(-1).target);
  const full = contrastExperiment(100);
  assert.equal(full.darkContext, '#121212');
  assert.equal(full.lightContext, '#ffffff');
  assert.match(grayHex(255), /^#[0-9a-f]{6}$/);
  assert.match(grayHex(-100), /^#[0-9a-f]{6}$/);
});

test('perspective demonstration has ordered flat crossbars converging on center', () => {
  const bars = perspectiveCrossbars();
  assert.equal(bars.length, 5);
  assert.ok(bars.every((bar) => bar.left + bar.right === 600));
  assert.ok(bars.every((bar) => bar.left >= 0 && bar.right <= 600));
  assert.ok(bars.every((bar, i) => i === 0 || bar.y > bars[i-1].y));
});
