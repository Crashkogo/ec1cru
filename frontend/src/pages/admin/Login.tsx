import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios'; // Добавили AxiosError
import { useNavigate } from 'react-router-dom';

// Схема валидации
const loginSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', data);
      const { token } = response.data;

      localStorage.setItem('token', token);

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role;

      if (['ADMIN', 'MODERATOR'].includes(role)) {
        navigate('/admin/dashboard');
        onClose();
      } else {
        setError('root', { message: 'Access denied. Admins or Moderators only.' });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>; // Типизация ошибки
      setError('root', {
        message: axiosError.response?.data?.message || 'Login failed',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-lightGray rounded-lg p-6 w-full max-w-md shadow-md">
        <h2 className="text-2xl font-bold text-darkBg mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-darkBg mb-1">Login (Name)</label>
            <input
              {...register('name')}
              className="w-full p-2 rounded border border-grayText text-darkBg"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-redAccent text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-darkBg mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full p-2 rounded border border-grayText text-darkBg"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-redAccent text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-redAccent text-sm mb-4">{errors.root.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-greenAccent text-whiteText p-2 rounded hover:bg-opacity-90"
          >
            Войти
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-grayText hover:text-darkBg">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default Login;