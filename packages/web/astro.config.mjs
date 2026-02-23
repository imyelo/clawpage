import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import UnoCSS from 'unocss/astro';
import { loadConfig } from 'c12';
import { createDefu } from 'defu';
import { join } from 'node:path';

// Arrays are concatenated: user items first, then base items.
const merge = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key])) {
    obj[key] = [...obj[key], ...value];
    return true;
  }
});

const projectDir = process.env.CHATS_SHARE_WORKDIR;

const { config: projectConfig } = await loadConfig({
  name: 'chats-share',
  configFile: 'chats-share',
  cwd: projectDir,
});

// Map top-level convenience keys to Astro config options.
// Paths are resolved against the project directory so they work regardless
// of which directory Astro is launched from.
const mapped = {};
if (projectConfig.site) mapped.site = projectConfig.site;
if (projectConfig.base) mapped.base = projectConfig.base;
if (projectConfig.public_dir) mapped.publicDir = projectDir ? join(projectDir, projectConfig.public_dir) : projectConfig.public_dir;
if (projectConfig.out_dir) mapped.outDir = projectDir ? join(projectDir, projectConfig.out_dir) : projectConfig.out_dir;

export default defineConfig(merge(
  { ...mapped, ...(projectConfig.astro ?? {}) },
  {
    integrations: [
      UnoCSS({ injectReset: true }),
      react(),
    ],
    vite: {
      css: {
        modules: {
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    output: 'static',
    build: {
      format: 'directory',
    },
  },
));
