import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallbackForm } from '../hooks/useCallbackForm';
import {
  ArrowRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import csImage from '../assets/cs.png';
import { usePreloadOnHover, preloadOnIdle } from '../utils/preloadRoutes';
import SubscribeForm from '../components/SubscribeForm';
import WorkflowTimeline from '../components/WorkflowTimeline';

// Схема валидации Zod
const callbackSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Неверный формат номера'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо дать согласие',
  }),
});

type CallbackFormInputs = z.infer<typeof callbackSchema>;

// Типы данных
interface Program {
  id: number;
  shortName: string;
}

interface ReadySolutionItem {
  slug: string;
  title: string;
  shortDescription: string;
  type: string;
  price: number | null;
  freshSupport: boolean;
  programs: { program: Program }[];
}

const Home: React.FC = () => {
  const [solutions, setSolutions] = useState<ReadySolutionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAboutTab, setActiveAboutTab] = useState('history');
  const { handleMouseEnter } = usePreloadOnHover();

  const { isSubmitting, submitCallback } = useCallbackForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CallbackFormInputs>({
    resolver: zodResolver(callbackSchema),
    defaultValues: { phone: '+7 ', consent: false },
  });

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    if (value.startsWith('7') || value.startsWith('8')) value = value.substring(1);
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
    setValue('phone', formatted, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<CallbackFormInputs> = async (data) => {
    const success = await submitCallback(data);
    if (success) {
      reset();
      setValue('phone', '+7 ');
    }
  };

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const solutionsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/ready-solutions?limit=4`);
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
          content="Профессиональные услуги 1С: внедрение, сопровождение, техподдержка, обучение, IT-аутсорсинг. 30 лет опыта, 600+ довольных клиентов."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-modern-primary-100 via-modern-white to-modern-accent-100 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.03) 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Левая колонка - ~25% ширины с плитками и формой */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
              {/* Статистические плитки вертикально */}
              <div className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div>
                  <div className="text-2xl font-bold text-modern-primary-600 mb-1">600+</div>
                  <div className="text-xs font-medium text-modern-gray-700">Клиентов с нами</div>
                </div>
                <ChevronDownIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:scale-125" />
              </div>

              <div className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div>
                  <div className="text-2xl font-bold text-modern-primary-600 mb-1">50+</div>
                  <div className="text-xs font-medium text-modern-gray-700">Внедрений реализовано</div>
                </div>
                <ChevronDownIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:scale-125" />
              </div>

              <div className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div>
                  <div className="text-2xl font-bold text-modern-primary-600 mb-1">30</div>
                  <div className="text-xs font-medium text-modern-gray-700">Лет на рынке</div>
                </div>
                <ChevronDownIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:scale-125" />
              </div>

              <div className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div className="flex-1 flex justify-center">
                  <img src={csImage} alt="1С" className="h-12 w-auto" />
                </div>
                <ChevronDownIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:scale-125" />
              </div>

              <div className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div>
                  <div className="text-base font-bold text-modern-primary-600 mb-1">IT-аутсорсинг</div>
                  <div className="text-xs font-medium text-modern-gray-700">Комплексное сопровождение</div>
                </div>
                <ChevronDownIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:scale-125" />
              </div>

              {/* Форма обратной связи - вертикальная */}
              <form onSubmit={handleSubmit(onSubmit)} className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern space-y-3">
                <div>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Ваше имя"
                    className={`w-full px-3 py-2 bg-modern-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200 placeholder-modern-gray-400 text-sm ${errors.name ? 'border-red-300' : 'border-modern-gray-200'}`}
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    onInput={handlePhoneInput}
                    className={`w-full px-3 py-2 bg-modern-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200 placeholder-modern-gray-400 text-sm ${errors.phone ? 'border-red-300' : 'border-modern-gray-200'}`}
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    {...register('consent')}
                    type="checkbox"
                    id="consent-home"
                    className={`mt-0.5 h-4 w-4 text-modern-primary-600 border-modern-gray-300 rounded focus:ring-modern-primary-500 flex-shrink-0 ${errors.consent ? 'ring-2 ring-red-500' : ''}`}
                  />
                  <label htmlFor="consent-home" className="text-xs text-modern-gray-600 leading-tight">
                    Я даю{' '}
                    <Link
                      to="/personal-data-consent"
                      className="text-modern-primary-600 hover:text-modern-primary-700 underline transition-colors duration-200"
                    >
                      Согласие
                    </Link>
                    {' '}на обработку персональных данных
                  </label>
                </div>
                {errors.consent && <p className="text-red-600 text-xs">{errors.consent.message}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-modern-primary-600 text-white rounded-lg hover:bg-modern-primary-700 transition-all duration-200 font-semibold text-sm shadow-modern hover:shadow-modern-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Отправка...</span>
                    </span>
                  ) : (
                    'Получить консультацию'
                  )}
                </button>
              </form>
            </div>

            {/* Правая часть - ~75% ширины с тремя информационными блоками в общей обёртке */}
            <div className="flex-1 bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 shadow-modern">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Блок 1: Автоматизация учета */}
                <div>
                  <h2 className="text-2xl font-bold text-modern-primary-600 mb-4 leading-tight">
                    Автоматизация учета — ваше конкурентное преимущество
                  </h2>
                  <p className="text-modern-gray-700 text-sm leading-relaxed">
                    Мы не просто устанавливаем программы. Мы внедряем отлаженную систему, которая объединяет разрозненные отделы, устраняет рутину и дает вам единую, точную картину бизнеса в реальном времени. Это позволяет принимать решения на основе данных, а не догадок.
                  </p>
                </div>

                {/* Блок 2: Что мы автоматизируем */}
                <div>
                  <h2 className="text-2xl font-bold text-modern-primary-600 mb-4 leading-tight">
                    Что мы автоматизируем
                  </h2>
                  <div className="space-y-3 text-sm text-modern-gray-700">
                    <div>
                      <div className="font-semibold text-modern-gray-900 mb-1">Финансы:</div>
                      <p className="leading-relaxed">Управленческий учет, расчет себестоимости, казначейство</p>
                    </div>
                    <div>
                      <div className="font-semibold text-modern-gray-900 mb-1">Продажи и CRM:</div>
                      <p className="leading-relaxed">От первого контакта до отгрузки и анализа эффективности менеджеров</p>
                    </div>
                    <div>
                      <div className="font-semibold text-modern-gray-900 mb-1">Склад и логистика:</div>
                      <p className="leading-relaxed">Учет остатков, оптимизация запасов, маршрутизация</p>
                    </div>
                    <div>
                      <div className="font-semibold text-modern-gray-900 mb-1">Производство:</div>
                      <p className="leading-relaxed">Планирование, контроль операций, расчет норм расхода</p>
                    </div>
                    <div>
                      <div className="font-semibold text-modern-gray-900 mb-1">Закупки:</div>
                      <p className="leading-relaxed">Контроль закупочных цен, планирование поставок</p>
                    </div>
                    <div>
                      <div className="font-semibold text-modern-gray-900 mb-1">Персонал и кадровый учет:</div>
                      <p className="leading-relaxed">Расчет заработной платы, управление отпусками и больничными, кадровое делопроизводство</p>
                    </div>
                  </div>
                </div>

                {/* Блок 3: Отрасли */}
                <div>
                  <h2 className="text-2xl font-bold text-modern-primary-600 mb-4 leading-tight">
                    Мы обеспечим сквозную автоматизацию для вашей отрасли
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="py-2 px-3 bg-modern-primary-50 rounded-lg font-medium text-modern-gray-900 hover:bg-modern-primary-100 transition-colors duration-200 cursor-pointer">
                      Производство
                    </div>
                    <div className="py-2 px-3 bg-modern-primary-50 rounded-lg font-medium text-modern-gray-900 hover:bg-modern-primary-100 transition-colors duration-200 cursor-pointer">
                      Розничная торговля
                    </div>
                    <div className="py-2 px-3 bg-modern-primary-50 rounded-lg font-medium text-modern-gray-900 hover:bg-modern-primary-100 transition-colors duration-200 cursor-pointer">
                      Оптовая торговля
                    </div>
                    <div className="py-2 px-3 bg-modern-primary-50 rounded-lg font-medium text-modern-gray-900 hover:bg-modern-primary-100 transition-colors duration-200 cursor-pointer">
                      Сельское хозяйство
                    </div>
                    <div className="py-2 px-3 bg-modern-primary-50 rounded-lg font-medium text-modern-gray-900 hover:bg-modern-primary-100 transition-colors duration-200 cursor-pointer">
                      Общепит
                    </div>
                    <div className="py-2 px-3 bg-modern-primary-50 rounded-lg font-medium text-modern-gray-900 hover:bg-modern-primary-100 transition-colors duration-200 cursor-pointer">
                      ЖКХ
                    </div>
                    <div className="py-2 px-3 bg-modern-primary-50 rounded-lg font-medium text-modern-gray-900 hover:bg-modern-primary-100 transition-colors duration-200 cursor-pointer">
                      Услуги
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Как мы работаем - Workflow Timeline */}
      <WorkflowTimeline />

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
                        {solution.price !== null && solution.price !== undefined
                          ? `${solution.price.toLocaleString('ru-RU')} ₽`
                          : 'Цена по запросу'}
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