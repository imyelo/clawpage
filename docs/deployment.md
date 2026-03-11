# Deployment Guide

The scaffold includes configuration files for all supported platforms. Pick the one that matches your host and follow the steps below.

---

## GitHub Pages

Uses the included `.github/workflows/deploy.yml`, which builds the site on every push to `main` and publishes to the `gh-pages` branch via [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages).

**Steps:**

1. Push the project to a GitHub repository.
2. Go to **Settings → Pages** in your repository.
3. Set **Source** to `Deploy from a branch`, branch `gh-pages`, folder `/ (root)`.
4. Push a commit to `main` — the workflow runs automatically and your site will be live at `https://<user>.github.io/<repo>/`.

**Configuration:** Set `site` and `base` in `chats-share.toml` to match your GitHub Pages URL:

```toml
site = "https://your-username.github.io"
base = "/your-repo-name"
```

For a custom domain or user/organisation site (`<user>.github.io`), `base` can be omitted.

---

## Netlify

Uses the included `netlify.toml`. Netlify detects Bun automatically.

**Steps:**

1. Push the project to a Git repository (GitHub, GitLab, or Bitbucket).
2. In the [Netlify dashboard](https://app.netlify.com), click **Add new site → Import an existing project**.
3. Select your repository. Netlify reads `netlify.toml` and pre-fills the build settings — no manual configuration needed.
4. Click **Deploy site**.

Your site is live at `https://<site-name>.netlify.app`. Connect a custom domain in **Site settings → Domain management**.

---

## Vercel

Uses the included `vercel.json`.

**Steps:**

1. Push the project to a Git repository.
2. In the [Vercel dashboard](https://vercel.com/new), click **Import Project** and select your repository.
3. Vercel reads `vercel.json` automatically — no manual configuration needed.
4. Click **Deploy**.

Your site is live at `https://<project-name>.vercel.app`. Connect a custom domain in **Project settings → Domains**.

Alternatively, deploy from the CLI:

```bash
npx vercel --prod
```

---

## Cloudflare Pages

Uses the included `wrangler.toml` (`pages_build_output_dir = "./dist"`).

### Option A — Git integration (recommended)

1. Go to [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**.
2. Select your repository.
3. Set:
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `BUN_VERSION = latest`
4. Click **Save and Deploy**.

No `wrangler.toml` is required for this path — Cloudflare reads the build settings from the dashboard.

### Option B — Wrangler CLI

The `wrangler.toml` in your project root configures the project name and output directory for Wrangler-based deployments.

```bash
# Install Wrangler
npm install -g wrangler

# Authenticate
wrangler login

# Build and deploy
bun run build
wrangler pages deploy ./dist --project-name=chats-share
```

On first run, Wrangler creates the Pages project automatically. Subsequent runs update it.
