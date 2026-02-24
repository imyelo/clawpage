# create-openclaw-chats-share

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

  - Add Zod config schema with validation for chats-share.toml
  - Add customizable footer component support
  - Add memory background effect for chat pages
  - Add custom chats directory support with external file watching
  - Add configurable meta options (title, description)
  - Extract chat file-reading logic into reusable lib/chats module

## 0.1.0

### Minor Changes

- 86144f9: Initial release of openclaw-chats-share monorepo

  - CLI tool for parsing Openclaw session logs to markdown
  - Astro-based web package for sharing conversations
  - Scaffold tool for creating new chat share projects
