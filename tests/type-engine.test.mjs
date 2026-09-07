import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CHARACTERS, DEFAULTS, PRESETS, generateAlphabet, measureLine, newSeed, seededParameters } from '../lib/type-engine.ts';

test('draws all 94 visible ASCII characters and gives space an advance', () => {
  const alphabet = generateAlphabet(1024, DEFAULTS);
  assert.equal(CHARACTERS.length, 94);
  for (let code = 33; code <= 126; code++) {
    const glyph = alphabet[String.fromCharCode(code)];
    assert.ok(glyph?.path.startsWith('M'), `Missing glyph ${String.fromCharCode(code)}`);
    assert.ok(glyph.path.endsWith('Z'));
    assert.ok(Number.isFinite(glyph.left));
    assert.ok(glyph.advance > 0);
  }
  assert.equal(alphabet[' '].path, '');
  assert.ok(alphabet[' '].advance > 0);
});

test('retains the same hand for the same seed and redraws every glyph for a new seed', () => {
  const first = generateAlphabet(92137, DEFAULTS);
  assert.deepEqual(first, generateAlphabet(92137, DEFAULTS));
  const second = generateAlphabet(49101, DEFAULTS);
  for (const char of CHARACTERS) assert.notEqual(first[char].path, second[char].path, char);
});

test('all drawing parameters visibly affect glyph geometry or layout', () => {
  const original = generateAlphabet(4127, DEFAULTS);
  for (const key of Object.keys(DEFAULTS)) {
    const changed = generateAlphabet(4127, { ...DEFAULTS, [key]: DEFAULTS[key] + (key === 'weight' ? 2 : 15) });
    assert.ok(CHARACTERS.some(char => JSON.stringify(original[char]) !== JSON.stringify(changed[char])), key);
    if (key === 'xHeight') {
      assert.equal(original.A.path, changed.A.path);
      assert.notEqual(original.a.path, changed.a.path);
    }
    if (key === 'spacing') {
      assert.equal(original.A.path, changed.A.path);
      assert.equal(changed.A.advance - original.A.advance, 15);
    }
  }
});

test('finite contours and positive spacing across presets, random hands, and extreme settings', () => {
  const extremes = [
    { weight: 1, pressure: 0, tremor: 0, irregularity: 0, width: 45, slant: -20, roundness: 0, xHeight: 45, bounce: 0, spacing: 2, flare: 0, grain: 0 },
    { weight: 12, pressure: 100, tremor: 100, irregularity: 100, width: 120, slant: 25, roundness: 100, xHeight: 82, bounce: 100, spacing: 32, flare: 100, grain: 100 },
  ];
  const settings = [...Object.values(PRESETS), ...extremes, ...Array.from({ length: 100 }, (_, i) => seededParameters(i * 49121))];
  for (const [index, params] of settings.entries()) {
    const alphabet = generateAlphabet(index * 8713, params);
    for (const char of CHARACTERS) {
      assert.ok(!/NaN|Infinity/.test(alphabet[char].path), `${index}: ${char}`);
      assert.ok(Number.isFinite(alphabet[char].advance) && alphabet[char].advance > 0);
      assert.ok(Number.isFinite(alphabet[char].left));
    }
  }
});

test('fresh cryptographic seeds and reproducible family parameters', () => {
  const seeds = Array.from({ length: 20 }, () => newSeed());
  assert.equal(new Set(seeds).size, seeds.length);
  for (const seed of seeds) assert.deepEqual(seededParameters(seed), seededParameters(seed));
});

test('measurement matches glyph advances and safely handles unsupported characters', () => {
  const alphabet = generateAlphabet(135, DEFAULTS);
  assert.equal(measureLine('Ab 7', alphabet), alphabet.A.advance + alphabet.b.advance + alphabet[' '].advance + alphabet['7'].advance);
  assert.equal(measureLine('🙂', alphabet), alphabet['?'].advance);
});
