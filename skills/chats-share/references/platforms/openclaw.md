# Agent Profile: OpenClaw

## Config Lookup

Read project dir from `~/.openclaw/workspace/TOOLS.md`:
1. Find the `## chats-share` section
2. Extract the `- Project: {path}` value

If not found → [First-Time Setup](../setup.md)

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

| Type | Key fields |
|------|------------|
| `session` | `id`, `timestamp`, `cwd` |
| `message` | `message.role`, `message.content[]`, `message.model`, `timestamp`; for toolResult: `message.toolCallId`, `message.toolName`, `message.isError` |
| `model_change` | `modelId`, `provider` |
| `thinking_level_change` | `thinkingLevel` |
| `custom` | `customType`; for `model-snapshot`: `data.modelId`, `data.provider` |
| `compaction` | `tokensBefore` |

Full schemas: `docs/openclaw-session-log-format-search.md`

## Registration

Append to `~/.openclaw/workspace/TOOLS.md`:

```bash
echo -e "\n## chats-share\n\n- Project: {absolute-path-to-project}\n" >> ~/.openclaw/workspace/TOOLS.md
```

This entry is what Config Lookup reads (see above).

## Conversion

Run the CLI:

```bash
npx openclaw-chats-share parse {sessionPath} -o {projectDir}/chats/.tmp/{timestamp}.yaml
```

The CLI handles format conversion, metadata extraction, and timeline building — including large files.
