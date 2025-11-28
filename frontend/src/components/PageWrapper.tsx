// frontend/src/components/PageWrapper.tsx - Модальное окно логина (двухрежимное)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { XMarkIcon, UserCircleIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { authProvider } from '../admin/authProvider';

interface PageWrapperProps {
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ showLogin, setShowLogin }) => {
  const [mode, setMode] = useState<'client' | 'employee'>('employee');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [employeeData, setEmployeeData] = useState({ name: '', password: '' });
  const [clientData, setClientData] = useState({ inn: '', password: '' });
  const navigate = useNavigate();

  const closeModal = useCallback(() => {
    setShowLogin(false);
    setEmployeeData({ name: '', password: '' });
    setClientData({ inn: '', password: '' });
    setError('');
    setMode('employee');
  }, [setShowLogin]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authProvider.checkAuth({});
        const role = localStorage.getItem('role');
        if (role && ['ADMIN', 'MODERATOR', 'EVENTORG', 'ITS', 'DEVDEP'].includes(role)) {
          navigate('/admin/');
          closeModal();
        } else if (role === 'CLIENT') {
          navigate('/client');
          closeModal();
        }
      } catch {
        // Пользователь не авторизован
      }
    };
    if (showLogin) {
      checkAuth();
    }
  }, [navigate, showLogin, closeModal]);

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      await authProvider.login({ username: employeeData.name, password: employeeData.password });

      const role = localStorage.getItem('role');

      if (role && ['ADMIN', 'MODERATOR', 'EVENTORG', 'ITS', 'DEVDEP'].includes(role)) {
        navigate('/admin/');
        closeModal();
      } else {
        setError(`Доступ запрещён. Роль: ${role || 'не указана'} не является ролью сотрудника.`);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверное имя пользователя или пароль');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('clientData');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/clients/login`,
        { inn: clientData.inn, password: clientData.password }
      );

      const { token, role, client } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('clientData', JSON.stringify(client));

      navigate('/client');
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверный ИНН или пароль');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('clientData');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: 'client' | 'employee') => {
    setMode(newMode);
    setError('');
    setEmployeeData({ name: '', password: '' });
    setClientData({ inn: '', password: '' });
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (showLogin) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showLogin, closeModal]);

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-modern-white rounded-xl shadow-modern-lg w-full max-w-md relative animate-zoom-in-95">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-modern-gray-400 hover:text-modern-gray-600 hover:bg-modern-gray-100 rounded-lg transition-all duration-200"
          aria-label="Закрыть окно входа"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-modern-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {mode === 'employee' ? (
                <BuildingOffice2Icon className="h-8 w-8 text-modern-primary-600" />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-modern-primary-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-modern-gray-900 mb-2">
              {mode === 'client' ? 'Вход для клиентов' : 'Вход для сотрудников'}
            </h2>
            <p className="text-modern-gray-600">
              {mode === 'client' ? 'Доступ к личному кабинету' : 'Доступ к административной панели'}
            </p>
          </div>

          {/* Переключатель режимов */}
          <div className="flex justify-center mb-8 bg-modern-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                mode === 'client'
                  ? 'bg-modern-white text-modern-primary-600 shadow-modern'
                  : 'text-modern-gray-600 hover:text-modern-gray-700'
              }`}
              onClick={() => switchMode('client')}
            >
              <UserCircleIcon className="h-4 w-4 mr-2" />
              Клиенты
            </button>
            <button
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                mode === 'employee'
                  ? 'bg-modern-white text-modern-primary-600 shadow-modern'
                  : 'text-modern-gray-600 hover:text-modern-gray-700'
              }`}
              onClick={() => switchMode('employee')}
            >
              <BuildingOffice2Icon className="h-4 w-4 mr-2" />
              Сотрудники
            </button>
          </div>

          {/* Форма для сотрудников */}
          {mode === 'employee' && (
            <form onSubmit={handleEmployeeLogin} className="space-y-6">
              <div>
                <label htmlFor="employee-name" className="block text-sm font-medium text-modern-gray-900 mb-2">
                  Имя пользователя
                </label>
                <input
                  id="employee-name"
                  type="text"
                  value={employeeData.name}
                  onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                  placeholder="Введите имя пользователя"
                  disabled={isLoading}
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label htmlFor="employee-password" className="block text-sm font-medium text-modern-gray-900 mb-2">
                  Пароль
                </label>
                <input
                  id="employee-password"
                  type="password"
                  value={employeeData.password}
                  onChange={(e) => setEmployeeData({ ...employeeData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                  placeholder="Введите пароль"
                  disabled={isLoading}
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 bg-modern-primary-600 text-white rounded-lg hover:bg-modern-primary-700 focus:ring-2 focus:ring-modern-primary-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </form>
          )}

          {/* Форма для клиентов */}
          {mode === 'client' && (
            <form onSubmit={handleClientLogin} className="space-y-6">
              <div>
                <label htmlFor="client-inn" className="block text-sm font-medium text-modern-gray-900 mb-2">
                  ИНН организации
                </label>
                <input
                  id="client-inn"
                  type="text"
                  value={clientData.inn}
                  onChange={(e) => setClientData({ ...clientData, inn: e.target.value })}
                  className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                  placeholder="Введите ИНН"
                  disabled={isLoading}
                  required
                  minLength={10}
                  maxLength={12}
                />
              </div>

              <div>
                <label htmlFor="client-password" className="block text-sm font-medium text-modern-gray-900 mb-2">
                  Пароль
                </label>
                <input
                  id="client-password"
                  type="password"
                  value={clientData.password}
                  onChange={(e) => setClientData({ ...clientData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                  placeholder="Введите пароль"
                  disabled={isLoading}
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 bg-modern-primary-600 text-white rounded-lg hover:bg-modern-primary-700 focus:ring-2 focus:ring-modern-primary-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </form>
          )}

          {/* Дополнительная информация */}
          <div className="mt-6 pt-6 border-t border-modern-gray-200">
            <p className="text-xs text-modern-gray-500 text-center">
              {mode === 'client'
                ? 'Нет доступа? Обратитесь к вашему менеджеру'
                : 'Проблемы с доступом? Обратитесь к администратору'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageWrapper;
