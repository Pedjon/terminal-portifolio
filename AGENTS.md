# Project guide

## Scope and architecture

- This repository is a private Yarn Classic monorepo with two independently deployable static apps. The terminal uses HTML, CSS, and vanilla JavaScript ES modules with Vite; the conventional portfolio uses Astro.
- Terminal source and tests live in `apps/terminal/`; structured résumé records live in `packages/content/`. There is no backend. The root `package.json` declares workspaces, ES modules, Node 24 or newer, and Yarn Classic 1.22.22.
- LokiJS 1.5.12 is loaded from a CDN and holds an in-memory command collection. It does not currently persist data.
- English (`en`) is the default language; Brazilian Portuguese (`pt-BR`) is also supported.
- The website lives in `apps/web/`, renders the shared records as HTML, and provides light/dark themes. Its English route is `/`; Portuguese is `/pt-br/`. Keep content and navigation usable without JavaScript.
- Portfolio content is personalized in both languages, based on the résumé in `docs/portfolio.md` and supplied contact details. `@portfolio/content` is the runtime source of facts; the Markdown document remains a reference. Keep both synchronized when updating résumé information. Do not invent personal details when editing it.

## Where to make changes

| File | Responsibility |
| --- | --- |
| `apps/terminal/src/index.html` | Terminal markup, external assets, and the module entrypoint. |
| `apps/terminal/src/assets/css/base.css` | Layout, colors, typography, and terminal styling. |
| `apps/terminal/src/assets/scripts/i18n.js` | Translated terminal UI messages, command descriptions, titles, and access to formatted content. |
| `apps/terminal/src/assets/scripts/format-portfolio.js` | Pure formatting of shared résumé records into terminal command output. |
| `apps/terminal/src/assets/scripts/init-storage.js` | `buildCommands()` generates command records and help; `initStorage(Loki)` explicitly initializes storage. |
| `apps/terminal/src/assets/scripts/handle-terminal.js` | Command processing, history, completion, and the optional `onLanguageChange(locale)` browser callback. |
| `apps/terminal/src/assets/scripts/keyboard-handler.js` | `bindKeyboard(input, terminal)` connects Enter, arrow keys, and Tab to the controller. |
| `apps/terminal/src/assets/scripts/init-terminal.js` | Browser entrypoint: DOM references, rendering, storage and controller setup, welcome output, and focus. |
| `apps/terminal/src/assets/scripts/navigation.js` | Incoming locale selection and links to the independently hosted website. |
| `packages/content/src/` | Shared bilingual résumé records and the pure `getPortfolio(locale)` / `supportedLocales` API. |
| `packages/content/tests/` | Content completeness, supported locales, and matching record IDs. |
| `docs/portfolio.md` | Résumé reference for the personalized portfolio content; synchronized manually with the shared content package. |
| `apps/terminal/tests/` | Unit tests for translations, command catalogs, and controller behavior. |
| `apps/terminal/vite.config.js` | Terminal source root and independent static build output. |
| `apps/web/src/pages/` | Static English and Portuguese entrypoints. |
| `apps/web/src/components/Portfolio.astro` | Website layout, résumé presentation, semantic navigation, and localized metadata. |
| `apps/web/src/scripts/` | Website UI translations, terminal URL generation, and theme behavior. |
| `apps/web/src/styles/global.css` | Responsive website layout and light/dark color tokens. |
| `apps/web/tests/` | Website language completeness, navigation, and theme tests. |
| `docs/deployment.md` | Independent build commands, URL environment variables, and static preview instructions. |
| `Dockerfile` | Node 24 Alpine development image with all workspace dependencies. |
| `docker-compose.yml` | Separate terminal and website services on ports 8080 and 8081, with app source, tests, and shared content mounted. |

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
- Use the optional `onLanguageChange(locale)` callback for terminal browser updates after successful language changes. Initialize incoming language before storage, and keep DOM access in the browser entrypoint.
- Keep résumé facts in `packages/content/src/en.js` and `pt-BR.js`; update both languages together and use matching stable record IDs. Consume them through `@portfolio/content`, treating returned records as read-only. Keep the package free of browser globals and mutable language state.
- Every portfolio-content change must be reflected correctly in both the terminal and conventional website, in English and Brazilian Portuguese. Update shared facts once in `@portfolio/content`, adjust either renderer when needed, and verify both presentations before completing the work. Keep the résumé reference synchronized.
- Keep terminal UI messages and command descriptions in `i18n.js`; use `format-portfolio.js` for text presentation instead of duplicating résumé facts.
- Keep website UI text in `apps/web/src/scripts/i18n.js`, update both languages together, and render shared records through Astro components. Do not duplicate résumé facts in templates.
- Keep theme preference storage defensive. Apply the saved website theme before first paint; without a saved choice, follow the system preference. Native links and role details must work without JavaScript.
- Keep Astro development and preview commands in the foreground with `--ignore-lock`, so `concurrently` and Docker own startup and shutdown even when an agent is detected. Keep strict development ports to avoid silently starting on a different port.
- Register new command names in `cmdNames` in `init-storage.js` and add their descriptions and output in both translation dictionaries. Help and Tab completion use the command collection.
- Put special command behavior in the controller's `processCommand()` in `handle-terminal.js`.
- Render user-provided text with `textContent` or DOM nodes.
- Preserve keyboard interaction and check usability at narrow viewport widths when changing the interface.
- Configure cross-app links through `VITE_WEB_URL` (terminal) and `PUBLIC_TERMINAL_URL` (website). Keep locale selection intact when switching apps; terminal query parameters select the initial language, and website languages use static routes. Never hardcode production domains.
- The website's boot transition runs before following either terminal link. Keep the animation under a second, bypass it for reduced motion, and preserve native modified clicks, new-tab targets, and no-JavaScript links. Reset transition state on page hide and restoration from the back/forward cache; direct visits must open normally.
- Keep the terminal Vite `envDir` at the workspace root, despite its `src` application root. Its HTML transform embeds the default website link before JavaScript runs; browser startup updates that link for the selected locale.

