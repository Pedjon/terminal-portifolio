import { input, processCommand, commandHistory, getHistoryIndex, setHistoryIndex, addCommand, addOutput } from './handle-terminal.js';
import { commandsCol } from './init-storage.js';

// Event listeners
input.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'Enter': {
      const command = input.value;
      processCommand(command);
      input.value = '';
      break;
    }
    
    case 'ArrowUp': {
      e.preventDefault();
      if (getHistoryIndex() > 0) {
        setHistoryIndex(getHistoryIndex() - 1);
        input.value = commandHistory[getHistoryIndex()];
      }
      break;
    }
    
    case 'ArrowDown': {
      e.preventDefault();
      if (getHistoryIndex() < commandHistory.length - 1) {
        setHistoryIndex(getHistoryIndex() + 1);
        input.value = commandHistory[getHistoryIndex()];
      } else {
        setHistoryIndex(commandHistory.length);
        input.value = '';
      }
      break;
    }
    
    case 'Tab': {
      e.preventDefault();
      const currentInput = input.value.toLowerCase();

      if (currentInput === '') {
        break;
      }

      const allCmds = commandsCol.find().map(c => c.name);
      const matches = allCmds.filter(cmd => cmd.startsWith(currentInput));
      
      if (matches.length === 1) {
        input.value = matches[0];
      } else if (matches.length > 1) {
        addCommand(currentInput);
        addOutput(matches.join('  '), 'response');
      }
      break;
    }
  }
});
