// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  define: {
    // Устанавливаем дефолтное значение для VITE_API_URL если не задано в .env
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'http://localhost:5000'
    ),
  },
  resolve: {
    alias: {
      tinymce: path.resolve(__dirname, 'node_modules/tinymce'),
    },
  },
  build: {
    // Оптимизации для code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Выносим React в отдельный чанк
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI библиотеки в отдельный чанк
          'ui-vendor': ['@heroicons/react', '@tanstack/react-query'],

          // Формы и валидация
          'forms-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // TinyMCE в отдельный чанк (большая библиотека)
          'editor-vendor': ['@tinymce/tinymce-react'],

          // React Admin в отдельный чанк
          'admin-vendor': ['react-admin', 'ra-data-simple-rest'],

          // Axios в отдельный чанк
          'http-vendor': ['axios'],

          // Lodash и утилиты
          'utils-vendor': ['lodash', 'react-google-recaptcha'],
        },
      },
    },

    // Увеличиваем лимит предупреждения о размере чанка
    chunkSizeWarningLimit: 1000,

    // Минификация
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Убираем console.log в продакшене
        drop_debugger: true,
      },
    },

    // Дополнительные оптимизации
    sourcemap: false, // Отключаем sourcemaps в продакшене для уменьшения размера
  },

  server: {
    port: 5173,
    host: '0.0.0.0', // ИЗМЕНЕНО: Слушаем на всех интерфейсах для доступа из сети
    fs: {
      allow: ['..'],
    },
    hmr: {
      port: 5174,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000', // Можно задать через переменную окружения
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});