import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ShareIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { sanitizeHTML } from '../utils/sanitize';
import CallbackModal from './CallbackModal';

interface Testimonial {
  id: number;
  companyName: string;
  content: string;
  createdAt: string;
  slug: string;
  isPublished: boolean;
  avatar?: string;
}

const TestimonialDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/testimonials/${slug}`)
      .then((response) => {
        setTestimonial(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching testimonial:', error);
        setLoading(false);
      });
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share && testimonial) {
      try {
        await navigator.share({
          title: `Отзыв от ${testimonial.companyName}`,
          text: `Отзыв от ${testimonial.companyName}`,
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

  if (!testimonial) {
    return (
      <>
        <Helmet>
          <title>Отзыв не найден - ООО «Инженер-центр»</title>
        </Helmet>
        <div className="min-h-screen bg-modern-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-4/5 mx-auto text-center">
              <div className="bg-modern-white rounded-xl shadow-modern p-12">
                <h1 className="text-2xl font-bold text-modern-gray-900 mb-4">
                  Отзыв не найден
                </h1>
                <p className="text-modern-gray-600 mb-6">
                  Запрашиваемый отзыв не существует или был удалён
                </p>
                <Link
                  to="/otzyvy"
                  className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Вернуться к отзывам
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
        <title>{`Отзыв от ${testimonial.companyName}`} - ООО «Инженер-центр»</title>
        <meta name="description" content={`Отзыв клиента ${testimonial.companyName} о работе с компанией Инженер-центр`} />
      </Helmet>

      <div className="min-h-screen bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-4/5 mx-auto">

            {/* Навигация назад */}
            <div className="mb-8">
              <Link
                to="/otzyvy"
                className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 font-medium"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Все отзывы
              </Link>
            </div>

            {/* Основной контент */}
            <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">

              {/* Заголовок с компанией */}
              <div className="p-8 lg:p-12 border-b border-modern-gray-200">

                {/* Аватар или иконка компании */}
                <div className="flex items-center mb-6">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={`Логотип ${testimonial.companyName}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-modern-gray-200 mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-modern-primary-100 to-modern-primary-200 flex items-center justify-center border-2 border-modern-primary-300 mr-4">
                      <BuildingOfficeIcon className="w-8 h-8 text-modern-primary-700" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-modern-gray-900 leading-tight">
                      {testimonial.companyName}
                    </h1>
                    <p className="text-modern-gray-500 mt-1">Отзыв клиента</p>
                  </div>
                </div>

                {/* Мета-информация и действия */}
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex flex-wrap items-center gap-6 text-modern-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">
                        {new Date(testimonial.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-colors duration-200 text-sm font-medium"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Поделиться
                  </button>
                </div>
              </div>

              {/* Иконка кавычек */}
              <div className="px-8 lg:px-12 pt-8">
                <svg
                  className="w-16 h-16 text-modern-primary-600 opacity-20"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>

              {/* Текст отзыва */}
              <div className="px-8 lg:px-12 pb-12">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-modern-gray-900 prose-p:text-modern-gray-700 prose-a:text-modern-primary-600 prose-strong:text-modern-gray-900 prose-ul:text-modern-gray-700 prose-ol:text-modern-gray-700"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(testimonial.content) }}
                />
              </div>
            </article>

            {/* CTA блок */}
            <div className="mt-12 bg-white rounded-xl shadow-modern p-8 border border-modern-gray-200 text-center">
              <h2 className="text-2xl font-bold text-modern-gray-900 mb-4">
                Станьте нашим клиентом
              </h2>
              <p className="text-modern-gray-600 mb-6">
                Присоединяйтесь к компаниям, которые доверяют нам автоматизацию своего бизнеса
              </p>
              <button
                onClick={() => setIsCallbackModalOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Заказать звонок
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для заказа звонка */}
      <CallbackModal
        isOpen={isCallbackModalOpen}
        onClose={() => setIsCallbackModalOpen(false)}
      />
    </>
  );
};

export default TestimonialDetail;
