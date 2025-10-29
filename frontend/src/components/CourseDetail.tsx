import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  ShareIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface Course {
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

const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/courses/${slug}`)
      .then((response) => {
        setCourse(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching course:', error);
        setLoading(false);
      });
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share && course) {
      try {
        await navigator.share({
          title: course.title,
          text: course.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - копируем ссылку в буфер обмена
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

  if (!course) {
    return (
      <>
        <Helmet>
          <title>Курс не найден - ООО «Инженер-центр»</title>
        </Helmet>
        <div className="min-h-screen bg-modern-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-4/5 mx-auto text-center">
              <div className="bg-modern-white rounded-xl shadow-modern p-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-modern-gray-100 rounded-full mb-4">
                  <AcademicCapIcon className="w-10 h-10 text-modern-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-modern-gray-900 mb-4">
                  Курс не найден
                </h1>
                <p className="text-modern-gray-600 mb-6">
                  Запрашиваемый курс не существует или был удален
                </p>
                <Link
                  to="/1c-courses"
                  className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Вернуться к курсам
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
        <title>{course.metaTitle || course.title} - ООО «Инженер-центр»</title>
        <meta name="description" content={course.metaDescription || course.shortDescription} />
      </Helmet>

      <div className="min-h-screen bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-4/5 mx-auto">

            {/* Навигация назад */}
            <div className="mb-8">
              <Link
                to="/1c-courses"
                className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 font-medium"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Все курсы
              </Link>
            </div>

            {/* Основной контент */}
            <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">

              {/* Заголовок */}
              <div className="p-8 lg:p-12 border-b border-modern-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-modern-primary-100 rounded-lg mb-4">
                  <AcademicCapIcon className="w-6 h-6 text-modern-primary-600" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-modern-gray-900 mb-6 leading-tight">
                  {course.title}
                </h1>

                {/* Мета-информация и действия */}
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex flex-wrap items-center gap-6 text-modern-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">
                        {new Date(course.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">
                        {new Date(course.createdAt).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
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

              {/* Содержимое курса */}
              <div className="p-8 lg:p-12">
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:text-modern-gray-900 prose-headings:font-semibold
                    prose-p:text-modern-gray-700 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-modern-primary-600 prose-a:hover:text-modern-primary-700 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-modern-gray-900 prose-strong:font-semibold
                    prose-ul:text-modern-gray-700 prose-ol:text-modern-gray-700
                    prose-li:mb-2 prose-li:leading-relaxed
                    prose-blockquote:border-l-4 prose-blockquote:border-modern-primary-500 prose-blockquote:bg-modern-primary-50 prose-blockquote:rounded-r-lg prose-blockquote:p-6 prose-blockquote:my-6
                    prose-code:bg-modern-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-modern-gray-800
                    prose-pre:bg-modern-gray-900 prose-pre:text-modern-gray-100 prose-pre:rounded-lg prose-pre:p-6
                    prose-img:rounded-lg prose-img:shadow-modern"
                  dangerouslySetInnerHTML={{ __html: course.content }}
                />
              </div>
            </article>

            {/* Навигация внизу */}
            <div className="mt-12 text-center">
              <Link
                to="/1c-courses"
                className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Вернуться к курсам
              </Link>
            </div>

            {/* Контактный блок */}
            <div className="mt-16">
              <div className="bg-modern-primary-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-modern-primary-900 mb-4 text-center">
                  Хочешь записаться на этот курс?
                </h2>
                <p className="text-modern-primary-700 mb-6 text-center">
                  Звони и оставляй заявку.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="tel:+78443300801"
                    className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                  >
                    📞 8 (8443) 300-801
                  </a>
                  <a
                    href="mailto:mail@ec-1c.ru"
                    className="inline-flex items-center px-6 py-3 bg-modern-white text-modern-primary-700 border-2 border-modern-primary-600 rounded-xl hover:bg-modern-primary-50 transition-colors duration-200 font-semibold"
                  >
                    ✉️ mail@ec-1c.ru
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
