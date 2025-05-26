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
      const response = await axios.post<LoginResponse>(
        `${apiUrl}/api/users/login`,
        { name: username, password },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      const { token, role } = response.data;
      if (!token || !role) {
        throw new Error('Invalid login response: missing token or role');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      return { redirectTo: false };
    } catch (error: unknown) {
      const message = error instanceof AxiosError ? error.response?.data?.message || error.message : 'Unknown error';
      console.error('Authentication error:', {
        message,
        status: error instanceof AxiosError ? error.response?.status : undefined,
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
      if (!['ADMIN', 'MODERATOR', 'EVENTORG', 'ITS'].includes(role)) {
        throw new Error('Insufficient permissions');
      }
      return Promise.resolve();
    } catch (error: unknown) {
      const message = error instanceof AxiosError ? error.message : 'Unknown error';
      console.error('JWT check failed:', message);
      throw error;
    }
  },
  getPermissions: async () => {
    const role = localStorage.getItem('role');
    return Promise.resolve(role || null);
  },
};