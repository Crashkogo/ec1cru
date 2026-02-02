'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import CallbackModal from '@/components/layout/CallbackModal';

/**
 * Интерфейс для отзыва клиента
 */
interface Testimonial {
  id: number;
  companyName: string;
  content: string;
  slug: string;
  avatar?: string;
}

/**
 * Компонент отдельной карточки отзыва
 * Отображает цитату, имя компании и аватар (опционально)
 */
interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const sanitizeText = (text: string) => text.replace(/<[^>]*>/g, '');

  return (
    <div
      className="flex-shrink-0 w-[400px] mx-4 bg-white rounded-xl shadow-modern hover:shadow-modern-lg transition-shadow duration-300 p-6 border border-modern-gray-200 flex flex-col"
      role="article"
      aria-label={`Отзыв от ${testimonial.companyName}`}
    >
      {/* Иконка кавычек */}
      <div className="mb-4">
        <svg
          className="w-10 h-10 text-modern-primary-600 opacity-20"
          fill="currentColor"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </div>

      {/* Текст отзыва - показываем только первые 250 символов */}
      <div className="text-modern-gray-700 mb-6 line-clamp-6 leading-relaxed text-sm flex-grow">
        {sanitizeText(testimonial.content).substring(0, 250)}...
      </div>

      {/* Информация о компании */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Аватар или placeholder */}
          <div className="flex-shrink-0 mr-4">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={`Логотип ${testimonial.companyName}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-modern-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-modern-primary-100 to-modern-primary-200 flex items-center justify-center border-2 border-modern-primary-300">
                <span className="text-modern-primary-700 font-semibold text-lg">
                  {testimonial.companyName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Имя и должность */}
          <div>
            <h4 className="font-semibold text-modern-gray-900 text-base">
              {testimonial.companyName}
            </h4>
            <p className="text-modern-gray-500 text-sm">Клиент</p>
          </div>
        </div>
      </div>

      {/* Кнопка "Полный отзыв" */}
      <div className="mt-4 pt-4 border-t border-modern-gray-200">
        <Link
          href={`/otzyvy/${testimonial.slug}`}
          className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 text-sm font-medium group"
        >
          Полный отзыв
          <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
};

/**
 * Главный компонент страницы отзывов
 * Бесконечная горизонтальная прокрутка карточек с паузой при наведении
 */
export default function TestimonialsPage() {
  // Состояние для отзывов с бэкенда
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);

  // Управление анимацией
  const controls = useAnimationControls();
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);

  // Статичные отзывы для fallback - используем useMemo для оптимизации
  const staticTestimonials: Testimonial[] = useMemo(
    () => [
      {
        id: 1,
        companyName: 'ООО "Сибирский торговый дом"',
        slug: 'ooo-sibirskii-torgovyi-dom',
        content:
          'Сотрудничаем с компанией Инженер-центр уже более 5 лет. За это время наша компания значительно автоматизировала бизнес-процессы благодаря внедрению решений на базе 1С. Особенно хочется отметить профессионализм специалистов технической поддержки.',
      },
      {
        id: 2,
        companyName: 'ЗАО "Волгоградский металлургический завод"',
        slug: 'zao-volgogradskii-metallurgicheskii-zavod',
        content:
          'Выражаем благодарность команде Инженер-центр за качественное внедрение системы управления производством на нашем предприятии. Проект был реализован точно в срок, несмотря на сложность производственных процессов.',
      },
      {
        id: 3,
        companyName: 'ИП Морозов А.В.',
        slug: 'ip-morozov-a-v',
        content:
          'Как индивидуальный предприниматель, я долго искал надежного партнера для ведения бухгалтерии. Обратился в Инженер-центр по рекомендации коллег - и не пожалел! Установили 1С:Бухгалтерию, провели обучение.',
      },
      {
        id: 4,
        companyName: 'ООО "Строительная компания Альфа"',
        slug: 'ooo-stroitelnaia-kompaniia-alfa',
        content:
          'Сотрудничаем с Инженер-центр с момента основания нашей строительной компании. За 7 лет совместной работы внедрили несколько конфигураций 1С, настроили интеграции, автоматизировали документооборот.',
      },
      {
        id: 5,
        companyName: 'АО "Южные молочные продукты"',
        slug: 'ao-iuzhnye-molochnye-produkty',
        content:
          'Наше молочное производство требовало современной системы учета с учетом специфики пищевой промышленности. Инженер-центр предложили и внедрили комплексное решение на базе 1С:Управление производственным предприятием.',
      },
      {
        id: 6,
        companyName: 'ООО "ТехноПром"',
        slug: 'ooo-tekhnoprom',
        content:
          'Благодарим за оперативную техническую поддержку и качественное обслуживание наших систем 1С. Все вопросы решаются быстро и профессионально. IT-аутсорсинг от Инженер-центр позволяет нам сосредоточиться на основном бизнесе.',
      },
      {
        id: 7,
        companyName: 'ЗАО "Продторг-Юг"',
        slug: 'zao-prodtorg-iug',
        content:
          'Отличная команда специалистов! Помогли настроить интеграцию между 1С и нашим интернет-магазином. Теперь все заказы автоматически попадают в учетную систему, что значительно экономит время и исключает ошибки.',
      },
      {
        id: 8,
        companyName: 'ООО "МедСнаб"',
        slug: 'ooo-medsnab',
        content:
          'Внедрили 1С:Управление торговлей с учетом специфики медицинского оборудования. Особенно ценим индивидуальный подход и готовность специалистов Инженер-центр разобраться во всех нюансах нашего бизнеса.',
      },
    ],
    []
  );

  /**
   * Загрузка отзывов с бэкенда при монтировании компонента
   * Если запрос не удался - используем статичные данные
   */
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/testimonials`);

        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          // Если с бэкенда ничего не пришло, используем статичные
          setTestimonials(staticTestimonials);
        }
      } catch (error) {
        console.warn(
          'Не удалось загрузить отзывы с сервера, используем статичные данные:',
          error
        );
        setTestimonials(staticTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [staticTestimonials]);

  // Дублируем массив отзывов для бесшовной бесконечной прокрутки
  const duplicatedTestimonials = useMemo(
    () => [...testimonials, ...testimonials],
    [testimonials]
  );

  /**
   * Расчёт длительности анимации и расстояния
   */
  const animationDuration = testimonials.length * 8; // 8 секунд на карточку
  const cardWidth = 432; // 400px + 32px margin (16px * 2)
  const totalDistance = testimonials.length * cardWidth;

  /**
   * Запуск анимации при загрузке данных
   */
  useEffect(() => {
    if (testimonials.length > 0) {
      startTimeRef.current = Date.now();

      controls.start({
        x: -totalDistance,
        transition: {
          duration: animationDuration,
          ease: 'linear',
          repeat: Infinity,
        },
      });
    }
  }, [testimonials.length, totalDistance, animationDuration, controls]);

  /**
   * Обработка паузы и возобновления анимации
   */
  const handleMouseEnter = () => {
    elapsedTimeRef.current = Date.now() - startTimeRef.current;
    controls.stop();
  };

  const handleMouseLeave = () => {
    const elapsedSeconds = elapsedTimeRef.current / 1000;
    const progress = (elapsedSeconds % animationDuration) / animationDuration;

    startTimeRef.current = Date.now() - (elapsedTimeRef.current % (animationDuration * 1000));

    controls.start({
      x: -totalDistance,
      transition: {
        duration: animationDuration * (1 - progress),
        ease: 'linear',
        repeat: Infinity,
        repeatDelay: 0,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-modern-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-modern-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-modern-gray-600">Загрузка отзывов...</p>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="min-h-screen bg-modern-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-modern-gray-600">Отзывы пока не добавлены</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-modern-gray-50">
      {/* Заголовок секции */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-modern-gray-900 mb-4">Отзывы наших клиентов</h1>
          <p className="text-lg text-modern-gray-600 max-w-3xl mx-auto">
            Мы гордимся доверием наших клиентов и результатами совместной работы. Более 30 лет
            помогаем компаниям автоматизировать бизнес-процессы на базе 1С.
          </p>
        </div>

        {/* Контейнер для бесконечной прокрутки */}
        <div
          className="relative overflow-hidden py-8"
          role="region"
          aria-label="Карусель отзывов клиентов"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Градиентные маски по краям для плавного fade эффекта */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-modern-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-modern-gray-50 to-transparent z-10 pointer-events-none" />

          {/* Бесконечно движущаяся полоса карточек */}
          <motion.div className="flex" animate={controls} initial={{ x: 0 }}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>

        {/* Призыв к действию */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl shadow-modern p-8 max-w-2xl mx-auto border border-modern-gray-200">
            <h2 className="text-2xl font-bold text-modern-gray-900 mb-4">Станьте нашим клиентом</h2>
            <p className="text-modern-gray-600 mb-6">
              Присоединяйтесь к компаниям, которые доверяют нам автоматизацию своего бизнеса
            </p>
            <button
              onClick={() => setIsCallbackModalOpen(true)}
              className="inline-flex items-center justify-center px-8 py-4 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Заказать звонок
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно для заказа звонка */}
      <CallbackModal isOpen={isCallbackModalOpen} onClose={() => setIsCallbackModalOpen(false)} />
    </div>
  );
}
