---
name: chats-share
description: "Share AI agent conversations as public web pages. Use when the user wants to share a conversation externally, export conversation history for documentation, or publish a chat session to a public URL."
metadata: {"openclaw":{"emoji":"💬","homepage":"https://github.com/imyelo/openclaw-chats-share"}}
---

# chats-share

Share AI agent conversations as public web pages.

## Supported Agents

| Agent | Profile |
|-------|---------|
| OpenClaw | [references/openclaw.md](references/openclaw.md) |

> For unlisted agents: ask the user for the session file path and project dir directly.

## Core Workflow

### 1. Setup Check

- Detect agent type; load project dir + site URL using the agent profile
- If project not configured → [First-Time Setup](references/setup.md)

### 2. Locate Session

- List sessions using agent profile discovery
- Show candidates → user confirms selection

### 3. Extract & Convert

- Check file size — if large (> 1 MB or > 500 lines) → [Large File Handling](references/large-file.md)
- Read (small) or preprocess (large) session content
- Convert to chats-share Markdown format
  Template: [references/output-template.md](references/output-template.md)
- **Critical:** Format conversion only — do NOT modify original content
- Save to `{projectDir}/chats/.tmp/{timestamp}.md`

### 4. Populate Metadata

Auto-fill from session data, then confirm with user:

| Field | Source | Action |
|-------|--------|--------|
| `date`, `sessionId` | Session file | Auto |
| `model`, `totalMessages` | Session data | Auto |
| `title`, `description` | Content analysis | Suggest → confirm |
| `participants` | Session roles | Extract → ask user to customize display names |
| `visibility` | — | Default: `public` |
| `defaultShowProcess` | — | Default: `false` |
| `tags` | — | Skip (user can add manually later) |

### 5. Redact

Review and remove sensitive information:
- API keys, tokens, passwords
- File paths with usernames (`/Users/xxx` → `~`)
- Email addresses, phone numbers
- Internal URLs and private IPs

### 6. Confirm & Save

- Suggest filename: `{YYYYMMDD}-{topic}.md`
- Show preview → user confirms or modifies topic/filename
- Move: `{projectDir}/chats/.tmp/{timestamp}.md` → `{projectDir}/chats/{YYYYMMDD}-{topic}.md`

---

## Optional: Publish

Push the file to a new branch and open a PR.
See [references/publish.md](references/publish.md). Only proceed after explicit user request.

---

## Edge Cases

- **First-time project setup** → [references/setup.md](references/setup.md)
- **Large or complex sessions** → [references/large-file.md](references/large-file.md)
