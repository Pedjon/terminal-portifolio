import { setLang, t } from './i18n.js';
import { commandsCol, seedCommands } from './init-storage.js';

export const input = document.getElementById('input');
export const output = document.getElementById('output');
export const terminalBody = document.querySelector('.terminal-body');

// Command history
export let commandHistory = [];
let historyIndex = -1;

export function getHistoryIndex() { return historyIndex; }
export function setHistoryIndex(val) { historyIndex = val; }

// Add output to terminal
export function addOutput(text, className = '') {
  if (text === null) return;
  
  const line = document.createElement('div');
  line.className = `output-line ${className}`;
  line.textContent = text;
  output.appendChild(line);
  scrollToBottom();
}

// Add command to terminal
export function addCommand(command) {
  const line = document.createElement('div');
  line.className = 'output-line command';
  line.innerHTML = `<span class="prompt">guest@portfolio:~$</span> <span class="command-text">${command}</span>`;
  output.appendChild(line);
  scrollToBottom();
}

// Process command
export function processCommand(command) {
  command = command.trim().toLowerCase();
  
  if (command === '') return;
  
  // Add to history
  commandHistory.push(command);
  historyIndex = commandHistory.length;
  
  // Display command
  addCommand(command);

  // Handle lang command
  if (command.startsWith('lang')) {
    const parts = command.split(/\s+/);
    if (parts.length === 2 && (parts[1] === 'en' || parts[1] === 'pt-br')) {
      const lang = parts[1] === 'pt-br' ? 'pt-BR' : parts[1];
      setLang(lang);
      seedCommands();
      addOutput(t('langChanged')(lang), 'response');
    } else {
      addOutput(t('langUsage'), 'response');
    }
    return;
  }
  
  // Query LokiJS for the command
  const cmd = commandsCol.findOne({ name: command });
  
  if (cmd) {
    if (command === 'clear') {
      output.innerHTML = '';
    } else if (cmd.output) {
      addOutput(cmd.output, 'response');
    }
  } else {
    addOutput(t('commandNotFound')(command), 'error');
  }
}

// Scroll to bottom
export function scrollToBottom() {
  terminalBody.scrollTop = terminalBody.scrollHeight;
}
