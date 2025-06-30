import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  ArrowRightIcon,
  NewspaperIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface NewsItem {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  createdAt: string;
  isPublished: boolean;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const itemsPerPage = 20;

  // Загрузка новостей
  const fetchNews = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/news`, {
        params: {
          page: reset ? 1 : page,
          limit: itemsPerPage,
          search: searchQuery || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        },
      });

      const newItems = response.data;
      setNews((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(newItems.length === itemsPerPage);
      if (!reset) setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      if (reset) setInitialLoading(false);
    }
  };

  // Первоначальная загрузка и сброс при изменении поиска
  useEffect(() => {
    setPage(1);
    setNews([]);
    setHasMore(true);
    const timeoutId = setTimeout(() => {
      fetchNews(true);
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, dateFrom, dateTo]);

  // Бесконечная подгрузка при скролле
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        fetchNews();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  const resetFilters = () => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setMobileFiltersOpen(false);
  };

  // Компонент фильтров
  const FiltersContent = () => (
    <>
      {/* Поиск */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-modern-gray-700 mb-2">
          Поиск по названию
        </label>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введите название..."
            className="w-full pl-10 pr-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-all duration-200 text-modern-gray-900 placeholder-modern-gray-500"
          />
        </div>
      </div>

      {/* Фильтр по дате С */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-modern-gray-700 mb-2">
          Дата с
        </label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-full px-3 py-2 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 text-modern-gray-900"
        />
      </div>

      {/* Фильтр по дате ПО */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-modern-gray-700 mb-2">
          Дата по
        </label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-full px-3 py-2 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 text-modern-gray-900"
        />
      </div>

      {/* Кнопка сброса */}
      <button
        onClick={resetFilters}
        className="w-full px-4 py-2 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-colors duration-200"
      >
        Сбросить фильтры
      </button>
    </>
  );

  if (initialLoading) {
    return (
      <>
        <Helmet>
          <title>Новости - 1С Поддержка</title>
          <meta name="description" content="Последние новости компании 1С Поддержка. Актуальная информация о продуктах 1С, обновлениях и событиях." />
        </Helmet>
        <div className="min-h-screen bg-modern-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-modern-primary-600 mx-auto mb-4"></div>
            <p className="text-modern-gray-600">Загрузка новостей...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Новости - 1С Поддержка</title>
        <meta
          name="description"
          content="Актуальные новости 1С, изменения в программах, обновления законодательства и другая полезная информация."
        />
      </Helmet>

      <div className="min-h-screen bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Мобильная кнопка фильтров */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center justify-center w-full px-4 py-3 bg-modern-white border border-modern-gray-300 rounded-lg shadow-modern hover:shadow-modern-md transition-all duration-200"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-modern-primary-600" />
              <span className="font-medium text-modern-gray-900">Фильтры</span>
              {(searchQuery || dateFrom || dateTo) && (
                <span className="ml-2 px-2 py-0.5 bg-modern-primary-100 text-modern-primary-700 rounded-full text-xs">
                  Активны
                </span>
              )}
            </button>
          </div>

          {/* Мобильные фильтры */}
          {mobileFiltersOpen && (
            <div className="lg:hidden mb-6 bg-modern-white rounded-xl shadow-modern p-6 relative">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="absolute top-4 right-4 p-1 text-modern-gray-400 hover:text-modern-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold text-modern-gray-900 mb-6">Фильтры</h2>
              <FiltersContent />
            </div>
          )}

          <div className="flex gap-6">

            {/* Десктопные фильтры */}
            <div className="hidden lg:block w-1/6 bg-modern-white rounded-xl shadow-modern p-6 h-fit">
              <h2 className="text-xl font-semibold text-modern-gray-900 mb-6">Фильтры</h2>
              <FiltersContent />
            </div>

            {/* Список новостей */}
            <div className="flex-1 lg:w-5/6">
              <div className="space-y-4">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.slug}`}
                    className="block bg-modern-white rounded-lg shadow-modern hover:shadow-modern-md transition-all duration-200 p-6 group"
                  >
                    <div className="flex items-start justify-between">

                      {/* Основная информация */}
                      <div className="flex-1 mr-6">
                        <div className="flex items-center mb-2">
                          <div className="p-2 bg-modern-primary-100 rounded-lg mr-3">
                            <NewspaperIcon className="h-5 w-5 text-modern-primary-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-modern-gray-900 group-hover:text-modern-primary-600 transition-colors duration-200">
                            {item.title}
                          </h3>
                        </div>

                        <p className="text-modern-gray-600 text-sm mb-3 line-clamp-2">
                          {item.shortDescription}
                        </p>

                        <div className="flex items-center text-sm text-modern-gray-500">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Стрелка */}
                      <div className="flex items-center">
                        <ArrowRightIcon className="h-5 w-5 text-modern-gray-400 group-hover:text-modern-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Индикатор загрузки */}
              {loading && (
                <div className="text-center mt-8">
                  <div className="inline-block w-6 h-6 border-2 border-modern-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-modern-gray-600 mt-2 text-sm">Загружаем ещё новости...</p>
                </div>
              )}

              {/* Пустое состояние */}
              {!loading && news.length === 0 && (
                <div className="text-center py-16">
                  <NewspaperIcon className="h-16 w-16 text-modern-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-modern-gray-900 mb-2">
                    Новости не найдены
                  </h3>
                  <p className="text-modern-gray-600">
                    Попробуйте изменить параметры поиска
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default News;