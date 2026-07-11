import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],

    /**
     * base — the public path your site is served from.
     * GitHub Pages project site: https://<username>.github.io/<repo-name>/
     * Set VITE_BASE_PATH in your GitHub Actions workflow. Defaults to '/' for local dev.
     */
    base: process.env.VITE_BASE_PATH ?? '/',

    resolve: {
      alias: {
        // '@' maps to ./src for clean absolute imports
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
