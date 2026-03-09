let currentLang = 'en';

const translations = {
  en: {
    welcome: `
Welcome to my Portfolio Terminal!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type 'help' to see available commands.
Type any command and press Enter to interact.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
    commandNotFound: (cmd) => `Command not found: ${cmd}. Type 'help' for available commands.`,
    helpHeader: 'Available commands:',
    helpFooter: 'Type any command to get started!',
    langChanged: (lang) => `Language changed to ${lang === 'en' ? 'English' : 'Português (BR)'}.`,
    langUsage: "Usage: lang <en|pt-BR>\nCurrent language: English",
    commands: {
      help: { description: 'Show available commands' },
      about: {
        description: 'Learn about me',
        output: `About Me
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hello! I'm a passionate developer who loves
building things for the web.

This is a terminal-style portfolio website.
Feel free to explore by typing commands!`
      },
      skills: {
        description: 'View my technical skills',
        output: `Technical Skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Languages:     JavaScript, Python, Java
Frontend:      React, Vue, HTML/CSS
Backend:       Node.js, Express, Django
Database:      MongoDB, PostgreSQL, MySQL
Tools:         Git, Docker, VS Code`
      },
      projects: {
        description: 'See my projects',
        output: `My Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Project One
   Description: A cool web application
   Tech: React, Node.js, MongoDB

2. Project Two
   Description: Another awesome project
   Tech: Vue, Express, PostgreSQL

3. Project Three
   Description: Something interesting
   Tech: Python, Django, Docker`
      },
      contact: {
        description: 'Get my contact information',
        output: `Contact Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:    your.email@example.com
GitHub:   github.com/yourusername
LinkedIn: linkedin.com/in/yourprofile
Twitter:  @yourhandle`
      },
      education: {
        description: 'View my education background',
        output: `Education
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bachelor of Computer Science
University Name | 2018 - 2022

Relevant Coursework:
- Data Structures & Algorithms
- Web Development
- Database Systems
- Software Engineering`
      },
      experience: {
        description: 'See my work experience',
        output: `Work Experience
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Software Developer | Company Name
Jan 2022 - Present
- Developed web applications
- Collaborated with cross-functional teams
- Implemented new features

Intern Developer | Another Company
Jun 2021 - Dec 2021
- Assisted in project development
- Learned industry best practices`
      },
      clear: { description: 'Clear the terminal' },
      lang: { description: 'Change language (en, pt-BR)' }
    }
  },
  'pt-BR': {
    welcome: `
Bem-vindo ao meu Terminal Portfólio!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Digite 'help' para ver os comandos disponíveis.
Digite qualquer comando e pressione Enter.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
    commandNotFound: (cmd) => `Comando não encontrado: ${cmd}. Digite 'help' para ver os comandos disponíveis.`,
    helpHeader: 'Comandos disponíveis:',
    helpFooter: 'Digite qualquer comando para começar!',
    langChanged: (lang) => `Idioma alterado para ${lang === 'en' ? 'English' : 'Português (BR)'}.`,
    langUsage: "Uso: lang <en|pt-BR>\nIdioma atual: Português (BR)",
    commands: {
      help: { description: 'Mostrar comandos disponíveis' },
      about: {
        description: 'Saiba mais sobre mim',
        output: `Sobre Mim
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Olá! Sou um desenvolvedor apaixonado que adora
construir coisas para a web.

Este é um site portfólio em estilo de terminal.
Sinta-se à vontade para explorar digitando comandos!`
      },
      skills: {
        description: 'Ver minhas habilidades técnicas',
        output: `Habilidades Técnicas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Linguagens:    JavaScript, Python, Java
Frontend:      React, Vue, HTML/CSS
Backend:       Node.js, Express, Django
Banco de Dados: MongoDB, PostgreSQL, MySQL
Ferramentas:   Git, Docker, VS Code`
      },
      projects: {
        description: 'Ver meus projetos',
        output: `Meus Projetos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Projeto Um
   Descrição: Uma aplicação web incrível
   Tecnologia: React, Node.js, MongoDB

2. Projeto Dois
   Descrição: Outro projeto fantástico
   Tecnologia: Vue, Express, PostgreSQL

3. Projeto Três
   Descrição: Algo interessante
   Tecnologia: Python, Django, Docker`
      },
      contact: {
        description: 'Obter informações de contato',
        output: `Informações de Contato
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:    your.email@example.com
GitHub:   github.com/yourusername
LinkedIn: linkedin.com/in/yourprofile
Twitter:  @yourhandle`
      },
      education: {
        description: 'Ver minha formação acadêmica',
        output: `Formação Acadêmica
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bacharelado em Ciência da Computação
Nome da Universidade | 2018 - 2022

Disciplinas Relevantes:
- Estrutura de Dados e Algoritmos
- Desenvolvimento Web
- Sistemas de Banco de Dados
- Engenharia de Software`
      },
      experience: {
        description: 'Ver minha experiência profissional',
        output: `Experiência Profissional
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Desenvolvedor de Software | Nome da Empresa
Jan 2022 - Presente
- Desenvolveu aplicações web
- Colaborou com equipes multidisciplinares
- Implementou novas funcionalidades

Desenvolvedor Estagiário | Outra Empresa
Jun 2021 - Dez 2021
- Auxiliou no desenvolvimento de projetos
- Aprendeu melhores práticas da indústria`
      },
      clear: { description: 'Limpar o terminal' },
      lang: { description: 'Alterar idioma (en, pt-BR)' }
    }
  }
};

function t(key) {
  return translations[currentLang][key];
}

function tCmd(cmdName) {
  return translations[currentLang].commands[cmdName];
}

function setLang(lang) {
  currentLang = lang;
}

function getLang() {
  return currentLang;
}
