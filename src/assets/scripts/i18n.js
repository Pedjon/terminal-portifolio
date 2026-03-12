import { welcome } from './commands/welcome.js';
import { about } from './commands/about.js';
import { help } from './commands/help.js';
import { skills } from './commands/skills.js';
import { projects } from './commands/projects.js';
import { contact } from './commands/contact.js';
import { education } from './commands/education.js';
import { experience } from './commands/experience.js';
import { clear } from './commands/clear.js';
import { lang } from './commands/lang.js';


let currentLang = 'en';

const translations = {
  en: {
    commands: {
      ...help['en'],
      ...about['en'],
      ...skills['en'],
      ...projects['en'],
      ...contact['en'],
      ...education['en'],
      ...experience['en'],
      ...clear['en'],
      ...lang['en'],
    },
    ...welcome['en'],
    commandNotFound: (cmd) => `Command not found: ${cmd}. Type 'help' for available commands.`,
    helpHeader: 'Available commands:',
    helpFooter: 'Type any command to get started!',
    langChanged: (lang) => `Language changed to ${lang === 'en' ? 'English' : 'Português (BR)'}.`,
    langUsage: "Usage: lang <en|pt-BR>\nCurrent language: English",
  },
  'pt-BR': {
    commands: {
      ...help['pt-BR'],
      ...about['pt-BR'],
      ...skills['pt-BR'],
      ...projects['pt-BR'],
      ...contact['pt-BR'],
      ...education['pt-BR'],
      ...experience['pt-BR'],
      ...clear['pt-BR'],
      ...lang['pt-BR'],
    },
    ...welcome['pt-BR'],
    commandNotFound: (cmd) => `Comando não encontrado: ${cmd}. Digite 'help' para ver os comandos disponíveis.`,
    helpHeader: 'Comandos disponíveis:',
    helpFooter: 'Digite qualquer comando para começar!',
    langChanged: (lang) => `Idioma alterado para ${lang === 'en' ? 'English' : 'Português (BR)'}.`,
    langUsage: "Uso: lang <en|pt-BR>\nIdioma atual: Português (BR)",
  }
};

export function t(key) {
  return translations[currentLang][key];
}

export function tCmd(cmdName) {
  return translations[currentLang].commands[cmdName];
}

export function setLang(lang) {
  currentLang = lang;
}

export function getLang() {
  return currentLang;
}
