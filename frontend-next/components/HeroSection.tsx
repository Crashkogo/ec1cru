'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, ClockIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UnifiedPost } from '@/types';

// Схема валидации
const callbackSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Неверный формат номера'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо дать согласие',
  }),
});

type CallbackFormInputs = z.infer<typeof callbackSchema>;

interface HeroSectionProps {
  unifiedPosts: UnifiedPost[];
}

export default function HeroSection({ unifiedPosts }: HeroSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.name, phone: data.phone }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit callback');
      }

      alert('С вами свяжется первый освободившийся специалист');
      reset();
      setValue('phone', '+7 ');
    } catch (error) {
      console.error('Error submitting callback form:', error);
      alert('Ошибка при отправке заявки. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-modern-primary-100 via-modern-white to-modern-accent-100 pt-20 pb-16 overflow-hidden">
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

            {/* Статистика в компактном виде - 5 плиток */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/otzyvy"
                className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-modern hover:shadow-modern-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <div className="text-3xl font-bold text-modern-primary-600 mb-2">600+</div>
                <div className="text-sm font-medium text-modern-gray-700">Клиентов с нами</div>
              </Link>
              <Link
                href="/implementation"
                className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-modern hover:shadow-modern-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <div className="text-3xl font-bold text-modern-primary-600 mb-2">50+</div>
                <div className="text-sm font-medium text-modern-gray-700">
                  Внедрений реализовано
                </div>
              </Link>
              <Link
                href="/about"
                className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-modern hover:shadow-modern-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <div className="text-3xl font-bold text-modern-primary-600 mb-2">30</div>
                <div className="text-sm font-medium text-modern-gray-700">Лет на рынке</div>
              </Link>
              <Link
                href="/support"
                className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-modern hover:shadow-modern-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center"
              >
                <Image src="/assets/cs.png" alt="1С" width={64} height={64} className="h-16 w-auto mx-auto" />
              </Link>
              {/* Новый блок IT-аутсорсинг */}
              <Link
                href="/tech-maintenance"
                className="col-span-2 bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-modern hover:shadow-modern-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <div className="text-xl font-bold text-modern-primary-600 mb-2">IT-аутсорсинг</div>
                <div className="text-sm font-medium text-modern-gray-700">
                  Комплексное сопровождение бизнеса в сфере IT
                </div>
              </Link>
            </div>

            {/* Форма обратной связи */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Ваше имя"
                    className={`w-full px-4 py-3 bg-modern-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200 placeholder-modern-gray-400 ${
                      errors.name ? 'border-red-300' : 'border-modern-gray-200'
                    }`}
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    onInput={handlePhoneInput}
                    className={`w-full px-4 py-3 bg-modern-white/80 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200 placeholder-modern-gray-400 ${
                      errors.phone ? 'border-red-300' : 'border-modern-gray-200'
                    }`}
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  {...register('consent')}
                  type="checkbox"
                  id="consent-home"
                  className={`mt-1 h-4 w-4 text-modern-primary-600 border-modern-gray-300 rounded focus:ring-modern-primary-500 focus:ring-2 ${
                    errors.consent ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                <label htmlFor="consent-home" className="text-sm text-modern-gray-600 leading-relaxed">
                  Я даю{' '}
                  <Link
                    href="/personal-data-consent"
                    className="text-modern-primary-600 hover:text-modern-primary-700 underline transition-colors duration-200"
                  >
                    Согласие
                  </Link>{' '}
                  на обработку персональных данных в соответствии с{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-modern-primary-600 hover:text-modern-primary-700 underline transition-colors duration-200"
                  >
                    Политикой Конфиденциальности
                  </Link>
                  .
                </label>
              </div>
              {errors.consent && (
                <p className="text-red-600 text-sm -mt-2">{errors.consent.message}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group px-8 py-4 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-all duration-200 font-semibold shadow-modern-md hover:shadow-modern-lg transform hover:scale-105 disabled:opacity-50"
              >
                <span className="flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      <span>Отправка...</span>
                    </>
                  ) : (
                    <>
                      <PhoneIcon className="h-5 w-5 mr-2" />
                      Получить консультацию
                      <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Правая часть - Единый блок Новости/Акции/Мероприятия */}
          <div className="bg-modern-white/80 backdrop-blur-sm rounded-xl p-6 shadow-modern flex flex-col h-full">
            {/* Заголовки в одну строку */}
            <div className="flex justify-around items-center mb-6 pb-4 border-b border-modern-gray-200">
              <Link
                href="/news"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-110"
              >
                Новости
              </Link>
              <span className="text-modern-gray-300">|</span>
              <Link
                href="/events"
                className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-all duration-200 hover:scale-110"
              >
                Мероприятия
              </Link>
              <span className="text-modern-gray-300">|</span>
              <Link
                href="/promotions"
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-all duration-200 hover:scale-110"
              >
                Акции
              </Link>
              <span className="text-modern-gray-300">|</span>
              <Link
                href="/life"
                className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-all duration-200 hover:scale-110"
              >
                Наша жизнь
              </Link>
            </div>

            {/* Список постов */}
            <div className="space-y-2 flex-1 overflow-hidden">
              {unifiedPosts.length > 0 ? (
                unifiedPosts.slice(0, 7).map((post) => {
                  // Определяем цветовую схему в зависимости от типа
                  const colorClasses = {
                    news: 'bg-blue-50/50 hover:bg-blue-100/50 border-blue-200',
                    event: 'bg-orange-50/50 hover:bg-orange-100/50 border-orange-200',
                    promotion: 'bg-emerald-50/50 hover:bg-emerald-100/50 border-emerald-200',
                    companylife: 'bg-purple-50/50 hover:bg-purple-100/50 border-purple-200',
                  };

                  // Проверяем, закреплён ли пост
                  const isPinned =
                    post.isPinned && post.pinnedUntil && new Date(post.pinnedUntil) >= new Date();

                  return (
                    <Link
                      key={`${post.type}-${post.id}`}
                      href={post.link}
                      className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-200 group ${colorClasses[post.type]}`}
                    >
                      {/* Левая часть: заголовок и дата */}
                      <div className="flex-shrink-0 w-1/3">
                        <div className="flex items-start gap-1 mb-1">
                          {isPinned && (
                            <MapPinIcon className="h-4 w-4 text-modern-primary-600 flex-shrink-0 mt-0.5" />
                          )}
                          <h4 className="font-semibold text-modern-gray-900 text-sm group-hover:text-modern-primary-600 transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h4>
                        </div>
                        <div className="flex items-center text-xs text-modern-gray-500">
                          <ClockIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          {new Date(post.date).toLocaleDateString('ru-RU')}
                        </div>
                      </div>

                      {/* Правая часть: краткое описание */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-modern-gray-600 line-clamp-2">
                          {post.shortDescription}
                        </p>
                      </div>

                      {/* Стрелка */}
                      <ArrowRightIcon className="h-5 w-5 text-modern-gray-400 group-hover:text-modern-primary-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                    </Link>
                  );
                })
              ) : (
                <div className="text-center text-modern-gray-500 text-sm py-8">
                  Посты скоро появятся!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
