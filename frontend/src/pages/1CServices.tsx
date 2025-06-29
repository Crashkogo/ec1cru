import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

// Типы для сервисов
interface Service {
    id: string;
    title: string;
    description: string;
    category: string;
    url: string;
    iconId: string;
}

// Данные сервисов (извлечены из HTML)
const services: Service[] = [
    {
        id: '1c-edi',
        title: '1С:EDI',
        description: 'EDI-обмен с торговыми партнерами, автоматизация цепочек заказов и поставок продукции',
        category: 'business',
        url: 'https://portal.1c.ru/applications/1C-EDI',
        iconId: '1C-EDI'
    },
    {
        id: '1c-share',
        title: '1С:Share',
        description: 'Простой и быстрый способ отправить контрагенту документ из программы 1С.',
        category: 'business',
        url: 'https://portal.1c.ru/applications/1C-Share',
        iconId: '1C-Share'
    },
    {
        id: '1c-administrator',
        title: '1С-Администратор',
        description: 'Доступ к каталогу отчетов и обработок сообщества Инфостарт для эффективной работы ИТ-специалистов компаний',
        category: 'support',
        url: 'https://portal.1c.ru/applications/1C-Administrator',
        iconId: '1C-Administrator'
    },
    {
        id: '1c-business-training',
        title: '1С:Бизнес-обучение',
        description: 'Веб-платформа для дистанционного обучения генеральных директоров и топ-менеджеров',
        category: 'business',
        url: 'https://portal.1c.ru/applications/1C-Business-Training',
        iconId: '1C-Business-Training'
    },
    {
        id: '1c-its',
        title: 'Информационная система 1С:ИТС',
        description: 'Консультации по законодательству, методики и инструкции по работе с программами «1С:Предприятия» (its.1c.ru)',
        category: 'support',
        url: 'https://portal.1c.ru/applications/1C-ITS',
        iconId: '1C-ITS'
    },
    {
        id: '1c-ess',
        title: '1С:Кабинет сотрудника',
        description: 'Обмен кадровыми документами с помощью технологии кадрового электронного документооборота',
        category: 'business',
        url: 'https://portal.1c.ru/applications/1C-ESS',
        iconId: '1C-ESS'
    },
    {
        id: '1c-counteragent',
        title: '1С:Контрагент',
        description: 'Автоматическое заполнение реквизитов контрагента по ИНН или наименованию',
        category: 'accounting',
        url: 'https://portal.1c.ru/applications/1C-Counteragent',
        iconId: '1C-Counteragent'
    },
    {
        id: '1c-credit',
        title: '1С:Кредит',
        description: 'Поиск кредитных предложений в программах 1С и автоматическое формирование заявки и пакета документов',
        category: 'business',
        url: 'https://portal.1c.ru/applications/1C-Credit',
        iconId: '1C-Credit'
    },
    {
        id: '1c-marking',
        title: '1С:Маркировка',
        description: 'Комплексные решения для маркировки от фирмы «1С» и сертифицированных партнеров',
        category: 'retail',
        url: 'https://portal.1c.ru/applications/1C-Marking',
        iconId: '1C-Marking'
    },
    {
        id: '1c-nomenclature',
        title: '1С:Номенклатура',
        description: 'Единый каталог описаний товаров в "1С:Предприятии 8"',
        category: 'business',
        url: 'https://portal.1c.ru/applications/1C-Nomenclature',
        iconId: '1C-Nomenclature'
    },
    {
        id: '1c-ofd',
        title: '1С-ОФД',
        description: 'Подключение к ОФД и передача фискальных данных в ФНС и ЦРПТ (Маркировка)',
        category: 'retail',
        url: 'https://portal.1c.ru/applications/1C-OFD',
        iconId: '1C-OFD'
    },
    {
        id: '1c-reporting',
        title: '1С-Отчетность',
        description: 'Подготовка и сдача регламентированной отчетности из программ 1С',
        category: 'accounting',
        url: 'https://portal.1c.ru/applications/1C-Reporting',
        iconId: '1C-Reporting'
    },
    {
        id: '1c-sign',
        title: '1С:Подпись',
        description: 'Простой способ получить электронную подпись от удостоверяющего центра ООО «НПЦ 1С»',
        category: 'edo',
        url: 'https://portal.1c.ru/applications/1C-Sign',
        iconId: '1C-Sign'
    },
    {
        id: '1c-document-recognition',
        title: '1С:Распознавание первичных документов',
        description: 'Автоматическое распознавание и создание первичных документов в программе 1С',
        category: 'accounting',
        url: 'https://portal.1c.ru/applications/1C-Document-Recognition',
        iconId: '1C-Document-Recognition'
    },
    {
        id: '1c-edo',
        title: '1С-ЭДО',
        description: 'Обмен электронными счетами-фактурами и другими документами с контрагентами',
        category: 'edo',
        url: 'https://portal.1c.ru/applications/1C-Edo',
        iconId: '1C-Edo'
    },
    {
        id: '1c-fresh',
        title: '1С:Предприятие через Интернет (1С:Фреш)',
        description: '«Облачный» продукт для работы с популярными программами 1С через Интернет',
        category: 'internet',
        url: 'https://portal.1c.ru/applications/1C-Enterprise',
        iconId: '1C-Enterprise'
    },
    {
        id: '1c-kassa',
        title: '1С:Касса облачное приложение',
        description: 'Простая автоматизация одного или нескольких небольших магазинов или точек оказания услуг',
        category: 'retail',
        url: 'https://portal.1c.ru/applications/1C-Kassa',
        iconId: '1C-Kassa'
    },
    {
        id: '1c-cloud-kassa',
        title: '1С-Облачная касса',
        description: 'Прием платежей в программе 1С без приобретения обычной онлайн-кассы',
        category: 'retail',
        url: 'https://portal.1c.ru/applications/1C-Cloud-Kassa',
        iconId: '1C-Cloud-Kassa'
    },
    {
        id: '1c-connect',
        title: '1С-Коннект',
        description: 'Мгновенная связь со специалистом техподдержки',
        category: 'support',
        url: 'https://portal.1c.ru/applications/1C-Buh-phone',
        iconId: '1C-Buh-phone'
    },
    {
        id: '1c-link',
        title: '1С:Линк',
        description: 'Простой способ организации удаленного подключения через Интернет без администратора или программиста',
        category: 'internet',
        url: 'https://portal.1c.ru/applications/1C-Link',
        iconId: '1C-Link'
    },
    {
        id: '1c-directbank',
        title: '1С:ДиректБанк',
        description: 'Отправка платежей и получение выписок прямо из программы 1С, без переключения в «Клиент-банк»',
        category: 'accounting',
        url: 'https://portal.1c.ru/applications/1C-Direct-bank',
        iconId: '1C-Direct-bank'
    },
    {
        id: '1c-delivery',
        title: '1С:Доставка',
        description: 'Оформление доставки грузов по России и за границу из программ 1С',
        category: 'business',
        url: 'https://portal.1c.ru/applications/1C-Delivery',
        iconId: '1C-Delivery'
    },
    {
        id: '1c-spark-risks',
        title: '1СПАРК Риски',
        description: 'Проверка надежности и мониторинг деятельности контрагентов',
        category: 'business',
        url: 'https://portal.1c.ru/applications/1C-Spark-risks',
        iconId: '1C-Spark-risks'
    },
    {
        id: '1c-cloud-backup',
        title: '1С:Облачный архив',
        description: 'Автоматическое резервное копирование информационных баз в облачное хранилище',
        category: 'support',
        url: 'https://portal.1c.ru/applications/1C-Cloud-backup',
        iconId: '1C-Cloud-backup'
    },
    {
        id: '1c-yookassa',
        title: 'ЮКаssа в программах 1С',
        description: 'Прием платежей через сервис ЮKassa в программах 1С: выставление счетов и получение уведомлений об оплатах',
        category: 'retail',
        url: 'https://portal.1c.ru/applications/1C-Yookassa',
        iconId: '1C-Yookassa'
    }
];

