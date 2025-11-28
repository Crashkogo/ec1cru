import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    MagnifyingGlassIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

// Типы для сервисов
interface Service {
    id: string;
    title: string;
    description: string;
    categories: string[];
    url: string;
    iconId: string;
}

// Палитра цветов для иконок (мягкие пастельные тона)
const colorPalette = [
    { bg: 'from-blue-100 to-blue-200', text: 'text-blue-600' },
    { bg: 'from-purple-100 to-purple-200', text: 'text-purple-600' },
    { bg: 'from-green-100 to-green-200', text: 'text-green-600' },
    { bg: 'from-orange-100 to-orange-200', text: 'text-orange-600' },
    { bg: 'from-pink-100 to-pink-200', text: 'text-pink-600' },
    { bg: 'from-indigo-100 to-indigo-200', text: 'text-indigo-600' },
    { bg: 'from-teal-100 to-teal-200', text: 'text-teal-600' },
    { bg: 'from-cyan-100 to-cyan-200', text: 'text-cyan-600' },
];

// Функция для получения цвета по ID сервиса (детерминированная)
const getColorForService = (serviceId: string): typeof colorPalette[0] => {
    // Простой хеш из строки
    let hash = 0;
    for (let i = 0; i < serviceId.length; i++) {
        hash = ((hash << 5) - hash) + serviceId.charCodeAt(i);
        hash = hash & hash;
    }
    const index = Math.abs(hash) % colorPalette.length;
    return colorPalette[index];
};

