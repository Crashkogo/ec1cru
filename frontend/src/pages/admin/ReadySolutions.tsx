// src/pages/admin/ReadySolutions.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadySolution {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  createdAt: string;
  isPublished: boolean;
}

const ReadySolutions: React.FC = () => {
  const [solutions, setSolutions] = useState<ReadySolution[]>([]);
  const [filteredSolutions, setFilteredSolutions] = useState<ReadySolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/admin/ready-solutions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSolutions(response.data);
        setFilteredSolutions(response.data); // Изначально показываем все решения
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching ready solutions:', error);
        setLoading(false);
      });
  }, []);

  // Фильтрация решений по поисковому запросу
  useEffect(() => {
    const filtered = solutions.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.shortDescription.toLowerCase().includes(query) ||
        item.slug.toLowerCase().includes(query) ||
        new Date(item.createdAt).toLocaleDateString('ru-RU').includes(query) ||
        (item.isPublished ? 'да' : 'нет').includes(query)
      );
    });
    setFilteredSolutions(filtered);
  }, [searchQuery, solutions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="text-darkBg text-center">Загрузка...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-darkBg">Готовые решения</h1>
        <Link
          to="/admin/ready-solutions/create"
          className="bg-greenAccent text-whiteText px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          Создать решение
        </Link>
      </div>

      {/* Поле поиска */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Поиск по всем полям..."
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-greenAccent"
        />
      </div>

      {filteredSolutions.length === 0 && searchQuery ? (
        <p className="text-darkBg text-center">Ничего не найдено</p>
      ) : filteredSolutions.length === 0 ? (
        <p className="text-darkBg text-center">Решений пока нет</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-darkBg">
            <thead>
              <tr className="bg-grayText text-whiteText">
                <th className="p-3 text-left">Название</th>
                <th className="p-3 text-left">Краткое описание</th>
                <th className="p-3 text-left">Дата создания</th>
                <th className="p-3 text-left">Опубликовано</th>
                <th className="p-3 text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredSolutions.map((solution) => (
                  <motion.tr
                    key={solution.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="p-3">{solution.title}</td>
                    <td className="p-3">{solution.shortDescription}</td>
                    <td className="p-3">{new Date(solution.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td className="p-3">{solution.isPublished ? 'Да' : 'Нет'}</td>
                    <td className="p-3">
                      <Link
                        to={`/admin/ready-solutions/edit/${solution.slug}`}
                        className="text-yellowAccent hover:text-opacity-80"
                      >
                        <FaEdit />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReadySolutions;