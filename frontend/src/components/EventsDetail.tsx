import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  ShareIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  LinkIcon,
  BuildingOfficeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { sanitizeHTML } from '../utils/sanitize';

// Замени на свой ключ reCAPTCHA v3 из переменных окружения
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE;

interface Event {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  startDate: string;
  createdAt: string;
  isPublished: boolean;
  status: boolean;
  ours: boolean;
  registrationEnabled: boolean;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  eventLink?: string;
  registrations?: { id: number; name: string; phone: string; email: string; organization: string; privacyConsent: boolean; createdAt: string }[];
}

// Схема валидации для формы регистрации
const registrationSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  phone: z.string().min(1, 'Телефон обязателен'),
  email: z.string().email('Неверный формат email').min(1, 'Email обязателен'),
  organization: z.string().min(1, 'Организация обязательна'),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо согласие на обработку персональных данных',
  }),
});

type RegistrationFormInputs = z.infer<typeof registrationSchema>;

const EventsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null); // Ссылка на reCAPTCHA

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormInputs>({
    resolver: zodResolver(registrationSchema),
  });

  // Загрузка данных мероприятия
  useEffect(() => {
    if (!slug) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/events/${slug}`)
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching event:', error);
        setLoading(false);
      });
  }, [slug]);

  // Выполняем reCAPTCHA перед отправкой формы
  const executeRecaptcha = async () => {
    if (recaptchaRef.current) {
      const token = await recaptchaRef.current.executeAsync(); // Выполняем невидимо
      return token;
    }
    return null;
  };

  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (data) => {
    if (!event) return;

    setRegistrationLoading(true);
    const token = await executeRecaptcha(); // Получаем токен перед отправкой
    if (!token) {
      alert('Ошибка проверки reCAPTCHA');
      setRegistrationLoading(false);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/events/${slug}/register`, {
        ...data,
        recaptchaToken: token, // Отправляем токен напрямую
      });
      setRegistrationSuccess(true);
      reset(); // Очищаем форму
      if (recaptchaRef.current) recaptchaRef.current.reset(); // Сбрасываем reCAPTCHA
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Ошибка при регистрации');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  const canRegister = event && event.registrationEnabled && new Date() < new Date(event.startDate);
  const isPastEvent = event && new Date() > new Date(event.startDate);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Загрузка... - ООО «Инженер-центр»</title>
        </Helmet>
        <div className="min-h-screen bg-modern-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-4/5 mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-modern-gray-300 rounded-lg mb-6"></div>
                <div className="h-4 bg-modern-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-modern-gray-300 rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-modern-gray-300 rounded"></div>
                  <div className="h-4 bg-modern-gray-300 rounded"></div>
                  <div className="h-4 bg-modern-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Helmet>
          <title>Мероприятие не найдено - ООО «Инженер-центр»</title>
        </Helmet>
        <div className="min-h-screen bg-modern-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-4/5 mx-auto text-center">
              <div className="bg-modern-white rounded-xl shadow-modern p-12">
                <h1 className="text-2xl font-bold text-modern-gray-900 mb-4">
                  Мероприятие не найдено
                </h1>
                <p className="text-modern-gray-600 mb-6">
                  Запрашиваемое мероприятие не существует или было удалено
                </p>
                <Link
                  to="/events"
                  className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Вернуться к мероприятиям
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{event.metaTitle || event.title} - ООО «Инженер-центр»</title>
        <meta name="description" content={event.metaDescription || event.shortDescription} />
      </Helmet>

      <div className="min-h-screen bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-4/5 mx-auto">

            {/* Навигация назад */}
            <div className="mb-8">
              <Link
                to="/events"
                className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 font-medium"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Все мероприятия
              </Link>
            </div>

            {/* Основной контент */}
            <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">

              {/* Заголовок */}
              <div className="p-8 lg:p-12 border-b border-modern-gray-200">
                <h1 className="text-3xl lg:text-4xl font-bold text-modern-gray-900 mb-6 leading-tight">
                  {event.title}
                </h1>

                {/* Статусы и мета-информация */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Статус мероприятия */}
                    {isPastEvent ? (
                      <div className="flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-600 rounded-full">
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        <span className="font-medium">Завершено</span>
                      </div>
                    ) : (
                      <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <span className="font-medium">Предстоит</span>
                      </div>
                    )}

                    {/* Тип мероприятия */}
                    <div className={`flex items-center px-4 py-2 rounded-full ${event.ours
                      ? 'bg-modern-primary-100 text-modern-primary-700'
                      : 'bg-modern-accent-100 text-modern-accent-700'
                      }`}>
                      {event.ours ? (
                        <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                      ) : (
                        <AcademicCapIcon className="h-5 w-5 mr-2" />
                      )}
                      <span className="font-medium text-sm">
                        {event.ours ? 'Наше' : 'Внешнее'}
                      </span>
                    </div>

                    {canRegister && (
                      <div className="bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white px-6 py-2 rounded-lg font-medium text-sm">
                        📝 Регистрация открыта
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {event.eventLink && (
                      <a
                        href={event.eventLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-modern-primary-100 text-modern-primary-700 rounded-lg hover:bg-modern-primary-200 transition-colors duration-200 text-sm font-medium"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Внешняя ссылка
                      </a>
                    )}

                    <button
                      onClick={handleShare}
                      className="inline-flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-colors duration-200 text-sm font-medium"
                    >
                      <ShareIcon className="h-4 w-4 mr-2" />
                      Поделиться
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-modern-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-3 text-modern-primary-600" />
                    <div>
                      <div className="text-xs font-medium text-modern-gray-400 uppercase tracking-wider">Дата</div>
                      <div className="text-sm font-medium text-modern-gray-700">
                        {new Date(event.startDate).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-3 text-modern-primary-600" />
                    <div>
                      <div className="text-xs font-medium text-modern-gray-400 uppercase tracking-wider">Время</div>
                      <div className="text-sm font-medium text-modern-gray-700">
                        {new Date(event.startDate).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Содержимое мероприятия */}
              <div className="p-8 lg:p-12">
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:text-modern-gray-900 prose-headings:font-semibold
                    prose-p:text-modern-gray-700 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-modern-primary-600 prose-a:hover:text-modern-primary-700 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-modern-gray-900 prose-strong:font-semibold
                    prose-ul:text-modern-gray-700 prose-ol:text-modern-gray-700
                    prose-li:mb-2 prose-li:leading-relaxed
                    prose-blockquote:border-l-4 prose-blockquote:border-modern-primary-500 prose-blockquote:bg-modern-primary-50 prose-blockquote:rounded-r-lg prose-blockquote:p-6 prose-blockquote:my-6
                    prose-code:bg-modern-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-modern-gray-800
                    prose-pre:bg-modern-gray-900 prose-pre:text-modern-gray-100 prose-pre:rounded-lg prose-pre:p-6
                    prose-img:rounded-lg prose-img:shadow-modern"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(event.content) }}
                />
              </div>

              {/* Форма регистрации */}
              {canRegister && !registrationSuccess && (
                <div className="bg-gradient-to-r from-modern-primary-50 to-modern-primary-100 p-8 lg:p-12 border-t border-modern-primary-200">
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-modern-primary-900 mb-2">
                        Регистрация на мероприятие
                      </h3>
                      <p className="text-modern-primary-700">
                        Заполните форму ниже, чтобы зарегистрироваться
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-modern-gray-900 mb-2">
                          Ваше имя *
                        </label>
                        <input
                          {...register('name')}
                          className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                          placeholder="Введите ваше имя"
                        />
                        {errors.name && (
                          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-modern-gray-900 mb-2">
                          Телефон *
                        </label>
                        <input
                          {...register('phone')}
                          className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                          placeholder="+7 (___) ___-__-__"
                        />
                        {errors.phone && (
                          <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-modern-gray-900 mb-2">
                          Email *
                        </label>
                        <input
                          {...register('email')}
                          className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                          placeholder="example@domain.com"
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-modern-gray-900 mb-2">
                          Организация *
                        </label>
                        <input
                          {...register('organization')}
                          className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
                          placeholder="Название вашей организации"
                        />
                        {errors.organization && (
                          <p className="text-red-600 text-sm mt-1">{errors.organization.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-start cursor-pointer">
                          <input
                            type="checkbox"
                            {...register('privacyConsent')}
                            className="mt-1 mr-3 h-5 w-5 text-modern-primary-600 border-modern-gray-300 rounded focus:ring-2 focus:ring-modern-primary-500"
                          />
                          <span className="text-sm text-modern-gray-700">
                            Я согласен на обработку персональных данных *
                          </span>
                        </label>
                        {errors.privacyConsent && (
                          <p className="text-red-600 text-sm mt-1">{errors.privacyConsent.message}</p>
                        )}
                      </div>

                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        size="invisible"
                      />

                      <button
                        type="submit"
                        disabled={registrationLoading}
                        className="w-full flex items-center justify-center px-6 py-4 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {registrationLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Регистрируем...
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="h-5 w-5 mr-2" />
                            Зарегистрироваться
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Успешная регистрация */}
              {canRegister && registrationSuccess && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-8 lg:p-12 border-t border-green-200">
                  <div className="text-center">
                    <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-900 mb-2">
                      Регистрация успешна!
                    </h3>
                    <p className="text-green-700 text-lg">
                      Подтверждение отправлено на ваш email. Увидимся на мероприятии!
                    </p>
                  </div>
                </div>
              )}
            </article>

            {/* Навигация внизу */}
            <div className="mt-12 text-center">
              <Link
                to="/events"
                className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Вернуться к мероприятиям
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsDetail;