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
    if (!token) return;

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
    return <div className="text-darkBg">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-darkBg">Новости</h1>
        <Link
          to="/admin/news/create"
          className="bg-greenAccent text-whiteText px-4 py-2 rounded hover:bg-opacity-90"
        >
          Создать новость
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-darkBg">
          <thead>
            <tr className="bg-grayText text-whiteText">
              <th className="p-2 text-left">Заголовок</th>
              <th className="p-2 text-left">Краткое описание</th>
              <th className="p-2 text-left">Дата создания</th>
              <th className="p-2 text-left">Опубликовано</th>
              <th className="p-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="border-b border-grayText">
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.shortDescription}</td>
                <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="p-2">{item.isPublished ? 'Да' : 'Нет'}</td>
                <td className="p-2">
                  <button className="text-yellowAccent hover:text-opacity-80">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default News;