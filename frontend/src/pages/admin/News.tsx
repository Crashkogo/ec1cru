import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface News {
  id: number;
  title: string;
  shortDescription: string;
  createdAt: string;
  isPublished: boolean;
  slug: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/admin/news`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setNews(response.data);
        setFilteredNews(response.data); // Изначально показываем все новости
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  }, []);

  // Фильтрация новостей по поисковому запросу
  useEffect(() => {
    const filtered = news.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.shortDescription.toLowerCase().includes(query) ||
        item.slug.toLowerCase().includes(query) ||
        new Date(item.createdAt).toLocaleDateString('ru-RU').includes(query) ||
        (item.isPublished ? 'да' : 'нет').includes(query)
      );
    });
    setFilteredNews(filtered);
  }, [searchQuery, news]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="text-darkBg text-center">Загрузка...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-darkBg">Новости</h1>
        <Link
          to="/admin/news/create"
          className="bg-greenAccent text-whiteText px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          Создать новость
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

      {filteredNews.length === 0 && searchQuery ? (
        <p className="text-darkBg text-center">Ничего не найдено</p>
      ) : filteredNews.length === 0 ? (
        <p className="text-darkBg text-center">Новостей пока нет</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-darkBg">
            <thead>
              <tr className="bg-grayText text-whiteText">
                <th className="p-3 text-left">Заголовок</th>
                <th className="p-3 text-left">Краткое описание</th>
                <th className="p-3 text-left">Дата создания</th>
                <th className="p-3 text-left">Опубликовано</th>
                <th className="p-3 text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredNews.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.shortDescription}</td>
                    <td className="p-3">{new Date(item.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td className="p-3">{item.isPublished ? 'Да' : 'Нет'}</td>
                    <td className="p-3">
                      <Link to={`/admin/news/edit/${item.slug}`} className="text-yellowAccent hover:text-opacity-80">
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

export default News;