// Категории фильтров
const categories = [
    { id: 'all', label: 'Все продукты' },
    { id: 'accounting', label: 'Для бухгалтерии' },
    { id: 'business', label: 'Для бизнеса' },
    { id: 'edo', label: 'ЭДО' },
    { id: 'retail', label: 'Для розницы' },
    { id: 'internet', label: '1С через Интернет' },
    { id: 'support', label: 'Поддержка' }
];

const Services1C: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Получение цветовой схемы для категории
    const getCategoryColors = (category: string) => {
        switch (category) {
            case 'accounting':
                return {
                    bg: 'from-blue-100 to-blue-200',
                    text: 'text-blue-600',
                    border: 'border-blue-200'
                };
            case 'business':
                return {
                    bg: 'from-modern-primary-100 to-modern-primary-200',
                    text: 'text-modern-primary-600',
                    border: 'border-modern-primary-200'
                };
            case 'edo':
                return {
                    bg: 'from-emerald-100 to-emerald-200',
                    text: 'text-emerald-600',
                    border: 'border-emerald-200'
                };
            case 'retail':
                return {
                    bg: 'from-orange-100 to-orange-200',
                    text: 'text-orange-600',
                    border: 'border-orange-200'
                };
            case 'internet':
                return {
                    bg: 'from-purple-100 to-purple-200',
                    text: 'text-purple-600',
                    border: 'border-purple-200'
                };
            case 'support':
                return {
                    bg: 'from-modern-accent-100 to-modern-accent-200',
                    text: 'text-modern-accent-600',
                    border: 'border-modern-accent-200'
                };
            default:
                return {
                    bg: 'from-modern-gray-100 to-modern-gray-200',
                    text: 'text-modern-gray-600',
                    border: 'border-modern-gray-200'
                };
        }
    };

    // Фильтрация сервисов
    const filteredServices = useMemo(() => {
        let filtered = services;

        // Фильтр по категории
        if (activeCategory !== 'all') {
            filtered = filtered.filter(service => service.category === activeCategory);
        }

        // Фильтр по поиску
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [activeCategory, searchTerm]);

    return (
        <>
            <Helmet>
                <title>Сервисы 1С - 1С Поддержка</title>
                <meta
                    name="description"
                    content="Полный каталог облачных сервисов 1С: ЭДО, отчетность, маркировка, кассы и многое другое для автоматизации вашего бизнеса."
                />
            </Helmet>

            <div className="min-h-screen bg-modern-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Заголовок */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-modern-gray-900">
                            Сервисы 1С
                        </h1>
                    </div>

                    {/* Фильтры и поиск */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-8">
                        {/* Кнопки фильтрации */}
                        <div className="flex flex-wrap gap-2 lg:flex-1">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${activeCategory === category.id
                                        ? 'bg-modern-primary-600 text-white shadow-modern-md'
                                        : 'bg-modern-white text-modern-gray-700 hover:bg-modern-gray-100 border border-modern-gray-200'
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>

                        {/* Поле поиска */}
                        <div className="relative lg:w-80">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400" />
                            <input
                                type="text"
                                placeholder="Поиск сервисов..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-modern-white border border-modern-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Сетка сервисов */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                            <div
                                key={service.id}
                                className="bg-modern-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-200 overflow-hidden group"
                            >
                                <div className="p-6">

                                    {/* Заголовок с иконкой */}
                                    <div className="flex items-start mb-4">

                                        {/* Иконка сервиса */}
                                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${getCategoryColors(service.category).bg} rounded-lg flex items-center justify-center mr-4 p-2`}>
                                            <svg className={`w-8 h-8 ${getCategoryColors(service.category).text}`}>
                                                <use href={`/1c-sprite.svg#icon-${service.iconId}`} />
                                            </svg>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-modern-gray-900 group-hover:text-modern-primary-600 transition-colors duration-200 mb-1">
                                                {service.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Категория */}
                                    <div className="mb-3">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColors(service.category).bg} ${getCategoryColors(service.category).text}`}>
                                            {categories.find(cat => cat.id === service.category)?.label || service.category}
                                        </span>
                                    </div>

                                    {/* Описание */}
                                    <p className="text-modern-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {service.description}
                                    </p>

                                    {/* Кнопка */}
                                    <a
                                        href={service.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 font-medium text-sm transition-colors duration-200"
                                    >
                                        Подробнее
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Пустое состояние */}
                    {filteredServices.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-modern-white rounded-xl shadow-modern p-12">
                                <h3 className="text-xl font-semibold text-modern-gray-900 mb-2">
                                    Сервисы не найдены
                                </h3>
                                <p className="text-modern-gray-600 mb-6">
                                    Попробуйте изменить критерии поиска или выбрать другую категорию
                                </p>
                                <button
                                    onClick={() => {
                                        setActiveCategory('all');
                                        setSearchTerm('');
                                    }}
                                    className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                                >
                                    Сбросить фильтры
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Дополнительная информация */}
                    <div className="mt-16 text-center">
                        <div className="bg-modern-primary-50 rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-modern-primary-900 mb-4">
                                Нужна помощь с выбором сервиса?
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

export default Services1C; 