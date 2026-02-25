'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, CheckIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { TariffPlan } from '@/types/tariff';
import CallbackModal from '@/components/ui/CallbackModal';

const TechMaintenancePage: React.FC = () => {
    const [tariffs, setTariffs] = useState<TariffPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [callbackOpen, setCallbackOpen] = useState(false);

    // Загрузка тарифов из API
    useEffect(() => {
        const fetchTariffs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tariff-plans`);
                if (response.ok) {
                    const data = await response.json();
                    setTariffs(data);
                } else {
                    console.error('Failed to fetch tariffs, status:', response.status);
                }
            } catch (error) {
                console.error('Failed to fetch tariffs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTariffs();
    }, []);

    // Функция рендера значения ячейки в зависимости от типа
    const renderCellValue = (value: string | number, type: string) => {
        if (type === 'price' && typeof value === 'number') {
            return value.toLocaleString('ru-RU');
        }
        if (type === 'boolean') {
            return value === '+' ? '+' : value === '-' ? '-' : value;
        }
        return value;
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-modern-primary-100 via-modern-white to-modern-accent-100 pt-16 pb-8 overflow-hidden">
                <div className="absolute inset-0 opacity-50">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.03) 2px, transparent 2px)`,
                        backgroundSize: '60px 60px'
                    }}></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Левая колонка с навигационными плитками */}
                        <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
                            <Link href="/support" className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                                <div>
                                    <div className="text-2xl font-bold text-modern-primary-600 mb-1">ИТС</div>
                                    <div className="text-xs font-medium text-modern-gray-700">
                                        Сопровождение 1С<br />Горячая линия
                                    </div>
                                </div>
                                <ArrowRightIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>

                            <Link href="/implementation" className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                                <div>
                                    <div className="text-2xl font-bold text-modern-primary-600 mb-1">Внедрение</div>
                                    <div className="text-xs font-medium text-modern-gray-700">
                                        Автоматизация бизнеса<br />От обследования до запуска
                                    </div>
                                </div>
                                <ArrowRightIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>

                            <Link href="/tech-maintenance" className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                                <div>
                                    <div className="text-2xl font-bold text-modern-primary-600 mb-1">IT-Аутсорс</div>
                                    <div className="text-xs font-medium text-modern-gray-700">
                                        Обслуживание ПК и серверов<br />Торговое оборудование
                                    </div>
                                </div>
                                <ArrowRightIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>

                            <button
                                onClick={() => setCallbackOpen(true)}
                                className="group bg-modern-primary-600 rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg hover:bg-modern-primary-700 transition-all duration-200 w-full text-left"
                            >
                                <div>
                                    <div className="text-lg font-bold text-white mb-1">Заказать звонок</div>
                                    <div className="text-xs font-medium text-modern-primary-100">
                                        Хочу подробности<br />Подберём решение для вас
                                    </div>
                                </div>
                                <PhoneIcon className="h-6 w-6 text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                            </button>
                        </div>

                        <CallbackModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />

                        {/* Правая часть - основной контент */}
                        <div className="flex-1 bg-modern-white/80 backdrop-blur-sm rounded-xl p-8 shadow-modern">
                            {/* Заголовок по центру */}
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-modern-primary-600 mb-5 leading-tight">
                                    IT-Аутсорсинг
                                </h1>
                                <p className="text-lg text-modern-gray-700 leading-relaxed max-w-4xl mx-auto font-medium">
                                    Услуга IT-Аутсорсинг в Волжском и Волгограде предназначена для компаний малого и среднего бизнеса, которые не имеют собственного IT-отдела.
                                </p>
                            </div>

                            {/* Второй абзац */}
                            <p className="text-base text-modern-gray-700 leading-relaxed text-center mb-8">
                                Мы подберем для Вас наиболее подходящий вариант абонентского обслуживания компьютеров фирмы, оргтехники и программного обеспечения. Мы поможем организовать систему резервного копирования данных (бэкапы), подобрать новые компьютеры для вашей организации или апгрейдить имеющиеся, осуществить ремонт компьютерного оборудования и многое другое.
                            </p>

                            {/* Блок экономии */}
                            <div className="bg-gradient-to-r from-modern-primary-50 to-modern-accent-50 rounded-xl p-6">
                                <h2 className="text-3xl font-bold text-modern-primary-600 mb-3 text-center">
                                    Экономия до 70%
                                </h2>
                                <p className="text-lg text-modern-gray-800 leading-relaxed font-medium text-center mb-3">
                                    Мы поможем экономить до 70% бюджета на обслуживание компьютерной инфраструктуры вашего бизнеса
                                </p>
                                <p className="text-base text-modern-gray-700 text-center">
                                    Напишите нам и мы вам расскажем, как этого добиться
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Почему выбирают нас */}
            <section className="py-12 bg-gradient-to-br from-modern-gray-50 to-modern-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-modern-primary-600 text-center mb-10">
                        Почему выбирают нас
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* Карточка 1 */}
                        <div className="bg-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 flex items-center p-4 gap-4">
                            <div className="w-16 h-16 overflow-hidden flex-shrink-0 rounded-lg relative">
                                <Image
                                    src="/assets/it/reason-1.png"
                                    alt="Постоянный мониторинг"
                                    fill
                                    className="object-cover object-left scale-150"
                                    style={{ objectPosition: 'left center' }}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-modern-gray-700 leading-relaxed">
                                    Постоянный мониторинг информационных систем
                                </p>
                            </div>
                        </div>

                        {/* Карточка 2 */}
                        <div className="bg-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 flex items-center p-4 gap-4">
                            <div className="w-16 h-16 overflow-hidden flex-shrink-0 rounded-lg relative">
                                <Image
                                    src="/assets/it/reason-2.png"
                                    alt="Экономия"
                                    fill
                                    className="object-cover object-left scale-150"
                                    style={{ objectPosition: 'left center' }}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-modern-gray-700 leading-relaxed">
                                    Экономия до 70% бюджета на IT обслуживание компании
                                </p>
                            </div>
                        </div>

                        {/* Карточка 3 */}
                        <div className="bg-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 flex items-center p-4 gap-4">
                            <div className="w-16 h-16 overflow-hidden flex-shrink-0 rounded-lg relative">
                                <Image
                                    src="/assets/it/reason-3.png"
                                    alt="Время реакции"
                                    fill
                                    className="object-cover object-left scale-150"
                                    style={{ objectPosition: 'left center' }}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-modern-gray-700 leading-relaxed">
                                    Лимитированное время реакции на обращения
                                </p>
                            </div>
                        </div>

                        {/* Карточка 4 */}
                        <div className="bg-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 flex items-center p-4 gap-4">
                            <div className="w-16 h-16 overflow-hidden flex-shrink-0 rounded-lg relative">
                                <Image
                                    src="/assets/it/reason-4.png"
                                    alt="Профилактика"
                                    fill
                                    className="object-cover object-left scale-150"
                                    style={{ objectPosition: 'left center' }}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-modern-gray-700 leading-relaxed">
                                    Полный цикл ежемесячных и еженедельных профилактических задач
                                </p>
                            </div>
                        </div>

                        {/* Карточка 5 */}
                        <div className="bg-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 flex items-center p-4 gap-4">
                            <div className="w-16 h-16 overflow-hidden flex-shrink-0 rounded-lg relative">
                                <Image
                                    src="/assets/it/reason-5.png"
                                    alt="Фиксированная стоимость"
                                    fill
                                    className="object-cover object-left scale-150"
                                    style={{ objectPosition: 'left center' }}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-modern-gray-700 leading-relaxed">
                                    Фиксированная ежемесячная стоимость услуг
                                </p>
                            </div>
                        </div>

                        {/* Карточка 6 */}
                        <div className="bg-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 flex items-center p-4 gap-4">
                            <div className="w-16 h-16 overflow-hidden flex-shrink-0 rounded-lg relative">
                                <Image
                                    src="/assets/it/reason-6.png"
                                    alt="Техподдержка"
                                    fill
                                    className="object-cover object-left scale-150"
                                    style={{ objectPosition: 'left center' }}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-modern-gray-700 leading-relaxed">
                                    Техническая поддержка пользователей по телефону
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Диаграмма процесса */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="relative w-full h-auto mb-8">
                            <Image
                                src="/assets/it/process-diagram.png"
                                alt="Диаграмма процесса IT-аутсорсинга"
                                width={800}
                                height={600}
                                className="w-full h-auto"
                            />
                        </div>
                        <button className="inline-flex items-center justify-center px-8 py-4 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-all duration-200 font-semibold text-lg shadow-modern-lg hover:scale-105">
                            Получить консультацию
                        </button>
                    </div>
                </div>
            </section>

            {/* Как мы работаем - 4 этапа */}
            <section className="py-12 bg-gradient-to-br from-modern-gray-50 to-modern-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-modern-gray-900 text-center mb-12">
                        Как мы работаем
                    </h2>

                    {/* Desktop версия - все в один ряд */}
                    <div className="hidden lg:block">
                        <div className="relative">
                            {/* Горизонтальная линия */}
                            <div className="absolute top-8 left-0 right-0 h-0.5 bg-modern-primary-300"></div>

                            {/* 4 этапа в один ряд */}
                            <div className="grid grid-cols-4 gap-6 relative">
                                {/* Этап 1 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-modern-primary-600 text-white flex items-center justify-center font-bold text-xl shadow-modern z-10 mb-4 relative">
                                        1
                                    </div>
                                    <h3 className="font-semibold text-modern-gray-900 mb-2 leading-tight min-h-[2.8rem] flex items-center text-base">
                                        Оставьте заявку
                                    </h3>
                                    <p className="text-sm text-modern-gray-600 leading-relaxed">
                                        Воспользуйтесь формой "Получить консультацию"
                                    </p>
                                </div>

                                {/* Этап 2 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-modern-primary-600 text-white flex items-center justify-center font-bold text-xl shadow-modern z-10 mb-4 relative">
                                        2
                                    </div>
                                    <h3 className="font-semibold text-modern-gray-900 mb-2 leading-tight min-h-[2.8rem] flex items-center text-base">
                                        Ответ специалиста
                                    </h3>
                                    <p className="text-sm text-modern-gray-600 leading-relaxed">
                                        Специалист свяжется с Вами<br />
                                        Мы подготовим коммерческое предложение<br />
                                        Вы заключаете с нами договор
                                    </p>
                                </div>

                                {/* Этап 3 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-modern-primary-600 text-white flex items-center justify-center font-bold text-xl shadow-modern z-10 mb-4 relative">
                                        3
                                    </div>
                                    <h3 className="font-semibold text-modern-gray-900 mb-2 leading-tight min-h-[2.8rem] flex items-center text-base">
                                        Аудит системы
                                    </h3>
                                    <p className="text-sm text-modern-gray-600 leading-relaxed">
                                        Мы проведем аудит компьютерных систем Вашей компании<br />
                                        По результатам аудита подготовим отчет<br />
                                        Выявим и устраним недочеты в инфраструктуре
                                    </p>
                                </div>

                                {/* Этап 4 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-modern-primary-600 text-white flex items-center justify-center font-bold text-xl shadow-modern z-10 mb-4 relative">
                                        4
                                    </div>
                                    <h3 className="font-semibold text-modern-gray-900 mb-2 leading-tight min-h-[2.8rem] flex items-center text-base">
                                        Сопровождение
                                    </h3>
                                    <p className="text-sm text-modern-gray-600 leading-relaxed">
                                        Штатное сопровождение инфраструктуры
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile версия - сетка */}
                    <div className="lg:hidden">
                        <div className="relative">
                            {/* Сетка этапов - адаптивная */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                                {/* Этап 1 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-modern-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-modern z-10 mb-4 relative">
                                        1
                                    </div>
                                    <h3 className="font-bold text-modern-gray-900 mb-2 text-sm min-h-[2.5rem] flex items-center">
                                        Оставьте заявку
                                    </h3>
                                    <p className="text-xs text-modern-gray-600 leading-relaxed">
                                        Воспользуйтесь формой "Получить консультацию"
                                    </p>
                                </div>

                                {/* Этап 2 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-modern-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-modern z-10 mb-4 relative">
                                        2
                                    </div>
                                    <h3 className="font-bold text-modern-gray-900 mb-2 text-sm min-h-[2.5rem] flex items-center">
                                        Ответ специалиста
                                    </h3>
                                    <p className="text-xs text-modern-gray-600 leading-relaxed">
                                        Специалист свяжется с Вами<br />
                                        Мы подготовим коммерческое предложение<br />
                                        Вы заключаете с нами договор
                                    </p>
                                </div>

                                {/* Этап 3 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-modern-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-modern z-10 mb-4 relative">
                                        3
                                    </div>
                                    <h3 className="font-bold text-modern-gray-900 mb-2 text-sm min-h-[2.5rem] flex items-center">
                                        Аудит системы
                                    </h3>
                                    <p className="text-xs text-modern-gray-600 leading-relaxed">
                                        Мы проведем аудит компьютерных систем Вашей компании<br />
                                        По результатам аудита подготовим отчет<br />
                                        Выявим и устраним недочеты в инфраструктуре
                                    </p>
                                </div>

                                {/* Этап 4 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-modern-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-modern z-10 mb-4 relative">
                                        4
                                    </div>
                                    <h3 className="font-bold text-modern-gray-900 mb-2 text-sm min-h-[2.5rem] flex items-center">
                                        Сопровождение
                                    </h3>
                                    <p className="text-xs text-modern-gray-600 leading-relaxed">
                                        Штатное сопровождение инфраструктуры
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Декоративный разделитель */}
                    <div className="mt-16">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-modern-primary-300 to-transparent"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-modern-primary-400"></div>
                                <div className="w-3 h-3 rounded-full bg-modern-primary-500"></div>
                                <div className="w-2 h-2 rounded-full bg-modern-primary-400"></div>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-modern-primary-300 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Что мы предлагаем */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-modern-primary-600 text-center mb-10">
                        Услуги входящие в договор
                    </h2>

                    <div className="max-w-5xl mx-auto bg-modern-white rounded-xl shadow-modern p-8">
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Организация системы резервного копирования данных</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Профилактика возникновения сбоев оборудования</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Устранение неисправностей локальной сети</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Устранение сбоев программного обеспечения</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Восстановление компьютеров после сбоя</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Настройка доступа к общим файлам и папкам</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Взаимодействие с интернет-провайдерами по тех.вопросам</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Разграничение прав доступа пользователей к сети интернет</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Установка ПО Заказчика</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Ремонт компьютерного оборудования Заказчика (без стоимости деталей)</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Установка и настройка периферийного оборудования (принтеры, сканеры и пр.)</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Антивирусная профилактика компьютеров, лечение от вирусов</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Линия консультаций пользователей</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Модернизация компьютерного оборудования Заказчика (без стоимости деталей)</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-modern-primary-600 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-base text-modern-gray-700">Ведение статистики по интернет-трафику</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Блок о Zabbix */}
            <section className="py-12 bg-gradient-to-br from-modern-gray-900 via-modern-gray-800 to-modern-gray-900 relative overflow-hidden">
                {/* Декоративные элементы */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-modern-accent-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-modern-primary-500 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-modern-accent-300 to-modern-primary-300">
                            Мониторинг IT-инфраструктуры на базе Zabbix
                        </h2>
                        <p className="text-lg mb-4 leading-relaxed text-modern-gray-100">
                            Мы внедряем и сопровождаем профессиональную систему мониторинга Zabbix, которая в реальном времени следит за серверами, сетевым оборудованием, 1С и рабочими станциями.
                        </p>
                        <p className="text-lg mb-4 leading-relaxed text-modern-gray-100">
                            Вы получаете мгновенные уведомления о любых сбоях — ещё до того, как они повлияют на бизнес.
                        </p>
                        <p className="text-lg mb-8 leading-relaxed font-semibold text-modern-accent-200">
                            Никаких «внезапно всё упало» — только спокойствие и полный контроль 24/7.
                        </p>
                        <a
                            href="/zabbix"
                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-modern-accent-500 to-modern-primary-500 text-white rounded-lg hover:from-modern-accent-600 hover:to-modern-primary-600 hover:text-white transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Узнать больше
                        </a>
                    </div>
                </div>
            </section>

            {/* Секция "Тарифы" - ДИНАМИЧЕСКАЯ */}
            <section className="py-12 bg-gradient-to-br from-modern-gray-50 to-modern-white" id="tariff">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-modern-primary-600 text-center mb-12">
                        Тарифы
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-modern-gray-600">Загрузка тарифов...</p>
                        </div>
                    ) : tariffs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-modern-gray-600">Тарифы временно недоступны</p>
                        </div>
                    ) : (
                        tariffs.map((tariff) => (
                            <div key={tariff.id} className="mb-12 max-w-6xl mx-auto">
                                <h3 className="text-2xl font-semibold text-modern-gray-800 mb-6">
                                    {tariff.name}
                                    {tariff.subtitle && (
                                        <span className="text-modern-gray-600 ml-2">{tariff.subtitle}</span>
                                    )}
                                </h3>

                                <div className="overflow-x-auto rounded-xl shadow-modern-lg">
                                    <table className="min-w-full divide-y divide-modern-gray-200">
                                        <thead className="bg-modern-primary-600 text-white">
                                            <tr>
                                                {tariff.columns.map((column) => (
                                                    <th
                                                        key={column.id}
                                                        className="px-6 py-4 text-sm font-semibold"
                                                        style={{ textAlign: column.align || 'center' }}
                                                    >
                                                        {column.label}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-modern-gray-200 bg-white">
                                            {tariff.rows.map((row) => (
                                                <tr key={row.id} className="hover:bg-modern-gray-50 transition-colors duration-150">
                                                    {tariff.columns.map((column) => (
                                                        <td
                                                            key={column.id}
                                                            className="px-6 py-4"
                                                            style={{ textAlign: column.align || 'center' }}
                                                        >
                                                            {column.type === 'price' ? (
                                                                <span className="font-semibold text-modern-primary-600 text-lg">
                                                                    {renderCellValue(row[column.id], column.type)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-modern-gray-700">
                                                                    {renderCellValue(row[column.id], column.type)}
                                                                </span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {tariff.footnote && (
                                    <p className="text-sm text-modern-gray-600 text-right mt-4 italic">
                                        {tariff.footnote}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* CTA блок */}
            <section className="py-12 bg-gradient-to-br from-modern-primary-600 to-modern-primary-700" id="contact">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            Нужна помощь?
                        </h2>
                        <p className="text-xl mb-8 text-modern-primary-50">
                            Если вам срочно нужна компьютерная помощь либо вы хотите задать нам вопрос, то наши специалисты всегда начеку.
                            <br />Нажмите на кнопку, заполните форму и мы вам сразу перезвоним.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="tel:+78443300200"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-modern-primary-700 rounded-xl hover:bg-modern-gray-100 transition-all duration-200 font-semibold shadow-modern-lg hover:scale-105"
                            >
                                <span>📞</span>
                                <span>8 (8443) 300-200</span>
                            </a>
                            <a
                                href="mailto:it@enginf.ru"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-modern-primary-800 text-white rounded-xl hover:bg-modern-primary-900 transition-all duration-200 font-semibold shadow-modern-lg hover:scale-105"
                            >
                                <span>✉️</span>
                                <span>it@enginf.ru</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TechMaintenancePage;
