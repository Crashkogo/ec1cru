/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Поддержка загруженных изображений из backend
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ec-1c.ru',
        pathname: '/uploads/**',
      },
    ],
  },

  // Настройка для статических файлов из public
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },

  // Transpile packages для React Admin
  transpilePackages: [
    'react-admin',
    'ra-core',
    'ra-ui-materialui',
    'ra-language-russian',
    '@mui/material',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled'
  ],

  // Отключаем React strict mode для админки (конфликт с React Admin)
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;
