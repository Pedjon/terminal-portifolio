// Initialize LokiJS database
const db = new loki('portfolio.db');
const commandsCol = db.addCollection('commands');

function seedCommands() {
  commandsCol.clear();

  const cmdNames = ['help', 'about', 'skills', 'projects', 'contact', 'education', 'experience', 'clear', 'lang'];
  cmdNames.forEach(name => {
    const cmdTranslation = tCmd(name);
    commandsCol.insert({
      name: name,
      description: cmdTranslation.description,
      output: cmdTranslation.output || null
    });
  });

  // Build the help output dynamically
  const allCmds = commandsCol.find();
  const lines = allCmds.map(c => `  ${c.name.padEnd(11)}- ${c.description}`);
  const helpText = `${t('helpHeader')}\n${lines.join('\n')}\n  \n${t('helpFooter')}`;
  const helpCmd = commandsCol.findOne({ name: 'help' });
  helpCmd.output = helpText;
  commandsCol.update(helpCmd);
}

seedCommands();
