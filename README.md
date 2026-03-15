# Clawpage

> 📤 Type /clawpage in any Openclaw chat. Your conversation becomes a permanent page at your own URL. Deploys to GitHub Pages, Vercel, Netlify, or Cloudflare Pages.

[Español](/docs/guide/es/README.md) · [Français](/docs/guide/fr/README.md) · [中文](/docs/guide/zh/README.md) · [日本語](/docs/guide/ja/README.md) · [한국어](/docs/guide/ko/README.md)

✨ No manual exports, no copy-pasting. One command and your chat is live at your own URL — title, description, and sensitive data handled for you.

## 📌 Features

- ⚡ `/clawpage` in any chat → live page at your URL in minutes
- 🚀 No infrastructure to manage — pure static, deploys to GitHub Pages, Vercel, Netlify, or Cloudflare Pages for free
- 🔀 Review before you publish — each chat opens a PR so you control what goes live
- 🔒 Share privately — direct link works, but chats stay off the public index by default
- 🛡️ Safe to share — AI-assisted redaction replaces sensitive data with `[REDACTED]` before export
- 🧠 Full fidelity — tool calls and thinking traces are preserved in the timeline, not stripped out

## 🚀 Live Demo

<a href="https://clawpage.yelo.ooo" target="_blank"><img src="./media/screenshot.png" alt="Screenshot of a chat page built with clawpage" width="640" /></a>

