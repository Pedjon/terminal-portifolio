import { setLang, t } from './i18n.js';

export function createTerminal({ commandsCol, seedCommands, addCommand, addOutput, clearOutput, onLanguageChange = () => {} }) {
  const commandHistory = [];
  let historyIndex = -1;

  function processCommand(command) {
    command = command.trim().toLowerCase();
    if (command === '') return;

    commandHistory.push(command);
    historyIndex = commandHistory.length;
    addCommand(command);

    if (command.startsWith('lang')) {
      const parts = command.split(/\s+/);
      if (parts.length === 2 && (parts[1] === 'en' || parts[1] === 'pt-br')) {
        const lang = parts[1] === 'pt-br' ? 'pt-BR' : parts[1];
        setLang(lang);
        seedCommands();
        onLanguageChange(lang);
        addOutput(t('langChanged')(lang), 'response');
      } else {
        addOutput(t('langUsage'), 'response');
      }
      return;
    }

    const cmd = commandsCol.findOne({ name: command });
    if (cmd) {
      if (command === 'clear') {
        clearOutput();
      } else if (cmd.output) {
        addOutput(cmd.output, 'response');
      }
    } else {
      addOutput(t('commandNotFound')(command), 'error');
    }
  }

  function previousCommand() {
    if (historyIndex > 0) {
      historyIndex--;
      return commandHistory[historyIndex];
    }
    return undefined;
  }

  function nextCommand() {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      return commandHistory[historyIndex];
    }
    historyIndex = commandHistory.length;
    return '';
  }

  function completeCommand(value) {
    const currentInput = value.toLowerCase();
    const matches = commandsCol.find().filter(cmd => cmd.name.startsWith(currentInput));
    return matches.length === 1 ? matches[0].name : value;
  }

  return { processCommand, previousCommand, nextCommand, completeCommand };
}
