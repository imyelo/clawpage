# create-clawpage

## 1.0.1

### Patch Changes

- add Apache-2.0 license

## 1.0.0

### Major Changes

- Rename project from chats-share to Clawpage

  The project config file has been renamed from `chats-share.toml` to `clawpage.toml`.

  **Migration:** rename your config file:

  ```bash
  mv chats-share.toml clawpage.toml
  ```

## 0.5.0

### Minor Changes

- Multi-platform deployment support (Vercel, Netlify, Cloudflare, Docker)
- Updated deployment configs in scaffolding tool

## 0.4.0

### Minor Changes

- Run `git init` and an initial commit after scaffolding so every project starts as its own independent git repository, preventing inheritance of a parent `.git` directory.

  Honour the `--dir` flag for the output path: `targetDir` now resolves from `--dir` (absolute or relative to cwd) when provided, falling back to `<cwd>/<projectName>`. The `cd` hint now prints the full `targetDir`.

## 0.3.0

### Minor Changes

- Improved the stability of log parsing.

## 0.2.1

### Patch Changes

- Update GitHub Pages deploy workflow

  - Add workflow_dispatch trigger for manual deployment
  - Add explicit contents:write permissions
  - Rename job to build-and-deploy for clarity
  - Update oven-sh/setup-bun to v2 with explicit bun-version
  - Update peaceiris/actions-gh-pages to v4
  - Add named steps for better readability
  - Add publish_branch: gh-pages configuration

## 0.2.0

### Minor Changes

- b174aed: Add web configuration enhancements and new UI components

  - Add Zod config schema with validation for clawpage.toml
  - Add customizable footer component support
  - Add memory background effect for chat pages
  - Add custom chats directory support with external file watching
  - Add configurable meta options (title, description)
  - Extract chat file-reading logic into reusable lib/chats module

## 0.1.0

### Minor Changes

- 86144f9: Initial release of clawpage monorepo

  - CLI tool for parsing Openclaw session logs to markdown
  - Astro-based web package for sharing conversations
  - Scaffold tool for creating new chat share projects
