import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: number;
  title: string;
  shortDescription: string;
  startDate: string;
  createdAt: string;
  isPublished: boolean;
  status: boolean;
  ours: boolean;
  slug: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/admin/events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEvents(response.data);
        setFilteredEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = events.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.shortDescription.toLowerCase().includes(query) ||
        item.slug.toLowerCase().includes(query) ||
        new Date(item.startDate).toLocaleDateString('ru-RU').includes(query) ||
        new Date(item.createdAt).toLocaleDateString('ru-RU').includes(query) ||
        (item.isPublished ? 'да' : 'нет').includes(query) ||
        (item.status ? 'прошло' : 'предстоящее').includes(query) ||
        (item.ours ? 'наше' : 'стороннее').includes(query)
      );
    });
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="text-darkBg text-center">Загрузка...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-darkBg">Мероприятия</h1>
        <Link
          to="/admin/events/create"
          className="bg-greenAccent text-whiteText px-4 py-2 rounded hover:bg-opacity-90 transition"
        >
          Создать мероприятие
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Поиск по всем полям..."
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-greenAccent"
        />
      </div>

      {filteredEvents.length === 0 && searchQuery ? (
        <p className="text-darkBg text-center">Ничего не найдено</p>
      ) : filteredEvents.length === 0 ? (
        <p className="text-darkBg text-center">Мероприятий пока нет</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-darkBg">
            <thead>
              <tr className="bg-grayText text-whiteText">
                <th className="p-3 text-left">Заголовок</th>
                <th className="p-3 text-left">Краткое описание</th>
                <th className="p-3 text-left">Дата начала</th>
                <th className="p-3 text-left">Статус</th>
                <th className="p-3 text-left">Наше</th>
                <th className="p-3 text-left">Опубликовано</th>
                <th className="p-3 text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredEvents.map((item) => (
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
                    <td className="p-3">{new Date(item.startDate).toLocaleDateString('ru-RU')}</td>
                    <td className="p-3">{item.status ? 'Прошло' : 'Предстоящее'}</td>
                    <td className="p-3">{item.ours ? 'Наше' : 'Стороннее'}</td>
                    <td className="p-3">{item.isPublished ? 'Да' : 'Нет'}</td>
                    <td className="p-3 flex space-x-2">
                      <Link
                        to={`/admin/events/edit/${item.slug}`}
                        className="text-yellowAccent hover:text-opacity-80"
                      >
                        <FaEdit />
                      </Link>
                      {item.ours && (
                        <Link
                          to={`/admin/events/${item.slug}/registrations`}
                          className="text-blue-500 hover:text-opacity-80"
                        >
                          <FaUsers />
                        </Link>
                      )}
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

export default Events;