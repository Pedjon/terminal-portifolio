export function bindKeyboard(input, terminal) {
  input.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Enter':
        terminal.processCommand(input.value);
        input.value = '';
        break;
      case 'ArrowUp': {
        e.preventDefault();
        const command = terminal.previousCommand();
        if (command !== undefined) input.value = command;
        break;
      }
      case 'ArrowDown':
        e.preventDefault();
        input.value = terminal.nextCommand();
        break;
      case 'Tab':
        if (e.shiftKey) break;
        e.preventDefault();
        input.value = terminal.completeCommand(input.value);
        break;
    }
  });
}
