import { getPortfolio } from '@portfolio/content';
import { formatPortfolioCommand } from './format-portfolio.js';

let currentLang = 'en';

const translations = {
  en: {
    pageTitle: 'Portfolio - Terminal',
    websiteLink: 'Website portfolio',
    welcomeWebsiteLink: 'portfolio website',
    donationsLink: 'donations page',
    inputLabel: 'Terminal command',
    shutdownMessage: 'Shutting down…',
    welcome: `
Welcome to my Portfolio Terminal!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type 'help' to see available commands.
Type any command and press Enter to interact.

Not used to using a terminal? You can also view my {website}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
    commandNotFound: (cmd) => `Command not found: ${cmd}. Type 'help' for available commands.`,
    helpHeader: 'Available commands:',
    helpFooter: 'Type any command to get started!',
    langChanged: (lang) => `Language changed to ${lang === 'en' ? 'English' : 'Português (BR)'}.`,
    langUsage: "Usage: lang <en|pt-BR>\nCurrent language: English",
    contactLabels: { email: 'Email', location: 'Location', linkedin: 'LinkedIn' },
    commands: {
      help: { description: 'Show available commands' },
      about: {
        description: 'Learn about me',
        title: 'About Me'
      },
      skills: {
        description: 'View my technical skills',
        title: 'Technical Skills'
      },
      projects: {
        description: 'Explore selected work projects',
        title: 'Selected Work Projects'
      },
      contact: {
        description: 'Get my contact information',
        title: 'Contact Information'
      },
      education: {
        description: 'View my education background',
        title: 'Education'
      },
      experience: {
        description: 'See my work experience',
        title: 'Work Experience'
      },
      donate: {
        description: 'Support my projects',
        output: 'Find my projects useful? You can support them on my {donations}.'
      },
      clear: { description: 'Clear the terminal' },
      lang: { description: 'Change language (en, pt-BR)' }
    }
  },
  'pt-BR': {
    pageTitle: 'Portfólio - Terminal',
    websiteLink: 'Portfólio web',
    welcomeWebsiteLink: 'site do portfólio',
    donationsLink: 'página de doações',
    inputLabel: 'Comando do terminal',
    shutdownMessage: 'Desligando…',
    welcome: `
Bem-vindo ao meu Terminal Portfólio!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Digite 'help' para ver os comandos disponíveis.
Digite qualquer comando e pressione Enter.

Não está acostumado a usar um terminal? Você também pode visitar o {website}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
    commandNotFound: (cmd) => `Comando não encontrado: ${cmd}. Digite 'help' para ver os comandos disponíveis.`,
    helpHeader: 'Comandos disponíveis:',
    helpFooter: 'Digite qualquer comando para começar!',
    langChanged: (lang) => `Idioma alterado para ${lang === 'en' ? 'English' : 'Português (BR)'}.`,
    langUsage: "Uso: lang <en|pt-BR>\nIdioma atual: Português (BR)",
    contactLabels: { email: 'Email', location: 'Localização', linkedin: 'LinkedIn' },
    commands: {
      help: { description: 'Mostrar comandos disponíveis' },
      about: {
        description: 'Saiba mais sobre mim',
        title: 'Sobre Mim'
      },
      skills: {
        description: 'Ver minhas habilidades técnicas',
        title: 'Habilidades Técnicas'
      },
      projects: {
        description: 'Explorar projetos profissionais selecionados',
        title: 'Projetos Profissionais Selecionados'
      },
      contact: {
        description: 'Obter informações de contato',
        title: 'Informações de Contato'
      },
      education: {
        description: 'Ver minha formação acadêmica',
        title: 'Formação Acadêmica'
      },
      experience: {
        description: 'Ver minha experiência profissional',
        title: 'Experiência Profissional'
      },
      donate: {
        description: 'Apoiar meus projetos',
        output: 'Meus projetos foram úteis para você? Você pode apoiá-los na minha {donations}.'
      },
      clear: { description: 'Limpar o terminal' },
      lang: { description: 'Alterar idioma (en, pt-BR)' }
    }
  }
};

export function t(key) {
  return translations[currentLang][key];
}

export function tCmd(cmdName) {
  const translation = translations[currentLang].commands[cmdName];
  return {
    ...translation,
    output: translation.output ?? formatPortfolioCommand(cmdName, getPortfolio(currentLang), translation.title, t('contactLabels'))
  };
}

export function setLang(lang) {
  currentLang = lang;
}

export function getLang() {
  return currentLang;
}
