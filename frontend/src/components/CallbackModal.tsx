
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { XMarkIcon, PhoneIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useCallbackForm } from '../hooks/useCallbackForm';

// Схема валидации Zod
const callbackSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  phone: z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Неверный формат номера телефона'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо дать согласие на обработку персональных данных',
  }),
});

type CallbackFormInputs = z.infer<typeof callbackSchema>;

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallbackModal: React.FC<CallbackModalProps> = ({ isOpen, onClose }) => {
  const { isSubmitting, submitCallback } = useCallbackForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CallbackFormInputs>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      phone: '+7 ',
      consent: false,
    },
  });

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      reset();
      setValue('phone', '+7 ');
    }
  }, [isOpen, reset, setValue]);

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

  const onSubmit: SubmitHandler<CallbackFormInputs> = async (data) => {
    const success = await submitCallback(data);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-modern-gray-900 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-modern-lg w-full max-w-md m-4 p-8 animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-modern-gray-400 hover:text-modern-gray-600 transition-colors"
          aria-label="Закрыть модальное окно"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-modern-gray-900">Заказать звонок</h2>
          <p className="text-modern-gray-600 mt-2">
            Оставьте ваши данные, и мы свяжемся с вами в ближайшее время.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Поле имени */}
          <div>
            <label htmlFor="name" className="sr-only">Ваше имя</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400" />
              <input
                id="name"
                {...register('name')}
                type="text"
                placeholder="Ваше имя"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200 ${
                  errors.name ? 'border-red-300' : 'border-modern-gray-300'
                }`}
              />
            </div>
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Поле телефона */}
          <div>
            <label htmlFor="phone" className="sr-only">Номер телефона</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400" />
              <input
                id="phone"
                {...register('phone')}
                type="tel"
                placeholder="+7 (___) ___-__-__"
                onInput={handlePhoneInput}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200 ${
                  errors.phone ? 'border-red-300' : 'border-modern-gray-300'
                }`}
              />
            </div>
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          {/* Согласие на обработку данных */}
          <div className="flex items-start space-x-3">
            <input
              id="consent"
              {...register('consent')}
              type="checkbox"
              className={`mt-1 h-4 w-4 text-modern-primary-600 border-modern-gray-300 rounded focus:ring-modern-primary-500 focus:ring-2 ${
                errors.consent ? 'ring-2 ring-red-500' : ''
              }`}
            />
            <label htmlFor="consent" className="text-sm text-modern-gray-600 leading-relaxed">
              Я даю{' '}
              <Link
                to="/personal-data-consent"
                target="_blank"
                className="text-modern-primary-600 hover:text-modern-primary-700 underline"
              >
                согласие
              </Link>
              {' '}на обработку персональных данных.
            </label>
          </div>
           {errors.consent && <p className="text-red-600 text-sm -mt-2">{errors.consent.message}</p>}


          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full group flex items-center justify-center px-8 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-all duration-200 font-semibold shadow-modern-md hover:shadow-modern-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </form>
      </div>
    </div>
  );
};

export default CallbackModal;
