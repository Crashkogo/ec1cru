import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
  });

  const fetchUsers = async (page: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
      setTotalUsers(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const onCreateSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(currentPage);
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
      fetchUsers(currentPage);
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
    setValue('role', user.role);
    setShowEditModal(true);
  };

  const totalPages = Math.ceil(totalUsers / limit);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="text-darkBg">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-darkBg">Пользователи</h1>
        <button
          onClick={() => {
            reset(); // Сбрасываем форму перед открытием
            setShowCreateModal(true);
          }}
          className="bg-greenAccent text-whiteText px-4 py-2 rounded hover:bg-opacity-90"
        >
          Создать пользователя
        </button>
      </div>

      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="overflow-x-auto"
      >
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
      </motion.div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <motion.button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-greenAccent text-whiteText hover:bg-opacity-90'}`}
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Назад
          </motion.button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <motion.button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-yellowAccent text-darkBg' : 'bg-grayText text-whiteText hover:bg-opacity-90'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {page}
            </motion.button>
          ))}
          <motion.button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-greenAccent text-whiteText hover:bg-opacity-90'}`}
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Вперёд
          </motion.button>
        </div>
      )}

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