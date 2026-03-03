# Output Template: chats-share Markdown

Use this when converting any session to chats-share format.
Full field reference: `docs/chats-share-data-format.md` in the project root.

## Frontmatter

```yaml
---
title: {descriptive title}
description: {one-sentence summary}
date: {YYYY-MM-DD}
sessionId: {session-id}
model: {first model used}
totalMessages: {count}
visibility: public
defaultShowProcess: false
participants:
  {DisplayName}:
    role: human
  {DisplayName}:
    role: agent
    model: {model-name}
---
```

## Header Block

Immediately after frontmatter:

```markdown
# {title}

> {YYYY-MM-DD}

---
```

## Message Block

```markdown
**{DisplayName}** · {ISO timestamp}

{message content}
```

Each message (and each standalone event block) is separated from the next by a `---` rule.

## Collapsible Block Types

```markdown
:::{type=thinking_level_change,collapsed=true}
🧠 **Thinking**
{model reasoning text}
:::

:::{type=custom,collapsed=true}
{tool call / model change / custom event content}
:::

:::{type=error,collapsed=false}
{error content}
:::

:::{type=session,collapsed=true}
{session metadata}
:::
```

## Tool Call Block (success)

```markdown
:::{type=custom,collapsed=true}
🔧 **{toolName}** · {arg summary}
✅ **{toolName}** · {result summary}
:::
```

## Tool Call Block (failure)

```markdown
:::{type=error,collapsed=false}
🔧 **{toolName}** · {arg summary}
❌ **{toolName}** · {error message}
:::
```

## Full Example

```markdown
---
title: Debugging an async race condition
description: Tracked down a race condition in a Node.js event emitter.
date: 2026-03-03
sessionId: cf1f8dbe-2a12-47cf-8221-9fcbf0c47466
model: claude-sonnet-4-6
totalMessages: 8
visibility: public
defaultShowProcess: false
participants:
  Alice:
    role: human
  Claude:
    role: agent
    model: claude-sonnet-4-6
---

# Debugging an async race condition

> 2026-03-03

---

:::{type=session,collapsed=true}
Session started · 2026-03-03T14:00:00.000Z
cwd: ~/projects/myapp
:::

---

**Alice** · 2026-03-03T14:01:00.000Z

I'm seeing a race condition in my event emitter setup. Here's the code...

---

**Claude** · 2026-03-03T14:02:00.000Z

:::{type=thinking_level_change,collapsed=true}
🧠 **Thinking**
The issue is likely in how the drain event interacts with...
:::

:::{type=custom,collapsed=true}
🔧 **read** · src/emitter.ts
✅ **read** · 42 lines read
:::

The problem is on line 17 — you're registering the listener inside the loop...
```
