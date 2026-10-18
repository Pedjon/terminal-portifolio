export function getTerminalUrl(baseUrl, locale) {
  const url = new URL(baseUrl);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new TypeError('PUBLIC_TERMINAL_URL must be an absolute HTTP or HTTPS URL.');
  }
  url.searchParams.set('lang', locale === 'pt-BR' ? locale : 'en');
  return url.href;
}

export function isPlainNavigation(event) {
  return event.button === 0 && !event.defaultPrevented
    && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function initTerminalNavigation() {
  const screen = document.getElementById('terminal-boot');
  let navigationTimer;

  function reset() {
    window.clearTimeout(navigationTimer);
    navigationTimer = undefined;
    screen.hidden = true;
    document.documentElement.classList.remove('is-booting');
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-terminal-link]');
    if (!link || !isPlainNavigation(event)
      || (link.target && link.target.toLowerCase() !== '_self')
      || link.hasAttribute('download')
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    event.preventDefault();
    if (navigationTimer !== undefined) return;

    const destination = link.href;
    screen.hidden = false;
    document.documentElement.classList.add('is-booting');
    navigationTimer = window.setTimeout(() => window.location.assign(destination), 800);
  });

  window.addEventListener('pagehide', reset);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) reset();
  });
}
