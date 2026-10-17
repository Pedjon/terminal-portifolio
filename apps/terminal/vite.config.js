import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { getWebsiteUrl } from './src/assets/scripts/navigation.js';

const appDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, appDirectory, 'VITE_');
  const websiteUrl = getWebsiteUrl(environment.VITE_WEB_URL || 'http://localhost:8081/', 'en');

  return {
    root: fileURLToPath(new URL('./src', import.meta.url)),
    envDir: appDirectory,
    plugins: [{
      name: 'portfolio-website-link',
      transformIndexHtml(html) {
        return html.replace('__WEBSITE_URL__', () => websiteUrl.replaceAll('&', '&amp;'));
      }
    }],
    build: {
      outDir: fileURLToPath(new URL('./dist', import.meta.url)),
      emptyOutDir: true
    }
  };
});
