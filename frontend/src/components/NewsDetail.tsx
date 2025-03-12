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
      .get(`http://localhost:5000/api/posts/news/${slug}`)
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
      <div className="container px-4 py-8">
        <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
          <p className="text-darkBg text-center">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container px-4 py-8">
        <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
          <p className="text-darkBg text-center">Новость не найдена</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-darkBg mb-4">{news.title}</h1>
        <p className="text-gray-500 mb-4">
          Опубликовано: {new Date(news.createdAt).toLocaleDateString('ru-RU')}
        </p>
        <p className="text-lg text-darkBg mb-6">{news.shortDescription}</p>
        <div
          className="prose max-w-none text-darkBg"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </div>
    </div>
  );
};

export default NewsDetail;