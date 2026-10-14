import { t, tCmd } from './i18n.js';

export function buildCommands() {
  const cmdNames = ['help', 'about', 'skills', 'projects', 'contact', 'education', 'experience', 'clear', 'lang'];
  const commands = cmdNames.map(name => {
    const cmdTranslation = tCmd(name);
    return {
      name,
      description: cmdTranslation.description,
      output: cmdTranslation.output || null
    };
  });

  const lines = commands.map(c => `  ${c.name.padEnd(11)}- ${c.description}`);
  const helpCmd = commands.find(c => c.name === 'help');
  helpCmd.output = `${t('helpHeader')}\n${lines.join('\n')}\n  \n${t('helpFooter')}`;

  return commands;
}

export function initStorage(Loki) {
  const db = new Loki('portfolio.db');
  const commandsCol = db.addCollection('commands');

  function seedCommands() {
    commandsCol.clear();
    buildCommands().forEach(command => commandsCol.insert(command));
  }

  seedCommands();
  return { commandsCol, seedCommands };
}
