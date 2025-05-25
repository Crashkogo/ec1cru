import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './index.css';
import App from './App.tsx'
import { StrictMode } from 'react';

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
    <App />
    </StrictMode>
  </Provider>
)
