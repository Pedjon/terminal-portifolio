import { getLang, setLang, t } from './i18n.js';
import { initStorage } from './init-storage.js';
import { createTerminal } from './handle-terminal.js';
import { bindKeyboard } from './keyboard-handler.js';
import { getInitialLocale, getWebsiteUrl, isPlainNavigation } from './navigation.js';

function initTerminal() {
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const terminalBody = document.querySelector('.terminal-body');
  const websiteLink = document.getElementById('website-link');
  const websiteLabel = document.getElementById('website-label');
  const shutdownScreen = document.getElementById('shutdown-screen');
  let navigationTimer;

  setLang(getInitialLocale(window.location.search));

  function updateLanguage(locale) {
    document.documentElement.lang = locale;
    document.title = t('pageTitle');
    input.setAttribute('aria-label', t('inputLabel'));
    websiteLabel.textContent = t('websiteLink');
    websiteLink.href = getWebsiteUrl(import.meta.env.VITE_WEB_URL || 'http://localhost:8081/', locale);
    const welcomeLink = output.querySelector('#welcome-website-link');
    if (welcomeLink) welcomeLink.href = websiteLink.href;
  }

  updateLanguage(getLang());

  function resetShutdown() {
    window.clearTimeout(navigationTimer);
    navigationTimer = undefined;
    shutdownScreen.hidden = true;
    document.body.classList.remove('is-shutting-down');
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('#website-link, #welcome-website-link');
    if (!link || !isPlainNavigation(event)
      || (link.target && link.target.toLowerCase() !== '_self')
      || link.hasAttribute('download')
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    event.preventDefault();
    if (navigationTimer !== undefined) return;

    const destination = link.href;
    shutdownScreen.textContent = t('shutdownMessage');
    shutdownScreen.hidden = false;
    input.blur();
    document.body.classList.add('is-shutting-down');
    navigationTimer = window.setTimeout(() => window.location.assign(destination), 700);
  });

  window.addEventListener('pagehide', resetShutdown);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) resetShutdown();
  });

  const { commandsCol, seedCommands } = initStorage(globalThis.loki);

  const viewport = window.visualViewport;
  if (viewport) {
    function updateViewport() {
      const style = document.documentElement.style;

      // Keep normal browser zoom instead of resizing the terminal to a zoomed view.
      if (viewport.scale !== 1) {
        style.removeProperty('--terminal-height');
        style.removeProperty('--terminal-top');
        return;
      }

      style.setProperty('--terminal-height', `${viewport.height}px`);
      style.setProperty('--terminal-top', `${viewport.offsetTop}px`);
    }

    viewport.addEventListener('resize', updateViewport);
    viewport.addEventListener('scroll', updateViewport);
    window.addEventListener('resize', updateViewport);
    updateViewport();
  }

  function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
  }

  function addOutput(text, className = '') {
    if (text === null) return;

    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    line.textContent = text;
    output.appendChild(line);
    scrollToBottom();
  }

  function addWelcome() {
    const line = document.createElement('div');
    line.className = 'output-line response';
    const [beforeLink, afterLink] = t('welcome').split('{website}');
    const link = document.createElement('a');
    link.id = 'welcome-website-link';
    link.href = websiteLink.href;
    link.textContent = t('welcomeWebsiteLink');
    line.append(beforeLink, link, afterLink);
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
    clearOutput: () => output.replaceChildren(),
    onLanguageChange: updateLanguage
  });

  bindKeyboard(input, terminal);
  terminalBody.addEventListener('click', (event) => {
    if (!event.target.closest('a')) input.focus();
  });
  addWelcome();
  input.focus();
}

initTerminal();
