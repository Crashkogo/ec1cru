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

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/posts/news', {
        params: { take: 3 },
      })
      .then((response) => {
        setLatestNews(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching latest news:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container px-4 py-8">
      <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
        {/* Блок новостей */}
        <div className="w-1/2 mx-auto">
          <div className="border-2 border-darkBg rounded-lg p-4">
            <h2 className="text-xl font-semibold text-darkBg mb-4">Последние новости</h2>
            {loading ? (
              <p className="text-darkBg text-center">Загрузка...</p>
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