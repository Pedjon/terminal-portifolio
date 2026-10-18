const messages = {
  en: {
    pageTitle: 'Support my projects',
    pageDescription: 'Support Pedro’s projects with a one-time donation through Mercado Pago.',
    skipLink: 'Skip to content',
    language: 'Language',
    darkTheme: 'Dark theme',
    light: 'Light',
    dark: 'Dark',
    portfolio: 'Portfolio',
    eyebrow: 'Donations',
    headline: 'Support my',
    headlineAccent: 'projects.',
    intro: 'If you liked my projects, you can support them with a donation. Every contribution helps me keep building and sharing.',
    options: 'Ways to support',
    mercadoPago: 'Mercado Pago',
    mercadoPagoDescription: 'One-time donation in Brazilian reais by card, PIX, or other methods available at Mercado Pago’s secure checkout.',
    amount: 'Amount',
    presetAmounts: 'Suggested amounts',
    customAmount: 'Other amount',
    amountHint: 'Between {min} and {max}.',
    donate: 'Continue to Mercado Pago',
    redirecting: 'Opening Mercado Pago…',
    invalidAmount: 'Enter an amount between {min} and {max}.',
    verificationRequired: 'Complete the verification before continuing.',
    checkoutError: 'The checkout could not be opened. Please try again in a moment.',
    javascriptRequired: 'Donations need JavaScript for the security check and the redirect to Mercado Pago.',
    paymentSuccess: 'Thank you! Your donation was received.',
    paymentPending: 'Thank you! Your donation is being processed by Mercado Pago.',
    paymentFailure: 'The payment was not completed. You can try again whenever you like.',
    checkoutItem: 'Donation to Pedro’s projects',
    checkoutItemDescription: 'Thank you for your support!',
    backToPortfolio: 'Back to the portfolio'
  },
  'pt-BR': {
    pageTitle: 'Apoie meus projetos',
    pageDescription: 'Apoie os projetos de Pedro com uma doação única pelo Mercado Pago.',
    skipLink: 'Pular para o conteúdo',
    language: 'Idioma',
    darkTheme: 'Tema escuro',
    light: 'Claro',
    dark: 'Escuro',
    portfolio: 'Portfólio',
    eyebrow: 'Doações',
    headline: 'Apoie meus',
    headlineAccent: 'projetos.',
    intro: 'Se você gostou dos meus projetos, pode apoiá-los com uma doação. Cada contribuição me ajuda a continuar criando e compartilhando.',
    options: 'Formas de apoiar',
    mercadoPago: 'Mercado Pago',
    mercadoPagoDescription: 'Doação única em reais por cartão, PIX ou outros meios disponíveis no checkout seguro do Mercado Pago.',
    amount: 'Valor',
    presetAmounts: 'Valores sugeridos',
    customAmount: 'Outro valor',
    amountHint: 'Entre {min} e {max}.',
    donate: 'Continuar para o Mercado Pago',
    redirecting: 'Abrindo o Mercado Pago…',
    invalidAmount: 'Informe um valor entre {min} e {max}.',
    verificationRequired: 'Conclua a verificação antes de continuar.',
    checkoutError: 'Não foi possível abrir o checkout. Tente novamente em instantes.',
    javascriptRequired: 'As doações precisam de JavaScript para a verificação de segurança e o redirecionamento ao Mercado Pago.',
    paymentSuccess: 'Obrigado! Sua doação foi recebida.',
    paymentPending: 'Obrigado! Sua doação está sendo processada pelo Mercado Pago.',
    paymentFailure: 'O pagamento não foi concluído. Você pode tentar novamente quando quiser.',
    checkoutItem: 'Doação para os projetos de Pedro',
    checkoutItemDescription: 'Muito obrigado pelo apoio!',
    backToPortfolio: 'Voltar ao portfólio'
  }
};

export const supportedLocales = Object.freeze(['en', 'pt-BR']);

export function resolveLocale(locale) {
  return supportedLocales.includes(locale) ? locale : 'en';
}

export function getMessages(locale) {
  return messages[resolveLocale(locale)];
}

export function localePath(locale) {
  return resolveLocale(locale) === 'pt-BR' ? '/pt-br/' : '/';
}

export function fillMessage(message, values) {
  return message.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}
