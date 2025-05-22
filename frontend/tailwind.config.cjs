/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Основная палитра
        lightGray: '#F5F5F5', // Основной фон
        darkPurple: '#818CFF', // Темно-фиолетовый для акцентов
        hoverButton: '#C5CAE9',
        lightPurple: '#A2A9FF', // Светло-фиолетовый для ховер-эффектов
        orange: '#F77C2F', // Оранжевый для CTA-кнопок
        turquoise: '#49E2F8', // Бирюзовый для выделения
        white: '#FFFFFF', // Белый для текста и фонов
        darkGray: '#333333', // Темно-серый для текста
        grayAccent: '#E5E7EB', // Серый для границ и второстепенных элементов
      },
      spacing: {
        '4-header': '0.5rem', // Сохраняем твой кастомный отступ
        'header': '4rem', // Высота хедера
      },
      fontSize: {
        'xs': '0.75rem', // 12px
        'sm': '0.875rem', // 14px
        'base': '1rem', // 16px
        'lg': '1.125rem', // 18px
        'xl': '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: false,
    },
  },
  plugins: [],
};