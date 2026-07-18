import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wndff.de',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: {
    enabled: false,
  },
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
