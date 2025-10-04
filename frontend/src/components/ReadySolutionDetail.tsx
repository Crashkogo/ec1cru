// src/pages/ReadySolutionDetail.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  ArrowLeftIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon,
  DocumentTextIcon,
  PrinterIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  TagIcon,
  CurrencyRubleIcon,
  PhotoIcon,
  HeartIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

interface Program {
  id: number;
  shortName: string;
}

interface ReadySolution {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  type: 'PROCESSING' | 'PRINT_FORM' | 'REPORT';
  freshSupport: boolean;
  programs: { program: Program }[];
  images: string[];
}

interface OrderForm {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

const SERVER_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ReadySolutionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [solution, setSolution] = useState<ReadySolution | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: '',
    email: '',
    phone: '+7 ',
    consent: false
  });
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/ready-solutions/${slug}`)
      .then((response) => {
        setSolution(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching solution:', error);
        setLoading(false);
      });
  }, [slug]);

  const handleNextImage = useCallback(() => {
    if (selectedImageIndex !== null && solution?.images) {
      setSelectedImageIndex((prev) =>
        prev === solution.images.length - 1 ? 0 : prev! + 1
      );
    }
  }, [selectedImageIndex, solution?.images]);

  const handlePrevImage = useCallback(() => {
    if (selectedImageIndex !== null && solution?.images) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? solution.images.length - 1 : prev! - 1
      );
    }
  }, [selectedImageIndex, solution?.images]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedImageIndex === null) return;
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'Escape') setSelectedImageIndex(null);
  }, [selectedImageIndex, handleNextImage, handlePrevImage]);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex, handleKeyDown]);

  const closeModal = () => setSelectedImageIndex(null);

  const handleShare = async () => {
    if (navigator.share && solution) {
      try {
        await navigator.share({
          title: solution.title,
          text: solution.shortDescription,
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.startsWith('7')) {
      value = value.substring(1);
    }

    let formatted = '+7';
    if (value.length > 0) {
      formatted += ' (' + value.substring(0, 3);
      if (value.length >= 3) {
        formatted += ') ' + value.substring(3, 6);
        if (value.length >= 6) {
          formatted += '-' + value.substring(6, 8);
          if (value.length >= 8) {
            formatted += '-' + value.substring(8, 10);
          }
        }
      }
    }

    setOrderForm(prev => ({ ...prev, phone: formatted }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.consent) {
      alert('Пожалуйста, заполните все поля и дайте согласие на обработку данных');
      return;
    }

    if (!solution) return;

    setOrderLoading(true);

    try {
      // Здесь будет отправка заказа на сервер
      await new Promise(resolve => setTimeout(resolve, 2000)); // Имитация отправки
      setOrderSuccess(true);
      setOrderForm({
        name: '',
        email: '',
        phone: '+7 ',
        consent: false
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Ошибка при отправке заказа');
    } finally {
      setOrderLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PROCESSING':
        return <ComputerDesktopIcon className="h-5 w-5" />;
      case 'PRINT_FORM':
        return <PrinterIcon className="h-5 w-5" />;
      case 'REPORT':
        return <DocumentTextIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'PROCESSING':
        return 'Обработка';
      case 'PRINT_FORM':
        return 'Печатная форма';
      case 'REPORT':
        return 'Отчёт';
      default:
        return 'Неизвестно';
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

  if (!solution) {
    return (
      <>
        <Helmet>
          <title>Решение не найдено - ООО «Инженер-центр»</title>
        </Helmet>
        <div className="min-h-screen bg-modern-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-4/5 mx-auto text-center">
              <div className="bg-modern-white rounded-xl shadow-modern p-12">
                <h1 className="text-2xl font-bold text-modern-gray-900 mb-4">
                  Решение не найдено
                </h1>
                <p className="text-modern-gray-600 mb-6">
                  Запрашиваемое решение не существует или было удалено
                </p>
                <Link
                  to="/ready-solutions"
                  className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Вернуться к решениям
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
        <title>{solution.title} - Готовые решения 1С - ООО «Инженер-центр»</title>
        <meta name="description" content={solution.shortDescription} />
      </Helmet>

      <div className="min-h-screen bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-4/5 mx-auto">

            {/* Навигация назад */}
            <div className="mb-8">
              <Link
                to="/ready-solutions"
                className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 font-medium"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Все готовые решения
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Основной контент */}
              <div className="lg:col-span-2">
                <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">

                  {/* Заголовок */}
                  <div className="p-8 lg:p-12 border-b border-modern-gray-200">
                    <div className="flex items-start justify-between mb-6">
                      <h1 className="text-3xl lg:text-4xl font-bold text-modern-gray-900 leading-tight flex-1">
                        {solution.title}
                      </h1>
                      <button
                        onClick={handleShare}
                        className="ml-6 p-3 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-colors duration-200"
                      >
                        <ShareIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Теги и характеристики */}
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center px-4 py-2 bg-modern-primary-100 text-modern-primary-700 rounded-full">
                        {getTypeIcon(solution.type)}
                        <span className="ml-2 font-medium">{getTypeName(solution.type)}</span>
                      </div>

                      {solution.freshSupport && (
                        <div className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full">
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          <span className="font-medium">1C:Fresh</span>
                        </div>
                      )}

                      {solution.programs && solution.programs.length > 0 && (
                        <>
                          {solution.programs.slice(0, 3).map((programWrapper, index) => (
                            <div
                              key={index}
                              className="flex items-center px-4 py-2 bg-modern-accent-100 text-modern-accent-700 rounded-full"
                            >
                              <TagIcon className="h-4 w-4 mr-2" />
                              <span className="font-medium text-sm">{programWrapper.program.shortName}</span>
                            </div>
                          ))}
                          {solution.programs.length > 3 && (
                            <div className="flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-600 rounded-full">
                              <span className="font-medium text-sm">+{solution.programs.length - 3}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Галерея */}
                  {solution.images && solution.images.length > 0 && (
                    <div className="p-8 lg:p-12 border-b border-modern-gray-200">
                      <h2 className="text-xl font-bold text-modern-gray-900 mb-6">Скриншоты</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {solution.images.map((img, idx) => (
                          <button
                            key={idx}
                            className="group relative overflow-hidden rounded-lg border border-modern-gray-200 hover:border-modern-primary-300 transition-all duration-200 hover:shadow-modern-md"
                            onClick={() => setSelectedImageIndex(idx)}
                          >
                            <img
                              src={`${SERVER_BASE_URL}${img}`}
                              alt={`${solution.title} - ${idx + 1}`}
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200"></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Полное описание */}
                  <div className="p-8 lg:p-12">
                    <h2 className="text-xl font-bold text-modern-gray-900 mb-6">Описание</h2>
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
                      dangerouslySetInnerHTML={{ __html: solution.fullDescription }}
                    />
                  </div>
                </article>
              </div>

              {/* Боковая панель с информацией о покупке */}
              <div className="lg:col-span-1">
                <div className="sticky top-28">
                  <div className="bg-modern-white rounded-xl shadow-modern p-8">

                    {/* Цена */}
                    <div className="text-center mb-8">
                      <div className="text-4xl font-bold text-modern-primary-600 mb-2">
                        {solution.price.toLocaleString('ru-RU')} ₽
                      </div>
                      <p className="text-modern-gray-600">за готовое решение</p>
                    </div>

                    {/* Характеристики */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between py-3 border-b border-modern-gray-100">
                        <span className="text-modern-gray-600">Тип:</span>
                        <div className="flex items-center text-modern-gray-900 font-medium">
                          {getTypeIcon(solution.type)}
                          <span className="ml-2">{getTypeName(solution.type)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-modern-gray-100">
                        <span className="text-modern-gray-600">1C:Fresh:</span>
                        <span className={`font-medium ${solution.freshSupport ? 'text-green-600' : 'text-modern-gray-500'}`}>
                          {solution.freshSupport ? 'Поддерживается' : 'Не поддерживается'}
                        </span>
                      </div>

                      {solution.programs && solution.programs.length > 0 && (
                        <div className="py-3">
                          <span className="text-modern-gray-600 block mb-3">Программы:</span>
                          <div className="flex flex-wrap gap-2">
                            {solution.programs.map((programWrapper, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-modern-primary-100 text-modern-primary-700 rounded-full text-sm font-medium"
                              >
                                {programWrapper.program.shortName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Форма заказа */}
                    {!orderSuccess ? (
                      <form onSubmit={handleFormSubmit} className="space-y-4 mb-8">
                        <div>
                          <input
                            type="text"
                            value={orderForm.name}
                            onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ваше имя"
                            className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                            required
                          />
                        </div>

                        <div>
                          <input
                            type="email"
                            value={orderForm.email}
                            onChange={(e) => setOrderForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Ваша@почта.ru"
                            className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                            required
                          />
                        </div>

                        <div>
                          <input
                            type="tel"
                            value={orderForm.phone}
                            onChange={handlePhoneChange}
                            placeholder="+7 (___) ___-__-__"
                            className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                            required
                          />
                        </div>

                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="consent"
                            checked={orderForm.consent}
                            onChange={(e) => setOrderForm(prev => ({ ...prev, consent: e.target.checked }))}
                            className="mt-1 h-4 w-4 text-modern-primary-600 border-modern-gray-300 rounded focus:ring-modern-primary-500 focus:ring-2"
                            required
                          />
                          <label htmlFor="consent" className="text-sm text-modern-gray-600 leading-relaxed">
                            Я даю{' '}
                            <Link
                              to="/personal-data-consent"
                              className="text-modern-primary-600 hover:text-modern-primary-700 underline transition-colors duration-200"
                            >
                              Согласие
                            </Link>
                            {' '}на обработку персональных данных в соответствии с{' '}
                            <Link
                              to="/privacy-policy"
                              className="text-modern-primary-600 hover:text-modern-primary-700 underline transition-colors duration-200"
                            >
                              Политикой Конфиденциальности
                            </Link>
                            .
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={orderLoading}
                          className="w-full flex items-center justify-center px-6 py-4 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {orderLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Отправляем...
                            </>
                          ) : (
                            'Заказать'
                          )}
                        </button>
                      </form>
                    ) : (
                      <div className="mb-8 p-4 bg-green-50 rounded-lg text-center">
                        <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-green-800 font-medium">Заказ отправлен!</p>
                        <p className="text-green-600 text-sm">Мы свяжемся с вами в ближайшее время</p>
                      </div>
                    )}

                    {/* Дополнительная информация */}
                    <div className="p-4 bg-modern-gray-50 rounded-lg">
                      <h3 className="font-semibold text-modern-gray-900 mb-2">Что включено:</h3>
                      <ul className="text-sm text-modern-gray-600 space-y-1">
                        <li>✓ Готовое к использованию решение</li>
                        <li>✓ Помощь в установке</li>
                        <li>✓ Демонстрация работы</li>
                        <li>✓ Ответим на ваши вопросы по доработке</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для увеличенного изображения */}
      {selectedImageIndex !== null && solution?.images && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors duration-200 z-10"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors duration-200 z-10"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <img
            src={`${SERVER_BASE_URL}${solution.images[selectedImageIndex]}`}
            alt="Увеличенное изображение"
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors duration-200 z-10"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          {/* Индикатор позиции */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black bg-opacity-50 text-white rounded-full text-sm">
            {selectedImageIndex + 1} / {solution.images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ReadySolutionDetail;