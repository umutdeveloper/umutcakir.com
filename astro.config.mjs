import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://umutcakir.com',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  trailingSlash: 'never',
  build: { inlineStylesheets: 'always', format: 'file' },
});
