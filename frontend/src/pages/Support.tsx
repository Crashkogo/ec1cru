import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

// Определяем тип для вкладок
interface Tab {
    id: string;
    label: string;
    content: string;
}

// Данные для вкладок
const tabs: Tab[] = [
    {
        id: 'tariffs',
        label: 'Тарифные планы',
        content:
            'Мы предлагаем гибкие тарифы для сопровождения 1С. Выберите оптимальный план для вашего бизнеса. Свяжитесь с нами для консультации.',
    },
    {
        id: 'consultation-regulations',
        label: 'Регламент линии консультации',
        content:
            'Наша линия консультации работает круглосуточно. Специалисты оперативно решают ваши вопросы. Ознакомьтесь с регламентом обслуживания.',
    },
    {
        id: 'support-conditions',
        label: 'Типовые условия сопровождения',
        content:
            'Гарантируем качественное сопровождение программ 1С. Условия включают регулярные обновления и техподдержку. Подробности доступны по запросу.',
    },
];

const Support: React.FC = () => {
    // Состояние для активной вкладки (по умолчанию — первая, "Тарифные планы")
    const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

    return (
        <>
            {/* SEO-оптимизация */}
            <Helmet>
                <title>Поддержка и сопровождение - ООО «Инженер-центр»</title>
                <meta
                    name="description"
                    content="Ознакомьтесь с тарифными планами, регламентом линии консультации и типовыми условиями сопровождения программ 1С."
                />
            </Helmet>

            {/* Основной контейнер */}
            <div className="min-h-screen bg-modern-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Заголовок */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-modern-gray-900">
                            Поддержка и сопровождение
                        </h1>
                    </div>

                    {/* Кнопки вкладок */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-modern-primary-600 text-white shadow-modern-md'
                                        : 'bg-modern-white text-modern-gray-700 hover:bg-modern-gray-100 border border-modern-gray-200'
                                    }`}
                                aria-selected={activeTab === tab.id}
                                role="tab"
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Контент активной вкладки */}
                    <div className="bg-modern-white rounded-xl shadow-modern p-8 mx-auto">
                        <div className="text-modern-gray-600 text-lg leading-relaxed">
                            {tabs.find((tab) => tab.id === activeTab)?.content}
                        </div>
                    </div>
                    {/* Дополнительная информация */}
                    <div className="mt-16 text-center">
                        <div className="bg-modern-primary-50 rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-modern-primary-900 mb-4">
                                Нужна консультация по выбору подходящего тарифа?
                            </h2>
                            <p className="text-modern-primary-700 mb-6">
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
                </div>
            </div>
        </>
    );
};

export default Support;