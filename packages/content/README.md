# Shared portfolio content

`@portfolio/content` supplies the résumé facts used by every portfolio app. It is a private ES module workspace with no browser globals, dependencies, or build step.

```js
import { getPortfolio, supportedLocales } from '@portfolio/content';

const portfolio = getPortfolio('pt-BR');
```

`supportedLocales` contains `en` and `pt-BR`. `getPortfolio()` returns English by default and falls back to English for unsupported locales. Treat returned records as read-only; selecting one language does not change another consumer's language.

Edit `src/en.js` and `src/pt-BR.js` together. Each locale contains a profile with paragraphs, grouped skills with items, projects and experience with highlights, education, and contact details. Collections use matching stable IDs across languages. Apps own presentation labels, links between experiences, and formatting; do not add terminal markup or HTML to these records.

Every portfolio-content change must be reflected correctly in both the terminal and conventional website, in English and Brazilian Portuguese. Update shared facts once in `@portfolio/content`, adjust either renderer when needed, and verify both presentations before completing the work. Keep the résumé reference synchronized.

The supplied résumé in `../../docs/portfolio.md` remains a reference. Preserve the supplied contact information. Do not invent personal details or claims.

Install dependencies at the repository root before running `yarn test`. Content tests check both locales, record completeness, and matching IDs.
