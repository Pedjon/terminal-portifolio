import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MAX_AMOUNT, MIN_AMOUNT, PRESET_AMOUNTS, formatAmount, normalizeAmount, parseAmountInput } from '../src/scripts/amount.js';

test('amounts are rounded to cents and limited to the accepted range', () => {
  assert.equal(normalizeAmount(25), 25);
  assert.equal(normalizeAmount(10.555), 10.56);
  assert.equal(normalizeAmount(MIN_AMOUNT), MIN_AMOUNT);
  assert.equal(normalizeAmount(MAX_AMOUNT), MAX_AMOUNT);
  for (const value of [MIN_AMOUNT - 0.01, MAX_AMOUNT + 0.01, 0, -10, NaN, Infinity, '25', null, undefined]) {
    assert.equal(normalizeAmount(value), null);
  }
});

test('typed amounts follow each locale’s separators', () => {
  assert.equal(parseAmountInput('25', 'pt-BR'), 25);
  assert.equal(parseAmountInput('25,50', 'pt-BR'), 25.5);
  assert.equal(parseAmountInput('R$ 1.000,00', 'pt-BR'), 1000);
  assert.equal(parseAmountInput('25.50', 'en'), 25.5);
  assert.equal(parseAmountInput('1,000.00', 'en'), 1000);
});

test('malformed or out-of-range typed amounts are rejected', () => {
  for (const text of ['', 'abc', '-10', '1e3', '10,5,0', '10,555', '2', '10.000,00']) {
    assert.equal(parseAmountInput(text, 'pt-BR'), null, text);
  }
  for (const text of ['25,50', '1,00,000', '.50']) {
    assert.equal(parseAmountInput(text, 'en'), null, text);
  }
});

test('suggested amounts are accepted and formatted in reais', () => {
  for (const amount of PRESET_AMOUNTS) assert.equal(normalizeAmount(amount), amount);
  assert.match(formatAmount(25, 'pt-BR'), /^R\$\s25$/);
  assert.match(formatAmount(25.5, 'en'), /^R\$25\.50$/);
});
