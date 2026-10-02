// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Old Turkish pages were removed in the 2026 redesign; send their URLs home.
const gone = ['/about', '/contact', '/projects', '/egitimler', '/blog',
  '/blog/angular-migration-ai-2-days', '/blog/memory-leak-hunting-with-ai', '/blog/senior-developer-ai-strategy'];

export default defineConfig({
  site: 'https://umutcakir.com',
  integrations: [sitemap({ filter: (page) => !gone.some((p) => page.replace(/\/$/, '').endsWith(p)) })],
  redirects: Object.fromEntries(gone.map((p) => [p, '/'])),
  trailingSlash: 'never',
  build: { inlineStylesheets: 'always', format: 'file' },
});
