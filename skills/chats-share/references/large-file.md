# Large File Handling

Use when the session file is > 1 MB or > 500 lines.

## Step 1: Check Size

```bash
ls -lh {session}.jsonl
wc -l {session}.jsonl
```

## Step 2: Strip Binary Content, Extract Text

```bash
jq -r '
  if .type == "message" then
    .message.content[]?.text // ""
  elif .type == "thinking" then
    "[Thinking]\n" + (.thinking // "")
  elif .type == "tool_call" then
    "[Tool Call]\n" + (.tool_calls[].name // "unknown") + "\n" + (.tool_calls[].arguments | tostring)
  elif .type == "tool_result" then
    "[Tool Result]\n" + (.toolResult.content[0:2000] // "")
  elif .type == "custom" then
    "[Custom] " + (.customType // "unknown") + " - " + (.data | tostring)
  elif .type == "model_change" then
    "[Model Change] " + .modelId
  elif .type == "thinking_level_change" then
    "[Thinking Level] " + .thinkingLevel
  else empty end
' {session}.jsonl > {projectDir}/chats/.tmp/{name}-raw.txt
```

## Step 3: If Still Too Large (> 2000 lines)

Truncate to recent messages:
```bash
tail -200 {projectDir}/chats/.tmp/{name}-raw.txt > {projectDir}/chats/.tmp/{name}-truncated.txt
```

Note the truncation in the `description` frontmatter field of the output file.

## Notes

- Do NOT modify original content during preprocessing
- Truncation is a last resort — prefer full conversion when possible
