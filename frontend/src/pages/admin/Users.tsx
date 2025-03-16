import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface User {
  id: number;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'EVENTORG' | 'CLINE' | 'ITS' | 'DEVDEP';
}

const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['ADMIN', 'MODERATOR', 'EVENTORG', 'CLINE', 'ITS', 'DEVDEP']),
});

type UserFormInputs = z.infer<typeof userSchema>;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  const onCreateSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers([...users, { id: Date.now(), ...data }]);
      setShowCreateModal(false);
      reset();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const onEditSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    if (!selectedUser) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${selectedUser.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...data } : u)));
      setShowEditModal(false);
      reset();
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setValue('name', user.name);
    setValue('password', '');
    setValue('role', user.role); // Убрали as any, тип теперь корректен
    setShowEditModal(true);
  };

  if (loading) {
    return <div className="text-darkBg">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-darkBg">Пользователи</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-greenAccent text-whiteText px-4 py-2 rounded hover:bg-opacity-90"
        >
          Создать пользователя
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-darkBg">
          <thead>
            <tr className="bg-grayText text-whiteText">
              <th className="p-2 text-left">Пользователь</th>
              <th className="p-2 text-left">Роль</th>
              <th className="p-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-grayText">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-yellowAccent hover:text-opacity-80"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно для создания */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-lightGray rounded-lg p-6 w-full max-w-md shadow-md">
            <h2 className="text-2xl font-bold text-darkBg mb-4">Создать пользователя</h2>
            <form onSubmit={handleSubmit(onCreateSubmit)}>
              <div className="mb-4">
                <label className="block text-darkBg mb-1">Имя</label>
                <input
                  {...register('name')}
                  className="w-full p-2 rounded border border-grayText text-darkBg"
                  placeholder="Введите имя"
                />
                {errors.name && <p className="text-redAccent text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-darkBg mb-1">Пароль</label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full p-2 rounded border border-grayText text-darkBg"
                  placeholder="Введите пароль"
                />
                {errors.password && (
                  <p className="text-redAccent text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-darkBg mb-1">Роль</label>
                <select
                  {...register('role')}
                  className="w-full p-2 rounded border border-grayText text-darkBg"
                >
                  <option value="ADMIN">Администратор</option>
                  <option value="MODERATOR">Модератор</option>
                  <option value="EVENTORG">Организатор</option>
                  <option value="CLINE">Линия консультации</option>
                  <option value="ITS">ИТС</option>
                  <option value="DEVDEP">Отдел внедрения</option>
                </select>
                {errors.role && <p className="text-redAccent text-sm mt-1">{errors.role.message}</p>}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-grayText hover:text-darkBg"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-greenAccent text-whiteText px-4 py-2 rounded hover:bg-opacity-90"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно для редактирования */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-lightGray rounded-lg p-6 w-full max-w-md shadow-md">
            <h2 className="text-2xl font-bold text-darkBg mb-4">Редактировать пользователя</h2>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="mb-4">
                <label className="block text-darkBg mb-1">Имя</label>
                <input
                  {...register('name')}
                  className="w-full p-2 rounded border border-grayText text-darkBg"
                  placeholder="Введите имя"
                />
                {errors.name && <p className="text-redAccent text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-darkBg mb-1">Пароль</label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full p-2 rounded border border-grayText text-darkBg"
                  placeholder="Введите новый пароль"
                />
                {errors.password && (
                  <p className="text-redAccent text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-darkBg mb-1">Роль</label>
                <select
                  {...register('role')}
                  className="w-full p-2 rounded border border-grayText text-darkBg"
                >
                  <option value="ADMIN">Администратор</option>
                  <option value="MODERATOR">Модератор</option>
                  <option value="EVENTORG">Организатор</option>
                  <option value="CLINE">Линия консультации</option>
                  <option value="ITS">ИТС</option>
                  <option value="DEVDEP">Отдел внедрения</option>
                </select>
                {errors.role && <p className="text-redAccent text-sm mt-1">{errors.role.message}</p>}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="text-grayText hover:text-darkBg"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-greenAccent text-whiteText px-4 py-2 rounded hover:bg-opacity-90"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;