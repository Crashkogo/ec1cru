import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

// Схема валидации
const subscribeSchema = z.object({
    email: z.string()
        .min(1, 'Email обязателен')
        .email('Неверный формат email'),
});

type SubscribeFormInputs = z.infer<typeof subscribeSchema>;

interface SubscribeFormProps {
    className?: string;
    title?: string;
    description?: string;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({
    className = '',
    title = 'Подпишитесь на рассылку',
    description = 'Получайте актуальную информацию о новостях, акциях и мероприятиях'
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<SubscribeFormInputs>({
        resolver: zodResolver(subscribeSchema),
    });

    const onSubmit: SubmitHandler<SubscribeFormInputs> = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/posts/subscribers`,
                data
            );

            setSubmitStatus('success');
            reset();

            // Автоматически скрываем сообщение об успехе через 5 секунд
            setTimeout(() => {
                setSubmitStatus('idle');
            }, 5000);

        } catch (error: any) {
            console.error('Subscription error:', error);
            setSubmitStatus('error');

            if (error.response?.data?.message) {
                switch (error.response.data.message) {
                    case 'Email already subscribed':
                        setErrorMessage('Этот email уже подписан на рассылку');
                        break;
                    case 'Invalid email format':
                        setErrorMessage('Неверный формат email адреса');
                        break;
                    default:
                        setErrorMessage(error.response.data.message);
                }
            } else {
                setErrorMessage('Произошла ошибка при подписке. Попробуйте позже.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`bg-modern-white rounded-xl shadow-modern p-6 ${className}`}>
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-modern-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-modern-gray-600">
                    {description}
                </p>
            </div>

            {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">
                            Спасибо! Вы успешно подписались на рассылку
                        </span>
                    </div>
                </div>
            )}

            {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-red-800 font-medium">
                            {errorMessage}
                        </span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400" />
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="example@domain.com"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-modern-primary-500 transition-colors duration-200 ${errors.email
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-modern-gray-300'
                                }`}
                            disabled={isSubmitting}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="w-full flex items-center justify-center px-6 py-3 bg-modern-primary-600 text-white rounded-lg hover:bg-modern-primary-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Подписываем...
                        </>
                    ) : submitStatus === 'success' ? (
                        <>
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            Подписка оформлена
                        </>
                    ) : (
                        <>
                            <EnvelopeIcon className="h-5 w-5 mr-2" />
                            Подписаться
                        </>
                    )}
                </button>

                <p className="text-xs text-modern-gray-500 text-center leading-relaxed">
                    Подписываясь, вы соглашаетесь с{' '}
                    <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-modern-primary-600 hover:text-modern-primary-700 underline"
                    >
                        политикой конфиденциальности
                    </a>
                    {' '}и можете отписаться в любое время.
                </p>
            </form>
        </div>
    );
};

export default SubscribeForm; 