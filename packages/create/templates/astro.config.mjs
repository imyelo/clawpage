import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import UnoCSS from 'unocss/astro';

export default defineConfig({
  site: 'https://your-username.github.io',
  integrations: [
    UnoCSS({ injectReset: true }),
    react()
  ],
  vite: {
    css: {
      modules: {
        generateScopedName: "[name]__[local]___[hash:base64:5]",
      }
    }
  },
  output: 'static',
  build: {
    format: 'directory',
  },
});
