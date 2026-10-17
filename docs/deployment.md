# Independent static deployments

Both apps build from the same repository and shared content package, but each output can be deployed independently. Keep the terminal at the main portfolio URL and deploy the website at its own domain or subdomain. Hosting configuration and publication are outside this repository's setup.

Use Node.js 24 or newer and Yarn Classic 1.22.22. Install from the repository root, including the workspace manifests and the single lockfile:

```sh
yarn install --frozen-lockfile
```

Do not install an app as a standalone package: its `@portfolio/content` dependency is linked from the monorepo, not published to a registry.

| Application | Build command from repository root | Publish directory |
| --- | --- | --- |
| Terminal | `yarn build:terminal` | `apps/terminal/dist` |
| Website | `yarn build:web` | `apps/web/dist` |

`yarn build` produces both outputs. Publish only the chosen app's `dist` directory; source files, tests, and workspace dependencies do not need to be served.

## Links between deployments

Copy each app's `.env.example` to `.env` in the same directory, or provide the variables through your build environment. For a terminal at the main domain and a website on a subdomain, for example:

```dotenv
# apps/terminal/.env
VITE_WEB_URL=https://www.example.com/
```

```dotenv
# apps/web/.env
PUBLIC_TERMINAL_URL=https://example.com/
```

Both values must be absolute HTTP or HTTPS URLs pointing to the other app's root. Example domains are illustrative; substitute your actual deployment URLs before a production build. Local defaults are `http://localhost:8081/` for the website and `http://localhost:8080/` for the terminal.

The terminal links to the website's `/` or `/pt-br/` route according to the current language. The website links to the terminal with `?lang=en` or `?lang=pt-BR`. The terminal defaults to English for missing or unsupported query values. Language commands update the cross-app link without persisting the terminal's language across reloads.

Environment values are embedded at build time. Rebuild after changing them; changing static-server environment variables does not update an existing output.

Docker Compose runs development servers and accepts the same variable names from your shell or the root Compose `.env` file. App-local `.env` files are excluded from Docker images; Compose supplies localhost defaults unless you override them.

Serve the website's `index.html` at `/` and `pt-br/index.html` at `/pt-br/`. Use ordinary static directory-index handling, rather than an SPA fallback to the English homepage. Both apps are intended to be served from the root of their respective deployments.

## Preview built output

After building, preview one app at a time or start each command in its own terminal:

```sh
yarn workspace @portfolio/terminal preview
yarn workspace @portfolio/web preview
```

The terminal uses port 8080 and the website uses port 8081. Alternatively, serve either output directly:

```sh
python3 -m http.server 8080 --directory apps/terminal/dist
python3 -m http.server 8081 --directory apps/web/dist
```

The terminal still loads LokiJS and Fira Code from CDNs; its browser needs internet access. The conventional website serves its own assets and uses system fonts.

Before publishing, check both website routes, contact links, light/dark themes, desktop and narrow widths, terminal commands, and browser console errors. Run `yarn test`, `yarn build`, and `git diff --check` from the root.
