# Deployment Guide

The scaffold includes configuration files for all supported platforms. Pick the one that matches your host and follow the steps below.

> **Note on private repositories:** We recommend keeping your repository **private** as a best practice to protect sensitive information in your chats — see [how to protect sensitive info](https://clawpage.yelo.ooo/chats/how-to-protect-sensitive-info/). However, GitHub Pages requires a **Pro plan or higher** to deploy from a private repository. If your repository is private and you are on the free GitHub plan, use Netlify, Vercel, or Cloudflare Pages instead — all three support private repositories on their free tiers.

---

## GitHub Pages

Uses the included `.github/workflows/deploy.yml`, which builds the site on every push to `main` and publishes to the `gh-pages` branch via [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages).

**Free tier limits:** Published site must be no larger than 1 GB; soft bandwidth limit of 100 GB/month. Not permitted for commercial use.

**Steps:**

1. Push the project to a GitHub repository.
2. Go to **Settings → Pages** in your repository.
3. Set **Source** to `Deploy from a branch`, branch `gh-pages`, folder `/ (root)`.
4. Push a commit to `main` — the workflow runs automatically and your site will be live at `https://<user>.github.io/<repo>/`.

**Configuration:** Set `site` and `base` in `clawpage.toml` to match your GitHub Pages URL:

```toml
site = "https://your-username.github.io"
base = "/your-repo-name"
```

For a user/organisation site (`<user>.github.io`) or when using a custom domain, `base` can be omitted.

**Custom domain:**

1. Add a `CNAME` file to your `public/` directory containing your domain (e.g. `chats.example.com`).
2. In your DNS provider, add a `CNAME` record pointing your subdomain to `<user>.github.io`.
3. In **Settings → Pages**, enter your custom domain and enable **Enforce HTTPS** once the certificate is provisioned.
4. Remove `base` from `clawpage.toml` and update `site` to your custom domain.

---

## Netlify

Uses the included `netlify.toml`. Netlify detects Bun automatically.

**Free tier limits:** 100 GB bandwidth/month, 300 build minutes/month. If either limit is exceeded, the site is suspended for the rest of the calendar month. Supports private repositories. Commercial use is permitted.

**Steps:**

1. Push the project to a Git repository (GitHub, GitLab, or Bitbucket).
2. In the [Netlify dashboard](https://app.netlify.com), click **Add new site → Import an existing project**.
3. Select your repository. Netlify reads `netlify.toml` and pre-fills the build settings — no manual configuration needed.
4. Click **Deploy site**.

Your site is live at `https://<site-name>.netlify.app`.

**Custom domain:**

1. In **Site settings → Domain management**, click **Add a domain** and enter your domain.
2. Follow Netlify's instructions to update your DNS records (either point your nameservers to Netlify, or add the provided `A`/`CNAME` records at your DNS provider).
3. Netlify provisions a free TLS certificate automatically.
4. Update `site` in `clawpage.toml` to your custom domain and remove `base` if set.

---

## Vercel

Uses the included `vercel.json`.

**Free tier limits:** The Hobby plan is for personal, non-commercial use only. Commercial projects require a Pro plan. Supports private repositories.

**Steps:**

1. Push the project to a Git repository.
2. In the [Vercel dashboard](https://vercel.com/new), click **Import Project** and select your repository.
3. Vercel reads `vercel.json` automatically — no manual configuration needed.
4. Click **Deploy**.

Your site is live at `https://<project-name>.vercel.app`.

Alternatively, deploy from the CLI:

```bash
npx vercel --prod
```

**Custom domain:**

1. In **Project settings → Domains**, click **Add** and enter your domain.
2. Follow Vercel's instructions to add the provided `A` or `CNAME` record at your DNS provider.
3. Vercel provisions a free TLS certificate automatically.
4. Update `site` in `clawpage.toml` to your custom domain and remove `base` if set.

---

## Cloudflare Pages

Uses the included `wrangler.toml` (`pages_build_output_dir = "./dist"`).

**Free tier limits:** 500 builds/month, unlimited bandwidth. Supports private repositories. Commercial use is permitted.

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
wrangler pages deploy ./dist --project-name=clawpage
```

On first run, Wrangler creates the Pages project automatically. Subsequent runs update it.

### Custom domain

1. In your Pages project, go to **Custom domains → Set up a custom domain** and enter your domain.
2. If your domain is already on Cloudflare, the DNS record is added automatically. Otherwise, add the provided `CNAME` record at your DNS provider.
3. Cloudflare provisions a free TLS certificate automatically.
4. Update `site` in `clawpage.toml` to your custom domain and remove `base` if set.
