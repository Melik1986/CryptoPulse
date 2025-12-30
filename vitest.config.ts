import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    alias: {
      '@': path.resolve(__dirname, './'),
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    deps: {
      optimizer: {
        web: {
          include: ['react', 'react-dom', 'zustand'],
        },
      },
    },
  },
});
