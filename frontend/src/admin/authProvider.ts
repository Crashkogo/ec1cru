// src/admin/authProvider.ts
import { AuthProvider } from 'react-admin';
import axios from 'axios';

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          name: username,
          password,
        }
      );

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      console.log('✅ Login successful as', username);

      return Promise.resolve();
    } catch (error: any) {
      console.error(
        '❌ Login failed:',
        error.response?.data?.message || error.message
      );
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return Promise.resolve();
  },
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject();
    await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  getPermissions: () => {
    const role = localStorage.getItem('role');
    return Promise.resolve(role);
  },
};

export { authProvider };
