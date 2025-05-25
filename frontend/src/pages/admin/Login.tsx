// frontend/src/pages/admin/Login.tsx
import React, { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { XMarkIcon } from '@heroicons/react/24/outline';

const loginSchema = z.object({
  name: z.string().min(3, 'Имя должно содержать минимум 3 символа'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginProps {
  onClose?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'client' | 'employee'>('employee');
  const login = useLogin();
  const notify = useNotify();
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

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      console.log('Before login attempt:', { username: data.name, mode }); // Лог перед логином
      await login({ username: data.name, password: data.password });
      const role = localStorage.getItem('role');
      console.log('Login attempt:', { mode, role, username: data.name }); // Лог после логина
      if (mode === 'employee' && role && ['ADMIN', 'MODERATOR', 'EVENTORG', 'ITS', 'DEVDEP'].includes(role)) {
        navigate('/admin');
        if (onClose) onClose();
      } else if (mode === 'client' && role === 'CLINE') {
        navigate('/client');
        if (onClose) onClose();
      } else {
        setError('root', { 
          message: `Доступ запрещён. Роль: ${role || 'не указана'}, режим: ${mode}.` 
        });
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('root', { message: 'Неверное имя пользователя или пароль' });
      notify('Ошибка входа', { type: 'error' });
    }
  };

  const switchMode = (newMode: 'client' | 'employee') => {
    setMode(newMode);
    reset();
  };

  return (
    <div
      className={`min-h-screen bg-gray-100 flex items-center justify-center ${onClose ? 'fixed inset-0 bg-black bg-opacity-50 z-50' : ''}`}
    >
      <div className="bg-white rounded-lg p-8 shadow-md w-full max-w-md relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-darkGray hover:text-primaryBlue"
            aria-label="Закрыть окно входа"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
        <h2 className="text-2xl font-semibold text-darkGray mb-6 text-center">
          {mode === 'client' ? 'Вход для клиентов' : 'Вход для сотрудников'}
        </h2>
        <div className="flex justify-center mb-6 space-x-2">
          <button
            className={`px-4 py-2 rounded-md font-medium text-base transition-all duration-200 transform ${
              mode === 'client'
                ? 'bg-primaryBlue text-textBlue border border-primaryBlue scale-105 shadow-md'
                : 'bg-lightGray text-darkGray hover:bg-grayAccent'
            }`}
            onClick={() => switchMode('client')}
          >
            Клиенты
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium text-base transition-all duration-200 transform ${
              mode === 'employee'
                ? 'bg-accentSkyTransparent text-textBlue border border-accentSkyTransparent scale-105 shadow-md'
                : 'bg-lightGray text-darkGray hover:bg-grayAccent'
            }`}
            onClick={() => switchMode('employee')}
          >
            Сотрудники
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-darkGray font-medium mb-1">
              Имя
            </label>
            <input
              id="name"
              {...register('name')}
              className={`w-full p-2 rounded border border-grayAccent text-darkGray focus:outline-none focus:ring-2 ${
                mode === 'client' ? 'focus:ring-primaryBlue' : 'focus:ring-accentSky'
              } transition-all duration-200`}
              placeholder="Введите имя"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-darkGray font-medium mb-1">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full p-2 rounded border border-grayAccent text-darkGray focus:outline-none focus:ring-2 ${
                mode === 'client' ? 'focus:ring-primaryBlue' : 'focus:ring-accentSky'
              } transition-all duration-200`}
              placeholder="Введите пароль"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          {errors.root && (
            <p className="text-red-500 text-sm mb-4">{errors.root.message}</p>
          )}
          <button
            type="submit"
            className={`w-full p-2 rounded text-textBlue border transition-all duration-200 transform hover:scale-105 ${
              mode === 'client'
                ? 'bg-primaryBlue border-primaryBlue hover:bg-hoverBlue'
                : 'bg-accentSkyTransparent border-accentSkyTransparent hover:bg-accentSky'
            }`}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;