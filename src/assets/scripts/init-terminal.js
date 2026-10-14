import { t } from './i18n.js';
import { initStorage } from './init-storage.js';
import { createTerminal } from './handle-terminal.js';
import { bindKeyboard } from './keyboard-handler.js';

function initTerminal() {
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const terminalBody = document.querySelector('.terminal-body');
  const { commandsCol, seedCommands } = initStorage(globalThis.loki);

  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function addOutput(text, className = '') {
    if (text === null) return;

    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    line.textContent = text;
    output.appendChild(line);
    scrollToBottom();
  }

  function addCommand(command) {
    const line = document.createElement('div');
    line.className = 'output-line command';

    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = 'guest@portfolio:~$';

    const commandText = document.createElement('span');
    commandText.className = 'command-text';
    commandText.textContent = command;

    line.append(prompt, ' ', commandText);
    output.appendChild(line);
    scrollToBottom();
  }

  const terminal = createTerminal({
    commandsCol,
    seedCommands,
    addCommand,
    addOutput,
    clearOutput: () => output.replaceChildren()
  });

  bindKeyboard(input, terminal);
  terminalBody.addEventListener('click', () => input.focus());
  addOutput(t('welcome'), 'response');
  input.focus();
}

initTerminal();
