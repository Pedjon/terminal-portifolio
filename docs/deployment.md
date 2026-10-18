# Independent static deployments

Both apps build from the same repository and shared content package, but each output can be deployed independently. Each app is served from the root of its own domain or subdomain. The terminal and website use Cloudflare Pages; see [Cloudflare Pages](#cloudflare-pages). The donations page runs on a Cloudflare Worker; see [Donations Worker](#donations-worker).

Use Node.js 24 or newer and Yarn Classic 1.22.22. Install from the repository root, including the workspace manifests and the single lockfile:

```sh
yarn install --frozen-lockfile
```

Do not install an app as a standalone package: its `@portfolio/content` dependency is linked from the monorepo, not published to a registry.

| Application | Build command from repository root | Publish directory |
| --- | --- | --- |
| Terminal | `yarn build:terminal` | `apps/terminal/dist` |
| Website | `yarn build:web` | `apps/web/dist` |
| Donations | `yarn build:donations` | `apps/donations/dist` (served by its Worker) |

`yarn build` produces all three outputs. Publish only the chosen app's `dist` directory; source files, tests, and workspace dependencies do not need to be served.

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

With JavaScript enabled, ordinary link activation shows a brief boot animation on the website or a shutdown animation on the terminal before following the existing destination. These effects need no shared origin, storage, or hosting configuration. Reduced-motion preferences and links opened in a new tab bypass the animations; direct visits and no-JavaScript links keep normal navigation.

Environment values are embedded at build time. Rebuild after changing them; changing static-server environment variables does not update an existing output.

Docker Compose runs development servers and accepts the same variable names from your shell or the root Compose `.env` file. App-local `.env` files are excluded from Docker images; Compose supplies localhost defaults unless you override them.

Serve the website's `index.html` at `/` and `pt-br/index.html` at `/pt-br/`. Use ordinary static directory-index handling, rather than an SPA fallback to the English homepage. Both apps are intended to be served from the root of their respective deployments.

## Cloudflare Pages

Production runs on two Cloudflare Pages projects connected to the GitHub repository. Pushes to `main` deploy production; other branches and pull requests get preview deployments on `pages.dev`. Both projects build from the repository root so the workspace and lockfile are available.

| Setting | Terminal | Website |
| --- | --- | --- |
| Project | `pedjon-terminal` | `pedjon-portfolio` |
| Custom domain | `terminal.pedjon.dev` | `portfolio.pedjon.dev` |
| Build command | `yarn build:terminal` | `yarn build:web` |
| Build output directory | `apps/terminal/dist` | `apps/web/dist` |
| Root directory | repository root | repository root |
| Build system version | 3 | 3 |
| Build watch paths (include) | `apps/terminal/*`, `packages/*`, `package.json`, `yarn.lock` | `apps/web/*`, `packages/*`, `package.json`, `yarn.lock` |
| Build watch paths (exclude) | `apps/terminal/tests/*`, `packages/*/tests/*` | `apps/web/tests/*`, `packages/*/tests/*` |

Build watch paths skip a project's build when a push changes none of its included files, so documentation-only or test-only changes do not redeploy either app, and changes to one app redeploy only that app. Shared content and dependency changes redeploy both. Cloudflare still builds for pushes with no file changes, with more than 20 commits, or with more than 3,000 changed files. Add new build inputs outside these paths, such as a root configuration file, to both include lists.

Both projects set `NODE_VERSION=24` and `YARN_VERSION=1.22.22`, because the v3 build image defaults to Yarn 4 and ignores `engines` and `packageManager`. The terminal sets `VITE_WEB_URL=https://portfolio.pedjon.dev/`, and the website sets `PUBLIC_TERMINAL_URL=https://terminal.pedjon.dev/`, for production and preview builds. Preview deployments therefore link to the production version of the other app.

Each custom domain uses a proxied `CNAME` record in the `pedjon.dev` zone pointing to the project's `pages.dev` subdomain. Change project settings in the Cloudflare dashboard under **Workers & Pages**, then retry a deployment so the new build values take effect.

## Donations Worker

The donations page is a Cloudflare Worker named `pedjon-donations` at `donations.pedjon.dev`, configured in `apps/donations/wrangler.jsonc`. It serves `apps/donations/dist` as static assets and runs code only for `/api/*`. The custom domain is declared in the Wrangler configuration, and `workers.dev` and preview URLs are disabled so Turnstile only accepts the production hostname.

Workers Builds deploys it from the GitHub repository:

| Setting | Value |
| --- | --- |
| Root directory | repository root |
| Build command | `yarn build:donations` |
| Deploy command | `yarn deploy:donations` |
| Build variables | `YARN_VERSION=1.22.22`, `PUBLIC_WEB_URL=https://portfolio.pedjon.dev/`, `PUBLIC_TURNSTILE_SITE_KEY=<widget site key>` |
| Build watch paths | `apps/donations/*`, `packages/*`, `package.json`, `yarn.lock` (excluding `apps/donations/tests/*`, `packages/*/tests/*`) |

`PUBLIC_WEB_URL` points the header and footer links at the website, and the Turnstile site key is public and embedded at build time. Without them, builds fall back to `http://localhost:8081/` and Cloudflare's test site key.

The Worker needs two secrets, which must never be committed:

| Secret | Value |
| --- | --- |
| `MP_ACCESS_TOKEN` | Production access token from the Mercado Pago application used for donations. |
| `TURNSTILE_SECRET_KEY` | Secret key of the Turnstile widget registered for `donations.pedjon.dev`. |

Set or rotate a secret from `apps/donations` with `npx wrangler secret put MP_ACCESS_TOKEN` and paste the value at the prompt. In the dashboard, add secrets under **Settings → Variables and Secrets** only after the first Git deployment finishes, and reload the page first: saving from a page opened before that deployment redeploys the import template's code without the `ASSETS` binding or variables. If `/api/checkout` answers `Hello world`, retry the latest build; deployments keep existing secrets. The `TURNSTILE_HOSTNAMES` variable in the Wrangler configuration lists the hostnames whose Turnstile tokens are accepted; keep `localhost` out of the production value. Workers Logs and traces are enabled, and checkout events are logged as JSON without tokens or payment data.

Checkout Pro charges the amount in Brazilian reais and returns visitors to `/?payment=<success|pending|failure>` or `/pt-br/?payment=…` on the same origin. The page shows a confirmation message and removes Mercado Pago's query parameters from the address bar. Payment notifications (webhooks) are not configured; check donations in the Mercado Pago dashboard.

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
