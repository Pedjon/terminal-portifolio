import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getMessages } from '../src/scripts/i18n.js';

test('both website languages provide the same nonempty UI messages', () => {
  const english = getMessages('en');
  const portuguese = getMessages('pt-BR');
  assert.deepEqual(Object.keys(english), Object.keys(portuguese));
  for (const messages of [english, portuguese]) {
    for (const value of Object.values(messages)) assert.ok(value.length > 0);
  }
  assert.notEqual(english.contactTitle, portuguese.contactTitle);
});
