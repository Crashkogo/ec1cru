// src/pages/ReadySolutionsList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { debounce } from 'lodash'

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

  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [freshSupportFilter, setFreshSupportFilter] = useState<boolean | null>(null);
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const itemsPerPage = 10;

  // Загрузка программ
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/programs`)
      .then((response) => {
        console.log('Programs loaded:', response.data);
        setPrograms(response.data);
      })
      .catch((error) => {
        console.error('Error fetching programs:', error.response?.status, error.response?.data);
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
    }
  }, [page, searchQuery, freshSupportFilter, selectedPrograms, typeFilter, loading, hasMore]);
  
/*   // Создаём debounced версию fetchSolutions
  const debouncedFetchSolutions = useCallback(
    () => debounce(fetchSolutions, 300)(), // Встроенная функция вызывает debounced версию
    [fetchSolutions] // Зависимость только от fetchSolutions
  ); */

  // Первоначальная загрузка и сброс при изменении фильтров
  useEffect(() => {
    fetchSolutions(true);
  }, [fetchSolutions, searchQuery, freshSupportFilter, selectedPrograms, typeFilter]);

  // Бесконечная подгрузка при скролле

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        fetchSolutions();
      }
    }, 300);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchSolutions, loading, hasMore]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-darkBg mb-6 text-center">Готовые решения</h1>

        {/* Фильтры */}
        <div className="mb-6">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="w-full flex items-center justify-between bg-darkBg text-whiteText p-3 rounded-md hover:bg-gray-700 transition-colors duration-300"
          >
            <span>Фильтры</span>
            {isFiltersOpen ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          <div
            className={`mt-2 border-2 border-darkBg rounded-md p-4 transition-all duration-300 ease-in-out ${
              isFiltersOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {/* Поиск по заголовку */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию..."
                className="p-2 border border-darkBg rounded-md text-darkBg focus:outline-none focus:border-blue-500 text-sm flex-1 min-w-[150px]"
              />

              {/* Фильтр по freshSupport */}
              <div className="flex items-center space-x-2 text-sm text-darkBg">
                <span>1C:Fresh</span>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={freshSupportFilter === true}
                    onChange={(e) => setFreshSupportFilter(e.target.checked ? true : null)}
                    className="mr-1"
                  />
                  Да
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={freshSupportFilter === false}
                    onChange={(e) => setFreshSupportFilter(e.target.checked ? false : null)}
                    className="mr-1"
                  />
                  Нет
                </label>
              </div>

              {/* Фильтр по типу */}
              <select
                value={typeFilter || ''}
                onChange={(e) => setTypeFilter(e.target.value || null)}
                className="p-2 border border-darkBg rounded-md text-darkBg focus:outline-none focus:border-blue-500 text-sm min-w-[120px]"
              >
                <option value="">Тип: Все</option>
                <option value="PROCESSING">Обработка</option>
                <option value="PRINT_FORM">Печатная форма</option>
                <option value="REPORT">Отчёт</option>
              </select>
            </div>

            {/* Фильтр по программам */}
            <div className="flex overflow-x-auto gap-4 pb-2">
              {programs.length > 0 ? (
                programs.map((program) => (
                  <label key={program.id} className="flex items-center text-sm text-darkBg whitespace-nowrap">
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
                      className="mr-1"
                    />
                    {program.shortName}
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">Программы не загружены</p>
              )}
            </div>
          </div>
        </div>

        {/* Список решений */}
        <div className="space-y-4">
        {solutions.map((solution) => (
          <Link
            key={solution.id}
            to={`/ready-solutions/${solution.slug}`}
            className="block border-2 border-darkBg rounded-md p-4 hover:shadow-lg hover:border-blue-500 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-darkBg mb-2">{solution.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{solution.shortDescription}</p>
            <div className="text-sm text-gray-500 flex flex-wrap gap-4">
              <span>
                <span className="font-medium">Цена:</span> {solution.price.toLocaleString()} ₽
              </span>
              <span>
                <span className="font-medium">Тип:</span>{' '}
                {solution.type === 'PROCESSING'
                  ? 'Обработка'
                  : solution.type === 'PRINT_FORM'
                  ? 'Печатная форма'
                  : 'Отчёт'}
              </span>
              <span>
                <span className="font-medium">1C:Fresh:</span> {solution.freshSupport ? 'Да' : 'Нет'}
              </span>
              <span>
                <span className="font-medium">Программы:</span>{' '}
                {solution.programs.map((p) => p.program.shortName).join(', ')}
              </span>
            </div>
          </Link>
        ))}
      </div>

        {/* Индикатор загрузки */}
        {loading && hasMore && (
        <div className="text-center mt-8">
          <div className="inline-block w-8 h-8 border-4 border-darkBg border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {!hasMore && solutions.length > 0 && (
        <p className="text-center mt-8 text-gray-500">Все решения загружены</p>
      )}
      </div>
    </div>
  );
};

export default ReadySolutionsList;