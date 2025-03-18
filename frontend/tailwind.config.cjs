module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
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
        lightGray: '#ccc',
      },
      spacing: {
        '4-header': '0.5rem',
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