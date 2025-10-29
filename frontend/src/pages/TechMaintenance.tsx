import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const TechMaintenance: React.FC = () => {
    // Плавная прокрутка для якорных ссылок
    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();
                const href = anchor.getAttribute('href');
                if (href) {
                    const element = document.querySelector(href);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);

    return (
        <>
            <Helmet>
                <title>IT Аутсорсинг - Компьютерная помощь - ООО «Инженер-центр»</title>
                <meta name="description" content="Наши услуги по техническому сопровождению и обслуживанию компьютерной техники, локальных сетей, серверного оборудования и оргтехники" />
                <meta name="keywords" content="it аутсорсинг, техническое обслуживание, компьютерная помощь, администрирование" />
            </Helmet>

            <div className="min-h-screen bg-modern-gray-50">
                {/* Основной контент */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-modern-primary-700">
                            IT-Аутсорсинг
                        </h1>
                    </div>

                    <div className="bg-modern-white rounded-xl shadow-modern p-8 mx-auto">
                        {/* Секция "Об услуге" */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-bold text-modern-gray-900 text-center mb-8">
                                ОБ УСЛУГЕ
                            </h2>
                            <div className="max-w-4xl mx-auto space-y-4 text-modern-gray-700 text-lg leading-relaxed">
                                <p>
                                    Отдел IT-поддержки и аутсорса в компании предоставляет комплекс услуг и сервисов работ, которые не могут осуществлять IT-отделы.
                                </p>
                                <p>
                                    Мы работаем как для получения некоторых функций компании потребительского использования и администрирования. Мы поможем осуществлять контроль выполнения технического задания (ТЗ), соблюдает общую организацию для любых направлений при исключении повторной, минимизации уровня издержностей в отделе АСУТП.
                                </p>
                            </div>

                            {/* Баннер экономии */}
                            <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
                                <div>
                                    <img
                                        src="/assets/it/banner-70-percent.png"
                                        alt="IT инфраструктура"
                                        className="w-full max-w-md mx-auto rounded-lg"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-bold text-modern-primary-600 mb-4">
                                        Экономия до 70%
                                    </h3>
                                    <p className="text-modern-gray-700 mb-6">
                                        По данным компании до 70% расходов на содержание собственного структурного отдела сервиса
                                    </p>
                                    <p className="text-modern-gray-600 mb-6">
                                        Подсчитаем всё в чём или материалом узнать заменим остановим
                                    </p>
                                    <a href="#contact" className="inline-block hover:opacity-80 transition-opacity">
                                        <img src="/assets/it/button-1.png" alt="Заказать услугу" className="h-36" />
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Секция "Почему выбирают нас" */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-bold text-modern-gray-900 text-center mb-12">
                                Почему выбирают нас
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="flex justify-center">
                                    <img src="/assets/it/reason-1.png" alt="Причина 1" className="max-w-xs w-full" />
                                </div>
                                <div className="flex justify-center">
                                    <img src="/assets/it/reason-2.png" alt="Причина 2" className="max-w-xs w-full" />
                                </div>
                                <div className="flex justify-center">
                                    <img src="/assets/it/reason-3.png" alt="Причина 3" className="max-w-xs w-full" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="flex justify-center">
                                    <img src="/assets/it/reason-4.png" alt="Причина 4" className="max-w-xs w-full" />
                                </div>
                                <div className="flex justify-center">
                                    <img src="/assets/it/reason-5.png" alt="Причина 5" className="max-w-xs w-full" />
                                </div>
                                <div className="flex justify-center">
                                    <img src="/assets/it/reason-6.png" alt="Причина 6" className="max-w-xs w-full" />
                                </div>
                            </div>

                            {/* Диаграмма процесса */}
                            <div className="mt-12">
                                <img src="/assets/it/process-diagram.png" alt="Схема процесса" className="w-full max-w-2xl mx-auto" />
                                <div className="text-center mt-8">
                                    <a href="#contact" className="inline-block hover:opacity-80 transition-opacity">
                                        <img src="/assets/it/button-2.png" alt="Заказать" className="h-36" />
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Секция "Что мы предлагаем" */}
                        <section className="mb-16">
                            <div className="text-center mb-12">
                                <img src="/assets/it/what-we-offer.png" alt="Что мы предлагаем" className="mx-auto max-w-5xl w-full" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-modern-gray-900 mb-6">        
                            Услуги входящие в договор
                                    </h3>
                                    <ul className="space-y-3 text-modern-gray-700">
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Организация системы резервного копирования данных</span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Профилактика возникновения сбоев оборудования </span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Устранение неисправностей локальной сети</span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Устранение сбоев программного обеспечения</span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Восстановление компьютеров после сбоя</span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Настройка доступа к общим файлам и папкам </span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Взаимодействие с интернет-провайдерами по тех.вопросам </span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Разграничение прав доступа пользователей к сети интернет</span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Установка ПО Заказчика </span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Ремонт компьютерного оборудования Заказчика (без стоимости  деталей)</span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Установка и настройка периферийного оборудования (принтеры, сканеры и пр.) </span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Антивирусная профилактика компьютеров, лечение от вирусов</span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Линия консультаций пользователей </span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Модернизация компьютерного оборудования Заказчика (без стоимости деталей) </span>
                                        </li>
                                        <li className="flex items-start">
                                            <img src="/assets/it/checkmark.png" alt="✓" className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                                            <span>Ведение статистики по интернет-трафику</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <img src="/assets/it/tasks-image.png" alt="IT задачи" className="w-full rounded-xl shadow-lg" />
                                </div>
                            </div>
                        </section>

                        {/* Секция "Тарифы" */}
                        <section className="mb-16" id="tariff">
                            <h2 className="text-3xl font-bold text-modern-gray-900 text-center mb-12">
                                Тарифы
                            </h2>

                            {/* Тариф "Контроль" */}
                            <div className="mb-12">
                                <h3 className="text-2xl font-semibold text-modern-gray-800 mb-6">
                                    Тариф «Контроль» (для малых организаций)
                                </h3>
                                <div className="overflow-x-auto rounded-xl shadow-lg">
                                    <table className="min-w-full divide-y divide-modern-gray-200">
                                        <thead className="bg-modern-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Наименование</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Кол-во ПК</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Стоимость на ПК*</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Кол-во часов</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Входящий мониторинг Zabbix</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-modern-gray-200 bg-white">
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">1</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">3100</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">+</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">3400</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">+</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">3</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">3700</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">+</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-sm text-modern-gray-600 text-right mt-4">
                                    * Цена указана в рублях за 1 месяц. Время расчета с 8 рабочих часов.
                                </p>
                            </div>

                            {/* Тариф "Стандарт" */}
                            <div className="mb-12">
                                <h3 className="text-2xl font-semibold text-modern-gray-800 mb-6">
                                    Тариф «Стандарт» (подходит большинству организаций)
                                </h3>
                                <div className="overflow-x-auto rounded-xl shadow-lg">
                                    <table className="min-w-full divide-y divide-modern-gray-200">
                                        <thead className="bg-modern-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Наименование</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Кол-во</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Стоимость на ПК*</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Кол-во плановых выездов</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Кол-во аварийных выездов</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-modern-gray-200 bg-white">
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">4-5</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">1000</td>
                                                <td className="px-6 py-4 text-center">1</td>
                                                <td className="px-6 py-4 text-center">3</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">6-9</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">900</td>
                                                <td className="px-6 py-4 text-center">1</td>
                                                <td className="px-6 py-4 text-center">4</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">10-13</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">850</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">5</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">14-15</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">800</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">6</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">16-19</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">750</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">7</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">20-24</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">720</td>
                                                <td className="px-6 py-4 text-center">3</td>
                                                <td className="px-6 py-4 text-center">8</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">25-30</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">700</td>
                                                <td className="px-6 py-4 text-center">3</td>
                                                <td className="px-6 py-4 text-center">9</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">От 30</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">По договоренности</td>
                                                <td className="px-6 py-4 text-center">По договоренности</td>
                                                <td className="px-6 py-4 text-center">По договоренности</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Серверное место (сервер на ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">1</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">5000</td>
                                                <td className="px-6 py-4 text-center">-</td>
                                                <td className="px-6 py-4 text-center">-</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Серверное место (сервер на ОС LINUX)</td>
                                                <td className="px-6 py-4 text-center">1</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">7000</td>
                                                <td className="px-6 py-4 text-center">-</td>
                                                <td className="px-6 py-4 text-center">-</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-sm text-modern-gray-600 text-right mt-4">
                                    * Цена указана в рублях за 1 месяц. Время расчета с 8 рабочих часов.
                                </p>
                            </div>

                            {/* Тариф "Продвинутый" */}
                            <div className="mb-12">
                                <h3 className="text-2xl font-semibold text-modern-gray-800 mb-6">
                                    Тариф «Продвинутый»
                                </h3>
                                <div className="overflow-x-auto rounded-xl shadow-lg">
                                    <table className="min-w-full divide-y divide-modern-gray-200">
                                        <thead className="bg-modern-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Наименование</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Кол-во</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Стоимость на ПК*</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Кол-во плановых выездов</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-modern-gray-700">Кол-во аварийных выездов</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-modern-gray-200 bg-white">
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">4-5</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">1200</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">5</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">6-9</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">1100</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">6</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">10-13</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">1000</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">7</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">14-15</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">950</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">8</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">16-19</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">900</td>
                                                <td className="px-6 py-4 text-center">2</td>
                                                <td className="px-6 py-4 text-center">9</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">20-24</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">860</td>
                                                <td className="px-6 py-4 text-center">3</td>
                                                <td className="px-6 py-4 text-center">10</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">25-30</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">830</td>
                                                <td className="px-6 py-4 text-center">3</td>
                                                <td className="px-6 py-4 text-center">11</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Рабочее место (ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">От 30</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">По договоренности</td>
                                                <td className="px-6 py-4 text-center">По договоренности</td>
                                                <td className="px-6 py-4 text-center">По договоренности</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Серверное место (сервер на ОС WINDOWS)</td>
                                                <td className="px-6 py-4 text-center">1</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">6000</td>
                                                <td className="px-6 py-4 text-center">-</td>
                                                <td className="px-6 py-4 text-center">-</td>
                                            </tr>
                                            <tr className="hover:bg-modern-gray-50">
                                                <td className="px-6 py-4 text-center">Серверное место (сервер на ОС LINUX)</td>
                                                <td className="px-6 py-4 text-center">1</td>
                                                <td className="px-6 py-4 text-center font-semibold text-modern-primary-600">8000</td>
                                                <td className="px-6 py-4 text-center">-</td>
                                                <td className="px-6 py-4 text-center">-</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-sm text-modern-gray-600 text-right mt-4">
                                    * Цена указана в рублях за 1 месяц. Время расчета с 4 рабочих часа.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* CTA блок */}
                    <div className="mt-16" id="contact">
                        <div className="bg-modern-primary-50 rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-modern-primary-900 mb-4 text-center">
                                Нужна помощь?
                            </h2>
                            <p className="text-modern-primary-700 mb-6 text-center">
                                Если вам срочно нужна компьютерная помощь либо вы хотите задать нам вопрос, то наши специалисты всегда начеку.<br />
                                Нажмите на кнопку, заполните форму и мы вам сразу перезвоним.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href="tel:+78443300200"
                                    className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                                >
                                    📞 8 (8443) 300-200
                                </a>
                                <a
                                    href="mailto:it@enginf.ru"
                                    className="inline-flex items-center px-6 py-3 bg-modern-white text-modern-primary-700 border-2 border-modern-primary-600 rounded-xl hover:bg-modern-primary-50 transition-colors duration-200 font-semibold"
                                >
                                    ✉️ it@enginf.ru
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TechMaintenance;
