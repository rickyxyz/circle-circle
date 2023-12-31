/// <reference types="vitest" />
/// <reference types="vite/client" />

import { UserConfig, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()] as UserConfig['plugins'],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['setupTests.ts'],
    include: ['./tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['./tests/e2e'],
    reporters: 'basic',
    globalSetup: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
