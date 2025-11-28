import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface ClientLoginProps {
  onClose: () => void;
}

type LoginMode = 'employee' | 'client';

const ClientLogin: React.FC<ClientLoginProps> = ({ onClose }) => {
  const [mode, setMode] = useState<LoginMode>('employee');
  const [username, setUsername] = useState('');
  const [inn, setInn] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        { name: username, password }
      );

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      onClose();
      navigate('/admin/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/clients/login`,
        { inn, password }
      );

      const { token, role, client } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('clientData', JSON.stringify(client));

      onClose();
      navigate('/client');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-modern-primary-600 to-modern-primary-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Вход в систему</h2>
          <p className="text-modern-primary-100 mt-1">Выберите тип учетной записи</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-modern-gray-200">
          <button
            onClick={() => {
              setMode('employee');
              setError('');
            }}
            className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
              mode === 'employee'
                ? 'text-modern-primary-600 border-b-2 border-modern-primary-600 bg-modern-primary-50'
                : 'text-modern-gray-500 hover:text-modern-gray-700 hover:bg-modern-gray-50'
            }`}
          >
            <UserCircleIcon className="h-5 w-5 mr-2" />
            Для сотрудников
          </button>
          <button
            onClick={() => {
              setMode('client');
              setError('');
            }}
            className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
              mode === 'client'
                ? 'text-modern-primary-600 border-b-2 border-modern-primary-600 bg-modern-primary-50'
                : 'text-modern-gray-500 hover:text-modern-gray-700 hover:bg-modern-gray-50'
            }`}
          >
            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
            Для клиентов
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {mode === 'employee' ? (
            <form onSubmit={handleEmployeeLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                  Имя пользователя
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Введите имя пользователя"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                  Пароль
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Введите пароль"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-modern-gray-300 text-modern-gray-700 rounded-lg hover:bg-modern-gray-50 transition-all duration-200 font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-modern-primary-600 text-white rounded-lg hover:bg-modern-primary-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Вход...' : 'Войти'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleClientLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                  ИНН организации
                </label>
                <input
                  type="text"
                  value={inn}
                  onChange={(e) => setInn(e.target.value)}
                  className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Введите ИНН"
                  required
                  minLength={10}
                  maxLength={12}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                  Пароль
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Введите пароль"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-modern-gray-300 text-modern-gray-700 rounded-lg hover:bg-modern-gray-50 transition-all duration-200 font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-modern-primary-600 text-white rounded-lg hover:bg-modern-primary-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Вход...' : 'Войти'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
