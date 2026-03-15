# create-clawpage

Scaffolding tool to initialize a new [clawpage](https://github.com/imyelo/clawpage) project.

## Usage

```bash
npx create-clawpage <project-name>
```

This creates a new directory with:

- `clawpage.toml` — site configuration (fill in your `site` URL)
- `chats/` — directory for your exported chat YAML files
- `.github/workflows/` — GitHub Actions workflow for automatic Pages deployment
- `package.json` — wired to `clawpage-web` for local dev and build

## Next Steps

After scaffolding, follow the setup guide in the [Clawpage README](https://github.com/imyelo/clawpage) or paste this into your agent chat:

```
Read https://clawhub.ai/imyelo/clawpage and install the clawpage skill,
then run first-time setup for me.
```
