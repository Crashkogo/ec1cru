import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface News {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  createdAt: string;
  isPublished: boolean;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/news/${slug}`)
      .then((response) => {
        setNews(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
          <p className="text-darkBg text-cente">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
          <p className="text-darkBg text-cente">Новость не найдена</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-full md:w-2/3 min-h-screen mx-auto bg-lightGray rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-darkBg mb-4">{news.title}</h1>
        <p className="text-gray-500 mb-4">
          Опубликовано: {new Date(news.createdAt).toLocaleDateString('ru-RU')}
        </p>
        <div
          className="news-content prose max-w-none text-gray-800 break-words"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </div>
    </div>
  );
};

export default NewsDetail;