import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getDonationsUrl, getInitialLocale, getWebsiteUrl, isPlainNavigation } from '../src/assets/scripts/navigation.js';

test('reads supported incoming languages and defaults to English', () => {
  for (const query of ['?lang=pt-BR', '?lang=pt-br', '?source=web&lang=PT-BR']) {
    assert.equal(getInitialLocale(query), 'pt-BR');
  }
  for (const query of ['', '?lang=en', '?lang=fr', '?lang=', '?lang=toString']) {
    assert.equal(getInitialLocale(query), 'en');
  }
});

test('website links select the localized page on another deployment', () => {
  assert.equal(getWebsiteUrl('https://portfolio.example/', 'en'), 'https://portfolio.example/');
  assert.equal(getWebsiteUrl('https://portfolio.example/', 'pt-BR'), 'https://portfolio.example/pt-br/');
  assert.equal(getWebsiteUrl('https://portfolio.example', 'fr'), 'https://portfolio.example/');
});

test('website links respect a configured base path and query string', () => {
  assert.equal(getWebsiteUrl('https://example.com/portfolio?source=terminal', 'pt-BR'), 'https://example.com/portfolio/pt-br/?source=terminal');
});

test('website deployment URLs must be absolute HTTP or HTTPS URLs', () => {
  for (const url of ['/portfolio/', 'javascript:alert(1)', 'file:///tmp/website']) {
    assert.throws(() => getWebsiteUrl(url, 'en'), TypeError);
  }
});

test('donation links select the localized page and validate their deployment URL', () => {
  assert.equal(getDonationsUrl('https://donations.example/', 'en'), 'https://donations.example/');
  assert.equal(getDonationsUrl('https://donations.example', 'pt-BR'), 'https://donations.example/pt-br/');
  assert.throws(() => getDonationsUrl('javascript:alert(1)', 'en'), /VITE_DONATIONS_URL/);
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
