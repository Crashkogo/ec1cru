// src/pages/admin/AdminHome.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

// Интерфейс для программы
interface Program {
  id: number;
  fullName: string;
  shortName: string;
  createdAt: string;
  updatedAt: string;
}

// Схема валидации для формы добавления программы
const programSchema = z.object({
  fullName: z.string().min(1, 'Полное название обязательно'),
  shortName: z.string().min(1, 'Краткое название обязательно'),
});

type ProgramFormInputs = z.infer<typeof programSchema>;

const AdminHome: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Управляем открытием всего блока настроек
  const [isFormOpen, setIsFormOpen] = useState(false); // Управляем открытием формы внутри настроек

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgramFormInputs>({
    resolver: zodResolver(programSchema),
  });

  // Загрузка списка программ
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/admin/programs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPrograms(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching programs:', error);
        setLoading(false);
      });
  }, []);

  // Отправка формы для создания программы
  const onSubmit: SubmitHandler<ProgramFormInputs> = async (data) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/admin/programs`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrograms((prev) => [response.data, ...prev]); // Добавляем новую программу в начало списка
      reset(); // Очищаем форму
      setIsFormOpen(false); // Закрываем форму после успеха
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Ошибка при добавлении программы');
    }
  };

  if (loading) {
    return <div className="text-darkBg text-center">Загрузка...</div>;
  }

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-darkBg mb-4">Главная панель</h1>

      {/* Заголовок настроек с кнопкой раскрытия */}
      <div className="mb-4">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="text-xl font-semibold text-darkBg flex items-center justify-between w-full hover:text-blue-600 transition"
        >
          Настройки готовых решений
          <motion.span
            animate={{ rotate: isSettingsOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </button>

        {/* Анимированный блок настроек */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-4"
            >
              {/* Кнопка для открытия формы */}
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="mb-4 bg-greenAccent text-whiteText px-4 py-2 rounded hover:bg-opacity-90 transition"
              >
                {isFormOpen ? 'Скрыть форму' : 'Добавить программу'}
              </button>

              {/* Анимированная форма */}
              <AnimatePresence>
                {isFormOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
                      <div>
                        <label className="block mb-1 font-medium">Полное название</label>
                        <input
                          {...register('fullName')}
                          className="w-full p-2 border rounded"
                          placeholder="Например, 1С:Бухгалтерия предприятия"
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-1 font-medium">Краткое название</label>
                        <input
                          {...register('shortName')}
                          className="w-full p-2 border rounded"
                          placeholder="Например, БП"
                        />
                        {errors.shortName && (
                          <p className="text-red-500 text-sm mt-1">{errors.shortName.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                      >
                        Добавить программу
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Список программ */}
              <div>
                <h3 className="text-lg font-medium text-darkBg mb-2">Текущие программы</h3>
                {programs.length === 0 ? (
                  <p className="text-darkBg">Программ пока нет</p>
                ) : (
                  <ul className="space-y-2">
                    <AnimatePresence>
                      {programs.map((program) => (
                        <motion.li
                          key={program.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                          className="p-2 bg-lightGray rounded flex justify-between items-center"
                        >
                          <span>
                            {program.fullName} ({program.shortName})
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(program.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Здесь можно добавить другие настройки в будущем */}
      <div className="mt-6">
        <p className="text-darkBg">Место для будущих настроек...</p>
      </div>
    </div>
  );
};

export default AdminHome;