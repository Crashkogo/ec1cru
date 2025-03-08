module.exports = {
  content: [
    './index.html', // Указываем index.html в корне
    './src/**/*.{js,ts,jsx,tsx}', // Все файлы в src
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#333333',
        yellowAccent: '#ffc107',
        redAccent: '#dc3545',
        greenAccent: '#28a745',
        whiteText: '#ffffff',
        grayText: '#555555',
      },
    },
  },
  plugins: [],
};