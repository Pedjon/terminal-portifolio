import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getDonationsUrl, getTerminalUrl, isPlainNavigation } from '../src/scripts/navigation.js';

test('terminal links retain the selected language on independently hosted apps', () => {
  assert.equal(getTerminalUrl('https://terminal.example/', 'pt-BR'), 'https://terminal.example/?lang=pt-BR');
  assert.equal(getTerminalUrl('https://terminal.example/', 'en'), 'https://terminal.example/?lang=en');
  assert.equal(getTerminalUrl('https://terminal.example/', 'fr'), 'https://terminal.example/?lang=en');
});

test('terminal links preserve deployment paths and replace an old locale', () => {
  assert.equal(getTerminalUrl('https://example.com/terminal/?source=web&lang=en', 'pt-BR'), 'https://example.com/terminal/?source=web&lang=pt-BR');
});

test('deployment links require absolute HTTP or HTTPS URLs', () => {
  for (const url of ['/terminal/', 'javascript:alert(1)', 'file:///tmp/terminal']) {
    assert.throws(() => getTerminalUrl(url, 'en'), TypeError);
  }
});

test('donation links select the localized page on their own deployment', () => {
  assert.equal(getDonationsUrl('https://donations.example/', 'en'), 'https://donations.example/');
  assert.equal(getDonationsUrl('https://donations.example', 'pt-BR'), 'https://donations.example/pt-br/');
  assert.equal(getDonationsUrl('https://example.com/donate?ref=web', 'fr'), 'https://example.com/donate/?ref=web');
  assert.throws(() => getDonationsUrl('javascript:alert(1)', 'en'), /PUBLIC_DONATIONS_URL/);
});

test('ordinary clicks, including keyboard-generated clicks, can animate navigation', () => {
  assert.equal(isPlainNavigation({ button: 0 }), true);
});

test('modified, auxiliary, and already-handled clicks retain native behavior', () => {
  for (const modifier of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey', 'defaultPrevented']) {
    assert.equal(isPlainNavigation({ button: 0, [modifier]: true }), false);
  }
  for (const button of [1, 2]) assert.equal(isPlainNavigation({ button }), false);
});
