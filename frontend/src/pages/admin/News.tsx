import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:5000/api/posts/news', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setNews(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  }, []);

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
      {news.length === 0 ? (
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
              {news.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.shortDescription}</td>
                  <td className="p-3">{new Date(item.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td className="p-3">{item.isPublished ? 'Да' : 'Нет'}</td>
                  <td className="p-3">
                    <Link to={`/admin/news/edit/${item.slug}`} className="text-yellowAccent hover:text-opacity-80">
                      <FaEdit />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default News;