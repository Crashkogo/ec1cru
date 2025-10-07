// frontend/vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    css: {
      postcss: './postcss.config.cjs',
    },
    // УДАЛИТЕ блок define - он не нужен!
    // Vite автоматически обрабатывает VITE_* переменные из .env
    
    resolve: {
      alias: {
        tinymce: path.resolve(__dirname, 'node_modules/tinymce'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@heroicons/react', '@tanstack/react-query'],
            'forms-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'editor-vendor': ['@tinymce/tinymce-react'],
            'admin-vendor': ['react-admin', 'ra-data-simple-rest'],
            'http-vendor': ['axios'],
            'utils-vendor': ['lodash', 'react-google-recaptcha'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      sourcemap: false,
    },
    server: {
      port: 5173,
      host: '0.0.0.0',
      fs: {
        allow: ['..'],
      },
      hmr: {
        port: 5174,
      },
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:5000',
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
  };
});