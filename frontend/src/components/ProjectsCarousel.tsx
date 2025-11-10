import React, { useRef, useEffect, useState } from 'react';
import { CheckCircleIcon, ChartBarIcon, CogIcon, ShoppingCartIcon, TruckIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface Project {
  id: number;
  title: string;
  industry: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const ProjectsCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const projects: Project[] = [
    {
      id: 1,
      title: 'Автоматизация производства',
      industry: 'Производство металлоконструкций',
      description: 'Внедрение 1С:ERP для управления производственным циклом и складским учетом',
      icon: <CogIcon className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      title: 'Управление розничной сетью',
      industry: 'Сеть продуктовых магазинов',
      description: 'Интеграция 1С:Управление торговлей с онлайн-кассами и программой лояльности',
      icon: <ShoppingCartIcon className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      title: 'Логистический комплекс',
      industry: 'Транспортная компания',
      description: 'Система управления перевозками и оптимизация маршрутов на базе 1С',
      icon: <TruckIcon className="w-8 h-8" />,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 4,
      title: 'Финансовый учет',
      industry: 'Холдинг из 12 компаний',
      description: 'Консолидированная отчетность и управленческий учет в 1С:Бухгалтерия КОРП',
      icon: <ChartBarIcon className="w-8 h-8" />,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      id: 5,
      title: 'Строительный учет',
      industry: 'Строительная компания',
      description: 'Управление проектами, сметами и подрядчиками в 1С:Строительство',
      icon: <BuildingOfficeIcon className="w-8 h-8" />,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      id: 6,
      title: 'Оптовая торговля',
      industry: 'Дистрибьютор медтехники',
      description: 'Автоматизация закупок, продаж и интеграция с CRM системой',
      icon: <CheckCircleIcon className="w-8 h-8" />,
      gradient: 'from-teal-500 to-cyan-500',
    },
  ];

  // Дублируем проекты для бесшовной прокрутки
  const duplicatedProjects = [...projects, ...projects, ...projects];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    let animationId: number;
    let scrollAmount = 0;

    const scroll = () => {
      if (!isPaused) {
        scrollAmount += 0.5; // Скорость прокрутки
        scrollContainer.scrollLeft = scrollAmount;

        // Сброс позиции для бесшовной прокрутки
        if (scrollAmount >= scrollContainer.scrollWidth / 3) {
          scrollAmount = 0;
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section id="projects" className="py-16 bg-gradient-to-br from-modern-gray-50 to-modern-primary-50/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-modern-gray-900 text-center mb-4">
          Наши проекты
        </h2>
        <p className="text-center text-modern-gray-600 text-lg max-w-2xl mx-auto">
          Успешно реализованные решения для различных отраслей бизнеса
        </p>
      </div>

      {/* Карусель с проектами */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 px-4 overflow-x-hidden pb-8"
          style={{ scrollBehavior: 'auto', minHeight: '500px' }}
        >
          {duplicatedProjects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="flex-shrink-0 w-80 group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="bg-white rounded-2xl shadow-modern hover:shadow-modern-lg transition-all duration-300 h-full overflow-hidden flex flex-col">
                {/* Градиентный хедер с иконкой */}
                <div className={`bg-gradient-to-r ${project.gradient} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      {project.icon}
                    </div>
                    <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      Завершен
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm opacity-90">{project.industry}</p>
                </div>

                {/* Контент */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-modern-gray-600 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Теги технологий */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-3 py-1 bg-modern-primary-100 text-modern-primary-700 rounded-full font-medium">
                      1С:Предприятие 8
                    </span>
                    <span className="text-xs px-3 py-1 bg-modern-accent-100 text-modern-accent-700 rounded-full font-medium">
                      Интеграция
                    </span>
                  </div>

                  {/* Кнопка подробнее - всегда внизу */}
                  <button className="mt-auto w-full py-2 px-4 bg-modern-gray-100 text-modern-gray-700 rounded-xl transition-all duration-200 font-semibold hover:scale-105">
                    Подробнее →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Индикатор прокрутки */}
        <div className="text-center mt-8">
        </div>
      </div>
    </section>
  );
};

export default ProjectsCarousel;
