# Project guide

## Scope and architecture

- This repository is a static terminal-style portfolio built with HTML, CSS, and vanilla JavaScript ES modules.
- Application files live in `src/`. There is no backend or bundler. The root `package.json` declares ES modules, Yarn Classic 1.22.22, and the test command.
- LokiJS 1.5.12 is loaded from a CDN and holds an in-memory command collection. It does not currently persist data.
- English (`en`) is the default language; Brazilian Portuguese (`pt-BR`) is also supported.
- Portfolio content is placeholder text. Do not invent personal details when editing it.

## Where to make changes

| File | Responsibility |
| --- | --- |
| `src/index.html` | Terminal markup, external assets, and the module entrypoint. |
| `src/assets/css/base.css` | Layout, colors, typography, and terminal styling. |
| `src/assets/scripts/i18n.js` | Translated UI messages, command descriptions, and portfolio content. |
| `src/assets/scripts/init-storage.js` | `buildCommands()` generates command records and help; `initStorage(Loki)` explicitly initializes storage. |
| `src/assets/scripts/handle-terminal.js` | `createTerminal(...)` returns command processing, history navigation, and completion methods. |
| `src/assets/scripts/keyboard-handler.js` | `bindKeyboard(input, terminal)` connects Enter, arrow keys, and Tab to the controller. |
| `src/assets/scripts/init-terminal.js` | Browser entrypoint: DOM references, rendering, storage and controller setup, welcome output, and focus. |
| `tests/` | Unit tests for translations, command catalogs, and controller behavior. |
| `Dockerfile` | Node 24 Alpine image with source, tests, and package files; serves only `src` on port 8080. |
| `docker-compose.yml` | Local container setup with source and tests mounted at `/app/src` and `/app/tests`, plus the package manifest and lockfile. |

## Development conventions

- Keep changes focused and follow the formatting of the file being edited.
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

For a simple static server without Docker, use `python3 -m http.server 8080 --directory src` when Python 3 is available. The browser needs internet access to load the CDN dependencies.

To test inside the running portfolio container, use `docker compose exec terminal-portifolio yarn test`. After changing the Dockerfile or Compose configuration, rebuild and recreate it with `docker compose up --build -d`. To test without starting the website, use `docker compose run --rm --build --no-deps terminal-portifolio yarn test`; it runs a disposable container without publishing the website's port.

With Node.js 24 or newer and Yarn Classic 1.22.22 installed locally, you can also run `yarn test` (or `node --test`) from the repository root. No dependency installation is needed. Tests use `node:test` and `node:assert/strict` with direct imports of application modules.

Add unit tests under `tests/` for changes to core behavior. Reset the language to English before each test and create fresh controllers and command catalogs for isolation. Controller tests use a small collection substitute backed by `buildCommands()` and mock rendering callbacks; they do not require a DOM emulator or LokiJS.

There are no lint commands or build scripts configured. Browser setup, rendering, focus, and event wiring receive a smoke check when affected. A broader browser check should cover:

1. The welcome message and input focus on load.
2. `help` and the portfolio content commands.
3. `lang pt-BR` and `lang en`, including translated help and output.
4. An unknown command and its error message.
5. Command history with Up/Down and single-match Tab completion.
6. `clear` and entering another command afterward.
7. Browser console errors and layout at desktop and narrow viewport widths.

For documentation-only changes, review instructions against the source and run `git diff --check`. When reporting work, state what was checked and any validation that could not be completed.
