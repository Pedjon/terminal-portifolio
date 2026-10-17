import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getPortfolio, supportedLocales } from '../src/index.js';

test('provides explicit locales and falls back to English for unsupported inputs', () => {
  assert.deepEqual(supportedLocales, ['en', 'pt-BR']);
  for (const locale of [undefined, null, '', 'fr', 'toString', '__proto__']) {
    assert.equal(getPortfolio(locale).locale, 'en');
  }
});

for (const locale of supportedLocales) {
  test(`provides complete structured portfolio records in ${locale}`, () => {
    const portfolio = getPortfolio(locale);
    assert.equal(portfolio.locale, locale);
    assert.ok(portfolio.profile.name);
    assert.ok(portfolio.profile.role);
    assert.equal(portfolio.profile.paragraphs.length, 4);
    assert.ok(portfolio.profile.paragraphs.every(paragraph => paragraph.length > 0));

    for (const [collection, count, fields] of [
      ['skills', 9, ['label']],
      ['projects', 4, ['title', 'organization']],
      ['experience', 5, ['role', 'organization', 'period']],
      ['education', 4, ['qualification', 'institution', 'year']]
    ]) {
      const records = portfolio[collection];
      assert.equal(records.length, count);
      assert.equal(new Set(records.map(record => record.id)).size, count);
      for (const record of records) {
        for (const field of fields) assert.ok(record[field]?.length > 0, `${record.id}.${field}`);
        if (record.highlights) assert.ok(record.highlights.every(highlight => highlight.length > 0));
        if (record.items) assert.ok(record.items.every(item => item.length > 0));
      }
    }

    assert.match(portfolio.contact.email, /^[^@]+@[^@]+$/);
    assert.ok(portfolio.contact.location.length > 0);
    assert.equal(new URL(portfolio.contact.linkedin).protocol, 'https:');
  });
}

test('translations cover the same records without sharing mutable language state', () => {
  const english = getPortfolio('en');
  const portuguese = getPortfolio('pt-BR');
  for (const key of ['skills', 'projects', 'experience', 'education']) {
    assert.deepEqual(english[key].map(record => record.id), portuguese[key].map(record => record.id));
  }
  assert.notEqual(english.profile.paragraphs[0], portuguese.profile.paragraphs[0]);
  assert.equal(english.locale, 'en');
  assert.equal(getPortfolio('en').locale, 'en');
  assert.equal(english.contact.email, portuguese.contact.email);
});
