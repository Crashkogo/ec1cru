import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Проверяем, давал ли пользователь согласие ранее
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Показываем уведомление с небольшой задержкой для плавности
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('cookieConsent', JSON.stringify({
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        }));
        setIsVisible(false);

        // Здесь можно инициализировать метрики
        initializeAnalytics();
    };

    const handleAcceptNecessary = () => {
        localStorage.setItem('cookieConsent', JSON.stringify({
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        }));
        setIsVisible(false);
    };

    const handleCustomize = () => {
        setShowDetails(!showDetails);
    };

    const initializeAnalytics = () => {
        // Здесь будет инициализация Яндекс.Метрики или Google Analytics
        // Например:
        // if (window.ym) window.ym(COUNTER_ID, 'init');

        // БЕЗОПАСНОСТЬ: Логирование только в режиме разработки
        if (import.meta.env.DEV) {
            console.log('Analytics initialized');
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="bg-white border-t-2 border-modern-primary-500 shadow-2xl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                        {/* Иконка печеньки */}
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.48.41-2.86 1.12-4.06.16.1.34.16.53.16.55 0 1-.45 1-1 0-.17-.04-.33-.12-.47C8.1 4.95 9.96 4 12 4c.55 0 1 .45 1 1s-.45 1-1 1-1 .45-1 1 .45 1 1 1c1.1 0 2-.9 2-2 0-.37-.11-.71-.28-1.01C16.45 5.94 18 8.77 18 12c0 .55.45 1 1 1s1-.45 1-1c0-.17-.03-.33-.08-.49C19.97 11.66 20 11.83 20 12c0 4.41-3.59 8-8 8z"/>
                                    <circle cx="8.5" cy="12.5" r="1.5"/>
                                    <circle cx="15" cy="10" r="1"/>
                                    <circle cx="11" cy="15" r="1"/>
                                    <circle cx="15" cy="15" r="1.5"/>
                                </svg>
                            </div>
                        </div>

                        {/* Контент */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-modern-gray-900 mb-2">
                                Мы используем файлы cookie
                            </h3>
                            <p className="text-modern-gray-600 text-sm leading-relaxed">
                                Наш сайт использует cookie-файлы для улучшения работы сайта и персонализации сервисов.
                                Продолжая использовать наш сайт, вы соглашаетесь с использованием cookie в соответствии с нашей{' '}
                                <a href="/privacy-policy" className="text-modern-primary-600 hover:underline">
                                    Политикой конфиденциальности
                                </a>.
                            </p>

                            {/* Детальные настройки */}
                            {showDetails && (
                                <div className="mt-4 space-y-3 p-4 bg-modern-gray-50 rounded-lg">
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id="necessary"
                                            checked
                                            disabled
                                            className="mt-1 h-4 w-4 text-modern-primary-600 rounded"
                                        />
                                        <label htmlFor="necessary" className="ml-3 text-sm">
                                            <span className="font-medium text-modern-gray-900">Необходимые</span>
                                            <p className="text-modern-gray-600">Требуются для работы сайта (авторизация, корзина)</p>
                                        </label>
                                    </div>
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id="analytics"
                                            defaultChecked
                                            className="mt-1 h-4 w-4 text-modern-primary-600 rounded focus:ring-modern-primary-500"
                                        />
                                        <label htmlFor="analytics" className="ml-3 text-sm">
                                            <span className="font-medium text-modern-gray-900">Аналитические</span>
                                            <p className="text-modern-gray-600">Помогают улучшать сайт (Яндекс.Метрика)</p>
                                        </label>
                                    </div>
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id="marketing"
                                            defaultChecked
                                            className="mt-1 h-4 w-4 text-modern-primary-600 rounded focus:ring-modern-primary-500"
                                        />
                                        <label htmlFor="marketing" className="ml-3 text-sm">
                                            <span className="font-medium text-modern-gray-900">Маркетинговые</span>
                                            <p className="text-modern-gray-600">Для показа релевантной рекламы</p>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Кнопки действий */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0">
                            <button
                                onClick={handleCustomize}
                                className="px-4 py-2 text-modern-gray-700 hover:text-modern-gray-900 font-medium text-sm transition-colors duration-200 whitespace-nowrap"
                            >
                                {showDetails ? 'Скрыть настройки' : 'Настроить'}
                            </button>
                            <button
                                onClick={handleAcceptNecessary}
                                className="px-6 py-2 bg-modern-gray-200 hover:bg-modern-gray-300 text-modern-gray-900 rounded-lg font-medium text-sm transition-colors duration-200 whitespace-nowrap"
                            >
                                Только необходимые
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="px-6 py-2 bg-modern-primary-600 hover:bg-modern-primary-700 text-white rounded-lg font-medium text-sm transition-colors duration-200 whitespace-nowrap shadow-md hover:shadow-lg"
                            >
                                Принять все
                            </button>
                        </div>

                        {/* Кнопка закрытия */}
                        <button
                            onClick={handleAcceptNecessary}
                            className="absolute top-4 right-4 lg:relative lg:top-0 lg:right-0 text-modern-gray-400 hover:text-modern-gray-600 transition-colors duration-200"
                            aria-label="Закрыть"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
