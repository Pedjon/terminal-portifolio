import { supportedLocales } from '@portfolio/content';

export function getInitialLocale(search) {
  const requested = new URLSearchParams(search).get('lang')?.toLowerCase();
  return supportedLocales.find(locale => locale.toLowerCase() === requested) || 'en';
}

export function getWebsiteUrl(baseUrl, locale) {
  const url = new URL(baseUrl);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new TypeError('VITE_WEB_URL must be an absolute HTTP or HTTPS URL.');
  }
  url.pathname = `${url.pathname.replace(/\/?$/, '/')}${locale === 'pt-BR' ? 'pt-br/' : ''}`;
  return url.href;
}

export function isPlainNavigation(event) {
  return event.button === 0 && !event.defaultPrevented
    && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
