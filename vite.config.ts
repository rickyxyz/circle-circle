/// <reference types="vitest" />
/// <reference types="vite/client" />

import { UserConfig, defineConfig } from 'vitest/config';
import cleanup from 'rollup-plugin-cleanup';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cleanup({ comments: 'istanbul', extensions: ['js', 'ts'] }),
  ] as UserConfig['plugins'],
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
  build: {
    cssMinify: 'lightningcss',
    rollupOptions: {
      external: ['/stories/.*', '/tests/.*', '**/*.test.ts', '**/*.spec.ts'],
      output: {
        manualChunks(id: string) {
          if (
            id.includes('react-router-dom') ||
            id.includes('@remix-run') ||
            id.includes('react-router')
          ) {
            return '@react-router';
          }
          if (id.includes('firebase')) {
            return '@firebase';
          }
          if (id.includes('quill')) {
            return '@quill';
          }
        },
      },
    },
  },
});
