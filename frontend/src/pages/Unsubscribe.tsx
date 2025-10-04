import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@mui/material';
import axios from 'axios';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

const Unsubscribe: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading');
    const [message, setMessage] = useState('');

    const token = searchParams.get('token');
    const subscriber = searchParams.get('subscriber');

    useEffect(() => {
        if (!token || !subscriber) {
            setStatus('error');
            setMessage('Недействительная ссылка для отписки');
            return;
        }

        const unsubscribe = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/posts/unsubscribe?token=${token}&subscriber=${subscriber}`
                );

                setStatus('success');
                setMessage('Вы успешно отписались от рассылки');
            } catch (error: any) {
                if (error.response?.status === 400 && error.response?.data?.message?.includes('Already unsubscribed')) {
                    setStatus('already');
                    setMessage('Вы уже отписались от рассылки ранее');
                } else {
                    setStatus('error');
                    setMessage('Произошла ошибка при отписке. Попробуйте позже или свяжитесь с нами.');
                }
            }
        };

        unsubscribe();
    }, [token, subscriber]);

    const getIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />;
            case 'already':
                return <EnvelopeIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />;
            case 'error':
                return <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />;
            default:
                return (
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-modern-primary-600 mx-auto mb-4"></div>
                );
        }
    };

    const getTitle = () => {
        switch (status) {
            case 'success':
                return 'Отписка выполнена';
            case 'already':
                return 'Уже отписаны';
            case 'error':
                return 'Ошибка отписки';
            default:
                return 'Выполняется отписка...';
        }
    };

    const getDescription = () => {
        switch (status) {
            case 'success':
                return 'Мы сожалеем, что вы покидаете нас. Если передумаете, вы всегда можете подписаться заново на нашем сайте.';
            case 'already':
                return 'Ваш email уже был удален из списка рассылки ранее.';
            case 'error':
                return 'Если проблема повторится, обратитесь к нам по email: mail@ec-1c.ru';
            default:
                return 'Пожалуйста, подождите...';
        }
    };

    return (
        <>
            <Helmet>
                <title>Отписка от рассылки - ООО «Инженер-центр»</title>
                <meta name="description" content="Отписка от email-рассылки ООО «Инженер-центр»" />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="min-h-screen bg-modern-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <Card className="!shadow-lg !border-0 !rounded-2xl p-8">
                        <div className="text-center">
                            {getIcon()}

                            <h1 className="text-2xl font-bold text-modern-gray-900 mb-3">
                                {getTitle()}
                            </h1>

                            <p className="text-modern-gray-600 mb-6">
                                {message}
                            </p>

                            <p className="text-sm text-modern-gray-500 mb-6">
                                {getDescription()}
                            </p>

                            {(status === 'success' || status === 'already') && (
                                <div className="bg-modern-gray-50 rounded-lg p-4 mb-6">
                                    <h3 className="text-sm font-medium text-modern-gray-900 mb-2">
                                        Хотите быть в курсе наших новостей?
                                    </h3>
                                    <p className="text-sm text-modern-gray-600 mb-3">
                                        Следите за нами в социальных сетях или посещайте наш сайт
                                    </p>
                                    <div className="flex justify-center space-x-4">
                                        <a
                                            href="/"
                                            className="text-modern-primary-600 hover:text-modern-primary-700 text-sm font-medium"
                                        >
                                            Главная страница
                                        </a>
                                        <a
                                            href="/news"
                                            className="text-modern-primary-600 hover:text-modern-primary-700 text-sm font-medium"
                                        >
                                            Новости
                                        </a>
                                    </div>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="bg-red-50 rounded-lg p-4 mb-6">
                                    <h3 className="text-sm font-medium text-red-900 mb-2">
                                        Нужна помощь?
                                    </h3>
                                    <p className="text-sm text-red-700">
                                        Свяжитесь с нами:
                                    </p>
                                    <div className="mt-2">
                                        <a
                                            href="mailto:mail@ec-1c.ru"
                                            className="text-red-700 hover:text-red-800 text-sm font-medium"
                                        >
                                            mail@ec-1c.ru
                                        </a>
                                        <span className="mx-2 text-red-700">|</span>
                                        <a
                                            href="tel:+78443300801"
                                            className="text-red-700 hover:text-red-800 text-sm font-medium"
                                        >
                                            +7 (8443) 300-801
                                        </a>
                                    </div>
                                </div>
                            )}

                            <footer className="text-xs text-modern-gray-400 border-t border-modern-gray-200 pt-4">
                                © 2024 ООО «Инженер-центр». Все права защищены.
                            </footer>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Unsubscribe; 