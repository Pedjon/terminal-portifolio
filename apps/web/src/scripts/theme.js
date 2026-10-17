export function resolveTheme(preference, systemIsDark) {
  return preference === 'light' || preference === 'dark'
    ? preference
    : systemIsDark ? 'dark' : 'light';
}

export function initTheme() {
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  const label = button.querySelector('[data-theme-label]');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;

  try {
    const saved = window.localStorage.getItem('portfolio-theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {
    // Theme controls still work when browser storage is unavailable.
  }

  function applyTheme() {
    const theme = resolveTheme(preference, media.matches);
    root.dataset.theme = theme;
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    label.textContent = theme === 'dark' ? button.dataset.darkLabel : button.dataset.lightLabel;
  }

  button.addEventListener('click', () => {
    preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    try {
      window.localStorage.setItem('portfolio-theme', preference);
    } catch {
      // Keep the explicit choice for this page even if it cannot be persisted.
    }
  });
  media.addEventListener('change', applyTheme);
  applyTheme();
  button.hidden = false;
}
