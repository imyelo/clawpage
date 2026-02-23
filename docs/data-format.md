# Share Chat Data Format

This directory contains share chat data files in Markdown format.

## Frontmatter Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `platform` | Yes | Platform name | `Discord`, `Telegram`, `WhatsApp`, `Signal` |
| `topic` | Yes | Chat topic/title | `Project Discussion` |
| `date` | Yes | Chat date (YYYY-MM-DD) | `2026-02-19` |
| `message_count` | Yes | Number of messages | `10` |
| `visibility` | No | Controls index visibility (`public` or `private`) | `public` (default) |
| `description` | No | Brief description for index display | `Discussion about new features` |

## Visibility

- `visibility: public` (default) - Chat will appear on the homepage index
- `visibility: private` - Chat will NOT appear on the homepage index, but remains accessible via direct URL

## File Naming

Use the format: `YYYYMMDD-{slug}.md`

Example: `20260219-demo-project-discussion.md`

## Content Format

```markdown
---
platform: Discord
topic: Project Discussion
date: 2026-02-19
message_count: 10
visibility: public
---

# Topic Title

> Platform · Date · N messages

---

**Author** · Timestamp

Message content...

---

**Another Author** · Another Timestamp

Message content...
```
