const input = document.getElementById('input');
const output = document.getElementById('output');
const terminalBody = document.querySelector('.terminal-body');

// Command history
let commandHistory = [];
let historyIndex = -1;

// Add output to terminal
function addOutput(text, className = '') {
  if (text === null) return;
  
  const line = document.createElement('div');
  line.className = `output-line ${className}`;
  line.textContent = text;
  output.appendChild(line);
  scrollToBottom();
}

// Add command to terminal
function addCommand(command) {
  const line = document.createElement('div');
  line.className = 'output-line command';
  line.innerHTML = `<span class="prompt">guest@portfolio:~$</span> <span class="command-text">${command}</span>`;
  output.appendChild(line);
  scrollToBottom();
}

// Process command
function processCommand(command) {
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
function scrollToBottom() {
  terminalBody.scrollTop = terminalBody.scrollHeight;
}
