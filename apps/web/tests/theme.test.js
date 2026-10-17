import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveTheme } from '../src/scripts/theme.js';

test('explicit light and dark choices override the system preference', () => {
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('light', false), 'light');
  assert.equal(resolveTheme('dark', true), 'dark');
  assert.equal(resolveTheme('dark', false), 'dark');
});

test('missing or unsupported stored choices follow the system preference', () => {
  for (const preference of [null, undefined, '', 'system', 'unexpected']) {
    assert.equal(resolveTheme(preference, true), 'dark');
    assert.equal(resolveTheme(preference, false), 'light');
  }
});