Or see a site we use it ourselves: [vibe.yelo.cc](https://vibe.yelo.cc)

## ⚡ Quick Start

Copy and Paste into your agent chat:

```
Read https://clawhub.ai/imyelo/clawpage and install the clawpage skill,
then run first-time setup for me.
```

### 🤖 What the Agent Does During Setup

The agent will scaffold a private GitHub repo, configure `clawpage.toml` with your Pages URL, push the initial commit, enable GitHub Actions as the Pages source, and register the project so `/clawpage` works immediately. For the full step-by-step, see [skills/clawpage/references/setup.md](skills/clawpage/references/setup.md).

## 📤 Share a Chat

Once setup is complete, use the `/clawpage` skill command in any Openclaw chat to export it:

```
/clawpage
```

The agent will:

1. 🔍 Identify the current session to export
2. ✅ Ask you to confirm the title, description, and visibility (`public` / `private`)
3. 🔒 Redact any sensitive data you flag
4. 📝 Write the YAML file to your working repo on a new branch (`chat/{YYYYMMDD}-{slug}`)
5. 🔀 Prompt you to open a Pull Request — merging to `main` triggers the GitHub Pages build

After the PR merges, your chat is live at `https://your-domain/chats/{slug}`.

> **⚠️ Before merging:** AI-powered redaction is not 100% reliable. Always open the generated YAML in the PR and manually replace any missed sensitive content with `[REDACTED]`. See [How to protect sensitive info](https://clawpage.yelo.ooo/chats/how-to-protect-sensitive-info) for details.

> **💡 Tip:** Set `visibility: private` (the default) to keep a chat accessible via direct link only, without it appearing on the public index page.

## ⚙️ How It Works

```
/clawpage
    │
    ▼
🤖 OpenClaw Skill
    │  1. 🔍 Locate and confirm the session to export
    │  2. 💬 Extract message history
    │  3. 📝 Populate metadata (title, participants, description)
    │  4. 🔒 Redact sensitive data
    │  5. 📄 Write YAML to your data repo
    │  6. 🔀 Push to new branch → create PR
    ▼
🚀 GitHub Pages
    └── https://your-domain/chats/{slug}
```

### 🌿 Branch-Based Workflow

Chats are pushed to a new branch (`chat/{slug}`) instead of main, with guidance to create a PR for review before merging.

## 🏗️ Repository Architecture

This repo is a **public template**. Your actual chat data lives in a separate **private working repo** — this keeps the template clean and forkable without data contamination.

| Repo | Visibility | Purpose |
|------|------------|---------|
| `clawpage` | Public | Template, packages, and Skill |
| `your-clawpage` | Private | Your actual chat data |

## ⚡ Configuration

The web package is configured via `clawpage.toml` in your working repo root.

| Key | Type | Description | Example |
|-----|------|-------------|---------|
| `site` | string (URL) | Full URL of your deployed site | `"https://you.github.io"` |
| `base` | string | Base path when the site is not served from the domain root | `"/my-repo"` |
| `public_dir` | string | Static assets directory (relative to config file) | `"public"` |
| `out_dir` | string | Build output directory (relative to config file) | `"dist"` |
| `chats_dir` | string | Custom chats directory path (absolute or relative to config file) | `"../my-chats"` |
| `template.options.title` | string | Homepage title | `"clawpage"` |
| `template.options.subtitle` | string | Homepage subtitle | `"// conversation archive"` |
| `template.options.description` | string | Meta description for the site | `"My conversation archive"` |
| `template.options.footer` | string | Footer text (Markdown supported) | `` |
| `template.options.analytics.google_analytics_id` | string | Google Analytics 4 Measurement ID | `"G-XXXXXXXXXX"` |
| `template.options.promo.enabled` | boolean | Show a promo block on the homepage to help spread clawpage | `false` |

**Example `clawpage.toml` (GitHub Pages project site):**

```toml
site = "https://your-username.github.io"
base = "/your-repo-name"

[template.options]
title = "clawpage"
subtitle = "// conversation archive"
footer = "powered by [@imyelo](https://github.com/imyelo)"

[template.options.promo]
enabled = true
```

When deploying to Netlify, Vercel, Cloudflare Pages, or a custom domain, set `site` to your full URL and omit `base`.

### 🚢 Deployment

The scaffold includes configuration files for

- ✅ GitHub Pages
- ✅ Netlify
- ✅ Vercel
- ✅ Cloudflare Pages.

For step-by-step instructions, custom domain setup, and free tier limits for each platform, see [docs/guide/en/deployment.md](/docs/guide/en/deployment.md).

## 📋 Data Format

Chat files are stored as YAML under `chats/` in your working repo. Generated by the CLI from Openclaw session JSONL files (`{id}.jsonl`).

**File naming:** `YYYYMMDD-{slug}.yaml`

**Top-level metadata fields:**

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | Yes | Session title / export name | `My Session` |
| `date` | Yes | Session date (YYYY-MM-DD) | `2026-02-15` |
| `sessionId` | Yes | Unique session ID | `cf1f8dbe-2a12-47cf-8221-9fcbf0c47466` |
| `channel` | No | Channel/platform name | `discord`, `telegram` |
| `model` | No | Model used in session | `MiniMax-M2.5` |
| `totalMessages` | No | Total message count | `42` |
| `totalTokens` | No | Total tokens consumed | `12345` |
| `tags` | No | Tag array for categorization | `[coding, debug]` |
| `visibility` | No | Index visibility | `private` (default) |
| `description` | No | Brief description for index | `Debugging a tricky async issue` |
| `defaultShowProcess` | No | Show process (thinking, tool calls) by default | `false` |
| `participants` | No | Maps participant names to `{ role: "human" \| "agent" }` | see example |

**Visibility:**
- `public` — appears on the homepage index
- `private` (default) — accessible via direct URL only, hidden from the index

The `timeline:` key holds an ordered list of message and event objects. See [docs/clawpage-data-format.md](/docs/clawpage-data-format.md) for the full schema.

**Example file:**

```yaml
title: Debugging Async Issue
date: 2026-02-15
sessionId: cf1f8dbe-2a12-47cf-8221-9fcbf0c47466
model: MiniMax-M2.5
totalMessages: 4
totalTokens: 12345
visibility: public
defaultShowProcess: false
participants:
  Alice:
    role: human
  Claude:
    role: agent

timeline:
  - type: message
    role: human
    speaker: Alice
    timestamp: "2026-02-15T06:13:50.514Z"
    content: |
      Message content...

  - type: message
    role: agent
    speaker: Claude
    timestamp: "2026-02-15T06:14:05.123Z"
    model: claude-sonnet-4-6
    content: |
      Response content...
```

## 📦 Packages

### 📄 `clawpage` (CLI)

Parses OpenClaw `sessions/{uuid}.jsonl` raw JSONL files and generates YAML output.

```bash
npx clawpage parse <sessions/{uuid}.jsonl> [-o output.yaml]
```

### 🌐 `clawpage-web`

Astro-based static site generator. Renders chat YAML files into shareable pages.

```bash
npx clawpage-web dev     # local dev server
npx clawpage-web build   # build static site
npx clawpage-web preview # preview built site locally
```

### 🛠️ `create-clawpage`

Scaffolding tool to initialize a new working repo from this template.

The generated project includes deployment configuration for GitHub Pages, Netlify, Vercel, and Cloudflare Pages — pick whichever platform you use.

```bash
npx create-clawpage <project-name>
```

## 🧑‍💻 Development

```bash
# Install dependencies
bun install

# Start demo dev server
bun run dev

# Build demo static site
bun run build

# Deploy demo to GitHub Pages
bun run deploy
```

## 📜 Release

This project uses [changesets](https://github.com/changesets/changesets) for versioning and changelog management.

```bash
# Create a new changeset
bun run changeset

# Check changeset status
bunx changeset status

# Preview version bumps (dry run)
bunx changeset version --dry-run

# Apply version bumps and update changelogs
bun run version
```

### Release Workflow

1. Create a changeset before merging a PR: `bun run changeset`
2. Select affected packages and bump type (patch/minor/major)
3. Write a description of the changes
4. Commit the changeset file with your PR
5. After merging, the changesets action creates a "Version Packages" PR
6. Merging the version PR triggers npm publish

## 📁 Project Structure

```
packages/
  cli/     - clawpage CLI (session log parser + YAML generator)
  web/     - clawpage-web (Astro static site)
    src/
      components/  - MessageHeader.astro, ChatMessage.astro, CollapsibleMessage.tsx, Footer.astro, MemoryBackground.astro
      lib/         - chats.ts, config.ts, config-schema.ts
      pages/       - index.astro, chats/[slug].astro
  create/  - create-clawpage scaffolding tool
chats/     - Demo YAML chat files
docs/      - Project documentation
skills/    - OpenClaw Skill definitions
```

## 🌟 Sites Using clawpage

Sites built with this tool:

- [Yelo](https://vibe.yelo.cc)
- Your site here — Add yours by [submitting a PR](https://github.com/imyelo/clawpage/edit/main/README.md)

## 📚 Additional Resources

- See [docs/guide/en/deployment.md](/docs/guide/en/deployment.md) for deployment instructions, custom domain setup, and platform free tier limits.
- See [docs/clawpage-data-format.md](/docs/clawpage-data-format.md) for complete frontmatter fields and content format.

## License

Apache-2.0 &copy; [yelo](https://github.com/imyelo), 2026 - present
