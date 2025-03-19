import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Registration {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

interface EventData {
  eventTitle: string;
  registrations: Registration[];
  eventId: number;
  eventLink?: string;
}

const EventRegistrations: React.FC = () => {
  console.log('EventRegistrations component rendered');

  const { slug } = useParams<{ slug: string }>();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('useEffect started');
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);

      if (!token) {
        console.error('No token found in localStorage');
        setError('Токен авторизации отсутствует');
        setLoading(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('API URL:', apiUrl);
      const fullUrl = `${apiUrl}/api/posts/admin/events/${slug}/registrations`; // Добавили /posts
      console.log('Fetching registrations from:', fullUrl);

      axios
        .get(fullUrl, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log('Server response:', response.data);
          setEventData({
            eventTitle: response.data.eventTitle || 'Без названия',
            registrations: response.data.registrations || [],
            eventId: response.data.eventId,
            eventLink: response.data.eventLink,
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching registrations:', error.response?.data || error.message);
          setError(error.response?.data?.message || 'Ошибка загрузки данных');
          setLoading(false);
        });
    } catch (err) {
      console.error('Error in useEffect:', err);
      setError('Произошла ошибка при загрузке');
      setLoading(false);
    }
  }, [slug]);

  const handleReminder = async () => {
    if (!eventData?.eventLink) {
      alert('Нельзя отправить напоминание: ссылка на мероприятие не заполнена.');
      return;
    }

    const confirmed = window.confirm(
      `Отправить напоминание всем участникам мероприятия "${eventData.eventTitle}"?`
    );
    if (!confirmed) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/admin/events/${eventData.eventId}/remind`, // Добавили /posts
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Напоминания успешно отправлены!');
    } catch (error) {
      console.error('Error sending reminders:', error);
      alert('Ошибка при отправке напоминаний');
    }
  };

  if (loading) {
    return <div className="text-darkBg text-center">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!eventData) {
    return <div className="text-darkBg text-center">Мероприятие не найдено</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-darkBg">
          Зарегистрированные участники: {eventData.eventTitle}
        </h1>
        {eventData.registrations.length > 0 && (
          <button
            onClick={handleReminder}
            className="text-purple-500 hover:text-opacity-80 flex items-center"
          >
            <FaBell size={24} className="mr-2" />
            Напомнить всем
          </button>
        )}
      </div>

      {eventData.registrations.length === 0 ? (
        <p className="text-darkBg text-center">Участников пока нет</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-darkBg">
            <thead>
              <tr className="bg-grayText text-whiteText">
                <th className="p-3 text-left">Имя</th>
                <th className="p-3 text-left">Телефон</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Дата регистрации</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {eventData.registrations.map((reg) => (
                  <motion.tr
                    key={reg.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="p-3">{reg.name}</td>
                    <td className="p-3">{reg.phone}</td>
                    <td className="p-3">{reg.email}</td>
                    <td className="p-3">{new Date(reg.createdAt).toLocaleDateString('ru-RU')}</td>
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

export default EventRegistrations;