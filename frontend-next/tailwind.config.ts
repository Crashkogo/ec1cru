import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Старые цвета (для совместимости)
        lightGray: '#F5F5F5',
        white: '#FFFFFF',
        darkGray: '#333333',
        grayAccent: '#E5E7EB',
        primaryBlue: '#8DCEDF',
        hoverBlue: '#6BA8C7',
        lightBlue: '#BDEDF6',
        accentSkyTransparent: '#4FC2F780',
        accentSky: '#4FC3F7',
        primaryOrange: '#FCCF8C',
        hoverOrange: '#E8B978',
        secondaryOrange: '#FDB265',
        hoverSecondaryOrange: '#E89B4F',
        accentYellow: '#F5A623',
        hoverYellow: '#D68F1F',
        textBlue: '#2D6A8B',

        // Новая современная цветовая схема
        modern: {
          // Нейтральные цвета
          'white': '#FFFFFF',
          'gray-50': '#F8FAFC',
          'gray-100': '#F1F5F9',
          'gray-200': '#E2E8F0',
          'gray-300': '#CBD5E1',
          'gray-400': '#94A3B8',
          'gray-500': '#64748B',
          'gray-600': '#475569',
          'gray-700': '#334155',
          'gray-800': '#1E293B',
          'gray-900': '#0F172A',

          // Основной цвет (синий)
          'primary-50': '#EFF6FF',
          'primary-100': '#DBEAFE',
          'primary-200': '#BFDBFE',
          'primary-300': '#93C5FD',
          'primary-400': '#60A5FA',
          'primary-500': '#3B82F6',
          'primary-600': '#2563EB',
          'primary-700': '#1D4ED8',
          'primary-800': '#1E40AF',
          'primary-900': '#1E3A8A',

          // Акцентный цвет (изумрудный)
          'accent-50': '#ECFDF5',
          'accent-100': '#D1FAE5',
          'accent-200': '#A7F3D0',
          'accent-300': '#6EE7B7',
          'accent-400': '#34D399',
          'accent-500': '#10B981',
          'accent-600': '#059669',
          'accent-700': '#047857',
          'accent-800': '#065F46',
          'accent-900': '#064E3B',
        }
      },
      spacing: {
        '4-header': '0.5rem',
        'header': '4rem',
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      backgroundImage: {
        // Старый градиент (для совместимости)
        'header-gradient': 'linear-gradient(135deg, #8DCEDFAA 0%, #BDEDF6 50%, #E6F5FA 100%)',

        // Новые современные градиенты
        'modern-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      boxShadow: {
        'modern': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'modern-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modern-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      textShadow: {
        sm: '0 0 1px var(--tw-shadow-color), 0 0 1px var(--tw-shadow-color), 0 0 1px var(--tw-shadow-color), 0 0 1px var(--tw-shadow-color)',
        md: '0 0 2px var(--tw-shadow-color), 0 0 2px var(--tw-shadow-color), 0 0 2px var(--tw-shadow-color), 0 0 2px var(--tw-shadow-color)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'zoom-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'zoom-in': 'zoom-in 0.2s ease-out',
        'zoom-in-95': 'zoom-in 0.2s ease-out',
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {},
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.text-stroke-1': {
          '-webkit-text-stroke-width': '1px',
          'text-stroke-width': '1px',
        },
        '.text-stroke-color-dark': {
          '-webkit-text-stroke-color': '#333333',
          'text-stroke-color': '#333333',
        },
        '.text-stroke-color-gray': {
          '-webkit-text-stroke-color': '#666666',
          'text-stroke-color': '#666666',
        },
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.25)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          'backdrop-filter': 'blur(4px)',
          '-webkit-backdrop-filter': 'blur(4px)',
          'border-radius': '10px',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
        },
      });
    }),
  ],
};

export default config;
