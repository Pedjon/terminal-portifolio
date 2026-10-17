import en from './en.js';
import ptBR from './pt-BR.js';

const portfolios = { en, 'pt-BR': ptBR };

export const supportedLocales = Object.freeze(['en', 'pt-BR']);

// The returned records are shared content; consumers should treat them as read-only.
export function getPortfolio(locale = 'en') {
  return portfolios[supportedLocales.includes(locale) ? locale : 'en'];
}
