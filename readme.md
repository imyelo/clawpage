# openclaw-chats-share

A monorepo for sharing OpenClaw conversation history as static websites. Trigger a share command in your chat channel and get a permanent, publicly accessible page — automatically built and deployed via GitHub Pages.

## How It Works

```
/chats-share {topic}
    │
    ▼
OpenClaw Skill
    │  1. Extract full message history from session file
    │  2. Generate topic suggestion (user confirms or edits)
    │  3. Sanitize sensitive data
    │  4. Write Markdown to your data repo
    │  5. Git commit → GitHub Actions build
    ▼
GitHub Pages
    └── https://your-domain/share/{slug}
```

## Repository Architecture

This repo is a **public template**. Your actual chat data lives in a separate **private working repo** — this keeps the template clean and forkable without data contamination.

| Repo | Visibility | Purpose |
|------|------------|---------|
| `openclaw-chats-share` | Public | Template, packages, and Skill |
| `your-chats-share` | Private | Your actual chat data |

## Packages

### `openclaw-chats-share` (CLI)

Parses OpenClaw `sessions/{uuid}.jsonl` raw JSONL files and generates Markdown output.

```bash
npx openclaw-chats-share parse <sessions/{uuid}.jsonl> [-o output.md]
```

### `openclaw-chats-share-web`

Astro-based static site generator. Renders chat Markdown files into shareable pages and deploys to GitHub Pages.

```bash
npx openclaw-chats-share-web dev     # local dev server
npx openclaw-chats-share-web build   # build static site
npx openclaw-chats-share-web deploy  # build + deploy to GitHub Pages
```

### `create-openclaw-chats-share`

Scaffolding tool to initialize a new working repo from this template.

```bash
npx create-openclaw-chats-share <project-name>
```

## Data Format

Chat files are stored as Markdown with YAML frontmatter under `chats/` in your working repo.

**File naming:** `YYYYMMDD-{slug}.md`

**Frontmatter fields:**

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `platform` | Yes | Source platform | `Discord`, `Telegram` |
| `topic` | Yes | Chat topic/title | `Project Discussion` |
| `date` | Yes | Chat date | `2026-02-19` |
| `message_count` | Yes | Number of messages | `10` |
| `visibility` | No | Index visibility | `public` (default) or `private` |
| `description` | No | Brief description for index | `Discussion about new features` |

**Visibility:**
- `public` (default) — appears on the homepage index
- `private` — accessible via direct URL only, hidden from the index

**Example file:**

```markdown
---
platform: Discord
topic: Project Discussion
date: 2026-02-19
message_count: 10
visibility: public
---

# Project Discussion

> Discord · 2026-02-19 · 10 messages

---

**Alice** · 14:32

Message content here...

---

**Bob** · 14:35

Reply content here...
```

## Development

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

## Project Structure

```
packages/
  cli/     - openclaw-chats-share CLI (session log parser + Markdown generator)
  web/     - openclaw-chats-share-web (Astro static site)
  create/  - create-openclaw-chats-share scaffolding tool
chats/     - Demo Markdown chat files
docs/      - Project documentation
skills/    - OpenClaw Skill definitions
```

## License

Apache-2.0 &copy; [yelo](https://github.com/imyelo), 2026 - present
