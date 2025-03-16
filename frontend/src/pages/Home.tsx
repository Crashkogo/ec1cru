import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Интерфейс для новостей
interface News {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
}

// Интерфейс для акций
interface Promotion {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  status: boolean; // Добавим статус для акций
}

const Home: React.FC = () => {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [latestPromotions, setLatestPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Функция для загрузки данных
    const fetchData = async () => {
      try {
        // Загрузка новостей
        const newsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/news`, {
          params: { take: 3 },
        });
        console.log('News response data:', newsResponse.data);
        if (Array.isArray(newsResponse.data)) {
          setLatestNews(newsResponse.data);
        } else {
          setError('Данные новостей с сервера не являются массивом');
        }

        // Загрузка акций
        const promotionsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/promotions`, {
          params: { take: 3 },
        });
        console.log('Promotions response data:', promotionsResponse.data);
        if (Array.isArray(promotionsResponse.data)) {
          setLatestPromotions(promotionsResponse.data);
        } else {
          setError('Данные акций с сервера не являются массивом');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Ошибка загрузки данных');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container h-full px-4 py-8">
      <div className="w-full md:w-2/3 mx-auto min-h-screen bg-lightGray rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Блок новостей */}
          <div className="w-full md:w-1/2">
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

          {/* Блок акций */}
          <div className="w-full md:w-1/2">
            <div className="border-2 border-darkBg rounded-lg p-4">
              <h2 className="text-xl font-semibold text-darkBg mb-4">Последние акции</h2>
              {loading ? (
                <p className="text-darkBg text-center">Загрузка...</p>
              ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : latestPromotions.length === 0 ? (
                <p className="text-darkBg text-center">Акций пока нет</p>
              ) : (
                <ul className="space-y-3">
                  {latestPromotions.map((promotion, index) => (
                    <li
                      key={promotion.id}
                      className="animate-slideDown opacity-0"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <Link
                        to={`/promotions/${promotion.slug}`}
                        className="text-blue-500 hover:underline text-base font-medium"
                      >
                        {promotion.title}
                      </Link>
                      <span className="block text-gray-500 text-sm">
                        {new Date(promotion.createdAt).toLocaleDateString('ru-RU')}
                        {promotion.status ? (
                          <span className="text-green-600 ml-2"> (Активна)</span>
                        ) : (
                          <span className="text-red-600 ml-2"> (Неактивна)</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;