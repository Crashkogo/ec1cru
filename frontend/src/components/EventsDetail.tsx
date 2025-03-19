import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ReCAPTCHA from 'react-google-recaptcha';

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
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  eventLink?: string;
  registrations?: { id: number; name: string; phone: string; email: string; createdAt: string }[];
}

// Схема валидации для формы регистрации
const registrationSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  phone: z.string().min(1, 'Телефон обязателен'),
  email: z.string().email('Неверный формат email').min(1, 'Email обязателен'),
});

type RegistrationFormInputs = z.infer<typeof registrationSchema>;

const EventsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
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

    const token = await executeRecaptcha(); // Получаем токен перед отправкой
    if (!token) {
      alert('Ошибка проверки reCAPTCHA');
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
    }
  };

  const canRegister = event && event.ours && new Date() < new Date(event.startDate);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
          <p className="text-darkBg text-center">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-2/3 mx-auto bg-lightGray rounded-lg shadow-md p-6">
          <p className="text-darkBg text-center">Мероприятие не найдено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-full md:w-2/3 min-h-screen mx-auto bg-lightGray rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-darkBg mb-4">{event.title}</h1>
        <p className="text-gray-500 mb-4">
          Дата начала: {new Date(event.startDate).toLocaleDateString('ru-RU')}{' '}
          {event.status ? '(Прошло)' : '(Предстоящее)'}
        </p>
        <p className="text-gray-700 mb-4">{event.shortDescription}</p>
        <div
          className="event-content prose max-w-none text-gray-800 break-words"
          dangerouslySetInnerHTML={{ __html: event.content }}
        />

        {/* Форма регистрации */}
        {canRegister && !registrationSuccess && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-darkBg mb-4">Регистрация на мероприятие</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Имя</label>
                <input
                  {...register('name')}
                  className="w-full p-2 border rounded"
                  placeholder="Введите ваше имя"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Телефон</label>
                <input
                  {...register('phone')}
                  className="w-full p-2 border rounded"
                  placeholder="Введите ваш телефон"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  {...register('email')}
                  className="w-full p-2 border rounded"
                  placeholder="Введите ваш email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Невидимая reCAPTCHA v3 */}
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                size="invisible" // Делаем капчу невидимой
              />

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
              >
                Зарегистрироваться
              </button>
            </form>
          </div>
        )}

        {canRegister && registrationSuccess && (
          <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-lg">
            Вы успешно зарегистрированы! Подтверждение отправлено на ваш email.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsDetail;