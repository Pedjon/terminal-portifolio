const separator = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
const bullets = lines => lines.map(line => `- ${line}`).join('\n');

export function formatPortfolioCommand(command, portfolio, title, contactLabels) {
  let body;

  switch (command) {
    case 'about':
      body = portfolio.profile.paragraphs.join('\n\n');
      break;
    case 'skills':
      body = portfolio.skills.map(group => `${group.label}: ${group.items.join(', ')}`).join('\n');
      break;
    case 'projects':
      body = portfolio.projects.map(project => `${project.title} | ${project.organization}\n${bullets(project.highlights)}`).join('\n\n');
      break;
    case 'contact':
      body = ['email', 'location', 'linkedin'].map(key => `${contactLabels[key]}: ${portfolio.contact[key]}`).join('\n');
      break;
    case 'education':
      body = portfolio.education.map(entry => `${entry.qualification}\n${entry.institution} | ${entry.year}`).join('\n\n');
      break;
    case 'experience':
      body = portfolio.experience.map(entry => `${entry.role} | ${entry.organization}\n${entry.period}\n${bullets(entry.highlights)}`).join('\n\n');
      break;
    default:
      return null;
  }

  return `${title}\n${separator}\n${body}`;
}
