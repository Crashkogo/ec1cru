import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  ShareIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

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

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/promotions/${slug}`)
      .then((response) => {
        setPromotion(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching promotion:', error);
        setLoading(false);
      });
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share && promotion) {
      try {
        await navigator.share({
          title: promotion.title,
          text: promotion.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Загрузка... - ООО «Инженер-центр»</title>
        </Helmet>
        <div className="min-h-screen bg-modern-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-4/5 mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-modern-gray-300 rounded-lg mb-6"></div>
                <div className="h-4 bg-modern-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-modern-gray-300 rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-modern-gray-300 rounded"></div>
                  <div className="h-4 bg-modern-gray-300 rounded"></div>
                  <div className="h-4 bg-modern-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!promotion) {
    return (
      <>
        <Helmet>
          <title>Акция не найдена - ООО «Инженер-центр»</title>
        </Helmet>
        <div className="min-h-screen bg-modern-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-4/5 mx-auto text-center">
              <div className="bg-modern-white rounded-xl shadow-modern p-12">
                <h1 className="text-2xl font-bold text-modern-gray-900 mb-4">
                  Акция не найдена
                </h1>
                <p className="text-modern-gray-600 mb-6">
                  Запрашиваемая акция не существует или была удалена
                </p>
                <Link
                  to="/promotions"
                  className="inline-flex items-center px-6 py-3 bg-modern-accent-600 text-white rounded-xl hover:bg-modern-accent-700 transition-colors duration-200 font-semibold"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Вернуться к акциям
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{promotion.metaTitle || promotion.title} - ООО «Инженер-центр»</title>
        <meta name="description" content={promotion.metaDescription || promotion.shortDescription} />
      </Helmet>

      <div className="min-h-screen bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-4/5 mx-auto">

            {/* Навигация назад */}
            <div className="mb-8">
              <Link
                to="/promotions"
                className="inline-flex items-center text-modern-accent-600 hover:text-modern-accent-700 transition-colors duration-200 font-medium"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Все акции
              </Link>
            </div>

            {/* Основной контент */}
            <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">

              {/* Заголовок */}
              <div className="p-8 lg:p-12 border-b border-modern-gray-200">
                <h1 className="text-3xl lg:text-4xl font-bold text-modern-gray-900 mb-6 leading-tight">
                  {promotion.title}
                </h1>

                {/* Статус и мета-информация */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                  <div className="flex flex-wrap items-center gap-6">
                    {promotion.status ? (
                      <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <span className="font-medium">Активна</span>
                      </div>
                    ) : (
                      <div className="flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-600 rounded-full">
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        <span className="font-medium">Завершена</span>
                      </div>
                    )}

                    {promotion.status && (
                      <div className="bg-gradient-to-r from-modern-accent-500 to-modern-accent-600 text-white px-6 py-2 rounded-lg font-medium text-sm">
                        🔥 Акция действует!
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-colors duration-200 text-sm font-medium"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Поделиться
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-modern-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-modern-accent-600" />
                    <div>
                      <div className="text-xs font-medium text-modern-gray-400 uppercase tracking-wider">Начало</div>
                      <div className="text-sm font-medium text-modern-gray-700">
                        {new Date(promotion.startDate).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-modern-accent-600" />
                    <div>
                      <div className="text-xs font-medium text-modern-gray-400 uppercase tracking-wider">Окончание</div>
                      <div className="text-sm font-medium text-modern-gray-700">
                        {new Date(promotion.endDate).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 mr-2 text-modern-accent-600" />
                    <div>
                      <div className="text-xs font-medium text-modern-gray-400 uppercase tracking-wider">Опубликовано</div>
                      <div className="text-sm font-medium text-modern-gray-700">
                        {new Date(promotion.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Содержимое акции */}
              <div className="p-8 lg:p-12">
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:text-modern-gray-900 prose-headings:font-semibold
                    prose-p:text-modern-gray-700 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-modern-accent-600 prose-a:hover:text-modern-accent-700 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-modern-gray-900 prose-strong:font-semibold
                    prose-ul:text-modern-gray-700 prose-ol:text-modern-gray-700
                    prose-li:mb-2 prose-li:leading-relaxed
                    prose-blockquote:border-l-4 prose-blockquote:border-modern-accent-500 prose-blockquote:bg-modern-accent-50 prose-blockquote:rounded-r-lg prose-blockquote:p-6 prose-blockquote:my-6
                    prose-code:bg-modern-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-modern-gray-800
                    prose-pre:bg-modern-gray-900 prose-pre:text-modern-gray-100 prose-pre:rounded-lg prose-pre:p-6
                    prose-img:rounded-lg prose-img:shadow-modern"
                  dangerouslySetInnerHTML={{ __html: promotion.content }}
                />
              </div>

              {/* Призыв к действию для активных акций */}
              {promotion.status && (
                <div className="bg-gradient-to-r from-modern-accent-50 to-modern-accent-100 p-8 lg:p-12 border-t border-modern-accent-200">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-modern-accent-900 mb-4">
                      Не упустите выгодную акцию!
                    </h3>
                    <p className="text-modern-accent-700 mb-6 text-lg">
                      Свяжитесь с нами, чтобы воспользоваться предложением
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <a
                        href="tel:+78443300801"
                        className="inline-flex items-center px-6 py-3 bg-modern-accent-600 text-white rounded-xl hover:bg-modern-accent-700 transition-colors duration-200 font-semibold"
                      >
                        📞 8 (8443) 300-801
                      </a>
                      <a
                        href="mailto:mail@ec-1c.ru"
                        className="inline-flex items-center px-6 py-3 bg-modern-white text-modern-accent-700 border-2 border-modern-accent-600 rounded-xl hover:bg-modern-accent-50 transition-colors duration-200 font-semibold"
                      >
                        ✉️ mail@ec-1c.ru
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* Навигация внизу */}
            <div className="mt-12 text-center">
              <Link
                to="/promotions"
                className="inline-flex items-center px-6 py-3 bg-modern-accent-600 text-white rounded-xl hover:bg-modern-accent-700 transition-colors duration-200 font-semibold"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Вернуться к акциям
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromotionsDetail;