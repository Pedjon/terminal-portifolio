import { MAX_AMOUNT, MIN_AMOUNT, formatAmount, parseAmountInput } from './amount.js';
import { fillMessage, getMessages } from './i18n.js';

const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';
const paymentResults = { success: 'paymentSuccess', pending: 'paymentPending', failure: 'paymentFailure' };

export function getPaymentResultMessage(search, messages) {
  const key = paymentResults[new URLSearchParams(search).get('payment')];
  return key ? messages[key] : null;
}

function showPaymentResult(ui) {
  const message = getPaymentResultMessage(window.location.search, ui);
  if (!message) return;
  const banner = document.getElementById('payment-result');
  banner.textContent = message;
  banner.hidden = false;
  // Mercado Pago appends payment details to the return URL; keep them out of the address bar.
  window.history.replaceState(null, '', window.location.pathname + window.location.hash);
}

export function initDonations() {
  const form = document.getElementById('donation-form');
  const locale = form.dataset.locale;
  const ui = getMessages(locale);
  const input = form.querySelector('#donation-amount');
  const presets = [...form.querySelectorAll('[data-amount]')];
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('#donation-status');
  const container = form.querySelector('#turnstile');
  const limits = { min: formatAmount(MIN_AMOUNT, locale), max: formatAmount(MAX_AMOUNT, locale) };
  let widgetId;

  showPaymentResult(ui);

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
  }

  function setBusy(busy) {
    button.disabled = busy;
    button.setAttribute('aria-busy', String(busy));
  }

  function syncPresets() {
    const amount = parseAmountInput(input.value, locale);
    for (const preset of presets) {
      preset.setAttribute('aria-pressed', String(Number(preset.dataset.amount) === amount));
    }
  }

  for (const preset of presets) {
    preset.addEventListener('click', () => {
      input.value = preset.dataset.amount;
      syncPresets();
      setStatus('');
    });
  }
  input.addEventListener('input', () => {
    syncPresets();
    setStatus('');
  });

  window.onTurnstileLoad = () => {
    widgetId = window.turnstile.render(container, {
      sitekey: container.dataset.sitekey,
      action: 'donate',
      theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
      language: locale.toLowerCase(),
      // The normal widget needs 300px; narrow phones get the compact layout.
      size: container.clientWidth < 300 ? 'compact' : 'normal',
      // A new token resolves only the missing-verification message; keep checkout errors visible.
      callback: () => {
        if (status.textContent === ui.verificationRequired) setStatus('');
      }
    });
  };
  const script = document.createElement('script');
  script.src = TURNSTILE_SCRIPT;
  script.async = true;
  document.head.append(script);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const amount = parseAmountInput(input.value, locale);
    if (amount === null) {
      setStatus(fillMessage(ui.invalidAmount, limits), true);
      input.focus();
      return;
    }

    const token = widgetId === undefined ? '' : window.turnstile.getResponse(widgetId);
    if (!token) {
      setStatus(ui.verificationRequired, true);
      return;
    }

    setBusy(true);
    setStatus(ui.redirecting);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, locale, turnstileToken: token })
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || `HTTP ${response.status}`);
      window.location.assign(data.url);
    } catch {
      setStatus(ui.checkoutError, true);
      setBusy(false);
      // Turnstile tokens are single-use; request a new one before allowing a retry.
      window.turnstile.reset(widgetId);
    }
  });

  // Returning with Back restores the page from cache with the button still busy.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    setBusy(false);
    setStatus('');
    if (widgetId !== undefined) window.turnstile.reset(widgetId);
  });
}