// Полный список сервисов с портала 1С
const services: Service[] = [
    {
        id: '1c-edi',
        title: '1С:EDI',
        description: 'EDI-обмен с торговыми партнерами, автоматизация цепочек заказов и поставок продукции',
        categories: ['all', 'edo'],
        url: 'https://portal.1c.ru/applications/1C-EDI',
        iconId: '1C-EDI'
    },
    {
        id: '1c-share',
        title: '1С:Share',
        description: 'Простой и быстрый способ отправить контрагенту документ из программы 1С',
        categories: ['all', 'edo'],
        url: 'https://portal.1c.ru/applications/1C-Share',
        iconId: '1C-Share'
    },
    {
        id: '1c-administrator',
        title: '1С-Администратор',
        description: 'Доступ к каталогу отчетов и обработок сообщества Инфостарт для эффективной работы ИТ-специалистов компаний',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Administrator',
        iconId: '1C-Administrator'
    },
    {
        id: '1c-business-training',
        title: '1С:Бизнес-обучение',
        description: 'Веб-платформа для дистанционного обучения генеральных директоров и топ-менеджеров',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Business-Training',
        iconId: '1C-Business-Training'
    },
    {
        id: '1c-its',
        title: 'Информационная система 1С:ИТС',
        description: 'Консультации по законодательству, методики и инструкции по работе с программами «1С:Предприятия» (its.1c.ru)',
        categories: ['all', 'popular', 'support'],
        url: 'https://portal.1c.ru/applications/1C-ITS',
        iconId: '1C-ITS'
    },
    {
        id: '1c-ess',
        title: '1С:Кабинет сотрудника',
        description: 'Обмен кадровыми документами с помощью технологии кадрового электронного документооборота',
        categories: ['all', 'personnel'],
        url: 'https://portal.1c.ru/applications/1C-ESS',
        iconId: '1C-ESS'
    },
    {
        id: '1c-counteragent',
        title: '1С:Контрагент',
        description: 'Автоматическое заполнение реквизитов контрагента по ИНН или наименованию',
        categories: ['all', 'counterparty-check'],
        url: 'https://portal.1c.ru/applications/1C-Counteragent',
        iconId: '1C-Counteragent'
    },
    {
        id: '1c-credit',
        title: '1С:Кредит',
        description: 'Поиск кредитных предложений в программах 1С и автоматическое формирование заявки и пакета документов',
        categories: ['all', 'bank-integration'],
        url: 'https://portal.1c.ru/applications/1C-Credit',
        iconId: '1C-Credit'
    },
    {
        id: '1c-courierika',
        title: '1С-Курьерика',
        description: 'Управление собственной службой доставки',
        categories: ['all', 'logistics'],
        url: 'https://portal.1c.ru/applications/1C-Courierika',
        iconId: '1C-Courierika'
    },
    {
        id: '1c-marking',
        title: '1С:Маркировка',
        description: 'Встроенные инструменты полного цикла для работы с маркированным товаром',
        categories: ['all', 'popular', 'marking'],
        url: 'https://portal.1c.ru/applications/1C-Marking',
        iconId: '1C-Marking'
    },
    {
        id: '1c-nomenclature',
        title: '1С:Номенклатура',
        description: 'Единый каталог описаний товаров в "1С:Предприятии 8"',
        categories: ['all'],
        url: 'https://portal.1c.ru/applications/1C-Nomenclature',
        iconId: '1C-Nomenclature'
    },
    {
        id: '1c-ofd',
        title: '1С-ОФД',
        description: 'Подключение к ОФД и передача фискальных данных в ФНС и ЦРПТ (Маркировка)',
        categories: ['all', 'reporting'],
        url: 'https://portal.1c.ru/applications/1C-OFD',
        iconId: '1C-OFD'
    },
    {
        id: '1c-program-update',
        title: '1С:Обновление программ',
        description: 'Обновления прикладных решений (конфигураций) и технологической платформы, информация о планируемых релизах',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Program-update',
        iconId: '1C-Program-update'
    },
    {
        id: '1c-online-orders',
        title: '1С:Онлайн-заказы',
        description: 'Публикация заказа для приема оплат от физических или юридических лиц',
        categories: ['all', 'payment'],
        url: 'https://portal.1c.ru/applications/1C-Online-Orders',
        iconId: '1C-Online-Orders'
    },
    {
        id: '1c-reporting',
        title: '1С-Отчетность',
        description: 'Подготовка и сдача регламентированной отчетности из программ 1С',
        categories: ['all', 'popular', 'reporting'],
        url: 'https://portal.1c.ru/applications/1C-Reporting',
        iconId: '1C-Reporting'
    },
    {
        id: '1c-sign',
        title: '1С:Подпись',
        description: 'Простой способ получить электронную подпись от удостоверяющего центра ООО «НПЦ 1С»',
        categories: ['all', 'edo'],
        url: 'https://portal.1c.ru/applications/1C-Sign',
        iconId: '1C-Sign'
    },
    {
        id: '1c-document-recognition',
        title: '1С:Распознавание первичных документов',
        description: 'Автоматическое распознавание и создание первичных документов в программе 1С',
        categories: ['all', 'ai'],
        url: 'https://portal.1c.ru/applications/1C-Document-Recognition',
        iconId: '1C-Document-Recognition'
    },
    {
        id: '1c-retail-checker',
        title: '1С-Ритейл Чекер',
        description: 'Экспертные рекомендации по управлению товарными запасами на основе статистики продаж и прогноза спроса',
        categories: ['all', 'forecasting'],
        url: 'https://portal.1c.ru/applications/1C-Retail-Checker',
        iconId: '1C-Retail-Checker'
    },
    {
        id: '1c-sbpb2b',
        title: '1С:СБП B2B',
        description: 'Моментальные платежи от юридических лиц',
        categories: ['all', 'new', 'payment'],
        url: 'https://portal.1c.ru/applications/1C-SBPB2B',
        iconId: '1C-SBPB2B'
    },
    {
        id: '1c-sbp',
        title: '1С:СБП C2B',
        description: 'Способ принимать безналичную оплату от покупателей без пластиковых карт и эквайринга',
        categories: ['all', 'payment'],
        url: 'https://portal.1c.ru/applications/1C-SBP',
        iconId: '1C-SBP'
    },
    {
        id: '1c-sverka',
        title: '1С:Сверка 2.0',
        description: 'Автоматическая сверка документов с контрагентами',
        categories: ['all'],
        url: 'https://portal.1c.ru/applications/1C-Sverka',
        iconId: '1C-Sverka'
    },
    {
        id: '1c-check-scan',
        title: '1С:Сканер чеков',
        description: 'Автоматическое заполнение авансовых отчетов данными из кассовых чеков',
        categories: ['all'],
        url: 'https://portal.1c.ru/applications/1C-Check-Scan',
        iconId: '1C-Check-Scan'
    },
    {
        id: '1c-edo',
        title: '1С-ЭДО',
        description: 'Обмен электронными счетами-фактурами и другими документами с контрагентами',
        categories: ['all', 'popular', 'edo'],
        url: 'https://portal.1c.ru/applications/1C-Edo',
        iconId: '1C-Edo'
    },
    {
        id: '1c-spark-risks',
        title: '1СПАРК Риски',
        description: 'Проверка надежности и мониторинг деятельности контрагентов',
        categories: ['all', 'counterparty-check'],
        url: 'https://portal.1c.ru/applications/1C-Spark-risks',
        iconId: '1C-Spark-risks'
    },
    {
        id: '1c-bidzaar',
        title: 'Bidzaar',
        description: 'Электронная торговая площадка для автоматизации закупок частных компаний',
        categories: ['all', 'ecommerce'],
        url: 'https://portal.1c.ru/applications/1C-Bidzaar',
        iconId: '1C-Bidzaar'
    },
    {
        id: '1c-sellmonitor',
        title: 'Sellmonitor',
        description: 'Сервис аналитики и умных инструментов для маркетплейсов',
        categories: ['all', 'ecommerce'],
        url: 'https://portal.1c.ru/applications/1C-Sellmonitor',
        iconId: '1C-Sellmonitor'
    },
    {
        id: '1c-smartway',
        title: 'Smartway',
        description: 'Организация командировок и автоматическое создание бухгалтерских и кадровых документов в программах 1С',
        categories: ['all', 'personnel'],
        url: 'https://portal.1c.ru/applications/1C-Smartway',
        iconId: '1C-Smartway'
    },
    {
        id: '1c-store',
        title: '1C-Store',
        description: 'Доступ к каталогу проверенных отчетов и обработок из «локальных» программ 1С',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Store',
        iconId: '1C-Store'
    },
    {
        id: '1c-umi',
        title: '1C-UMI',
        description: 'Готовые сайты для всех типов бизнеса: для специалистов, компаний, а также лендинги и интернет-магазины',
        categories: ['all', 'ecommerce'],
        url: 'https://portal.1c.ru/applications/1C-UMI',
        iconId: '1C-UMI'
    },
    {
        id: '1c-mag',
        title: 'mag1c',
        description: 'Автоматическое создание веб-витрины бизнеса из программы 1С для приема заказов или старта продаж через интернет',
        categories: ['all', 'ecommerce'],
        url: 'https://portal.1c.ru/applications/1C-MAG',
        iconId: '1C-MAG'
    },
    {
        id: '1c-bn-tradeoffers',
        title: '1С:Бизнес-сеть. Торговая площадка',
        description: 'B2B-маркетплейс для продаж и корпоративных закупок, связывающий напрямую Поставщиков с Закупщиками',
        categories: ['all', 'ecommerce'],
        url: 'https://portal.1c.ru/applications/1C-Bn-TradeOffers',
        iconId: '1C-Bn-TradeOffers'
    },
    {
        id: '1c-directbank',
        title: '1С:ДиректБанк',
        description: 'Отправка платежей и получение выписок прямо из программы 1С, без переключения в «Клиент-банк»',
        categories: ['all', 'bank-integration'],
        url: 'https://portal.1c.ru/applications/1C-Direct-bank',
        iconId: '1C-Direct-bank'
    },
    {
        id: '1c-delivery',
        title: '1С:Доставка',
        description: 'Оформление доставки грузов по России и за границу из программ 1С',
        categories: ['all', 'logistics'],
        url: 'https://portal.1c.ru/applications/1C-Delivery',
        iconId: '1C-Delivery'
    },
    {
        id: '1c-egisz',
        title: '1С:ЕГИСЗ',
        description: 'Подключение к сервисам ЕГИСЗ организаций, оказывающих медицинскую помощь, для выполнения лицензионных требований',
        categories: ['all', 'gis'],
        url: 'https://portal.1c.ru/applications/1C-EGISZ',
        iconId: '1C-EGISZ'
    },
    {
        id: '1c-change-inform',
        title: '1С:Изменение сведений',
        description: 'Внесение изменений в ЕГРЮЛ/ЕГРИП из программы 1С',
        categories: ['all', 'reporting'],
        url: 'https://portal.1c.ru/applications/1C-Change-inform',
        iconId: '1C-Change-inform'
    },
    {
        id: '1c-industry-subscription',
        title: '1С:КП Отраслевой',
        description: 'Поддержка отраслевых и специализированных программ 1С',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Industry-subscription',
        iconId: '1C-Industry-subscription'
    },
    {
        id: '1c-kassa',
        title: '1С:Касса облачное приложение',
        description: 'Простая автоматизация одного или нескольких небольших магазинов или точек оказания услуг',
        categories: ['all'],
        url: 'https://portal.1c.ru/applications/1C-Kassa',
        iconId: '1C-Kassa'
    },
    {
        id: '1c-connect',
        title: '1С-Коннект',
        description: 'Мгновенная связь со специалистом техподдержки',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Buh-phone',
        iconId: '1C-Buh-phone'
    },
    {
        id: '1c-corp-support',
        title: 'Корпоративная технологическая поддержка',
        description: 'Повышение производительности, доступности и масштабируемости корпоративной информационной системы',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-corp-support',
        iconId: '1C-corp-support'
    },
    {
        id: '1c-courier',
        title: '1С:Курьер',
        description: 'Оформление курьерской доставки по городу из программ 1С',
        categories: ['all', 'logistics'],
        url: 'https://portal.1c.ru/applications/1C-Courier',
        iconId: '1C-Courier'
    },
    {
        id: '1c-lecture-hall',
        title: '1С:Лекторий',
        description: 'Семинары по законодательству и его отражению в программах «1С:Предприятия»',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Lecture-hall',
        iconId: '1C-Lecture-hall'
    },
    {
        id: '1c-leasing',
        title: '1С:Лизинг',
        description: 'Поиск предложений от лизинговых компаний в программах 1С и автоматическое формирование заявки и пакета документов',
        categories: ['all', 'bank-integration'],
        url: 'https://portal.1c.ru/applications/1C-Leasing',
        iconId: '1C-Leasing'
    },
    {
        id: '1c-helpdesc',
        title: 'Линия консультаций',
        description: 'Консультации пользователей программ 1С по телефону и электронной почте',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Helpdesc',
        iconId: '1C-Helpdesc'
    },
    {
        id: '1c-link',
        title: '1С:Линк',
        description: 'Простой способ организации удаленного подключения через Интернет без администратора или программиста',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Link',
        iconId: '1C-Link'
    },
    {
        id: '1c-mdlp',
        title: '1С:МДЛП',
        description: 'Подключение к системе маркировки Честный ЗНАК и передача данных о движении лекарственных препаратов в ФГИС МДЛП',
        categories: ['all', 'marking', 'gis'],
        url: 'https://portal.1c.ru/applications/1C-MDLP',
        iconId: '1C-MDLP'
    },
    {
        id: '1c-cloud-kassa',
        title: '1С-Облачная касса',
        description: 'Прием платежей в программе 1С без приобретения обычной онлайн-кассы',
        categories: ['all', 'payment'],
        url: 'https://portal.1c.ru/applications/1C-Cloud-Kassa',
        iconId: '1C-Cloud-Kassa'
    },
    {
        id: '1c-cloud-backup',
        title: '1С:Облачный архив',
        description: 'Автоматическое резервное копирование информационных баз в облачное хранилище',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Cloud-backup',
        iconId: '1C-Cloud-backup'
    },
    {
        id: '1c-auditor',
        title: 'Отвечает аудитор',
        description: 'Консультации от экспертов и аудиторов по бухгалтерскому и кадровому учету',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-Auditor',
        iconId: '1C-Auditor'
    },
    {
        id: '1c-enterprise',
        title: '1С:Предприятие через Интернет (1С:Фреш)',
        description: '«Облачный» продукт для работы с популярными программами 1С через Интернет',
        categories: ['all', 'popular'],
        url: 'https://portal.1c.ru/applications/1C-Enterprise',
        iconId: '1C-Enterprise'
    },
    {
        id: '1c-corp-support-prem',
        title: 'Премиальная поддержка корпоративных клиентов',
        description: 'Эффективная эксплуатация и развитие решений 1С в крупных корпоративных ландшафтах',
        categories: ['all', 'support'],
        url: 'https://portal.1c.ru/applications/1C-corp-support-prem',
        iconId: '1C-corp-support-prem'
    },
    {
        id: '1c-forecast-sales',
        title: '1С:Прогнозирование продаж',
        description: 'Прогноз продаж для производственных и торговых компаний в программах 1С',
        categories: ['all', 'forecasting'],
        url: 'https://portal.1c.ru/applications/1C-Forecast-sales',
        iconId: '1C-Forecast-sales'
    },
    {
        id: '1c-speech-recognition',
        title: '1С:Распознавание речи',
        description: 'Облачное преобразование в текст потокового аудио или файлов с записью речи, голосовое управление программами 1С',
        categories: ['all', 'new', 'ai'],
        url: 'https://portal.1c.ru/applications/1C-Speech-Recognition',
        iconId: '1C-Speech-Recognition'
    },
    {
        id: '1c-speech-synthesis',
        title: '1С:Синтез речи',
        description: 'Облачное преобразование текста в речь человека, голосовые интерфейсы в программах 1С',
        categories: ['all', 'new', 'ai'],
        url: 'https://portal.1c.ru/applications/1C-Speech-Synthesis',
        iconId: '1C-Speech-Synthesis'
    },
    {
        id: '1c-self-employed',
        title: '1С:Статус самозанятого',
        description: 'Проверка статуса налогоплательщика налога на профессиональный доход (самозанятого) в программах 1С',
        categories: ['all', 'reporting'],
        url: 'https://portal.1c.ru/applications/1C-Self-Employed',
        iconId: '1C-Self-Employed'
    },
    {
        id: '1c-taxcom',
        title: '1С-Такском',
        description: 'Обмен электронными счетами-фактурами и другими документами с контрагентами',
        categories: ['all', 'edo'],
        url: 'https://portal.1c.ru/applications/1C-Taxcom',
        iconId: '1C-Taxcom'
    },
    {
        id: '1c-goods',
        title: '1С-Товары',
        description: 'Прогноз спроса, автоматический заказ и управление ассортиментом розничного магазина',
        categories: ['all', 'forecasting'],
        url: 'https://portal.1c.ru/applications/1C-Goods',
        iconId: '1C-Goods'
    },
    {
        id: '1c-forecast',
        title: '1С:Универсальное прогнозирование',
        description: 'Прогнозирование показателей бизнеса в программах 1С',
        categories: ['all', 'forecasting'],
        url: 'https://portal.1c.ru/applications/1C-Forecast',
        iconId: '1C-Forecast'
    },
    {
        id: '1c-financial-control',
        title: '1С-Финконтроль',
        description: 'Проверка правильности учета в государственных учреждениях',
        categories: ['all'],
        url: 'https://portal.1c.ru/applications/1C-Financial-control',
        iconId: '1C-Financial-control'
    },
    {
        id: '1c-financial-reporting',
        title: '1С:Финотчетность',
        description: 'Подготовка и отправка в банк финансовой отчетности заемщика',
        categories: ['all', 'bank-integration'],
        url: 'https://portal.1c.ru/applications/1C-Financial-Reporting',
        iconId: '1C-Financial-Reporting'
    },
    {
        id: '1c-ofd-receipt',
        title: '1С-Чеки ОФД',
        description: 'Автоматическая загрузка фискальных данных в программы 1С из ОФД',
        categories: ['all'],
        url: 'https://portal.1c.ru/applications/1C-OFD-receipt',
        iconId: '1C-OFD-receipt'
    },
    {
        id: '1c-bn',
        title: 'ЭДО без электронной подписи для участников 1С:Бизнес-сеть',
        description: 'Обмен электронными документами без электронной подписи между пользователями программ 1С',
        categories: ['all', 'edo'],
        url: 'https://portal.1c.ru/applications/1C-Bn',
        iconId: '1C-Bn'
    },
    {
        id: '1c-epd',
        title: '1С-ЭПД',
        description: 'Обмен транспортными накладными и другими перевозочными документами в электронном виде',
        categories: ['all', 'edo', 'logistics'],
        url: 'https://portal.1c.ru/applications/1C-EPD',
        iconId: '1C-EPD'
    },
    {
        id: '1c-etp',
        title: '1С-ЭТП',
        description: 'Электронные подписи для участия в электронных торгах и работы на государственных порталах',
        categories: ['all'],
        url: 'https://portal.1c.ru/applications/1C-Etp',
        iconId: '1C-Etp'
    },
    {
        id: '1c-yookassa',
        title: 'ЮКаssа в программах 1С',
        description: 'Прием платежей через сервис ЮKassa в программах 1С: выставление счетов и получение уведомлений об оплатах',
        categories: ['all', 'payment'],
        url: 'https://portal.1c.ru/applications/1C-Yookassa',
        iconId: '1C-Yookassa'
    },
    {
        id: '1c-second-pilot',
        title: '1С:Напарник для разработки',
        description: 'Интеллектуальный помощник для разработчиков 1С, встроенный в 1С:EDT',
        categories: ['all', 'new', 'ai'],
        url: 'https://portal.1c.ru/applications/1C-Second-Pilot',
        iconId: '1C-Second-Pilot'
    },
    {
        id: '1c-ausn',
        title: '1С:АУСН',
        description: 'Электронное взаимодействие с банками и ФНС для организаций и предпринимателей на АУСН',
        categories: ['all', 'new', 'reporting'],
        url: 'https://portal.1c.ru/applications/1C-Ausn',
        iconId: '1C-Ausn'
    },
    {
        id: '1c-ens',
        title: '1С:ЕНС',
        description: 'Работа с личным кабинетом ФНС по единому налоговому счету в программе 1С',
        categories: ['all', 'new', 'reporting'],
        url: 'https://portal.1c.ru/applications/1C-ENS',
        iconId: '1C-ENS'
    }
];

