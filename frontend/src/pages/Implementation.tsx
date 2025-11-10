import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallbackForm } from '../hooks/useCallbackForm';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import csImage from '../assets/cs.png';
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

const Implementation: React.FC = () => {
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

  return (
    <>
      <Helmet>
        <title>Внедрение 1С - ООО «Инженер-центр»</title>
        <meta
          name="description"
          content="Профессиональное внедрение программных продуктов 1С. Полный цикл работ от знакомства до сопровождения."
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
                    id="consent-implementation"
                    className={`mt-0.5 h-4 w-4 text-modern-primary-600 border-modern-gray-300 rounded focus:ring-modern-primary-500 flex-shrink-0 ${errors.consent ? 'ring-2 ring-red-500' : ''}`}
                  />
                  <label htmlFor="consent-implementation" className="text-xs text-modern-gray-600 leading-tight">
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

      {/* Блок консультации */}
      <section className="py-16 bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-modern-primary-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-modern-primary-900 mb-4 text-center">
              Нужна консультация по выбору подходящего тарифа?
            </h2>
            <p className="text-modern-primary-700 mb-6 text-center">
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
      </section>
    </>
  );
};

export default Implementation;
