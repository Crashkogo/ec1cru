'use client';

import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ReCAPTCHA from 'react-google-recaptcha';
import { UserPlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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

interface RegistrationFormProps {
  slug: string;
}

export default function RegistrationForm({ slug }: RegistrationFormProps) {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormInputs>({
    resolver: zodResolver(registrationSchema),
  });

  const executeRecaptcha = async () => {
    if (recaptchaRef.current) {
      const token = await recaptchaRef.current.executeAsync();
      return token;
    }
    return null;
  };

  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (data) => {
    setRegistrationLoading(true);
    const token = await executeRecaptcha();
    if (!token) {
      alert('Ошибка проверки reCAPTCHA');
      setRegistrationLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/events/${slug}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            recaptchaToken: token,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      setRegistrationSuccess(true);
      reset();
      if (recaptchaRef.current) recaptchaRef.current.reset();
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Ошибка при регистрации');
    } finally {
      setRegistrationLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-8 lg:p-12 border-t border-green-200">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-900 mb-2">Регистрация успешна!</h3>
          <p className="text-green-700">
            Мы отправили вам письмо с подтверждением и деталями мероприятия.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-modern-primary-50 to-modern-primary-100 p-8 lg:p-12 border-t border-modern-primary-200">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-modern-primary-900 mb-2">
            Регистрация на мероприятие
          </h3>
          <p className="text-modern-primary-700">Заполните форму ниже, чтобы зарегистрироваться</p>
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
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
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
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-modern-gray-900 mb-2">Email *</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200"
              placeholder="example@domain.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
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

          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              size="invisible"
            />
          )}

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
  );
}
