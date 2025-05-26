// frontend/src/admin/authProvider.ts
import { AuthProvider } from 'react-admin';
import axios, { AxiosError } from 'axios';

interface LoginResponse {
  message: string;
  token: string;
  role: string;
}

interface ProtectedUserResponse {
  user: { role: string };
}

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
<<<<<<< HEAD
      const response = await axios.post<LoginResponse>(
        `${apiUrl}/api/users/login`,
        { name: username, password },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );
=======
      const loginUrl = `${apiUrl}/api/users/login`;
      console.log('Environment:', import.meta.env); // Логируем окружение
      console.log('Login request to:', loginUrl); // Логируем URL
      console.log('Request payload:', { name: username, password: '****' }); // Логируем тело
      console.log('Starting axios request...');

      const response = await axios.post(
        loginUrl,
        {
          name: username,
          password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

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
>>>>>>> 8cbc464880bef5378f9c53580fda236c2e8b6133

      const { token, role } = response.data;
      if (!token || !role) {
        throw new Error('Invalid login response: missing token or role');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Предотвращаем автоматический редирект React-Admin
      return { redirectTo: false };
    } catch (error: any) {
      console.error('Login error:', {
        message: error.message,
        code: error.code,
        response: error.response ? JSON.stringify(error.response.data, null, 2) : null,
        status: error.response?.status,
        config: error.config
          ? {
              url: error.config.url,
              method: error.config.method,
              data: error.config.data,
              headers: error.config.headers,
            }
          : null,
      });
      throw new Error('Authentication failed');
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
      const response = await axios.get<ProtectedUserResponse>(`${apiUrl}/api/users/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { role } = response.data.user;
      if (!['ADMIN', 'MODERATOR', 'EVENTORG', 'ITS', 'DEVDEP'].includes(role)) {
        throw new Error('Insufficient permissions');
      }
      return Promise.resolve();
    } catch (error: unknown) {
      const message = error instanceof AxiosError ? error.response?.data?.message || error.message : 'Unknown error';
      console.error('Check auth error:', message);
      throw new Error('Authentication check failed');
    }
  },
  getPermissions: async () => {
    const role = localStorage.getItem('role');
    return Promise.resolve(role || null);
  },
};