import { normalizeAmount } from '../src/scripts/amount.js';
import { getMessages, localePath, resolveLocale } from '../src/scripts/i18n.js';

export const TURNSTILE_ACTION = 'donate';
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const PREFERENCES_URL = 'https://api.mercadopago.com/checkout/preferences';
const MAX_BODY_BYTES = 4096;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

function log(level, event, details = {}) {
  console[level](JSON.stringify({ event, ...details }));
}

export function parseHostnames(value) {
  return new Set(String(value ?? '').split(',').map(hostname => hostname.trim()).filter(Boolean));
}

export async function verifyTurnstile({ token, secret, remoteIp, hostnames, fetchImpl }) {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048
    || !secret || hostnames.size === 0) return false;

  let result;
  try {
    const response = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({ secret, response: token, remoteip: remoteIp ?? '' })
    });
    if (!response.ok) throw new Error(`siteverify ${response.status}`);
    result = await response.json();
  } catch (error) {
    log('error', 'turnstile_unavailable', { message: error.message });
    return false;
  }

  // Cloudflare's test secret omits the action; production secrets never return testing results.
  const actionMatches = result.action === TURNSTILE_ACTION
    || result.metadata?.result_with_testing_key === true;
  return result.success === true && actionMatches && hostnames.has(result.hostname);
}

export function buildPreference({ amount, locale, origin }) {
  const ui = getMessages(locale);
  const returnUrl = payment => new URL(`${localePath(locale)}?payment=${payment}`, origin).href;
  return {
    items: [{
      id: 'donation',
      title: ui.checkoutItem,
      description: ui.checkoutItemDescription,
      quantity: 1,
      currency_id: 'BRL',
      unit_price: amount
    }],
    back_urls: {
      success: returnUrl('success'),
      pending: returnUrl('pending'),
      failure: returnUrl('failure')
    },
    auto_return: 'approved'
  };
}

export async function handleCheckout(request, env, fetchImpl = fetch) {
  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) {
    return json({ error: 'payload_too_large' }, 413);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }

  const amount = normalizeAmount(body?.amount);
  if (amount === null) return json({ error: 'invalid_amount' }, 400);

  const verified = await verifyTurnstile({
    token: body.turnstileToken,
    secret: env.TURNSTILE_SECRET_KEY,
    remoteIp: request.headers.get('CF-Connecting-IP'),
    hostnames: parseHostnames(env.TURNSTILE_HOSTNAMES),
    fetchImpl
  });
  if (!verified) return json({ error: 'verification_failed' }, 403);

  if (!env.MP_ACCESS_TOKEN) {
    log('error', 'checkout_not_configured');
    return json({ error: 'checkout_unavailable' }, 503);
  }

  const preference = buildPreference({
    amount,
    locale: resolveLocale(body.locale),
    origin: new URL(request.url).origin
  });

  try {
    const response = await fetchImpl(PREFERENCES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': crypto.randomUUID()
      },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify(preference)
    });
    const data = await response.json();
    if (!response.ok || typeof data.init_point !== 'string' || !data.init_point.startsWith('https://')) {
      log('error', 'checkout_rejected', { status: response.status });
      return json({ error: 'checkout_unavailable' }, 502);
    }
    log('info', 'checkout_created', { amount, preferenceId: data.id });
    return json({ url: data.init_point });
  } catch (error) {
    log('error', 'checkout_unavailable', { message: error.message });
    return json({ error: 'checkout_unavailable' }, 502);
  }
}
