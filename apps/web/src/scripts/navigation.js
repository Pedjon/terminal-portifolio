export function getTerminalUrl(baseUrl, locale) {
  const url = new URL(baseUrl);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new TypeError('PUBLIC_TERMINAL_URL must be an absolute HTTP or HTTPS URL.');
  }
  url.searchParams.set('lang', locale === 'pt-BR' ? locale : 'en');
  return url.href;
}
