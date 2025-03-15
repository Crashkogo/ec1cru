import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './index.css';
import App from './App.tsx'
import { StrictMode } from 'react';
import './quill-config'; // Импортируем конфигурацию один раз


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
    <App />
    </StrictMode>
  </Provider>
)
