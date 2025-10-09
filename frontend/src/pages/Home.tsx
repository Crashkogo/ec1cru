import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ClockIcon,
  ArrowRightIcon,
  CalendarIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import csImage from '../assets/cs.png';
import { usePreloadOnHover, preloadOnIdle } from '../utils/preloadRoutes';
import SubscribeForm from '../components/SubscribeForm';

// Типы данных
interface NewsItem {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  createdAt: string;
  isPublished: boolean;
}

interface PromotionItem {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  startDate: string;
  endDate: string;
  status: boolean;
  isPublished: boolean;
}

interface EventItem {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  startDate: string;
  isPublished: boolean;
  ours: boolean;
  status: boolean;
}

interface Program {
  id: number;
  shortName: string;
}

interface ReadySolutionItem {
  slug: string;
  title: string;
  shortDescription: string;
  type: string;
  price: number;
  freshSupport: boolean;
  programs: { program: Program }[];
}

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [solutions, setSolutions] = useState<ReadySolutionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAboutTab, setActiveAboutTab] = useState('history');
  const { handleMouseEnter } = usePreloadOnHover();

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {

      try {
        const [newsRes, promotionsRes, eventsRes, solutionsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/posts/news?take=3`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/posts/promotions?take=3`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/posts/events?take=3`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/posts/ready-solutions?limit=4`)
        ]);

        setNews(newsRes.data);
        setPromotions(promotionsRes.data);
        setEvents(eventsRes.data);
        setSolutions(solutionsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Запускаем preloading критических маршрутов при idle
    preloadOnIdle();
  }, []);

  if (loading) {
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
    <>
      <Helmet>
        <title>ООО «Инженер-центр» - Профессиональная автоматизация бизнеса</title>
        <meta
          name="description"
          content="Профессиональные услуги 1С: внедрение, сопровождение, техподдержка, обучение. 30 лет опыта, 600+ довольных клиентов."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-modern-primary-50 via-modern-white to-modern-accent-50 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.03) 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Левая часть - УТП и статистика */}
            <div className="space-y-8">
              {/* УТП */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-modern-gray-900 mb-6 leading-tight">
                  <span className="text-modern-primary-600 block">Индивидуальный подход</span>
                  от лидеров в регионе
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-modern-gray-700 mb-8">
                  Полный цикл услуг
                </h2>
              </div>

              {/* Статистика в компактном виде */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-modern">
                  <div className="text-3xl font-bold text-modern-primary-600 mb-2">600+</div>
                  <div className="text-sm font-medium text-modern-gray-700">Клиентов с нами</div>
                </div>
                <div className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-modern">
                  <div className="text-3xl font-bold text-modern-primary-600 mb-2">50+</div>
                  <div className="text-sm font-medium text-modern-gray-700">Внедрений реализовано</div>
                </div>
                <div className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-modern">
                  <div className="text-3xl font-bold text-modern-primary-600 mb-2">30</div>
                  <div className="text-sm font-medium text-modern-gray-700">Лет на рынке</div>
                </div>
                <div className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-modern">
                  <img src={csImage} alt="1С" className="h-16 w-auto mx-auto" />
                </div>
              </div>

              {/* Форма обратной связи */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Поле имени */}
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    className="w-full px-4 py-3 bg-modern-white/80 backdrop-blur-sm border border-modern-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200 placeholder-modern-gray-400"
                  />

                  {/* Поле телефона */}
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    defaultValue="+7 "
                    className="w-full px-4 py-3 bg-modern-white/80 backdrop-blur-sm border border-modern-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200 placeholder-modern-gray-400"
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement;
                      let value = input.value.replace(/\D/g, '');

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

                      input.value = formatted;
                    }}
                    onFocus={(e) => {
                      if (e.target.value === '') {
                        e.target.value = '+7 ';
                      }
                    }}
                  />
                </div>

                {/* Согласие на обработку данных */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 h-4 w-4 text-modern-primary-600 border-modern-gray-300 rounded focus:ring-modern-primary-500 focus:ring-2"
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
              </div>

              {/* Кнопка консультации */}
              <button className="w-full group px-8 py-4 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-all duration-200 font-semibold shadow-modern-md hover:shadow-modern-lg transform hover:scale-105">
                <span className="flex items-center justify-center">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Получить консультацию
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>
            </div>

            {/* Правая часть - Новости, Акции, Мероприятия */}
            <div className="space-y-3">

              {/* Новости */}
              <div className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern">
                <Link
                  to="/news"
                  onMouseEnter={() => handleMouseEnter('/news')}
                  className="block text-center mb-4 hover:text-modern-primary-700 transition-all duration-200"
                >
                  <h3 className="text-lg font-bold text-modern-primary-600 transition-transform duration-200 hover:scale-110">Новости</h3>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  {news.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      to={`/news/${item.slug}`}
                      onMouseEnter={() => handleMouseEnter(`/news/${item.slug}`)}
                      className="block hover:bg-modern-gray-50 rounded-lg p-2 transition-colors duration-200 group"
                    >
                      <h4 className="font-medium text-modern-gray-900 text-sm group-hover:text-modern-primary-600 transition-colors duration-200 line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center text-xs text-modern-gray-500">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Акции */}
              <div className="bg-modern-accent-50/80 backdrop-blur-sm rounded-xl p-4 shadow-modern border border-modern-accent-200">
                <Link
                  to="/promotions"
                  onMouseEnter={() => handleMouseEnter('/promotions')}
                  className="block text-center mb-4 hover:text-modern-accent-700 transition-all duration-200"
                >
                  <h3 className="text-lg font-bold text-modern-accent-600 transition-transform duration-200 hover:scale-110">Акции</h3>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  {promotions.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      to={`/promotions/${item.slug}`}
                      onMouseEnter={() => handleMouseEnter(`/promotions/${item.slug}`)}
                      className="block hover:bg-modern-accent-100/50 rounded-lg p-2 transition-colors duration-200 group"
                    >
                      <h4 className="font-medium text-modern-gray-900 text-sm group-hover:text-modern-accent-700 transition-colors duration-200 line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <div className="text-xs text-modern-gray-500">
                        До {new Date(item.endDate).toLocaleDateString('ru-RU')}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Мероприятия */}
              <div className="bg-modern-primary-50/80 backdrop-blur-sm rounded-xl p-4 shadow-modern border border-modern-primary-200">
                <Link
                  to="/events"
                  onMouseEnter={() => handleMouseEnter('/events')}
                  className="block text-center mb-4 hover:text-modern-primary-700 transition-all duration-200"
                >
                  <h3 className="text-lg font-bold text-modern-primary-600 transition-transform duration-200 hover:scale-110">Мероприятия</h3>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  {events.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      to={`/events/${item.slug}`}
                      onMouseEnter={() => handleMouseEnter(`/events/${item.slug}`)}
                      className="block hover:bg-modern-primary-100/50 rounded-lg p-2 transition-colors duration-200 group"
                    >
                      <h4 className="font-medium text-modern-gray-900 text-sm group-hover:text-modern-primary-700 transition-colors duration-200 line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center text-xs text-modern-gray-500">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(item.startDate).toLocaleDateString('ru-RU')}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Готовые решения */}
      {
        solutions.length > 0 && (
          <section className="py-12 bg-modern-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-modern-gray-900 mb-4">
                  Готовые решения 1С
                </h2>
                <p className="text-xl text-modern-gray-600">
                  Проверенные решения для быстрого старта вашего бизнеса
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {solutions.map((solution) => (
                  <Link
                    key={solution.slug}
                    to={`/ready-solutions/${solution.slug}`}
                    onMouseEnter={() => handleMouseEnter(`/ready-solutions/${solution.slug}`)}
                    className="group bg-modern-white rounded-xl p-4 shadow-modern hover:shadow-modern-lg transition-all duration-200 transform hover:scale-105 flex flex-col"
                  >
                    {/* Заголовок и программы на одном уровне */}
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <h3 className="text-lg font-semibold text-modern-gray-900 group-hover:text-modern-primary-600 transition-colors duration-200 flex-1">
                        {solution.title}
                      </h3>

                      {/* Программы справа */}
                      <div className="flex flex-wrap gap-1 justify-end flex-shrink-0">
                        {solution.programs && solution.programs.length > 0 && (
                          <>
                            {solution.programs.slice(0, 2).map((programWrapper, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-modern-primary-100 text-modern-primary-700 rounded-full text-xs font-medium"
                              >
                                {programWrapper.program.shortName}
                              </span>
                            ))}
                            {solution.programs.length > 2 && (
                              <span className="px-2 py-1 bg-modern-gray-100 text-modern-gray-600 rounded-full text-xs font-medium">
                                ...
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-modern-gray-600 text-sm mb-4 line-clamp-4 flex-grow min-h-[4rem]">
                      {solution.shortDescription}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-modern-primary-600">
                        {solution.price.toLocaleString('ru-RU')} ₽
                      </span>
                      <ArrowRightIcon className="h-5 w-5 text-modern-gray-400 group-hover:text-modern-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/ready-solutions"
                  onMouseEnter={() => handleMouseEnter('/ready-solutions')}
                  className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                >
                  Все готовые решения
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </div>
          </section>
        )
      }

      {/* О компании */}
      <section className="py-16 bg-modern-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-modern-gray-900 text-center mb-12">
              О компании
            </h2>

            {/* Переключатели */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveAboutTab('history')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeAboutTab === 'history'
                  ? 'bg-modern-primary-600 text-white shadow-modern-md'
                  : 'bg-modern-gray-100 text-modern-gray-700 hover:bg-modern-gray-200'
                  }`}
              >
                История
              </button>
              <button
                onClick={() => setActiveAboutTab('team')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeAboutTab === 'team'
                  ? 'bg-modern-primary-600 text-white shadow-modern-md'
                  : 'bg-modern-gray-100 text-modern-gray-700 hover:bg-modern-gray-200'
                  }`}
              >
                Наша команда
              </button>
              <button
                onClick={() => setActiveAboutTab('careers')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeAboutTab === 'careers'
                  ? 'bg-modern-primary-600 text-white shadow-modern-md'
                  : 'bg-modern-gray-100 text-modern-gray-700 hover:bg-modern-gray-200'
                  }`}
              >
                Вакансии
              </button>
            </div>

            {/* Контент */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Левая часть - текст */}
              <div className="space-y-6">
                {activeAboutTab === 'history' && (
                  <>
                    <h3 className="text-2xl font-bold text-modern-gray-900">История компании</h3>
                    <div className="space-y-4 text-modern-gray-600">
                      <p>
                        Компания «ООО «Инженер-центр»» - ведущий региональный интегратор решений 1С
                        с 30-летним опытом работы на рынке автоматизации бизнеса.
                      </p>
                      <p>
                        За годы работы мы успешно реализовали более 50 проектов внедрения,
                        обслуживаем свыше 600 клиентов различного масштаба - от небольших
                        предприятий до крупных корпораций.
                      </p>
                      <p>
                        Наша команда состоит из сертифицированных специалистов, которые
                        постоянно повышают квалификацию и следят за новейшими тенденциями
                        в области информационных технологий.
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 pt-4">
                      <span className="text-3xl font-bold text-modern-primary-600">30</span>
                      <span className="text-modern-gray-600">лет успешной работы на рынке</span>
                    </div>
                    <Link
                      to="/about"
                      onMouseEnter={() => handleMouseEnter('/about')}
                      className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                    >
                      Подробнее о компании
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </Link>
                  </>
                )}

                {activeAboutTab === 'team' && (
                  <>
                    <h3 className="text-2xl font-bold text-modern-gray-900">Наша команда</h3>
                    <div className="space-y-4 text-modern-gray-600">
                      <p>
                        Наша команда - это высококвалифицированные специалисты с многолетним
                        опытом работы в области автоматизации бизнес-процессов.
                      </p>
                      <p>
                        Мы объединяем профессионалов различных направлений: разработчиков,
                        консультантов по внедрению, специалистов технической поддержки и
                        преподавателей учебного центра.
                      </p>
                      <p>
                        Каждый член команды имеет официальные сертификаты 1С и регулярно
                        проходит обучение для поддержания высокого уровня экспертизы.
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 pt-4">
                      <span className="text-3xl font-bold text-modern-primary-600">25+</span>
                      <span className="text-modern-gray-600">сертифицированных специалистов</span>
                    </div>
                    <Link
                      to="/team"
                      onMouseEnter={() => handleMouseEnter('/team')}
                      className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                    >
                      Познакомиться с командой
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </Link>
                  </>
                )}

                {activeAboutTab === 'careers' && (
                  <>
                    <h3 className="text-2xl font-bold text-modern-gray-900">Карьера в нашей компании</h3>
                    <div className="space-y-4 text-modern-gray-600">
                      <p>
                        Мы всегда рады видеть в нашей команде талантливых и амбициозных
                        специалистов, готовых развиваться в сфере информационных технологий.
                      </p>
                      <p>
                        Предлагаем стабильную работу в дружном коллективе, возможности
                        профессионального роста, обучение за счет компании и участие в
                        интересных проектах.
                      </p>
                      <p>
                        Мы предоставляем менторскую поддержку и помогаем раскрыть потенциал
                        каждого сотрудника.
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 pt-4">
                      <span className="text-3xl font-bold text-modern-primary-600">5+</span>
                      <span className="text-modern-gray-600">открытых вакансий</span>
                    </div>
                    <Link
                      to="/careers"
                      onMouseEnter={() => handleMouseEnter('/careers')}
                      className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                    >
                      Посмотреть вакансии
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </Link>
                  </>
                )}
              </div>

              {/* Правая часть - изображение */}
              <div className="flex justify-center">
                <div className="relative">
                  {activeAboutTab === 'history' && (
                    <div className="w-80 h-80 bg-gradient-to-br from-modern-primary-100 to-modern-primary-200 rounded-2xl flex items-center justify-center shadow-modern-lg">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-modern-primary-600 mb-4">30</div>
                        <div className="text-xl font-semibold text-modern-primary-700">лет опыта</div>
                        <div className="text-modern-primary-600 mt-2">на рынке 1С</div>
                      </div>
                    </div>
                  )}

                  {activeAboutTab === 'team' && (
                    <div className="w-80 h-80 bg-gradient-to-br from-modern-accent-100 to-modern-accent-200 rounded-2xl flex items-center justify-center shadow-modern-lg">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-modern-accent-600 mb-4">25+</div>
                        <div className="text-xl font-semibold text-modern-accent-700">специалистов</div>
                        <div className="text-modern-accent-600 mt-2">в нашей команде</div>
                      </div>
                    </div>
                  )}

                  {activeAboutTab === 'careers' && (
                    <div className="w-80 h-80 bg-gradient-to-br from-modern-gray-100 to-modern-gray-200 rounded-2xl flex items-center justify-center shadow-modern-lg">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-modern-gray-600 mb-4">5+</div>
                        <div className="text-xl font-semibold text-modern-gray-700">вакансий</div>
                        <div className="text-modern-gray-600 mt-2">ждут вас</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Подписка на рассылку */}
      <section className="py-16 bg-modern-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <SubscribeForm
              title="Не пропустите важные новости!"
              description="Подпишитесь на нашу рассылку и получайте актуальную информацию о новых решениях, акциях и мероприятиях"
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;