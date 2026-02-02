'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  ArrowRightIcon,
  BuildingOffice2Icon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface CompanyLifeItem {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  createdAt: string;
  isPublished: boolean;
}

export default function CompanyLifePage() {
  const [posts, setPosts] = useState<CompanyLifeItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const itemsPerPage = 20;

  // Загрузка постов
  const fetchPosts = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(reset ? 1 : page),
        limit: String(itemsPerPage),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/company-life?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch company life posts');
      }

      const newItems: CompanyLifeItem[] = await response.json();
      setPosts((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(newItems.length === itemsPerPage);
      if (!reset) setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching company life posts:', error);
    } finally {
      setLoading(false);
      if (reset) setInitialLoading(false);
    }
  };

  // Первоначальная загрузка и сброс при изменении поиска
  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    const timeoutId = setTimeout(() => {
      fetchPosts(true);
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
        fetchPosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setMobileFiltersOpen(false);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleDateFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
  }, []);

  const handleDateToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
  }, []);

  const FiltersContent = useMemo(
    () => (
      <>
        {/* Поиск */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-modern-gray-700 mb-2">
            Поиск по названию
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Введите название..."
              autoComplete="off"
              className="w-full pl-10 pr-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-all duration-200 text-modern-gray-900 placeholder-modern-gray-500"
            />
          </div>
        </div>

        {/* Фильтр по дате С */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-modern-gray-700 mb-2">Дата с</label>
          <input
            type="date"
            value={dateFrom}
            onChange={handleDateFromChange}
            className="w-full px-3 py-2 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 text-modern-gray-900"
          />
        </div>

        {/* Фильтр по дате ПО */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-modern-gray-700 mb-2">Дата по</label>
          <input
            type="date"
            value={dateTo}
            onChange={handleDateToChange}
            className="w-full px-3 py-2 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 text-modern-gray-900"
          />
        </div>

        {/* Кнопка сброса */}
        {(searchQuery || dateFrom || dateTo) && (
          <button
            onClick={resetFilters}
            className="w-full py-3 bg-modern-gray-100 text-modern-gray-700 font-medium rounded-lg hover:bg-modern-gray-200 transition-colors duration-200"
          >
            Сбросить фильтры
          </button>
        )}
      </>
    ),
    [searchQuery, dateFrom, dateTo, resetFilters, handleSearchChange, handleDateFromChange, handleDateToChange]
  );

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-modern-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-modern-primary-600 mx-auto mb-4"></div>
          <p className="text-modern-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
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
            {FiltersContent}
          </div>
        )}

        <div className="flex gap-6">
          {/* Десктопные фильтры */}
          <div className="hidden lg:block w-1/6 bg-modern-white rounded-xl shadow-modern p-6 h-fit">
            <h2 className="text-xl font-semibold text-modern-gray-900 mb-6">Фильтры</h2>
            {FiltersContent}
          </div>

          {/* Список постов */}
          <div className="flex-1 lg:w-5/6">
            {posts.length === 0 && !loading ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-modern">
                <BuildingOffice2Icon className="mx-auto h-12 w-12 text-modern-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-modern-gray-900 mb-2">
                  Посты не найдены
                </h3>
                <p className="text-modern-gray-600 mb-4">
                  {searchQuery || dateFrom || dateTo
                    ? 'Попробуйте изменить параметры поиска'
                    : 'Посты скоро появятся!'}
                </p>
                {(searchQuery || dateFrom || dateTo) && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-4 py-2 bg-modern-primary-600 text-white rounded-lg hover:bg-modern-primary-700 transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/life/${post.slug}`}
                    className="block bg-modern-white rounded-lg shadow-modern hover:shadow-modern-md transition-all duration-200 p-6 group"
                  >
                    <div className="flex items-start justify-between">
                      {/* Основная информация */}
                      <div className="flex-1 mr-6">
                        <div className="flex items-center mb-2">
                          <div className="p-2 bg-modern-primary-100 rounded-lg mr-3">
                            <BuildingOffice2Icon className="h-5 w-5 text-modern-primary-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-modern-gray-900 group-hover:text-modern-primary-600 transition-colors duration-200">
                            {post.title}
                          </h3>
                        </div>

                        <p className="text-modern-gray-600 text-sm mb-3 line-clamp-2">
                          {post.shortDescription}
                        </p>

                        <div className="flex items-center text-sm text-modern-gray-500">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
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
            )}

            {/* Индикатор загрузки */}
            {loading && (
              <div className="text-center mt-8">
                <div className="inline-block w-6 h-6 border-2 border-modern-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-modern-gray-600 mt-2 text-sm">Загружаем ещё посты...</p>
              </div>
            )}

            {/* Пустое состояние */}
            {!loading && posts.length === 0 && (
              <div className="text-center py-16">
                <BuildingOffice2Icon className="h-16 w-16 text-modern-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-modern-gray-900 mb-2">Нет постов</h3>
                <p className="text-modern-gray-600">
                  {searchQuery || dateFrom || dateTo
                    ? 'Попробуйте изменить параметры фильтрации'
                    : 'Скоро здесь появятся посты о жизни компании'}
                </p>
                {(searchQuery || dateFrom || dateTo) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-modern-primary-600 text-white rounded-lg hover:bg-modern-primary-700 transition-colors duration-200"
                  >
                    Сбросить фильтры
                  </button>
                )}
              </div>
            )}

            {/* Конец списка */}
            {!hasMore && posts.length > 0 && (
              <div className="text-center mt-8 py-4 border-t border-modern-gray-200">
                <p className="text-modern-gray-500 text-sm">Все посты загружены</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
