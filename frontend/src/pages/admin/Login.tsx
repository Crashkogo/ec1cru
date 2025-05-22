// frontend/src/components/Login.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Схема валидации
const loginSchema = z.object({
  name: z.string().min(3, 'Имя должно содержать минимум 3 символа'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'client' | 'employee'>('client');
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
      const endpoint =
        mode === 'employee' ? '/api/users/login' : '/api/clients/login';
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        { ...data, role: mode }
      );
      const { token } = response.data;

      localStorage.setItem('token', token);

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role;

      if (mode === 'employee' && ['ADMIN', 'MODERATOR'].includes(role)) {
        navigate('/admin/dashboard');
        onClose();
      } else if (mode === 'client') {
        navigate('/client/dashboard');
        onClose();
      } else {
        setError('root', { message: 'Доступ запрещён. Проверьте роль.' });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setError('root', {
        message: axiosError.response?.data?.message || 'Ошибка входа',
      });
    }
  };

  const switchMode = (newMode: 'client' | 'employee') => {
    setMode(newMode);
    reset(); // Сбрасываем форму при переключении
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        onClose ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all duration-300"
        style={{ transform: onClose ? 'scale(1)' : 'scale(0.95)' }}
      >
        {/* Кнопка закрытия */}
        <button
          className="absolute top-4 right-4 text-darkGray hover:text-darkPurple"
          onClick={onClose}
          aria-label="Закрыть окно входа"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Заголовок */}
        <h2 className="text-2xl font-semibold text-darkPurple mb-6 text-center">
          Вход
        </h2>

        {/* Переключатель режимов */}
        <div className="flex justify-center mb-6 space-x-2">
          <button
            className={`px-4 py-2 rounded-md font-medium text-base transition-all duration-200 transform ${
              mode === 'client'
                ? 'bg-darkPurple text-white scale-105 shadow-md'
                : 'bg-gray-200 text-darkGray hover:bg-gray-300'
            }`}
            onClick={() => switchMode('client')}
          >
            Клиенты
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium text-base transition-all duration-200 transform ${
              mode === 'employee'
                ? 'bg-orange text-white scale-105 shadow-md'
                : 'bg-gray-200 text-darkGray hover:bg-gray-300'
            }`}
            onClick={() => switchMode('employee')}
          >
            Сотрудники
          </button>
        </div>

        {/* Форма */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`transition-all duration-300 transform ${
            mode === 'client' ? 'translate-x-0' : '-translate-x-2'
          }`}
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-darkGray font-medium mb-1"
            >
              Имя
            </label>
            <input
              id="name"
              {...register('name')}
              className={`w-full p-2 rounded border border-grayAccent text-darkGray focus:outline-none focus:ring-2 ${
                mode === 'client' ? 'focus:ring-darkPurple' : 'focus:ring-orange'
              } transition-all duration-200`}
              placeholder="Введите имя"
            />
            {errors.name && (
              <p className="text-redAccent text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-darkGray font-medium mb-1"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full p-2 rounded border border-grayAccent text-darkGray focus:outline-none focus:ring-2 ${
                mode === 'client' ? 'focus:ring-darkPurple' : 'focus:ring-orange'
              } transition-all duration-200`}
              placeholder="Введите пароль"
            />
            {errors.password && (
              <p className="text-redAccent text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-redAccent text-sm mb-4">{errors.root.message}</p>
          )}

          <button
            type="submit"
            className={`w-full p-2 rounded text-white transition-all duration-200 transform hover:scale-105 ${
              mode === 'client'
                ? 'bg-darkPurple hover:bg-darkPurple/90'
                : 'bg-orange hover:bg-orange/90'
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