// Категории фильтров (соответствуют оригиналу)
const categories = [
    { id: 'all', label: 'Все продукты' },
    { id: 'popular', label: 'Популярное' },
    { id: 'new', label: 'Новинки' },
    { id: 'reporting', label: 'Отчетность и налоги' },
    { id: 'edo', label: 'ЭДО' },
    { id: 'counterparty-check', label: 'Проверка контрагентов' },
    { id: 'personnel', label: 'Персонал и кадры' },
    { id: 'gis', label: 'Интеграция с ГИС' },
    { id: 'marking', label: 'Маркировка' },
    { id: 'payment', label: 'Прием оплат' },
    { id: 'ecommerce', label: 'Интернет-торговля' },
    { id: 'logistics', label: 'Логистика и доставка' },
    { id: 'forecasting', label: 'Сервисы прогнозирования' },
    { id: 'bank-integration', label: 'Взаимодействие с банками' },
    { id: 'ai', label: 'Сервисы ИИ' },
    { id: 'support', label: 'Поддержка' }
];

const Services1C: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Фильтрация сервисов
    const filteredServices = useMemo(() => {
        let filtered = services;

        // Фильтр по категории
        if (activeCategory !== 'all') {
            filtered = filtered.filter(service =>
                service.categories.includes(activeCategory)
            );
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
                <title>Сервисы 1С - ООО «Инженер-центр»</title>
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
                        <p className="text-modern-gray-600 mt-2">
                            Полный каталог продуктов и услуг для работы с 1С:Предприятие
                        </p>
                    </div>

                    {/* Фильтры и поиск */}
                    <div className="mb-6">
                        {/* Кнопки фильтрации */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${activeCategory === category.id
                                        ? 'bg-modern-primary-600 text-white shadow-md'
                                        : 'bg-modern-white text-modern-gray-700 hover:bg-modern-gray-100 border border-modern-gray-200'
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>

                        {/* Поле поиска */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-modern-gray-400" />
                            <input
                                type="text"
                                placeholder="Поиск"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-modern-white border border-modern-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Сетка сервисов */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => {
                            const serviceColor = getColorForService(service.id);
                            return (
                                <a
                                    key={service.id}
                                    href={service.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-modern-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-200 overflow-hidden group block"
                                >
                                    <div className="p-6">
                                        {/* Заголовок с иконкой */}
                                        <div className="flex items-start mb-4">
                                            {/* Иконка сервиса */}
                                            <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${serviceColor.bg} rounded-lg flex items-center justify-center mr-4`}>
                                                <svg className={`w-8 h-8 ${serviceColor.text}`}>
                                                    <use href={`/1c-sprite2.svg#icon-${service.iconId}`} />
                                                </svg>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-modern-gray-900 group-hover:text-modern-primary-600 transition-colors duration-200 mb-1 line-clamp-2">
                                                    {service.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Описание */}
                                        <p className="text-modern-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {service.description}
                                        </p>

                                        {/* Кнопка */}
                                        <div className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 font-medium text-sm transition-colors duration-200">
                                            Подробнее
                                            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
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

                    {/* Источник */}
                    <div className="mt-8 text-center text-sm text-modern-gray-500">
                        Источник данных: <a href="https://portal.1c.ru/applications" target="_blank" rel="noopener noreferrer" className="text-modern-primary-600 hover:underline">portal.1c.ru</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Services1C;
