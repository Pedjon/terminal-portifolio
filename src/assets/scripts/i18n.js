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
I'm a senior software engineer with 7+ years of experience designing, building, and operating highly available distributed systems and large-scale financial platforms.

At TOTVS - RD Station, I work on the marketing automation engine supporting 1 billion leads monthly, contributing to its migration from Ruby on Rails to microservices with Temporal and the adoption of AI agents in development.

I specialize in backend engineering, distributed systems, Domain-Driven Design (DDD), and Hexagonal Architecture, with full-stack experience in Ruby on Rails, Node.js, Clojure, React, and Vue.js. I modernize legacy systems and build scalable platforms that process millions of daily transactions.

I'm a lifelong learner who values team collaboration and collective architectural decisions. I aim to write clear, refactorable code that balances product delivery with long-term system health.`
      },
      skills: {
        description: 'View my technical skills',
        output: `Technical Skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Languages: Ruby, JavaScript, TypeScript, Clojure, Python, Go
Backend: Ruby on Rails, Node.js, Serverless, Kafka, RabbitMQ, Temporal
Frontend: React, Vue.js
Databases: PostgreSQL, MySQL, Datomic, MongoDB, DynamoDB
Cloud & Infrastructure: AWS, GCP, Docker, Kubernetes, Lambda, CloudFront, S3
CI/CD: CircleCI, Spinnaker
Observability: New Relic, Kibana, Grafana, Datadog, Rollbar, Logging & Tracing
Architecture: Microservices, DDD, Hexagonal Architecture, Diplomat, BFF, API Design, TDD
AI Tools: Cursor, Claude, Codex, Kimi, Gemini, GLM`
      },
      projects: {
        description: 'Explore selected work projects',
        output: `Selected Work Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RD Station Marketing Automation | TOTVS - RD Station
- Contributing to the migration of a Ruby on Rails engine supporting 1 billion leads monthly to microservices, using Temporal for event-driven workflow orchestration.
- Projected improvements: 30% lower infrastructure costs and 43% better performance.

Pix Transfer Out | Nubank
- Helped develop a new microservice API to support the transfer flow and reduce friction caused by Pix transaction errors.
- The initiative reduced user friction by 15%.

Hotmart Pages / Klickpages | Hotmart
- Helped redesign a monolith into DDD-based microservices serving 100k+ creators and millions of users, leading domain modeling, service design, and backend implementation.
- Co-designed global content delivery and SSL automation with the DevOps team using AWS Lambda, CloudFront, S3, and GCP.
- Results: 99.99% uptime, 65% faster page loads, 70% faster deployments, and over 60% lower infrastructure costs.

Central | Ignição Digital
- Built the financial and events management platform from scratch as a founding engineer, supporting ticket sales, course access, payments, recharges, and invoices for Ignição Digital and Erico Rocha.
- Vue.js, Ruby on Rails, Node.js, and AWS Lambda microservices coordinated through a custom Rails API gateway, using Hexagonal Architecture.
- Supported R$5M+ in yearly transactions, with RSpec/Jest unit tests and New Relic observability.`
      },
      contact: {
        description: 'Get my contact information',
        output: `Contact Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: pedrohenrique.gdo@gmail.com
Location: Brasília, Distrito Federal, Brazil
LinkedIn: https://www.linkedin.com/in/pedro-henrique-oliveira-983559168/`
      },
      education: {
        description: 'View my education background',
        output: `Education
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MBA in Systems Architecture
FullCycle | 2026

Bachelor of Computer Science
Centro Universitário de Brasília - UNICEUB | 2017

High School Graduation
Colégio Sigma | 2010

English School Graduation
Casa Thomas Jefferson | 2008`
      },
      experience: {
        description: 'See my work experience',
        output: `Work Experience
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Senior Software Engineer | TOTVS - RD Station
Jul 2026 - Present
- Work on the Automation team, supporting marketing workflows for 1 billion leads monthly.
- Contribute to the migration from a Ruby on Rails monolith to microservices with Temporal. The initiative is expected to reduce infrastructure costs by 30% and improve performance by 43%.
- Selected for a small group introducing AI agent workflows to accelerate software development.

Software Engineer | Nubank
Apr 2025 - Jul 2026
- Designed and operated mission-critical financial systems in Pix Transfer Out, processing 20B transactions monthly across Brazil, Mexico, and Colombia with 99.99% uptime.
- Drove architectural discussions, refactoring, and delivery from design to production monitoring, collaborating with product, platform, and regional teams on business and regulatory features.
- Helped build a microservice API for the transfer flow in an initiative that reduced friction caused by Pix errors by 15%.

Senior Software Engineer | Hotmart
May 2021 - Apr 2025
- Helped redesign Klickpages into Hotmart Pages, moving a monolith to DDD-based microservices serving 100k+ creators and millions of users.
- Led domain modeling, service design, and backend implementation with Ruby on Rails, Node.js, Hexagonal Architecture, and event-driven communication; also contributed to React and Vue.js frontends.
- Co-designed global content delivery and SSL automation with DevOps using AWS Lambda, CloudFront, S3, and GCP.
- Achieved 99.99% uptime, 65% faster page loads, 70% faster deployments, and over 60% lower infrastructure costs.

Back-end Developer | Getninjas
Apr 2021 - May 2021
- Improved service communication, reliability, and performance across Ruby on Rails monoliths and microservices supporting 500k+ freelancers nationwide.

Full Stack Developer | Ignição Digital
Feb 2019 - Apr 2021
- As a founding engineer, built Central, a financial and events management platform for Ignição Digital and Erico Rocha, supporting ticket sales, course access, payments, recharges, and invoices with R$5M+ in yearly transactions.
- Designed Vue.js, Ruby on Rails, Node.js, and AWS Lambda microservices with a custom Rails API gateway, Hexagonal Architecture, high unit test coverage with RSpec/Jest, and New Relic observability.
- Maintained and evolved Klickpages, its MVC Rails monolith and custom JavaScript/HTML/CSS frontend, plus Node.js, Padrino, and Rails services supporting editing, publishing, and client communication.`
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
Sou engenheiro de software sênior com mais de 7 anos de experiência projetando, construindo e operando sistemas distribuídos de alta disponibilidade e plataformas financeiras de grande escala.

Na TOTVS - RD Station, trabalho no motor de automação de marketing que atende 1 bilhão de leads por mês, contribuindo para sua migração de Ruby on Rails para microsserviços com Temporal e para a adoção de agentes de IA no desenvolvimento.

Sou especializado em engenharia backend, sistemas distribuídos, Domain-Driven Design (DDD) e Arquitetura Hexagonal, com experiência full stack em Ruby on Rails, Node.js, Clojure, React e Vue.js. Modernizo sistemas legados e construo plataformas escaláveis que processam milhões de transações diárias.

Valorizo o aprendizado contínuo, a colaboração e as decisões arquiteturais coletivas. Busco escrever código claro e fácil de refatorar, equilibrando a entrega de produtos com a saúde dos sistemas no longo prazo.`
      },
      skills: {
        description: 'Ver minhas habilidades técnicas',
        output: `Habilidades Técnicas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Linguagens: Ruby, JavaScript, TypeScript, Clojure, Python, Go
Backend: Ruby on Rails, Node.js, Serverless, Kafka, RabbitMQ, Temporal
Frontend: React, Vue.js
Bancos de Dados: PostgreSQL, MySQL, Datomic, MongoDB, DynamoDB
Nuvem e Infraestrutura: AWS, GCP, Docker, Kubernetes, Lambda, CloudFront, S3
CI/CD: CircleCI, Spinnaker
Observabilidade: New Relic, Kibana, Grafana, Datadog, Rollbar, Logs e Rastreamento
Arquitetura: Microsserviços, DDD, Arquitetura Hexagonal, Diplomat, BFF, Design de APIs, TDD
Ferramentas de IA: Cursor, Claude, Codex, Kimi, Gemini, GLM`
      },
      projects: {
        description: 'Explorar projetos profissionais selecionados',
        output: `Projetos Profissionais Selecionados
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Automação de Marketing RD Station | TOTVS - RD Station
- Contribuo para a migração de um motor Ruby on Rails que atende 1 bilhão de leads por mês para microsserviços, usando Temporal na orquestração de fluxos orientados a eventos.
- Melhorias previstas: redução de 30% nos custos de infraestrutura e aumento de 43% no desempenho.

Pix Transfer Out | Nubank
- Ajudei a desenvolver uma nova API em um microsserviço para apoiar o fluxo de transferências e reduzir o atrito causado por erros nas transações Pix.
- A iniciativa reduziu o atrito dos usuários em 15%.

Hotmart Pages / Klickpages | Hotmart
- Participei da reformulação de um monólito em microsserviços baseados em DDD para mais de 100 mil criadores e milhões de usuários, liderando a modelagem de domínio, o design de serviços e a implementação backend.
- Projetei com a equipe de DevOps a entrega global de conteúdo e a automação de SSL usando AWS Lambda, CloudFront, S3 e GCP.
- Resultados: 99,99% de disponibilidade, carregamento de páginas 65% mais rápido, implantações 70% mais rápidas e redução de mais de 60% nos custos de infraestrutura.

Central | Ignição Digital
- Como engenheiro fundador, construí do zero a plataforma de gestão financeira e de eventos, com venda de ingressos, acesso a cursos, pagamentos, recargas e notas fiscais para a Ignição Digital e Erico Rocha.
- Microsserviços em Vue.js, Ruby on Rails, Node.js e AWS Lambda coordenados por um API gateway próprio em Rails, com Arquitetura Hexagonal.
- Mais de R$5 milhões em transações anuais, com testes unitários em RSpec/Jest e observabilidade no New Relic.`
      },
      contact: {
        description: 'Obter informações de contato',
        output: `Informações de Contato
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: pedrohenrique.gdo@gmail.com
Localização: Brasília, Distrito Federal, Brasil
LinkedIn: https://www.linkedin.com/in/pedro-henrique-oliveira-983559168/`
      },
      education: {
        description: 'Ver minha formação acadêmica',
        output: `Formação Acadêmica
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MBA em Arquitetura de Sistemas
FullCycle | 2026

Bacharelado em Ciência da Computação
Centro Universitário de Brasília - UNICEUB | 2017

Conclusão do Ensino Médio
Colégio Sigma | 2010

Conclusão do Curso de Inglês
Casa Thomas Jefferson | 2008`
      },
      experience: {
        description: 'Ver minha experiência profissional',
        output: `Experiência Profissional
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Engenheiro de Software Sênior | TOTVS - RD Station
Jul 2026 - Presente
- Trabalho na equipe de Automação, apoiando fluxos de marketing para 1 bilhão de leads por mês.
- Contribuo para a migração de um monólito Ruby on Rails para microsserviços com Temporal. A iniciativa prevê reduzir os custos de infraestrutura em 30% e melhorar o desempenho em 43%.
- Fui selecionado para um pequeno grupo que introduz fluxos de trabalho com agentes de IA para acelerar o desenvolvimento de software.

Engenheiro de Software | Nubank
Abr 2025 - Jul 2026
- Projetei e operei sistemas financeiros de missão crítica no Pix Transfer Out, processando 20 bilhões de transações mensais no Brasil, México e Colômbia, com 99,99% de disponibilidade.
- Conduzi discussões arquiteturais, refatorações e entregas do design ao monitoramento em produção, colaborando com equipes de produto, plataforma e regionais em funcionalidades de impacto no negócio e regulatório.
- Ajudei a construir uma API em um microsserviço para o fluxo de transferências, em uma iniciativa que reduziu em 15% o atrito causado por erros no Pix.

Engenheiro de Software Sênior | Hotmart
Mai 2021 - Abr 2025
- Participei da reformulação do Klickpages para o Hotmart Pages, migrando um monólito para microsserviços baseados em DDD, atendendo mais de 100 mil criadores e milhões de usuários.
- Liderei a modelagem de domínio, o design de serviços e a implementação backend com Ruby on Rails, Node.js, Arquitetura Hexagonal e comunicação orientada a eventos; também contribuí nos frontends React e Vue.js.
- Projetei com DevOps a entrega global de conteúdo e a automação de SSL usando AWS Lambda, CloudFront, S3 e GCP.
- Alcancei 99,99% de disponibilidade, carregamento de páginas 65% mais rápido, implantações 70% mais rápidas e redução de mais de 60% nos custos de infraestrutura.

Desenvolvedor Back-end | Getninjas
Abr 2021 - Mai 2021
- Melhorei a comunicação entre serviços, a confiabilidade e o desempenho de monólitos Ruby on Rails e microsserviços que atendiam mais de 500 mil profissionais autônomos em todo o país.

Desenvolvedor Full Stack | Ignição Digital
Fev 2019 - Abr 2021
- Como engenheiro fundador, construí a Central, plataforma de gestão financeira e de eventos para a Ignição Digital e Erico Rocha, com venda de ingressos, acesso a cursos, pagamentos, recargas e notas fiscais, movimentando mais de R$5 milhões por ano.
- Projetei microsserviços em Vue.js, Ruby on Rails, Node.js e AWS Lambda com um API gateway próprio em Rails, Arquitetura Hexagonal, alta cobertura de testes unitários com RSpec/Jest e observabilidade no New Relic.
- Mantive e evoluí o Klickpages, seu monólito MVC em Rails e frontend próprio em JavaScript/HTML/CSS, além de serviços em Node.js, Padrino e Rails para edição, publicação e comunicação com clientes.`
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
  return translations[currentLang].commands[cmdName];
}

export function setLang(lang) {
  currentLang = lang;
}

export function getLang() {
  return currentLang;
}
