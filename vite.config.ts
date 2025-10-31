import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 可选：方便用 @ 引用 src
    },
  },
  server: {
    port: 3000,
    open: true,
    // 解决 SPA 404
    fs: {
      allow: ['.'],
    },
  },
});
