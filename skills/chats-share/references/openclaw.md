# Agent Profile: OpenClaw

## Config Lookup

Read project dir from `~/.openclaw/workspace/TOOLS.md`:
1. Find the `## chats-share` section
2. Extract the `- Project: {path}` value

If not found → [First-Time Setup](setup.md)

Also read `site` URL from `{projectDir}/chats-share.toml`.

## Session Discovery

```bash
ls -t ~/.openclaw/agents/main/sessions/*.jsonl
```

Filter by:
- `sessionId=xxx` → grep exact session ID in filename
- `topic=xxx` → grep keyword in file content
- `current` → use the most recent (first result from `ls -t`)

Show candidates → confirm with user.

## Session Format

JSONL — one JSON object per line. Event types:

| Type | Content |
|------|---------|
| `session` | Session metadata (id, timestamp, cwd) |
| `message` | role + content blocks (text / thinking / toolCall) |
| `model_change` | Model switch event |
| `thinking_level_change` | Thinking level change |
| `custom` | Custom events (model-snapshot, compaction, plugin calls) |

Full schemas: `docs/openclaw-session-log-format-search.md`

## Parsing: Event → chats-share Format

| Event type | chats-share output |
|------------|-------------------|
| `session` | `:::{type=session,collapsed=true}` block |
| `message` (user / assistant) | `---` separator + `**role** · timestamp` header + content |
| Thinking block inside message | `:::{type=thinking_level_change,collapsed=true}` inside message body |
| Tool call (success) | `:::{type=custom,collapsed=true}` block with call + result |
| Tool call (failure) | `:::{type=error,collapsed=false}` block with call + error |
| `model_change` | `:::{type=custom,collapsed=true}` block |
| `thinking_level_change` | `:::{type=thinking_level_change,collapsed=true}` block |
| `custom` | `:::{type=custom,collapsed=true}` block |

Participant extraction:
- `role: "user"` → human participant
- `role: "assistant"` → agent participant (capture `model` field)
- `role: "toolResult"` → part of the assistant turn, not a separate participant

For large files → [large-file.md](large-file.md)

## Registration

Append to `~/.openclaw/workspace/TOOLS.md`:

```bash
echo -e "\n## chats-share\n\n- Project: {absolute-path-to-project}\n" >> ~/.openclaw/workspace/TOOLS.md
```

This entry is what Config Lookup reads (see above).
