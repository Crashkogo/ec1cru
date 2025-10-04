// frontend/src/pages/admin/Login.tsx
import React, { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';

const loginSchema = z.object({
  name: z.string().min(3, 'Имя должно содержать минимум 3 символа'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await login({ username: data.name, password: data.password });
    } catch (error) {
      setError('root', { message: 'Неверное имя пользователя или пароль' });
      notify('Ошибка входа', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-modern-gray-50 to-modern-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-modern-xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-modern-primary-100 to-transparent rounded-bl-full opacity-50" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-modern-accent-100 to-transparent rounded-tr-full opacity-50" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-r from-modern-primary-600 to-modern-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BuildingOffice2Icon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-modern-gray-900 mb-2">
            Панель администратора
          </h2>
          <p className="text-modern-gray-600">
            Войдите в систему управления ООО «Инженер-центр»
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          {/* Username Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-modern-gray-700 mb-2">
              Имя пользователя
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-modern-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                autoComplete="username"
                {...register('name')}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200 ${errors.name
                  ? 'border-red-300 bg-red-50'
                  : 'border-modern-gray-300 bg-white hover:border-modern-gray-400'
                  }`}
                placeholder="Введите имя пользователя"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-modern-gray-700 mb-2">
              Пароль
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-modern-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200 ${errors.password
                  ? 'border-red-300 bg-red-50'
                  : 'border-modern-gray-300 bg-white hover:border-modern-gray-400'
                  }`}
                placeholder="Введите пароль"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-modern-gray-400 hover:text-modern-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-modern-gray-400 hover:text-modern-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Error Message */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-600">{errors.root.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-modern-primary-600 to-modern-primary-700 text-white py-3 px-4 rounded-xl font-medium hover:from-modern-primary-700 hover:to-modern-primary-800 focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Вход...
              </div>
            ) : (
              'Войти в систему'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-xs text-modern-gray-500">
            ООО «Инженер-центр» © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;