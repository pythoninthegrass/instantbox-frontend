import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost';
const API_PORT = process.env.API_PORT || '65501';

export default defineConfig({
  integrations: [svelte()],
  server: {
    proxy: {
      '/v2/superinspire': {
        target: `${API_URL}:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // If you have global SCSS variables or mixins, you can add them here
          // additionalData: `@import "./src/styles/variables.scss";`,
        },
      },
    },
  },
});
