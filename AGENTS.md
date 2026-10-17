# Project guide

## Scope and architecture

- This repository is a private Yarn Classic monorepo. The terminal portfolio uses HTML, CSS, and vanilla JavaScript ES modules with Vite for development and static builds.
- Terminal source and tests live in `apps/terminal/`. There is no backend. The root `package.json` declares workspaces, ES modules, Node 24 or newer, and Yarn Classic 1.22.22.
- LokiJS 1.5.12 is loaded from a CDN and holds an in-memory command collection. It does not currently persist data.
- English (`en`) is the default language; Brazilian Portuguese (`pt-BR`) is also supported.
- Portfolio content is personalized in both languages, based on the résumé in `docs/portfolio.md` and supplied contact details. The Markdown document is a reference and is not loaded by the website; keep it and the translated content synchronized when updating résumé information. Do not invent personal details when editing it.

## Where to make changes

| File | Responsibility |
| --- | --- |
| `apps/terminal/src/index.html` | Terminal markup, external assets, and the module entrypoint. |
| `apps/terminal/src/assets/css/base.css` | Layout, colors, typography, and terminal styling. |
| `apps/terminal/src/assets/scripts/i18n.js` | Translated UI messages, command descriptions, and portfolio content. |
| `apps/terminal/src/assets/scripts/init-storage.js` | `buildCommands()` generates command records and help; `initStorage(Loki)` explicitly initializes storage. |
| `apps/terminal/src/assets/scripts/handle-terminal.js` | `createTerminal(...)` returns command processing, history navigation, and completion methods. |
| `apps/terminal/src/assets/scripts/keyboard-handler.js` | `bindKeyboard(input, terminal)` connects Enter, arrow keys, and Tab to the controller. |
| `apps/terminal/src/assets/scripts/init-terminal.js` | Browser entrypoint: DOM references, rendering, storage and controller setup, welcome output, and focus. |
| `docs/portfolio.md` | Résumé reference for the personalized portfolio content; synchronized manually with `i18n.js`. |
| `apps/terminal/tests/` | Unit tests for translations, command catalogs, and controller behavior. |
| `apps/terminal/vite.config.js` | Terminal source root and independent static build output. |
| `Dockerfile` | Node 24 Alpine image with installed workspaces; starts the terminal development server on port 8080. |
| `docker-compose.yml` | Local container setup with terminal source, tests, and Vite configuration mounted under `/app/apps/terminal`. |

## Development conventions

- Keep changes focused and follow the formatting of the file being edited.
- Always update the relevant documentation in the same change when adding or changing a feature. Update `README.md` for user-facing behavior, commands, and setup; update `AGENTS.md` for architecture, development conventions, and validation requirements; update other affected documents as needed. Treat documentation updates as part of completing feature work.
- Make small, focused commits (micro commits) as work progresses. Each commit should cover one coherent change, include its relevant documentation and tests, and pass the checks appropriate to that change. Commit only files related to the task and use clear, descriptive commit messages.
- When the work is finished, summarize the changes and validation, then ask the user whether to push the commits. Wait for explicit approval before pushing unless the user has already authorized the push for the current task.
- Use Yarn Classic 1.22.22 for package commands and keep `yarn.lock` updated when dependencies change.
- Use the existing plain JavaScript and CSS approach unless the task calls for an architecture change.
- Use explicit ES module imports and exports with `.js` extensions. Keep DOM access and browser startup in `init-terminal.js` so reusable modules can be imported by Node without browser globals.
- Keep LokiJS initialization explicit through `initStorage(Loki)`. The browser passes `globalThis.loki` from the existing CDN script.
- Keep history inside each controller instance. Inject the command collection and `seedCommands`, `addCommand`, `addOutput`, and `clearOutput` callbacks through `createTerminal(...)`.
- Keep user-facing content in `i18n.js` and update both languages together.
- Register new command names in `cmdNames` in `init-storage.js` and add their descriptions and output in both translation dictionaries. Help and Tab completion use the command collection.
- Put special command behavior in the controller's `processCommand()` in `handle-terminal.js`.
- Render user-provided text with `textContent` or DOM nodes.
- Preserve keyboard interaction and check usability at narrow viewport widths when changing the interface.

## Run and validate

Run `docker compose up --build` from the repository root, then open `http://localhost:8080`. Source edits are visible after refreshing the browser. Run `docker compose down` to stop and remove the container.

Without Docker, install Node.js 24 or newer and Yarn Classic 1.22.22. Run `yarn install --frozen-lockfile`, then `yarn dev:terminal` from the repository root. Run `yarn build:terminal` to produce `apps/terminal/dist/`, which can be served with `python3 -m http.server 8080 --directory apps/terminal/dist`. The browser needs internet access to load the CDN dependencies.

To test inside the running portfolio container, use `docker compose exec terminal-portifolio yarn test`. After changing the Dockerfile or Compose configuration, rebuild and recreate it with `docker compose up --build -d`. To test without starting the website, use `docker compose run --rm --build --no-deps terminal-portifolio yarn test`; it runs a disposable container without publishing the website's port.

With dependencies installed locally, run `yarn test` (or `node --test`) from the repository root. Tests use `node:test` and `node:assert/strict` with direct imports of application modules.

Add unit tests under `apps/terminal/tests/` for changes to core behavior. Reset the language to English before each test and create fresh controllers and command catalogs for isolation. Controller tests use a small collection substitute backed by `buildCommands()` and mock rendering callbacks; they do not require a DOM emulator or LokiJS.

Run `yarn build` after changing application code or build configuration. There is no lint command configured. Browser setup, rendering, focus, and event wiring receive a smoke check when affected. A broader browser check should cover:

1. The welcome message and input focus on load.
2. `help` and the portfolio content commands.
3. `lang pt-BR` and `lang en`, including translated help and output.
4. An unknown command and its error message.
5. Command history with Up/Down and single-match Tab completion.
6. `clear` and entering another command afterward.
7. Browser console errors and layout at desktop and narrow viewport widths.

For documentation-only changes, review instructions against the source and run `git diff --check`. When reporting work, state what was checked and any validation that could not be completed.
