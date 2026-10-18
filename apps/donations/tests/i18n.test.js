import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fillMessage, getMessages, localePath, resolveLocale } from '../src/scripts/i18n.js';
import { getPaymentResultMessage } from '../src/scripts/donate.js';

test('both donation page languages provide the same nonempty messages', () => {
  const english = getMessages('en');
  const portuguese = getMessages('pt-BR');
  assert.deepEqual(Object.keys(english), Object.keys(portuguese));
  for (const messages of [english, portuguese]) {
    for (const value of Object.values(messages)) assert.ok(value.length > 0);
  }
  assert.notEqual(english.intro, portuguese.intro);
});

test('unsupported locales fall back to English routes and messages', () => {
  assert.equal(resolveLocale('fr'), 'en');
  assert.equal(getMessages(undefined), getMessages('en'));
  assert.equal(localePath('pt-BR'), '/pt-br/');
  assert.equal(localePath('fr'), '/');
});

test('message placeholders are filled and unknown ones are kept', () => {
  assert.equal(fillMessage('From {min} to {max}', { min: 'R$ 5', max: 'R$ 5.000' }), 'From R$ 5 to R$ 5.000');
  assert.equal(fillMessage('{missing}', {}), '{missing}');
});

test('Mercado Pago return parameters select a payment result message', () => {
  const messages = getMessages('en');
  assert.equal(getPaymentResultMessage('?payment=success&collection_id=1', messages), messages.paymentSuccess);
  assert.equal(getPaymentResultMessage('?payment=pending', messages), messages.paymentPending);
  assert.equal(getPaymentResultMessage('?payment=failure', messages), messages.paymentFailure);
  assert.equal(getPaymentResultMessage('?payment=other', messages), null);
  assert.equal(getPaymentResultMessage('', messages), null);
});
