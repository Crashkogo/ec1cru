import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      // Указываем псевдоним для TinyMCE
      'tinymce': path.resolve(__dirname, 'node_modules/tinymce'),
    },
  },
  server: {
    fs: {
      allow: ['..'], // Разрешаем доступ к node_modules
    },
  },
});