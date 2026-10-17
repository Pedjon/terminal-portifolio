import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import { bindKeyboard } from '../src/assets/scripts/keyboard-handler.js';

test('Tab completes commands while Shift+Tab allows focus to reach the website link', () => {
  let keydown;
  const input = { value: 'abo', addEventListener: (type, handler) => { keydown = handler; } };
  const terminal = { completeCommand: mock.fn(() => 'about') };
  const preventDefault = mock.fn();
  bindKeyboard(input, terminal);

  keydown({ key: 'Tab', shiftKey: true, preventDefault });
  assert.equal(preventDefault.mock.callCount(), 0);
  assert.equal(terminal.completeCommand.mock.callCount(), 0);
  assert.equal(input.value, 'abo');

  keydown({ key: 'Tab', shiftKey: false, preventDefault });
  assert.equal(preventDefault.mock.callCount(), 1);
  assert.equal(input.value, 'about');
});
