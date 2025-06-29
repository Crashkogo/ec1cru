import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
    MagnifyingGlassIcon,
    CalendarIcon,
    ArrowRightIcon,
    AcademicCapIcon,
    BuildingOfficeIcon,
    LinkIcon,
    AdjustmentsHorizontalIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface EventItem {
    id: number;
    title: string;
    shortDescription: string;
    slug: string;
    startDate: string;
    ours: boolean;
    eventLink?: string;
    isPublished: boolean;
}

const Events: React.FC = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [oursFilter, setOursFilter] = useState<boolean | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'future' | 'past'>('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const itemsPerPage = 20;

    // Загрузка мероприятий
    const fetchEvents = async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;
        setLoading(true);

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/events`, {
                params: {
                    page: reset ? 1 : page,
                    limit: itemsPerPage,
                    search: searchQuery || undefined,
                    ours: oursFilter !== null ? oursFilter : undefined,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    dateFrom: dateFrom || undefined,
                    dateTo: dateTo || undefined,
                },
            });

            const newItems = response.data;
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
    }, [searchQuery, oursFilter, statusFilter, dateFrom, dateTo]);

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
    }, [loading, hasMore]);

    const isPastEvent = (eventDate: string) => {
        return new Date(eventDate) < new Date();
    };

    const resetFilters = () => {
        setSearchQuery('');
        setOursFilter(null);
        setStatusFilter('all');
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

            {/* Фильтр по организатору */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                    Организатор
                </label>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="ours"
                            checked={oursFilter === null}
                            onChange={() => setOursFilter(null)}
                            className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
                        />
                        <span className="text-sm text-modern-gray-700">Все</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="ours"
                            checked={oursFilter === true}
                            onChange={() => setOursFilter(true)}
                            className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
                        />
                        <span className="text-sm text-modern-gray-700">Наши мероприятия</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="ours"
                            checked={oursFilter === false}
                            onChange={() => setOursFilter(false)}
                            className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
                        />
                        <span className="text-sm text-modern-gray-700">Внешние мероприятия</span>
                    </label>
                </div>
            </div>

            {/* Фильтр по времени */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                    Время проведения
                </label>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="status"
                            checked={statusFilter === 'all'}
                            onChange={() => setStatusFilter('all')}
                            className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
                        />
                        <span className="text-sm text-modern-gray-700">Все</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="status"
                            checked={statusFilter === 'future'}
                            onChange={() => setStatusFilter('future')}
                            className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
                        />
                        <span className="text-sm text-modern-gray-700">Предстоящие</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="status"
                            checked={statusFilter === 'past'}
                            onChange={() => setStatusFilter('past')}
                            className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
                        />
                        <span className="text-sm text-modern-gray-700">Прошедшие</span>
                    </label>
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
                    <title>Мероприятия - 1С Поддержка</title>
                    <meta name="description" content="Календарь мероприятий 1С Поддержка. Семинары, конференции, обучающие программы и деловые встречи." />
                </Helmet>
                <div className="min-h-screen bg-modern-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-modern-primary-600 mx-auto mb-4"></div>
                        <p className="text-modern-gray-600">Загрузка мероприятий...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Мероприятия - 1С Поддержка</title>
                <meta name="description" content="Календарь мероприятий 1С Поддержка. Семинары, конференции, обучающие программы и деловые встречи." />
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
                            {(searchQuery || oursFilter !== null || statusFilter !== 'all' || dateFrom || dateTo) && (
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

                        {/* Список мероприятий */}
                        <div className="flex-1 lg:w-5/6">
                            <div className="space-y-4">
                                {events.map((item) => {
                                    const isPast = isPastEvent(item.startDate);
                                    return (
                                        <Link
                                            key={item.id}
                                            to={`/events/${item.slug}`}
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
                                                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${isPast
                                                            ? 'bg-modern-gray-100 text-modern-gray-600'
                                                            : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {isPast ? 'Завершено' : 'Предстоит'}
                                                        </span>
                                                    </div>

                                                    <p className="text-modern-gray-600 text-sm mb-3 line-clamp-2">
                                                        {item.shortDescription}
                                                    </p>

                                                    <div className="flex items-center space-x-4 text-sm text-modern-gray-500">
                                                        <div className="flex items-center">
                                                            <CalendarIcon className="h-4 w-4 mr-1" />
                                                            <span>
                                                                {new Date(item.startDate).toLocaleDateString('ru-RU', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <span>•</span>
                                                        <span>{item.ours ? 'Наше мероприятие' : 'Внешнее мероприятие'}</span>
                                                        {item.ours && item.eventLink && (
                                                            <>
                                                                <span>•</span>
                                                                <div className="flex items-center text-modern-primary-600">
                                                                    <LinkIcon className="h-4 w-4 mr-1" />
                                                                    <span>Регистрация доступна</span>
                                                                </div>
                                                            </>
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
                                    <AcademicCapIcon className="h-16 w-16 text-modern-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-modern-gray-900 mb-2">
                                        Мероприятия не найдены
                                    </h3>
                                    <p className="text-modern-gray-600">
                                        Попробуйте изменить параметры поиска или фильтры
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

export default Events; 