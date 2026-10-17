# Terminal Portfolio

A personal portfolio presented as an interactive terminal. Visitors type commands to explore information about the developer, skills, projects, education, experience, and contact details.

Built with plain HTML, CSS, and JavaScript ES modules. LokiJS stores the command catalog in memory. There is no build step or backend.

## Run locally

With Docker and Docker Compose installed, run from the repository root:

```sh
docker compose up --build
```

Open [localhost:8080](http://localhost:8080). Source and test directories are mounted at `/app/src` and `/app/tests`, alongside the package manifest and lockfile. Refresh the browser after editing source files, or rerun tests after editing test files.

To stop and remove the container:

```sh
docker compose down
```

Alternatively, with Python 3 installed:

```sh
python3 -m http.server 8080 --directory src
```

LokiJS loads from jsDelivr and Fira Code loads from Google Fonts, so an internet connection is needed to load these external assets.

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
src/
  index.html                       Terminal markup and script loading
  assets/
    css/base.css                   Terminal styling
    scripts/
      i18n.js                      Translations and portfolio content
      init-storage.js              Command registration and help generation
      handle-terminal.js           Command execution, history, and completion
      keyboard-handler.js          Keyboard event bindings
      init-terminal.js             Browser entrypoint, rendering, and input focus
docs/portfolio.md                  Résumé reference for personalized content
tests/                             Unit tests for core application logic
package.json                       ES module configuration and test command
yarn.lock                          Yarn dependency lockfile
Dockerfile                         Static server image with unit tests included
docker-compose.yml                 Local container configuration
```

## Development

Always update the relevant documentation in the same change when adding or changing a feature. Keep this README current for user-facing behavior, commands, and setup, and update `AGENTS.md` when architecture, development conventions, or validation requirements change. Update other affected documents as needed; documentation is part of completing feature work.

Portfolio commands contain English and Brazilian Portuguese summaries of the résumé in `docs/portfolio.md`, plus the supplied contact details. Edit both the `en` and `pt-BR` entries in `src/assets/scripts/i18n.js` when updating the content; the Markdown document is a reference and is not loaded by the website, so changes must be synchronized manually. To add a command, add its name to `cmdNames` in `init-storage.js` and define its translations in both languages. Add special behavior in `handle-terminal.js` when needed.

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

Both commands run the current source and tests from the mounted directories. The container serves only `src`, so test files and package metadata are outside the website's static root.

To run tests locally with Node.js 24 or newer and [Yarn Classic 1.22.22](https://classic.yarnpkg.com/en/docs/install) installed:

```sh
yarn test
```

The suite uses Node's built-in test runner and assertions, with no dependencies to install. You can also run it directly with `node --test`.

Tests cover translations, command catalog and help generation, command execution, language switching, history, and completion. Each terminal controller receives a command collection and rendering callbacks, so its logic can be tested without a browser or LokiJS.

Rendering, focus, keyboard event wiring, and browser module loading still need a browser smoke check. There are no lint commands or build scripts configured.
