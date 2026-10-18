import { supportedLocales } from '@portfolio/content';

export function getInitialLocale(search) {
  const requested = new URLSearchParams(search).get('lang')?.toLowerCase();
  return supportedLocales.find(locale => locale.toLowerCase() === requested) || 'en';
}

function getLocalizedRootUrl(baseUrl, locale, variable) {
  const url = new URL(baseUrl);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new TypeError(`${variable} must be an absolute HTTP or HTTPS URL.`);
  }
  url.pathname = `${url.pathname.replace(/\/?$/, '/')}${locale === 'pt-BR' ? 'pt-br/' : ''}`;
  return url.href;
}

export function getWebsiteUrl(baseUrl, locale) {
  return getLocalizedRootUrl(baseUrl, locale, 'VITE_WEB_URL');
}

export function getDonationsUrl(baseUrl, locale) {
  return getLocalizedRootUrl(baseUrl, locale, 'VITE_DONATIONS_URL');
}

export function isPlainNavigation(event) {
  return event.button === 0 && !event.defaultPrevented
    && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
