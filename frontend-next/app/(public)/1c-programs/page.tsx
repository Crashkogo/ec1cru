'use client';

import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { programs, categoriesRow1, categoriesRow2, getCategoryColors } from './programsData';

export default function ProgramsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrograms = useMemo(() => {
    let filtered = programs;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(program => program.categories.includes(activeCategory));
    }

    if (searchTerm) {
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [activeCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-modern-gray-900">
            Программы 1С
          </h1>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categoriesRow1.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-modern-primary-600 text-white shadow-modern-md'
                    : 'bg-modern-white text-modern-gray-700 hover:bg-modern-gray-100 border border-modern-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {categoriesRow2.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-modern-primary-600 text-white shadow-modern-md'
                    : 'bg-modern-white text-modern-gray-700 hover:bg-modern-gray-100 border border-modern-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative lg:w-80 mb-8">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400" />
          <input
            type="text"
            placeholder="Поиск программ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-modern-white border border-modern-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => {
            const firstCategory = program.categories[0] || 'placeholder';
            const categoryColors = getCategoryColors(firstCategory);
            const ProgramIcon = program.icon;

            return (
              <div
                key={program.id}
                className="bg-modern-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${categoryColors.bg} rounded-lg flex items-center justify-center mr-4 p-2`}>
                      <ProgramIcon className={`w-8 h-8 ${categoryColors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-modern-gray-900 group-hover:text-modern-primary-600 transition-colors duration-200 mb-1">
                        {program.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {program.categories.map(cat => {
                      const catColors = getCategoryColors(cat);
                      return (
                        <span key={cat} className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${catColors.text}`}>
                          {cat}
                        </span>
                      );
                    })}
                  </div>

                  <p className="text-modern-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {program.description}
                  </p>

                  <a
                    href={program.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 font-medium text-sm transition-colors duration-200"
                  >
                    Подробнее
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-modern-white rounded-xl shadow-modern p-12">
              <h3 className="text-xl font-semibold text-modern-gray-900 mb-2">
                Программы не найдены
              </h3>
              <p className="text-modern-gray-600 mb-6">
                Попробуйте изменить критерии поиска или выбрать другую категорию
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
