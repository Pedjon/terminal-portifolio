import { addOutput, input, terminalBody } from './handle-terminal.js';
import { t } from './i18n.js';
import './keyboard-handler.js';

// Initial welcome message
function showWelcome() {
  addOutput(t('welcome'), 'response');
}

// Keep input focused
terminalBody.addEventListener('click', () => {
  input.focus();
});

// Initialize
showWelcome();
input.focus();
