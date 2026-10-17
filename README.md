# Portfolio

A personal portfolio presented as an interactive terminal. Visitors type commands to explore information about the developer, skills, projects, education, experience, and contact details.

Organized as a Yarn Classic workspace. The terminal uses plain HTML, CSS, and JavaScript ES modules, with Vite for development and static production builds. LokiJS stores the command catalog in memory. There is no backend.

## Run locally

With Docker and Docker Compose installed, run from the repository root:

```sh
docker compose up --build
```

Open [localhost:8080](http://localhost:8080). Terminal source and tests are mounted under `/app/apps/terminal`; Vite reloads the page after source edits. Rebuild the container after changing dependencies or workspace configuration.

To stop and remove the container:

```sh
docker compose down
```

Alternatively, install Node.js 24 or newer and Yarn Classic 1.22.22, then run from the repository root:

```sh
yarn install --frozen-lockfile
yarn dev:terminal
```

LokiJS loads from jsDelivr and Fira Code loads from Google Fonts, so an internet connection is needed to load these external assets.

Run `yarn build:terminal` to generate `apps/terminal/dist/`. Preview that output with `yarn workspace @portfolio/terminal preview`, or serve it with `python3 -m http.server 8080 --directory apps/terminal/dist`. The source now requires Vite; Python is suitable for the built output.

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

Press **Enter** to execute a command, use **Up/Down** to navigate command history, and press **Tab** to complete a command when there is a single match. Commands are case-insensitive. Language selection and command history reset on reload.

## Project structure

```text
apps/terminal/
  src/index.html                   Terminal markup and module entrypoint
  src/assets/css/base.css          Terminal styling
  src/assets/scripts/              Translations, command catalog, controller, and browser setup
  tests/                           Unit tests for core terminal logic
  vite.config.js                   Development server and static build configuration
  package.json                     Terminal workspace and commands
packages/content/                  Shared structured English and Portuguese résumé records
docs/portfolio.md                  Résumé reference for personalized content
package.json                       Private workspace root and repository commands
yarn.lock                          Shared Yarn Classic lockfile
Dockerfile                         Node 24 development image
docker-compose.yml                 Local container configuration
```

## Development

Always update the relevant documentation in the same change when adding or changing a feature. Keep this README current for user-facing behavior, commands, and setup, and update `AGENTS.md` when architecture, development conventions, or validation requirements change. Update other affected documents as needed; documentation is part of completing feature work.

Agents should make small, focused commits (micro commits) as work progresses, with one coherent change per commit, including relevant documentation and tests. Run the appropriate checks before committing, commit only files related to the task, and use descriptive commit messages. When work is finished, summarize the changes and validation, then ask whether to push the commits. Wait for explicit approval before pushing unless the user has already authorized the push for the current task.

Portfolio facts live in the `@portfolio/content` workspace. Edit `packages/content/src/en.js` and `packages/content/src/pt-BR.js` together; see [the content guide](packages/content/README.md) for the record structure and API. The résumé in `docs/portfolio.md` remains a reference and must be synchronized manually when facts change. Terminal UI labels and command descriptions live in `apps/terminal/src/assets/scripts/i18n.js`; `format-portfolio.js` formats shared records into text. To add a command, add its name to `cmdNames` in `init-storage.js` and define its translations in both languages. Add special behavior in `handle-terminal.js` when needed.

The browser loads `init-terminal.js` as its module entrypoint. Reusable modules export translation functions, `buildCommands()`, `initStorage(Loki)`, `createTerminal(...)`, and `bindKeyboard(input, terminal)`. Importing these reusable modules does not access the DOM or initialize LokiJS. Keep browser setup and rendering in the entrypoint.

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

Both commands run the current source and tests from the mounted workspace directories. Vite serves the terminal source root; tests and package metadata are outside it.

To run tests locally with Node.js 24 or newer and [Yarn Classic 1.22.22](https://classic.yarnpkg.com/en/docs/install) installed:

```sh
yarn test
```

Install workspace dependencies first with `yarn install --frozen-lockfile`. The suite uses Node's built-in test runner and assertions. You can also run it directly with `node --test`.

Tests cover shared content completeness and locale parity, translations, command catalog and help generation, command execution, language switching, history, and completion. Each terminal controller receives a command collection and rendering callbacks, so its logic can be tested without a browser or LokiJS.

Rendering, focus, keyboard event wiring, and browser module loading still need a browser smoke check. Run `yarn build` to verify production bundling. There is no lint command configured.
