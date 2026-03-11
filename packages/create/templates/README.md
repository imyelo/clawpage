# my-chats-project

Share your Openclaw conversations as a static site.

## Setup

```bash
bun install
bun run dev
```

## Commands

| Command | Action |
| --- | --- |
| `bun run dev` | Start local dev server |
| `bun run build` | Build static site to `dist/` |

## Deployment

This project includes configuration files for all supported platforms. See the [deployment guide](https://github.com/imyelo/openclaw-chats-share/blob/main/docs/deployment.md) for step-by-step instructions.

| Platform | Config file | Notes |
| --- | --- | --- |
| GitHub Pages | `.github/workflows/deploy.yml` | Pushes to `gh-pages` branch on every commit to `main` |
| Netlify | `netlify.toml` | Connect repo in Netlify dashboard |
| Vercel | `vercel.json` | Connect repo in Vercel dashboard, or use `vercel --prod` |
| Cloudflare Pages | `wrangler.toml` | Git integration (dashboard) or `wrangler pages deploy` |

## Configuration

Edit `chats-share.toml` to customise the site URL, base path, and appearance (title, subtitle, footer, etc.).

For a full list of options and advanced configuration (custom domain, external chats directory, etc.), see the [openclaw-chats-share documentation](https://github.com/imyelo/openclaw-chats-share#configuration).

---

Powered by [openclaw-chats-share](https://github.com/imyelo/openclaw-chats-share).
