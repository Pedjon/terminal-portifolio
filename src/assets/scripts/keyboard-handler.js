// Event listeners
input.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'Enter': {
      const command = input.value;
      processCommand(command);
      input.value = '';
      break;
    }
    case 'ArrowUp':
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
      break;
    case 'ArrowDown':
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
      break;
    case 'Tab': {
      e.preventDefault();
      // Auto-complete functionality
      const currentInput = input.value.toLowerCase();
      const allCmds = commandsCol.find().map(c => c.name);
      const matches = allCmds.filter(cmd => cmd.startsWith(currentInput));
      if (matches.length === 1) {
        input.value = matches[0];
      }
      break;
    }
  }
});
