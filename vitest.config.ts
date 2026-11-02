import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

const src = fileURLToPath(new URL('./src', import.meta.url));
const fromSrc = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: /^@(?=\/|$)/, replacement: src },
      { find: /^src(?=\/|$)/, replacement: src },
      { find: /^stores(?=\/|$)/, replacement: fromSrc('stores') },
      { find: /^components(?=\/|$)/, replacement: fromSrc('components') },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    clearMocks: true,
  },
});
