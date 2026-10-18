# Portfolio

A bilingual portfolio with two presentations: an interactive terminal for developers and a conventional website for recruiters and hiring teams. Both use the same résumé records and can be built and hosted independently. The terminal remains the main portfolio experience.

Organized as a Yarn Classic monorepo. The terminal uses vanilla JavaScript and Vite; the website uses Astro to generate static HTML. LokiJS stores the terminal command catalog in memory. There is no backend.

## Run locally

With Docker and Docker Compose installed, run from the repository root:

```sh
docker compose up --build
```

Open the terminal at [localhost:8080](http://localhost:8080) and the website at [localhost:8081](http://localhost:8081). Both apps' source, tests, and shared content are mounted into the containers; source edits trigger live reload. Rebuild after changing dependencies or workspace package manifests. The existing `terminal-portifolio` service runs the terminal; `web-portfolio` runs the conventional website.

To stop and remove the containers:

```sh
docker compose down
```

To run both apps locally, install Node.js 24 or newer and Yarn Classic 1.22.22, then run from the repository root:

```sh
yarn install --frozen-lockfile
yarn dev
```

LokiJS loads from jsDelivr and Fira Code loads from Google Fonts, so an internet connection is needed to load these external assets.

Run `yarn build:terminal` to generate `apps/terminal/dist/`. Preview that output with `yarn workspace @portfolio/terminal preview`, or serve it with `python3 -m http.server 8080 --directory apps/terminal/dist`. The source now requires Vite; Python is suitable for the built output.

| Command | Purpose |
| --- | --- |
| `yarn dev` | Start both apps; stop both with Ctrl+C. |
| `yarn dev:terminal` | Start the terminal at `http://localhost:8080`. |
| `yarn dev:web` | Start the website at `http://localhost:8081`. |
| `yarn build` | Build both apps. |
| `yarn build:terminal` | Build the terminal into `apps/terminal/dist/`. |
| `yarn build:web` | Build the website into `apps/web/dist/`. |
| `yarn test` | Run all workspace unit tests. |

## Conventional website

The website introduces the developer, work experience, selected projects, skills, education, and contact links on one responsive page. English is available at `/`; Brazilian Portuguese is at `/pt-br/`. Navigation, contact links, and expandable role details work without JavaScript.

The website follows the system light/dark preference until the visitor uses the theme control. Explicit choices are saved in browser local storage and applied before first paint. If storage is unavailable, the control still works for the current page. With JavaScript disabled, the website follows the system preference and hides the theme control.

Set `PUBLIC_TERMINAL_URL` in `apps/web/.env` before a production build to point the website's terminal links at the independently hosted terminal. Start from `apps/web/.env.example`; the development default is `http://localhost:8080/`. See [the deployment guide](docs/deployment.md) for independent static builds.

## Commands

| Command | Description |
| --- | --- |
| `help` | List available commands. |
| `about` | Show the developer introduction. |
| `skills` | Show technical skills. |
| `projects` | List projects. |
| `contact` | Show contact information. |
| `education` | Show education details. |
| `experience` | Show work experience. |
| `clear` | Clear terminal output. |
| `lang en` / `lang pt-BR` | Switch between English and Brazilian Portuguese. |

Press **Enter** to execute a command, use **Up/Down** to navigate command history, and press **Tab** to complete a command when there is a single match. Use **Shift+Tab** to navigate backward to the website link; browsers may focus the scrollable output along the way. Commands are case-insensitive. History resets on reload; language starts in English unless the incoming URL includes `?lang=pt-BR` or `?lang=en`. Language commands update the website link and document language without persisting a preference.

The terminal header links to the conventional website in the current language. Set `VITE_WEB_URL` in `apps/terminal/.env` before production builds, starting from `apps/terminal/.env.example`. It defaults to `http://localhost:8081/` for development. Vite also embeds this URL into the HTML so the link works before the terminal starts or when JavaScript is unavailable. Website links back to the terminal include the selected language in the query string.

## Project structure

```text
apps/terminal/
  src/index.html                   Terminal markup and module entrypoint
  src/assets/css/base.css          Terminal styling
  src/assets/scripts/              Translations, command catalog, controller, and browser setup
  tests/                           Unit tests for core terminal logic
  vite.config.js                   Development server and static build configuration
  package.json                     Terminal workspace and commands
apps/web/
  src/pages/                       English and Portuguese static routes
  src/components/                  Shared portfolio page and section heading
  src/scripts/                     Website labels, links, and theme control
  src/styles/global.css            Responsive light and dark themes
  tests/                           Website labels, navigation, and theme tests
  astro.config.mjs                 Static build configuration
packages/content/                  Shared structured English and Portuguese résumé records
docs/portfolio.md                  Résumé reference for personalized content
docs/deployment.md                 Independent builds, URL configuration, and static hosting
package.json                       Private workspace root and repository commands
yarn.lock                          Shared Yarn Classic lockfile
Dockerfile                         Node 24 development image
docker-compose.yml                 Local container configuration
```

## Development

Always update the relevant documentation in the same change when adding or changing a feature. Keep this README current for user-facing behavior, commands, and setup, and update `AGENTS.md` when architecture, development conventions, or validation requirements change. Update other affected documents as needed; documentation is part of completing feature work.

Agents should make small, focused commits (micro commits) as work progresses, with one coherent change per commit, including relevant documentation and tests. Run the appropriate checks before committing, commit only files related to the task, and use descriptive commit messages. When work is finished, summarize the changes and validation, then ask whether to push the commits. Wait for explicit approval before pushing unless the user has already authorized the push for the current task.

Portfolio facts live in the `@portfolio/content` workspace. Edit `packages/content/src/en.js` and `packages/content/src/pt-BR.js` together; see [the content guide](packages/content/README.md) for the record structure and API. The résumé in `docs/portfolio.md` remains a reference and must be synchronized manually when facts change. Terminal UI labels and command descriptions live in `apps/terminal/src/assets/scripts/i18n.js`; `format-portfolio.js` formats shared records into text. To add a command, add its name to `cmdNames` in `init-storage.js` and define its translations in both languages. Add special behavior in `handle-terminal.js` when needed.

Every portfolio-content change must be reflected correctly in both the terminal and conventional website, in English and Brazilian Portuguese. Update shared facts once in `@portfolio/content`, adjust either renderer when needed, and verify both presentations before completing the work. Keep the résumé reference synchronized.

The browser loads `init-terminal.js` as its module entrypoint. Reusable modules export translation functions, `buildCommands()`, `initStorage(Loki)`, `createTerminal(...)`, and `bindKeyboard(input, terminal)`. Importing these modules does not access the DOM or initialize LokiJS. Keep terminal browser setup and rendering in the entrypoint. The controller's optional `onLanguageChange(locale)` callback lets browser setup refresh the document language, input label, and website link after a valid language command.

The Astro development and preview scripts use `--ignore-lock` to stay in the foreground when run by an agent. This lets `concurrently` and Docker manage their lifecycle. Stop workspace preview commands with Ctrl+C; they are not background Astro servers. The Docker build keeps Yarn downloads in a BuildKit cache instead of the development image.

## Tests

Run tests inside the running portfolio container:

```sh
docker compose exec terminal-portifolio yarn test
```

After changing the Dockerfile or Compose configuration, rebuild and recreate the container with `docker compose up --build -d` before using `exec`.

To run tests in a disposable container without starting the website:

```sh
docker compose run --rm --build --no-deps terminal-portifolio yarn test
```

Both commands run the tests for all workspaces against current mounted source. Vite serves the terminal source root; tests and package metadata are outside it. Compose mounts app source and tests, not host dependency directories; rebuild after changing any workspace manifest or the root lockfile.

To run tests locally with Node.js 24 or newer and [Yarn Classic 1.22.22](https://classic.yarnpkg.com/en/docs/install) installed:

```sh
yarn test
```

Install workspace dependencies first with `yarn install --frozen-lockfile`. The suite uses Node's built-in test runner and assertions. You can also run it directly with `node --test`.

Tests cover shared content completeness and locale parity, translations, command catalog and help generation, command execution, language switching, history, and completion. Each terminal controller receives a command collection and rendering callbacks, so its logic can be tested without a browser or LokiJS.

Website tests cover translated UI labels, cross-origin terminal links, and theme preference selection. Browser smoke checks should cover both languages, desktop and narrow layouts, theme persistence, a blocked-storage context, and the website with JavaScript disabled. Also check terminal rendering, focus, and keyboard event wiring. Run `yarn build` to verify both independent production outputs. There is no lint command configured.
