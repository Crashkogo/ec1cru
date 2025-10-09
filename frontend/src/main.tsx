import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx'
import { StrictMode } from 'react';

// Импортируем тестовую функцию для разработки
import './utils/transliterate';

// Инициализация тёмной темы
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
