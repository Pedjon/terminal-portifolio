import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { getLang, setLang, t, tCmd } from '../src/assets/scripts/i18n.js';

const defaultLanguage = getLang();

beforeEach(() => setLang('en'));

test('starts in English', () => {
  assert.equal(defaultLanguage, 'en');
  assert.equal(t('helpHeader'), 'Available commands:');
});

test('switches translations and command content to Portuguese and back', () => {
  setLang('pt-BR');
  assert.equal(getLang(), 'pt-BR');
  assert.equal(t('helpHeader'), 'Comandos disponíveis:');
  assert.equal(tCmd('about').description, 'Saiba mais sobre mim');
  assert.ok(tCmd('about').output.startsWith('Sobre Mim'));

  setLang('en');
  assert.equal(getLang(), 'en');
  assert.equal(tCmd('about').description, 'Learn about me');
  assert.ok(tCmd('about').output.startsWith('About Me'));
});

test('formats command errors and language confirmations in the current language', () => {
  assert.equal(t('commandNotFound')('missing'), "Command not found: missing. Type 'help' for available commands.");
  assert.equal(t('langChanged')('en'), 'Language changed to English.');

  setLang('pt-BR');
  assert.equal(t('commandNotFound')('missing'), "Comando não encontrado: missing. Digite 'help' para ver os comandos disponíveis.");
  assert.equal(t('langChanged')('pt-BR'), 'Idioma alterado para Português (BR).');
});

test('donation text keeps one link placeholder in both languages', () => {
  for (const language of ['en', 'pt-BR']) {
    setLang(language);
    assert.equal(tCmd('donate').output.split('{donations}').length, 2);
    assert.ok(t('donationsLink'));
  }
});
