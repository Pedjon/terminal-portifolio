import assert from 'node:assert/strict';
import { beforeEach, mock, test } from 'node:test';
import { createTerminal } from '../src/assets/scripts/handle-terminal.js';
import { getLang, setLang, t } from '../src/assets/scripts/i18n.js';
import { buildCommands } from '../src/assets/scripts/init-storage.js';

function setupTerminal() {
  let commands = buildCommands();
  const seedCommands = mock.fn(() => { commands = buildCommands(); });
  const addCommand = mock.fn();
  const addOutput = mock.fn();
  const clearOutput = mock.fn();
  const terminal = createTerminal({
    commandsCol: {
      find: () => commands,
      findOne: ({ name }) => commands.find(command => command.name === name)
    },
    seedCommands,
    addCommand,
    addOutput,
    clearOutput
  });

  return { terminal, seedCommands, addCommand, addOutput, clearOutput };
}

beforeEach(() => setLang('en'));

test('normalizes command casing and surrounding whitespace for output and history', () => {
  const { terminal, addCommand, addOutput } = setupTerminal();
  terminal.processCommand('  AbOuT \t');

  assert.deepEqual(addCommand.mock.calls[0].arguments, ['about']);
  assert.deepEqual(addOutput.mock.calls[0].arguments, [buildCommands().find(command => command.name === 'about').output, 'response']);
  assert.equal(terminal.previousCommand(), 'about');
});

test('ignores empty input without changing output or history', () => {
  const { terminal, addCommand, addOutput, clearOutput, seedCommands } = setupTerminal();
  for (const input of ['', ' ', '\t\n']) terminal.processCommand(input);

  for (const callback of [addCommand, addOutput, clearOutput, seedCommands]) {
    assert.equal(callback.mock.callCount(), 0);
  }
  assert.equal(terminal.previousCommand(), undefined);
  assert.equal(terminal.nextCommand(), '');

  terminal.processCommand('about');
  terminal.processCommand(' ');
  assert.equal(terminal.previousCommand(), 'about');
  assert.equal(terminal.previousCommand(), undefined);
});

for (const language of ['en', 'pt-BR']) {
  test(`displays registered command content in ${language}`, () => {
    setLang(language);
    const { terminal, addCommand, addOutput } = setupTerminal();
    const commands = buildCommands().filter(command => command.output !== null);

    for (const command of commands) terminal.processCommand(command.name);

    assert.deepEqual(addCommand.mock.calls.map(call => call.arguments), commands.map(command => [command.name]));
    assert.deepEqual(addOutput.mock.calls.map(call => call.arguments), commands.map(command => [command.output, 'response']));
  });

  test(`displays an unknown-command error in ${language}`, () => {
    setLang(language);
    const { terminal, addCommand, addOutput } = setupTerminal();
    terminal.processCommand('missing');

    assert.deepEqual(addCommand.mock.calls[0].arguments, ['missing']);
    assert.deepEqual(addOutput.mock.calls[0].arguments, [t('commandNotFound')('missing'), 'error']);
    assert.equal(terminal.previousCommand(), 'missing');
  });
}

test('switches languages, refreshes the catalog, and uses translated output immediately', () => {
  const { terminal, seedCommands, addOutput } = setupTerminal();

  for (const [input, language] of [['  LANG\tPT-BR ', 'pt-BR'], ['lang en', 'en']]) {
    terminal.processCommand(input);
    assert.equal(getLang(), language);
    assert.deepEqual(addOutput.mock.calls.at(-1).arguments, [t('langChanged')(language), 'response']);

    terminal.processCommand('help');
    assert.ok(addOutput.mock.calls.at(-1).arguments[0].startsWith(t('helpHeader')));
    terminal.processCommand('about');
    assert.equal(addOutput.mock.calls.at(-1).arguments[0], buildCommands().find(command => command.name === 'about').output);
  }

  assert.equal(seedCommands.mock.callCount(), 2);
});

for (const language of ['en', 'pt-BR']) {
  test(`rejects invalid language arguments with usage in ${language}`, () => {
    setLang(language);
    const { terminal, seedCommands, addOutput } = setupTerminal();
    const invalidCommands = ['lang', 'lang fr', 'lang en extra'];
    for (const command of invalidCommands) terminal.processCommand(command);

    assert.equal(getLang(), language);
    assert.equal(seedCommands.mock.callCount(), 0);
    assert.deepEqual(addOutput.mock.calls.map(call => call.arguments), invalidCommands.map(() => [t('langUsage'), 'response']));
  });
}

test('clears output while retaining history and accepting subsequent commands', () => {
  const { terminal, addCommand, addOutput, clearOutput } = setupTerminal();
  terminal.processCommand('about');
  terminal.processCommand('clear');

  assert.equal(clearOutput.mock.callCount(), 1);
  assert.equal(addOutput.mock.callCount(), 1);
  assert.deepEqual(addCommand.mock.calls.at(-1).arguments, ['clear']);
  assert.equal(terminal.previousCommand(), 'clear');
  assert.equal(terminal.previousCommand(), 'about');

  terminal.processCommand('skills');
  assert.equal(addOutput.mock.callCount(), 2);
  assert.equal(terminal.previousCommand(), 'skills');
});

test('navigates history at both boundaries and resets after a new command', () => {
  const { terminal } = setupTerminal();
  assert.equal(terminal.previousCommand(), undefined);
  assert.equal(terminal.nextCommand(), '');
  terminal.processCommand('about');
  terminal.processCommand('skills');

  assert.equal(terminal.previousCommand(), 'skills');
  assert.equal(terminal.previousCommand(), 'about');
  assert.equal(terminal.previousCommand(), undefined);
  assert.equal(terminal.nextCommand(), 'skills');
  assert.equal(terminal.nextCommand(), '');
  assert.equal(terminal.nextCommand(), '');
  assert.equal(terminal.previousCommand(), 'skills');

  terminal.processCommand('contact');
  assert.equal(terminal.previousCommand(), 'contact');
  assert.equal(terminal.previousCommand(), 'skills');
});

test('keeps history separate between controller instances', () => {
  const first = setupTerminal().terminal;
  const second = setupTerminal().terminal;
  first.processCommand('about');

  assert.equal(second.previousCommand(), undefined);
  second.processCommand('skills');
  assert.equal(first.previousCommand(), 'about');
  assert.equal(second.previousCommand(), 'skills');
});

test('completes unique prefixes and preserves ambiguous or unmatched input', () => {
  const { terminal, addCommand, addOutput } = setupTerminal();
  for (const [input, expected] of [['abo', 'about'], ['HE', 'help'], ['about', 'about'], ['EX', 'experience'], ['c', 'c'], ['', ''], ['missing', 'missing']]) {
    assert.equal(terminal.completeCommand(input), expected);
  }

  assert.equal(terminal.previousCommand(), undefined);
  assert.equal(addCommand.mock.callCount(), 0);
  assert.equal(addOutput.mock.callCount(), 0);
});
