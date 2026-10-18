import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { setLang, t, tCmd } from '../src/assets/scripts/i18n.js';
import { buildCommands } from '../src/assets/scripts/init-storage.js';

const commandNames = ['help', 'about', 'skills', 'projects', 'contact', 'education', 'experience', 'donate', 'clear', 'lang'];

beforeEach(() => setLang('en'));

for (const language of ['en', 'pt-BR']) {
  test(`builds the command catalog and complete help in ${language}`, () => {
    setLang(language);
    const commands = buildCommands();
    assert.deepEqual(commands.map(command => command.name), commandNames);

    const help = commands.find(command => command.name === 'help').output;
    assert.ok(help.startsWith(t('helpHeader')));
    assert.ok(help.endsWith(t('helpFooter')));

    for (const command of commands) {
      assert.equal(command.description, tCmd(command.name).description);
      assert.ok(command.description.length > 0);
      const helpEntries = help.split('\n').filter(line => line.trimStart().startsWith(`${command.name} `));
      assert.equal(helpEntries.length, 1, `${command.name} should appear once in help`);
      assert.ok(helpEntries[0].endsWith(command.description));
      if (command.name !== 'help') {
        assert.equal(command.output, tCmd(command.name).output ?? null);
      }
    }
  });
}

test('returns fresh command records on every build', () => {
  const first = buildCommands();
  const second = buildCommands();
  first[0].output = 'changed';
  first[1].description = 'changed';

  assert.ok(second[0].output.startsWith('Available commands:'));
  assert.equal(second[1].description, 'Learn about me');
  assert.equal(tCmd('about').description, 'Learn about me');
});
