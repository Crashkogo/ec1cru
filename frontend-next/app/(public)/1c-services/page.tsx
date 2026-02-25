'use client';

import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { services, categories, getColorForService } from './servicesData';

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Фильтрация сервисов
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Фильтр по категории
    if (activeCategory !== 'all') {
      filtered = filtered.filter(service =>
        service.categories.includes(activeCategory)
      );
    }

    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [activeCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-modern-gray-900">
            Сервисы 1С
          </h1>
          <p className="text-modern-gray-600 mt-2">
            Полный каталог продуктов и услуг для работы с 1С:Предприятие
          </p>
        </div>

        {/* Фильтры и поиск */}
        <div className="mb-6">
          {/* Кнопки фильтрации */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                  activeCategory === category.id
                    ? 'bg-modern-primary-600 text-white shadow-md'
                    : 'bg-modern-white text-modern-gray-700 hover:bg-modern-gray-100 border border-modern-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Поле поиска */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400" />
            <input
              type="text"
              placeholder="Поиск"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-modern-white border border-modern-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Сетка сервисов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const serviceColor = getColorForService(service.id);
            return (
              <a
                key={service.id}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-modern-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-200 overflow-hidden group block"
              >
                <div className="p-6">
                  {/* Заголовок с иконкой */}
                  <div className="flex items-start mb-4">
                    {/* Иконка сервиса */}
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${serviceColor.bg} rounded-lg flex items-center justify-center mr-4`}>
                      <svg className={`w-8 h-8 ${serviceColor.text}`}>
                        <use href={`/1c-sprite2.svg#icon-${service.iconId}`} />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-modern-gray-900 group-hover:text-modern-primary-600 transition-colors duration-200 mb-1 line-clamp-2">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Описание */}
                  <p className="text-modern-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Кнопка */}
                  <div className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 font-medium text-sm transition-colors duration-200">
                    Подробнее
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Пустое состояние */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-modern-white rounded-xl shadow-modern p-12">
              <h3 className="text-xl font-semibold text-modern-gray-900 mb-2">
                Сервисы не найдены
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

        {/* Дополнительная информация */}
        <div className="mt-10 text-center">
          <div className="bg-modern-primary-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-modern-primary-900 mb-4">
              Нужна помощь с выбором сервиса?
            </h2>
            <p className="text-modern-primary-700 mb-6">
              Наши специалисты помогут подобрать оптимальное решение для вашего бизнеса
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

        {/* Источник */}
        <div className="mt-8 text-center text-sm text-modern-gray-500">
          Источник данных:{' '}
          <a
            href="https://portal.1c.ru/applications"
            target="_blank"
            rel="noopener noreferrer"
            className="text-modern-primary-600 hover:underline"
          >
            portal.1c.ru
          </a>
        </div>
      </div>
    </div>
  );
}
