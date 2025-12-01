// src/admin/authProvider.ts
import { AuthProvider } from 'react-admin';
import axios from 'axios';

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      // БЕЗОПАСНОСТЬ: withCredentials отправляет и принимает HttpOnly cookies
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          name: username,
          password,
        },
        {
          withCredentials: true, // ВАЖНО: Разрешаем отправку/прием cookies
        }
      );

      const { role } = response.data;
      // БЕЗОПАСНОСТЬ: Сохраняем только роль в localStorage (не чувствительные данные)
      // Токен хранится в HttpOnly cookie и недоступен из JavaScript
      localStorage.setItem('role', role);

      // БЕЗОПАСНОСТЬ: Логирование только в режиме разработки
      if (import.meta.env.DEV) {
        console.log('✅ Login successful as', username);
      }

      return Promise.resolve();
    } catch (error: any) {
      // БЕЗОПАСНОСТЬ: Логирование ошибок только в режиме разработки
      if (import.meta.env.DEV) {
        console.error(
          '❌ Login failed:',
          error.response?.data?.message || error.message
        );
      }
      throw error;
    }
  },
  logout: async () => {
    try {
      // БЕЗОПАСНОСТЬ: Отправляем запрос на бэкенд для очистки HttpOnly cookies
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/logout`,
        {},
        {
          withCredentials: true, // ВАЖНО: Разрешаем отправку cookies
        }
      );
    } catch (error) {
      // Игнорируем ошибки logout - все равно очищаем локальные данные
      if (import.meta.env.DEV) {
        console.error('Logout error:', error);
      }
    }

    localStorage.removeItem('role');
    return Promise.resolve();
  },
  checkAuth: async () => {
    try {
      // БЕЗОПАСНОСТЬ: Проверяем валидность токена из HttpOnly cookie
      // Токен автоматически отправляется браузером с запросом
      await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        withCredentials: true, // ВАЖНО: Разрешаем отправку cookies
      });
      return Promise.resolve();
    } catch (error) {
      // Если токен невалиден или отсутствует, разлогиниваем пользователя
      return Promise.reject();
    }
  },
  checkError: () => Promise.resolve(),
  getPermissions: () => {
    const role = localStorage.getItem('role');
    return Promise.resolve(role);
  },
};

export { authProvider };
