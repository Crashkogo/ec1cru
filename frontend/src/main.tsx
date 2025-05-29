import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './index.css';
import App from './App.tsx'
import { StrictMode } from 'react';

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
  <Provider store={store}>
    <StrictMode>
    <App />
    </StrictMode>
  </Provider>
)
