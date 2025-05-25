// frontend/src/admin/authProvider.ts
import { AuthProvider } from 'react-admin';
import axios from 'axios';

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const loginUrl = `${apiUrl}/api/users/login`;
      console.log('Environment:', import.meta.env); // Логируем окружение
      console.log('Login request to:', loginUrl); // Логируем URL
      console.log('Request payload:', { name: username, password: '****' }); // Логируем тело

      console.log('Starting axios request...');
      const response = await axios.post(loginUrl, {
        name: username,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000, // Увеличили таймаут до 10 секунд
      });

      console.log('Axios request completed');
      console.log('Full response object:', JSON.stringify(response, null, 2));
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);

      let token, role;
      if (response.data && typeof response.data === 'object') {
        ({ token, role } = response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format');
      }

      if (!token || !role) {
        console.error('Missing token or role:', { token, role });
        throw new Error('Invalid login response: missing token or role');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      console.log('Saved to localStorage:', { token: token.slice(0, 20) + '...', role });

      return Promise.resolve();
    } catch (error: any) {
      console.error('Login error:', {
        message: error.message,
        code: error.code,
        response: error.response ? JSON.stringify(error.response.data, null, 2) : null,
        status: error.response?.status,
        config: error.config ? {
          url: error.config.url,
          method: error.config.method,
          data: error.config.data,
          headers: error.config.headers,
        } : null,
      });
      throw new Error(`Authentication failed: ${error.message}`);
    }
  },
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return Promise.resolve();
  },
  checkError: async ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      throw new Error('Session expired');
    }
    return Promise.resolve();
  },
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await axios.get(`${apiUrl}/api/users/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { role } = response.data.user;
      console.log('Check auth role:', role);
      if (!['ADMIN', 'MODERATOR', 'EVENTORG', 'ITS', 'DEVDEP'].includes(role)) {
        throw new Error('Insufficient permissions');
      }
      return Promise.resolve();
    } catch (error: any) {
      console.error('Check auth error:', error.message);
      throw error;
    }
  },
  getPermissions: async () => {
    const role = localStorage.getItem('role');
    console.log('Get permissions:', role);
    return Promise.resolve(role || null);
  },
};