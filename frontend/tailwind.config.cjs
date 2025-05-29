/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
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
        textBlue: '#2D6A8B', // Новый цвет для текста и иконок
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
        // Текущий градиент (слева направо, мягкий голубой)
        //'header-gradient': 'linear-gradient(90deg, #BDEDF6AA 0%, #E6F5FA 50%, #F0F9FD 100%)',

        // Вариант 1: Более насыщенный голубой с диагональным направлением
        'header-gradient': 'linear-gradient(135deg, #8DCEDFAA 0%, #BDEDF6 50%, #E6F5FA 100%)',

        // Вариант 2: Вертикальный градиент сверху вниз с акцентом
        // 'header-gradient': 'linear-gradient(to bottom, #4FC3F7AA 0%, #BDEDF6 50%, #F0F9FD 100%)',

        // Вариант 3: Мягкий градиент с добавлением оранжевого оттенка
        // 'header-gradient': 'linear-gradient(90deg, #BDEDF6AA 0%, #FCCF8CAA 50%, #F0F9FD 100%)',

        // Вариант 4: Более контрастный с прозрачностью
        // 'header-gradient': 'linear-gradient(to right, #4FC3F780 0%, #8DCEDF80 50%, #E6F5FA80 100%)',
      },
      textShadow: {
        sm: '0 0 1px var(--tw-shadow-color), 0 0 1px var(--tw-shadow-color), 0 0 1px var(--tw-shadow-color), 0 0 1px var(--tw-shadow-color)',
        md: '0 0 2px var(--tw-shadow-color), 0 0 2px var(--tw-shadow-color), 0 0 2px var(--tw-shadow-color), 0 0 2px var(--tw-shadow-color)',
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: false,
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
      });
    }),
  ],
};