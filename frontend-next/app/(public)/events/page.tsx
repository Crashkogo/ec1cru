'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  CalendarIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import type { EventItem } from '@/types';

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [oursFilter, setOursFilter] = useState<boolean | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'future' | 'past'>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const itemsPerPage = 20;

  // Загрузка мероприятий
  const fetchEvents = async (reset = false) => {
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
      if (oursFilter !== null) params.append('ours', String(oursFilter));
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/events?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const newItems: EventItem[] = await response.json();
      setEvents((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(newItems.length === itemsPerPage);
      if (!reset) setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      if (reset) setInitialLoading(false);
    }
  };

  // Первоначальная загрузка и сброс при изменении фильтров
  useEffect(() => {
    setPage(1);
    setEvents([]);
    setHasMore(true);
    const timeoutId = setTimeout(() => {
      fetchEvents(true);
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, dateFrom, dateTo, oursFilter, statusFilter]);

  // Бесконечная подгрузка при скролле
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        fetchEvents();
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
    setOursFilter(null);
    setStatusFilter('all');
    setMobileFiltersOpen(false);
  }, []);

  // Обработчики изменения с сохранением фокуса
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleDateFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
  }, []);

  const handleDateToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
  }, []);

  // Функция проверки статуса события
  const isEventPast = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

  // Компонент фильтров
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

        {/* Фильтр: Наши/Внешние */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-modern-gray-700 mb-2">
            Тип мероприятия
          </label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="ours"
                checked={oursFilter === null}
                onChange={() => setOursFilter(null)}
                className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
              />
              <span className="text-modern-gray-700">Все</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="ours"
                checked={oursFilter === true}
                onChange={() => setOursFilter(true)}
                className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
              />
              <span className="text-modern-gray-700">Наши</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="ours"
                checked={oursFilter === false}
                onChange={() => setOursFilter(false)}
                className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
              />
              <span className="text-modern-gray-700">Внешние</span>
            </label>
          </div>
        </div>

        {/* Фильтр: Статус */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-modern-gray-700 mb-2">
            Статус
          </label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={statusFilter === 'all'}
                onChange={() => setStatusFilter('all')}
                className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
              />
              <span className="text-modern-gray-700">Все</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={statusFilter === 'future'}
                onChange={() => setStatusFilter('future')}
                className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
              />
              <span className="text-modern-gray-700">Предстоящие</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={statusFilter === 'past'}
                onChange={() => setStatusFilter('past')}
                className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
              />
              <span className="text-modern-gray-700">Прошедшие</span>
            </label>
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
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-colors duration-200"
        >
          Сбросить фильтры
        </button>
      </>
    ),
    [
      searchQuery,
      handleSearchChange,
      oursFilter,
      statusFilter,
      dateFrom,
      handleDateFromChange,
      dateTo,
      handleDateToChange,
      resetFilters,
    ]
  );

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-modern-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-modern-primary-600 mx-auto mb-4"></div>
          <p className="text-modern-gray-600">Загрузка мероприятий...</p>
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
            {(searchQuery || dateFrom || dateTo || oursFilter !== null || statusFilter !== 'all') && (
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

          {/* Список мероприятий */}
          <div className="flex-1 lg:w-5/6">
            <div className="space-y-4">
              {events.map((item) => {
                const isPast = isEventPast(item.eventDate || item.startDate);

                return (
                  <Link
                    key={item.id}
                    href={`/events/${item.slug}`}
                    className="block bg-modern-white rounded-lg shadow-modern hover:shadow-modern-md transition-all duration-200 p-6 group"
                  >
                    <div className="flex items-start justify-between">
                      {/* Основная информация */}
                      <div className="flex-1 mr-6">
                        <div className="flex items-center mb-2">
                          <div className="p-2 bg-modern-primary-100 rounded-lg mr-3">
                            {item.ours ? (
                              <BuildingOfficeIcon className="h-5 w-5 text-modern-primary-600" />
                            ) : (
                              <AcademicCapIcon className="h-5 w-5 text-modern-primary-600" />
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-modern-gray-900 group-hover:text-modern-primary-600 transition-colors duration-200">
                            {item.title}
                          </h3>
                        </div>

                        <p className="text-modern-gray-600 text-sm mb-3 line-clamp-2">
                          {item.shortDescription}
                        </p>

                        <div className="flex items-center gap-4 flex-wrap">
                          {/* Дата и время */}
                          <div className="flex items-center text-sm text-modern-gray-500">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(item.eventDate || item.startDate).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}{' '}
                              в{' '}
                              {new Date(item.eventDate || item.startDate).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          {/* Статус */}
                          {isPast ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-modern-gray-100 text-modern-gray-700">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Завершено
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Предстоит
                            </span>
                          )}

                          {/* Ссылка на трансляцию */}
                          {item.eventLink && (
                            <span className="inline-flex items-center text-sm text-modern-primary-600">
                              <LinkIcon className="h-4 w-4 mr-1" />
                              Ссылка на трансляцию
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Стрелка */}
                      <div className="flex items-center">
                        <ArrowRightIcon className="h-5 w-5 text-modern-gray-400 group-hover:text-modern-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Индикатор загрузки */}
            {loading && (
              <div className="text-center mt-8">
                <div className="inline-block w-6 h-6 border-2 border-modern-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-modern-gray-600 mt-2 text-sm">Загружаем ещё мероприятия...</p>
              </div>
            )}

            {/* Пустое состояние */}
            {!loading && events.length === 0 && (
              <div className="text-center py-16">
                <CalendarIcon className="h-16 w-16 text-modern-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-modern-gray-900 mb-2">
                  Мероприятия не найдены
                </h3>
                <p className="text-modern-gray-600">Попробуйте изменить параметры поиска</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
