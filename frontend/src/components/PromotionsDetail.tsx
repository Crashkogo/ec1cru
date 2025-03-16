import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Promotion {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  status: boolean;
}

const PromotionsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    console.log('Fetching promotion with slug:', slug); // Лог для отладки
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/promotions/${slug}`)
      .then((response) => {
        console.log('Promotion fetched:', response.data);
        setPromotion(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching promotion:', error.response?.status, error.response?.data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
          <p className="text-darkBg text-center">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
          <p className="text-darkBg text-center">Акция не найдена</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-full md:w-2/3 min-h-screen mx-auto bg-lightGray rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-darkBg mb-4">{promotion.title}</h1>
        <p className="text-gray-500 mb-2">
          Опубликовано: {new Date(promotion.createdAt).toLocaleDateString('ru-RU')}
        </p>
        <p className="text-gray-500 mb-2">
          Дата начала: {new Date(promotion.startDate).toLocaleDateString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-gray-500 mb-2">
          Дата окончания: {new Date(promotion.endDate).toLocaleDateString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-gray-500 mb-4">
          Статус: <span className={promotion.status ? 'text-green-600' : 'text-red-600'}>
            {promotion.status ? 'Активна' : 'Неактивна'}
          </span>
        </p>
        <div
          className="promotion-content prose max-w-none text-gray-800 break-words"
          dangerouslySetInnerHTML={{ __html: promotion.content }}
        />
      </div>
    </div>
  );
};

export default PromotionsDetail;