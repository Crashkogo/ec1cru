'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowDownIcon, UserIcon, PhoneIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import WorkflowTimeline from '@/components/WorkflowTimeline';
import ProjectsCarousel from '@/components/ProjectsCarousel';
import { useCallbackForm } from '@/hooks/useCallbackForm';

// Схема валидации для формы доработок
const customizationSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Неверный формат номера телефона'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо дать согласие на обработку персональных данных',
  }),
});

type CustomizationFormInputs = z.infer<typeof customizationSchema>;

const ImplementationPage: React.FC = () => {
  const { isSubmitting, submitCallback } = useCallbackForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CustomizationFormInputs>({
    resolver: zodResolver(customizationSchema),
    defaultValues: {
      phone: '+7 ',
      consent: false,
    },
  });

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');

    if (value.startsWith('7') || value.startsWith('8')) {
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
    setValue('phone', formatted, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<CustomizationFormInputs> = async (data) => {
    await submitCallback(data);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-modern-primary-100 via-modern-white to-modern-accent-100 pt-16 pb-8 overflow-hidden">
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

              <Link href="/support" className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div>
                  <div className="text-2xl font-bold text-modern-primary-600 mb-1">ИТС</div>
                  <div className="text-xs font-medium text-modern-gray-700">
                    Сопровождение 1С<br />Горячая линия
                  </div>
                </div>
                <ArrowRightIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link href="/implementation" className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div>
                  <div className="text-2xl font-bold text-modern-primary-600 mb-1">Внедрение</div>
                  <div className="text-xs font-medium text-modern-gray-700">
                    Автоматизация бизнеса<br />От обследования до запуска
                  </div>
                </div>
                <ArrowRightIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link href="/tech-maintenance" className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div>
                  <div className="text-2xl font-bold text-modern-primary-600 mb-1">IT-Аутсорс</div>
                  <div className="text-xs font-medium text-modern-gray-700">
                    Обслуживание ПК и серверов<br />Торговое оборудование
                  </div>
                </div>
                <ArrowRightIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Правая часть - ~75% ширины с тремя информационными блоками в общей обёртке */}
            <div className="flex-1 bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 shadow-modern">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Блок 1: Автоматизация учета */}
                <div>
                  <h2 className="text-3xl font-bold text-modern-primary-600 mb-4 leading-tight">
                    Автоматизация учета — <br></br>ваше конкурентное преимущество
                  </h2>
                  <p className="text-modern-gray-700 text-base leading-relaxed mb-6">
                    Мы не просто устанавливаем программы. Мы внедряем отлаженную систему, которая объединяет разрозненные отделы, устраняет рутину и дает вам единую, точную картину бизнеса в реальном времени. Это позволяет принимать решения на основе данных, а не догадок.
                  </p>
                  <button
                    onClick={() => {
                      const element = document.getElementById('projects');
                      if (element) {
                        const offset = 100; // Отступ сверху в пикселях
                        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - offset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-all duration-200 font-semibold shadow-modern hover:shadow-modern-lg group"
                  >
                    <span>Наши проекты</span>
                    <ArrowDownIcon className="w-5 h-5 transition-transform duration-200 group-hover:translate-y-1" />
                  </button>
                </div>

                {/* Блок 2: Что мы автоматизируем */}
                <div>
                  <h2 className="text-3xl font-bold text-modern-primary-600 mb-4 leading-tight">
                    Что мы автоматизируем
                  </h2>
                  <div className="space-y-3 text-base text-modern-gray-700">
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
                  <h2 className="text-3xl font-bold text-modern-primary-600 mb-4 leading-tight">
                    Мы обеспечим сквозную автоматизацию для вашей отрасли
                  </h2>
                  <div className="space-y-2 text-base">
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
      <WorkflowTimeline largeFonts={true} />

      {/* Наши проекты - Carousel */}
      <ProjectsCarousel />

      {/* Форма доработок под заказ */}
      <section className="py-12 bg-gradient-to-br from-modern-gray-50 to-modern-primary-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-modern-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                {/* Левая часть - Заголовок и преимущества */}
                <div className="lg:col-span-2 bg-gradient-to-br from-modern-primary-600 to-modern-primary-700 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-4">
                    Доработки под заказ
                  </h2>
                  <p className="text-modern-primary-50 mb-6 leading-relaxed">
                    Нужна уникальная функциональность для вашей 1С? Мы разработаем и внедрим индивидуальные решения, которые полностью соответствуют специфике вашего бизнеса.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold">3+</span>
                      </div>
                      <div>
                        <div className="font-semibold">От 3 дней</div>
                        <div className="text-sm text-modern-primary-100">Срок разработки</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold">100%</span>
                      </div>
                      <div>
                        <div className="font-semibold">Под ваши задачи</div>
                        <div className="text-sm text-modern-primary-100">Индивидуальный подход</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-semibold">Гарантия</div>
                        <div className="text-sm text-modern-primary-100">На все доработки</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Правая часть - Форма */}
                <div className="lg:col-span-3 p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Поле имени */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-modern-gray-900 mb-2">
                          Ваше имя <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400" />
                          <input
                            id="name"
                            {...register('name')}
                            type="text"
                            placeholder="Введите ваше имя"
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-all duration-200 ${errors.name ? 'border-red-300 bg-red-50' : 'border-modern-gray-300'
                              }`}
                          />
                        </div>
                        {errors.name && <p className="text-red-600 text-sm mt-1 ml-1">{errors.name.message}</p>}
                      </div>

                      {/* Поле телефона */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-modern-gray-900 mb-2">
                          Номер телефона <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400" />
                          <input
                            id="phone"
                            {...register('phone')}
                            type="tel"
                            placeholder="+7 (___) ___-__-__"
                            onInput={handlePhoneInput}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-all duration-200 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-modern-gray-300'
                              }`}
                          />
                        </div>
                        {errors.phone && <p className="text-red-600 text-sm mt-1 ml-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    {/* Согласие на обработку данных */}
                    <div className="flex items-start space-x-3 p-3 bg-modern-gray-50 rounded-xl">
                      <input
                        id="consent"
                        {...register('consent')}
                        type="checkbox"
                        className={`mt-0.5 h-4 w-4 text-modern-primary-600 border-modern-gray-300 rounded focus:ring-modern-primary-500 focus:ring-2 cursor-pointer ${errors.consent ? 'ring-2 ring-red-500' : ''
                          }`}
                      />
                      <label htmlFor="consent" className="text-xs text-modern-gray-700 leading-relaxed cursor-pointer">
                        Я даю{' '}
                        <Link
                          href="/personal-data-consent"
                          target="_blank"
                          className="text-modern-primary-600 hover:text-modern-primary-700 underline font-medium"
                        >
                          согласие
                        </Link>
                        {' '}на обработку персональных данных
                      </label>
                    </div>
                    {errors.consent && <p className="text-red-600 text-sm ml-1 -mt-2">{errors.consent.message}</p>}

                    {/* Кнопка отправки */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex items-center justify-center px-8 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-all duration-200 font-semibold shadow-modern hover:shadow-modern-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            <span>Отправка...</span>
                          </>
                        ) : (
                          <>
                            <span>Отправить заявку</span>
                            <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ImplementationPage;