## Run and validate

Run `docker compose up --build` from the repository root, then open the terminal at `http://localhost:8080` and the website at `http://localhost:8081`. Source changes in either app or the shared package trigger live reload. Run `docker compose down` to stop and remove the containers. Rebuild after changes to dependency manifests, the lockfile, Dockerfile, or Compose configuration.

Without Docker, install Node.js 24 or newer and Yarn Classic 1.22.22. Run `yarn install --frozen-lockfile`, then `yarn dev:terminal` from the repository root. Run `yarn build:terminal` to produce `apps/terminal/dist/`, which can be served with `python3 -m http.server 8080 --directory apps/terminal/dist`. The browser needs internet access to load the CDN dependencies.

Run `yarn dev` for both apps, or `yarn dev:web` for the conventional website on port 8081. `yarn build:web` produces a separate `apps/web/dist/` directory. Configure `VITE_WEB_URL` and `PUBLIC_TERMINAL_URL` before production builds; they default to the other app's localhost URL in development. See `docs/deployment.md`.

To test inside the running portfolio container, use `docker compose exec terminal-portifolio yarn test`. After changing the Dockerfile or Compose configuration, rebuild and recreate it with `docker compose up --build -d`. To test without starting the website, use `docker compose run --rm --build --no-deps terminal-portifolio yarn test`; it runs a disposable container without publishing the website's port.

With dependencies installed locally, run `yarn test` (or `node --test`) from the repository root. Tests use `node:test` and `node:assert/strict` with direct imports of application modules.

Add unit tests under the relevant workspace's `tests/` directory for changes to core behavior. Reset the terminal language to English before each terminal test and create fresh controllers and command catalogs for isolation. Controller tests use a small collection substitute backed by `buildCommands()` and mock rendering callbacks; they do not require a DOM emulator or LokiJS.

Run `yarn build` after changing application code or build configuration. There is no lint command configured. Browser setup, rendering, focus, and event wiring receive a smoke check when affected. A broader browser check should cover:

1. The translated welcome message, its clickable website option for visitors unfamiliar with terminals, and input focus on load. Check mouse and keyboard activation of the welcome link.
2. `help` and the portfolio content commands.
3. `lang pt-BR` and `lang en`, including translated help and output.
4. An unknown command and its error message.
5. Command history with Up/Down and single-match Tab completion.
6. `clear` and entering another command afterward.
7. Browser console errors and layout at desktop and narrow viewport widths.
8. Header and welcome website links after language commands, incoming `?lang=pt-BR`, unsupported locale fallback, and Shift+Tab focus navigation. After `clear`, language changes must still work with the welcome link removed.

For the website, check both locales, section navigation, contact links, light/dark system preferences, saved theme choices, storage failure, and no-JavaScript rendering. Run shared content tests and website tests through the root `yarn test` command.

Check the website's header and contact terminal links with mouse and keyboard in both locales. Verify the boot screen, reduced-motion bypass, modified/new-tab activation, and Back/Forward restoration at desktop and narrow widths.

For documentation-only changes, review instructions against the source and run `git diff --check`. When reporting work, state what was checked and any validation that could not be completed.
