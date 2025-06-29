// src/pages/ReadySolutionsList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowRightIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { debounce } from 'lodash';

interface Program {
  id: number;
  shortName: string;
}

interface ReadySolution {
  id: number;
  title: string;
  shortDescription: string;
  price: number;
  type: 'PROCESSING' | 'PRINT_FORM' | 'REPORT';
  freshSupport: boolean;
  programs: { program: Program }[];
  slug: string;
}

const ReadySolutionsList: React.FC = () => {
  const [solutions, setSolutions] = useState<ReadySolution[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [freshSupportFilter, setFreshSupportFilter] = useState<boolean | null>(null);
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const itemsPerPage = 20;

  // Загрузка программ
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/programs`)
      .then((response) => {
        setPrograms(response.data);
      })
      .catch((error) => {
        console.error('Error fetching programs:', error);
      });
  }, []);

  // Загрузка решений с фильтрами и пагинацией
  const fetchSolutions = useCallback(async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/ready-solutions`, {
        params: {
          page: reset ? 1 : page,
          limit: itemsPerPage,
          search: searchQuery || undefined,
          freshSupport: freshSupportFilter !== null ? freshSupportFilter : undefined,
          programIds: selectedPrograms.length > 0 ? selectedPrograms : undefined,
          type: typeFilter || undefined,
        },
      });

      const newSolutions = response.data;
      setSolutions((prev) => (reset ? newSolutions : [...prev, ...newSolutions]));
      setHasMore(newSolutions.length === itemsPerPage);
      if (!reset) setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false);
      if (reset) setInitialLoading(false);
    }
  }, [page, searchQuery, freshSupportFilter, selectedPrograms, typeFilter, loading, hasMore]);

  // Первоначальная загрузка и сброс при изменении фильтров
  useEffect(() => {
    setPage(1);
    setSolutions([]);
    setHasMore(true);
    const timeoutId = setTimeout(() => {
      fetchSolutions(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, freshSupportFilter, selectedPrograms, typeFilter]);

  // Бесконечная подгрузка при скролле
  useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        fetchSolutions();
      }
    }, 300);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchSolutions, loading, hasMore]);

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
        return type;
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter(null);
    setFreshSupportFilter(null);
    setSelectedPrograms([]);
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

      {/* Фильтр по типу */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-modern-gray-700 mb-2">
          Тип решения
        </label>
        <select
          value={typeFilter || ''}
          onChange={(e) => setTypeFilter(e.target.value || null)}
          className="w-full px-3 py-2 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 text-modern-gray-900"
        >
          <option value="">Все типы</option>
          <option value="PROCESSING">Обработка</option>
          <option value="PRINT_FORM">Печатная форма</option>
          <option value="REPORT">Отчёт</option>
        </select>
      </div>

      {/* Фильтр по 1C:Fresh */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-modern-gray-700 mb-2">
          Поддержка 1C:Fresh
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="freshSupport"
              checked={freshSupportFilter === null}
              onChange={() => setFreshSupportFilter(null)}
              className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
            />
            <span className="text-sm text-modern-gray-700">Все</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="freshSupport"
              checked={freshSupportFilter === true}
              onChange={() => setFreshSupportFilter(true)}
              className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
            />
            <span className="text-sm text-modern-gray-700">Поддерживается</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="freshSupport"
              checked={freshSupportFilter === false}
              onChange={() => setFreshSupportFilter(false)}
              className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500"
            />
            <span className="text-sm text-modern-gray-700">Не поддерживается</span>
          </label>
        </div>
      </div>

      {/* Фильтр по программам */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-modern-gray-700 mb-2">
          Программы 1С
        </label>
        <div className="max-h-40 overflow-y-auto space-y-2 border border-modern-gray-200 rounded-lg p-3">
          {programs.map((program) => (
            <label key={program.id} className="flex items-center">
              <input
                type="checkbox"
                value={program.id}
                checked={selectedPrograms.includes(program.id)}
                onChange={(e) => {
                  const id = parseInt(e.target.value);
                  setSelectedPrograms((prev) =>
                    e.target.checked ? [...prev, id] : prev.filter((p) => p !== id)
                  );
                }}
                className="mr-2 text-modern-primary-600 focus:ring-modern-primary-500 rounded"
              />
              <span className="text-sm text-modern-gray-700">{program.shortName}</span>
            </label>
          ))}
        </div>
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
          <title>Готовые решения 1С - 1С Поддержка</title>
          <meta name="description" content="Готовые решения 1С для автоматизации бизнеса. Обработки, отчёты, печатные формы." />
        </Helmet>
        <div className="min-h-screen bg-modern-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-modern-primary-600 mx-auto mb-4"></div>
            <p className="text-modern-gray-600">Загрузка решений...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Готовые решения 1С - 1С Поддержка</title>
        <meta name="description" content="Готовые решения 1С для автоматизации бизнеса. Обработки, отчёты, печатные формы для различных конфигураций." />
      </Helmet>

      <div className="min-h-screen bg-modern-gray-50 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Мобильная кнопка фильтров */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center justify-center w-full px-4 py-3 bg-modern-white border border-modern-gray-300 rounded-lg shadow-modern hover:shadow-modern-md transition-all duration-200"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-modern-primary-600" />
              <span className="font-medium text-modern-gray-900">Фильтры</span>
              {(searchQuery || typeFilter || freshSupportFilter !== null || selectedPrograms.length > 0) && (
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

            {/* Список решений */}
            <div className="flex-1 lg:w-5/6">
              <div className="space-y-4">
                {solutions.map((solution) => (
                  <Link
                    key={solution.id}
                    to={`/ready-solutions/${solution.slug}`}
                    className="block bg-modern-white rounded-lg shadow-modern hover:shadow-modern-md transition-all duration-200 p-6 group"
                  >
                    <div className="flex items-start justify-between">

                      {/* Основная информация */}
                      <div className="flex-1 mr-6">
                        <div className="flex items-center mb-2">
                          <div className="p-2 bg-modern-primary-100 rounded-lg mr-3">
                            {getTypeIcon(solution.type)}
                          </div>
                          <h3 className="text-xl font-semibold text-modern-gray-900 group-hover:text-modern-primary-600 transition-colors duration-200">
                            {solution.title}
                          </h3>
                          {solution.freshSupport && (
                            <span className="ml-3 px-2 py-1 bg-modern-accent-100 text-modern-accent-700 rounded-full text-xs font-medium">
                              1C:Fresh
                            </span>
                          )}
                        </div>

                        <p className="text-modern-gray-600 text-sm mb-3 line-clamp-2">
                          {solution.shortDescription}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-modern-gray-500">
                          <span className="font-medium">Тип: {getTypeName(solution.type)}</span>
                          <span>•</span>
                          <span>
                            Программы: {solution.programs.map((p) => p.program.shortName).join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Цена и стрелка */}
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-2xl font-bold text-modern-primary-600">
                            {solution.price.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
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
                  <p className="text-modern-gray-600 mt-2 text-sm">Загружаем ещё решения...</p>
                </div>
              )}

              {/* Пустое состояние */}
              {!loading && solutions.length === 0 && (
                <div className="text-center py-16">
                  <ComputerDesktopIcon className="h-16 w-16 text-modern-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-modern-gray-900 mb-2">
                    Решения не найдены
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

export default ReadySolutionsList;