import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import UnoCSS from 'unocss/astro';
import { presetUno, presetAttributify } from 'unocss';
import presetTypography from '@unocss/preset-typography';
import { loadConfig } from 'c12';
import { createDefu } from 'defu';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { ChatsShareConfigSchema } from './src/lib/config-schema.ts';

// Arrays are concatenated, then base items.
const merge = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key])) {
    obj[key] = [...obj[key], ...value];
    return true;
  }
});

const projectDir = process.env.CHATS_SHARE_WORKDIR ?? process.cwd();

// The chats/ directory lives outside Astro's project root, so Vite won't watch
// it by default. This plugin adds it to the watcher and triggers a full reload
// whenever a chat file or the project config file changes.
function externalWatchPlugin() {
  const chatsDir = resolve(
    projectDir,
    config.chats_dir ?? 'chats',
  );
  const configDir = projectDir;

  return {
    name: 'openclaw-chats-watch',
    apply: 'serve',
    configureServer(server) {
      if (existsSync(chatsDir)) {
        server.watcher.add(chatsDir);
      }
      server.watcher.add(join(configDir, 'chats-share.toml'));

      const reload = (file) => {
        if (file.startsWith(chatsDir) || file.startsWith(join(configDir, 'chats-share.toml'))) {
          server.moduleGraph.invalidateAll();
          server.ws.send({ type: 'full-reload' });
        }
      };

      server.watcher.on('add', reload);
      server.watcher.on('change', reload);
      server.watcher.on('unlink', reload);
    },
  };
}

const { config: projectConfig } = await loadConfig({
  name: 'chats-share',
  configFile: 'chats-share',
  cwd: projectDir,
});

const parsed = ChatsShareConfigSchema.safeParse(projectConfig);
if (!parsed.success) {
  console.warn('Invalid config:', parsed.error.flatten());
}

const config = parsed.success ? parsed.data : {};

// Map top-level convenience keys to Astro config options.
// Paths are resolved against the project directory so they work regardless
// of which directory Astro is launched from.
const mapped = {};
if (config.site) mapped.site = config.site;
if (config.base) mapped.base = config.base;
if (config.public_dir) mapped.publicDir = projectDir ? join(projectDir, config.public_dir) : config.public_dir;
if (config.out_dir) mapped.outDir = projectDir ? join(projectDir, config.out_dir) : config.out_dir;

export default defineConfig(merge(
  { ...mapped, ...(config.astro ?? {}) },
  {
    integrations: [
      UnoCSS({
        injectReset: true,
        presets: [
          presetUno(),
          presetTypography({
            cssExtend: {
              // Remove decorative backtick pseudo-elements around inline code
              'code::before': { content: 'none' },
              'code::after': { content: 'none' },
              // Remove decorative quote pseudo-elements around blockquotes
              'blockquote p:first-of-type::before': { content: 'none' },
              'blockquote p:last-of-type::after': { content: 'none' },
              // Use design system colors instead of preset defaults
              ':is(.prose)': {
                '--un-prose-body': 'var(--text-primary)',
                '--un-prose-invert-body': 'var(--text-primary)',
                '--un-prose-links': 'var(--accent)',
                '--un-prose-invert-links': 'var(--accent)',
                '--un-prose-headings': 'var(--text-primary)',
                '--un-prose-invert-headings': 'var(--text-primary)',
                '--un-prose-code': 'var(--text-primary)',
                '--un-prose-invert-code': 'var(--text-primary)',
                '--un-prose-pre-bg': 'var(--bg-tertiary)',
                '--un-prose-invert-pre-bg': 'var(--bg-tertiary)',
                '--un-prose-bullets': 'var(--text-muted)',
                '--un-prose-invert-bullets': 'var(--text-muted)',
                '--un-prose-counters': 'var(--text-muted)',
                '--un-prose-invert-counters': 'var(--text-muted)',
                '--un-prose-quotes': 'var(--text-secondary)',
                '--un-prose-invert-quotes': 'var(--text-secondary)',
                '--un-prose-quote-borders': 'var(--border)',
                '--un-prose-invert-quote-borders': 'var(--border)',
              },
            },
          }),
          presetAttributify(),
        ],
        theme: {
          colors: {
            'text-primary': 'var(--text-primary)',
            'text-secondary': 'var(--text-secondary)',
            'text-muted': 'var(--text-muted)',
            'accent': 'var(--accent)',
            'border': 'var(--border)',
            'bg-primary': 'var(--bg-primary)',
            'bg-secondary': '#141414',
            'bg-tertiary': 'var(--bg-tertiary)',
            'msg-assistant-bg': 'var(--assistant-msg-bg)',
            'msg-assistant-border': 'var(--assistant-msg-border)',
            'msg-user-bg': 'var(--user-msg-bg)',
            'msg-user-border': 'var(--user-msg-border)',
          },
        },
      }),
      react(),
    ],
    vite: {
      css: {
        modules: {
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
      plugins: [externalWatchPlugin()],
    },
    output: 'static',
    build: {
      format: 'directory',
    },
  },
));
