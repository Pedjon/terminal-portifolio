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
