import { handleCheckout } from './checkout.js';

// Static assets are served before the Worker runs, except for /api/* (see wrangler.jsonc).
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/checkout') {
      if (request.method !== 'POST') {
        return new Response(null, { status: 405, headers: { Allow: 'POST' } });
      }
      return handleCheckout(request, env);
    }

    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'not_found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
