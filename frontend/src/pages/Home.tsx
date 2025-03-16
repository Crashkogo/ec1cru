import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface News {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
}

const Home: React.FC = () => {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/news`, {
        params: { take: 3 },
      })
      .then((response) => {
        console.log('Response data:', response.data); // Для отладки
        if (Array.isArray(response.data)) {
          setLatestNews(response.data);
        } else {
          setError('Данные с сервера не являются массивом');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching latest news:', error);
        setError('Ошибка загрузки новостей');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container h-full px-4 py-8">
      <div className="w-full md:w-2/3 mx-auto min-h-screen bg-lightGray rounded-lg shadow-md p-6">
        {/* Блок новостей */}
        <div className="w-1/2 mx-auto">
          <div className="border-2 border-darkBg rounded-lg p-4">
            <h2 className="text-xl font-semibold text-darkBg mb-4">Последние новости</h2>
            {loading ? (
              <p className="text-darkBg text-center">Загрузка...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : latestNews.length === 0 ? (
              <p className="text-darkBg text-center">Новостей пока нет</p>
            ) : (
              <ul className="space-y-3">
                {latestNews.map((news, index) => (
                  <li
                    key={news.id}
                    className="animate-slideDown opacity-0"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <Link
                      to={`/news/${news.slug}`}
                      className="text-blue-500 hover:underline text-base font-medium"
                    >
                      {news.title}
                    </Link>
                    <span className="block text-gray-500 text-sm">
                      {new Date(news.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;