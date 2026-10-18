import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TURNSTILE_ACTION, buildPreference, handleCheckout, parseHostnames } from '../worker/checkout.js';
import worker from '../worker/index.js';

const env = {
  MP_ACCESS_TOKEN: 'mp-test-token',
  TURNSTILE_SECRET_KEY: 'turnstile-secret',
  TURNSTILE_HOSTNAMES: 'donations.example.com'
};
const verified = { success: true, action: TURNSTILE_ACTION, hostname: 'donations.example.com' };

function checkoutRequest(body, headers = {}) {
  return new Request('https://donations.example.com/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.7', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

// Answers siteverify and Mercado Pago calls, recording each request.
function mockFetch({ siteverify = verified, preference = { status: 201, body: { id: 'pref-1', init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-1' } } } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (url.includes('siteverify')) return Response.json(siteverify);
    return Response.json(preference.body, { status: preference.status });
  };
  return { calls, fetchImpl };
}

test('a verified donation creates a Mercado Pago preference and returns its checkout URL', async (t) => {
  t.mock.method(console, 'info', () => {});
  const { calls, fetchImpl } = mockFetch();
  const response = await handleCheckout(checkoutRequest({ amount: 25.5, locale: 'pt-BR', turnstileToken: 'token' }), env, fetchImpl);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { url: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-1' });

  const verification = new URLSearchParams(calls[0].init.body);
  assert.equal(verification.get('secret'), 'turnstile-secret');
  assert.equal(verification.get('response'), 'token');
  assert.equal(verification.get('remoteip'), '203.0.113.7');

  assert.equal(calls[1].url, 'https://api.mercadopago.com/checkout/preferences');
  assert.equal(calls[1].init.headers.Authorization, 'Bearer mp-test-token');
  const preference = JSON.parse(calls[1].init.body);
  assert.equal(preference.items[0].unit_price, 25.5);
  assert.equal(preference.items[0].currency_id, 'BRL');
  assert.equal(preference.back_urls.success, 'https://donations.example.com/pt-br/?payment=success');
});

test('invalid amounts are rejected before verification or checkout', async () => {
  for (const amount of [1, 6000, '25', null]) {
    const { calls, fetchImpl } = mockFetch();
    const response = await handleCheckout(checkoutRequest({ amount, turnstileToken: 'token' }), env, fetchImpl);
    assert.equal(response.status, 400);
    assert.equal(calls.length, 0);
  }
});

test('malformed and oversized requests are rejected', async () => {
  const { calls, fetchImpl } = mockFetch();
  assert.equal((await handleCheckout(checkoutRequest('{'), env, fetchImpl)).status, 400);
  const large = checkoutRequest({ amount: 25 }, { 'Content-Length': '5000' });
  assert.equal((await handleCheckout(large, env, fetchImpl)).status, 413);
  assert.equal(calls.length, 0);
});

test('failed, mismatched, or missing Turnstile verification blocks checkout', async (t) => {
  t.mock.method(console, 'error', () => {});
  const cases = [
    { siteverify: { ...verified, success: false } },
    { siteverify: { ...verified, action: 'login' } },
    { siteverify: { ...verified, hostname: 'localhost' } },
    { siteverify: { ...verified, action: undefined } },
    { token: '' },
    { token: 'x'.repeat(2049) },
    { env: { ...env, TURNSTILE_HOSTNAMES: '' } }
  ];
  for (const { siteverify, token = 'token', env: caseEnv = env } of cases) {
    const { calls, fetchImpl } = mockFetch({ siteverify });
    const response = await handleCheckout(checkoutRequest({ amount: 25, turnstileToken: token }), caseEnv, fetchImpl);
    assert.equal(response.status, 403);
    assert.ok(calls.every(call => !call.url.includes('mercadopago')));
  }
});

test('Cloudflare test keys pass verification without an action', async (t) => {
  t.mock.method(console, 'info', () => {});
  const siteverify = { success: true, hostname: 'donations.example.com', metadata: { result_with_testing_key: true } };
  const { fetchImpl } = mockFetch({ siteverify });
  const response = await handleCheckout(checkoutRequest({ amount: 25, turnstileToken: 'token' }), env, fetchImpl);
  assert.equal(response.status, 200);
});

test('checkout failures return a generic error without exposing Mercado Pago details', async (t) => {
  t.mock.method(console, 'error', () => {});
  const { fetchImpl } = mockFetch({ preference: { status: 401, body: { message: 'invalid access token' } } });
  const response = await handleCheckout(checkoutRequest({ amount: 25, turnstileToken: 'token' }), env, fetchImpl);
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: 'checkout_unavailable' });

  const unconfigured = await handleCheckout(checkoutRequest({ amount: 25, turnstileToken: 'token' }),
    { ...env, MP_ACCESS_TOKEN: '' }, mockFetch().fetchImpl);
  assert.equal(unconfigured.status, 503);
});

test('preferences return visitors to their language with English as the fallback', () => {
  const english = buildPreference({ amount: 10, locale: 'fr', origin: 'https://donations.example.com' });
  assert.equal(english.back_urls.failure, 'https://donations.example.com/?payment=failure');
  assert.equal(english.auto_return, 'approved');
  assert.match(english.items[0].title, /projects/);
});

test('Turnstile hostnames are read from a comma-separated list', () => {
  assert.deepEqual([...parseHostnames(' a.example.com, ,b.example.com ')], ['a.example.com', 'b.example.com']);
  assert.equal(parseHostnames(undefined).size, 0);
});

test('the Worker routes only the checkout API and serves other paths as assets', async () => {
  const assetEnv = { ...env, ASSETS: { fetch: async () => new Response('asset') } };
  const get = await worker.fetch(new Request('https://donations.example.com/api/checkout'), assetEnv);
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('Allow'), 'POST');
  const unknown = await worker.fetch(new Request('https://donations.example.com/api/other'), assetEnv);
  assert.equal(unknown.status, 404);
  const page = await worker.fetch(new Request('https://donations.example.com/'), assetEnv);
  assert.equal(await page.text(), 'asset');
});
