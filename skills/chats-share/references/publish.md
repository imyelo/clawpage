# Publish (Optional)

Push the chat file to a new branch and open a pull request.

Only run this after step 6 (Confirm & Save) is complete, and only with explicit user confirmation.

## Steps

1. Create branch:
   ```bash
   cd {projectDir}
   git checkout -b chat/{YYYYMMDD}-{topic}
   ```
2. Stage and commit:
   ```bash
   git add chats/{YYYYMMDD}-{topic}.md
   git commit -m "docs: add {topic}"
   ```
3. Push:
   ```bash
   git push -u origin chat/{YYYYMMDD}-{topic}
   ```
4. Show guidance:
   ```
   ✓ Branch pushed: chat/{YYYYMMDD}-{topic}

   Next steps:
   1. Open https://github.com/{repo}/pull/new/chat/{YYYYMMDD}-{topic}
   2. Review and create PR
   ```
