// frontend/src/components/PageWrapper.tsx - Модальное окно логина
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { XMarkIcon, UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { authProvider } from '../admin/authProvider';

const loginSchema = z.object({
  name: z.string().min(3, 'Имя должно содержать минимум 3 символа'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface PageWrapperProps {
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ showLogin, setShowLogin }) => {
  const [mode, setMode] = useState<'client' | 'employee'>('employee');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const closeModal = useCallback(() => {
    setShowLogin(false);
    reset();
    setMode('employee');
  }, [setShowLogin, reset]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authProvider.checkAuth({});
        const role = localStorage.getItem('role');
        if (role && ['ADMIN', 'MODERATOR', 'EVENTORG', 'ITS', 'DEVDEP'].includes(role)) {
          navigate('/admin/dashboard');
          closeModal();
        } else if (role === 'CLINE') {
          navigate('/client');
          closeModal();
        }
      } catch {
        // Пользователь не авторизован, ничего не делаем
      }
    };
    if (showLogin) {
      checkAuth();
    }
  }, [navigate, showLogin, closeModal]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      await authProvider.login({ username: data.name, password: data.password });

      const role = localStorage.getItem('role');

      if (mode === 'employee' && role && ['ADMIN', 'MODERATOR', 'EVENTORG', 'ITS', 'DEVDEP'].includes(role)) {
        navigate('/admin/dashboard');
        closeModal();
      } else if (mode === 'client' && role === 'CLINE') {
        navigate('/client');
        closeModal();
      } else {
        setError('root', {
          message: `Доступ запрещён. Роль: ${role || 'не указана'}, режим: ${mode}.`,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('root', { message: 'Неверное имя пользователя или пароль' });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: 'client' | 'employee') => {
    setMode(newMode);
    reset();
  };

  // Обработка нажатия Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (showLogin) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Блокируем скролл фона
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

        {/* Кнопка закрытия */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-modern-gray-400 hover:text-modern-gray-600 hover:bg-modern-gray-100 rounded-lg transition-all duration-200"
          aria-label="Закрыть окно входа"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-modern-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {mode === 'employee' ? (
                <BuildingOfficeIcon className="h-8 w-8 text-modern-primary-600" />
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
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${mode === 'client'
                ? 'bg-modern-white text-modern-primary-600 shadow-modern'
                : 'text-modern-gray-600 hover:text-modern-gray-700'
                }`}
              onClick={() => switchMode('client')}
            >
              <UserCircleIcon className="h-4 w-4 mr-2" />
              Клиенты
            </button>
            <button
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${mode === 'employee'
                ? 'bg-modern-white text-modern-primary-600 shadow-modern'
                : 'text-modern-gray-600 hover:text-modern-gray-700'
                }`}
              onClick={() => switchMode('employee')}
            >
              <BuildingOfficeIcon className="h-4 w-4 mr-2" />
              Сотрудники
            </button>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-modern-gray-900 mb-2">
                Имя пользователя
              </label>
              <input
                id="name"
                {...register('name')}
                className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                placeholder="Введите имя пользователя"
                disabled={isLoading}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-modern-gray-900 mb-2">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                placeholder="Введите пароль"
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {errors.root && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{errors.root.message}</p>
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

          {/* Дополнительная информация */}
          <div className="mt-6 pt-6 border-t border-modern-gray-200">
            <p className="text-xs text-modern-gray-500 text-center">
              {mode === 'client'
                ? 'Нет доступа? Обратитесь к вашему менеджеру'
                : 'Проблемы с доступом? Обратитесь к администратору'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageWrapper;