import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface ClientData {
  id: number;
  inn: string;
  name: string;
  manager: {
    firstName: string;
    lastName: string;
  };
}

// Mock данные для виджетов
const mockITSStatus = {
  type: 'ИТС ПРОФ',
  validUntil: '31.12.2025',
  isActive: true,
};

const mockBalance = -15000; // Отрицательный баланс (задолженность)

const mockRequests = [
  { id: 1, title: 'Обновление конфигурации 1С', status: 'В работе', date: '2025-11-25' },
  { id: 2, title: 'Консультация по учету НДС', status: 'Выполнена', date: '2025-11-20' },
];

const ClientDashboard: React.FC = () => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const storedData = localStorage.getItem('clientData');
    if (storedData) {
      setClientData(JSON.parse(storedData));
    }
  }, []);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Здесь можно добавить логику обновления данных с сервера
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Приветствие */}
      <div className="bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              Добро пожаловать, {clientData?.name || 'Загрузка...'}!
            </h1>
            <p className="text-modern-primary-100">
              Здесь вы можете управлять договорами, финансами и заявками
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
              aria-label="Обновить данные"
            >
              <ArrowPathIcon className="h-6 w-6 text-white" />
            </button>
            <div className="text-right">
              <p className="text-sm text-modern-primary-100">Дата обновления данных:</p>
              <p className="text-sm font-semibold">{formatDate(lastUpdate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Сетка виджетов */}
      <div className="grid grid-cols-1 gap-6">
        {/* Виджет: Мои договора */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-modern-gray-900 mb-6">Мои договора</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ИТС ПРОФ */}
              <div className="p-4 border-2 border-modern-gray-200 rounded-lg">
                <h4 className="text-base font-semibold text-modern-gray-900 mb-3">ИТС ПРОФ</h4>
                <p className="text-sm text-green-600 font-medium mb-1">Активен до:</p>
                <p className="text-lg font-bold text-green-600">31.12.2025</p>
              </div>

              {/* Горячая линия */}
              <div className="p-4 border-2 border-modern-gray-200 rounded-lg">
                <h4 className="text-base font-semibold text-modern-gray-900 mb-3">Горячая линия</h4>
                <p className="text-sm text-green-600 font-medium mb-1">Активен до:</p>
                <p className="text-lg font-bold text-green-600">15.06.2026</p>
              </div>

              {/* Технический отдел */}
              <div className="p-4 border-2 border-modern-gray-200 rounded-lg">
                <h4 className="text-base font-semibold text-modern-gray-900 mb-3">Технический отдел</h4>
                <p className="text-sm text-red-600 font-medium mb-3">Не активен</p>
                <button className="w-full bg-modern-primary-500 hover:bg-modern-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  Отправить заявку
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Виджет: Ваш Менеджер */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-modern-gray-900">Ваш менеджер</h3>
              </div>
              <div className="w-12 h-12 bg-modern-primary-100 rounded-lg flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-modern-primary-600" />
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-modern-primary-500 to-modern-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {clientData?.manager?.firstName?.charAt(0) || 'М'}
              </div>
              <div className="ml-4">
                <p className="text-xl font-bold text-modern-gray-900">
                  {clientData?.manager
                    ? `${clientData.manager.firstName} ${clientData.manager.lastName}`
                    : 'Загрузка...'}
                </p>
                <p className="text-sm text-modern-gray-500">Персональный менеджер</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-4 bg-modern-gray-50 rounded-lg">
              <PhoneIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
              <div className="text-center">
                <a
                  href="tel:+78443300801,123"
                  className="text-lg font-semibold text-modern-gray-900 hover:text-modern-primary-600 transition-colors"
                >
                  8 (8443) 300-801 доб. 123
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Виджет: Финансы */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-modern-gray-900">Финансы</h3>
                <p className="text-sm text-modern-gray-500 mt-1">Текущий баланс</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-modern-gray-600 mb-2">Баланс счета</p>
              <p className={`text-4xl font-bold ${mockBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {mockBalance.toLocaleString('ru-RU')} ₽
              </p>
              {mockBalance < 0 && (
                <p className="text-sm text-red-600 mt-2">Задолженность</p>
              )}
            </div>

            <button className="w-full bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-modern-primary-600 hover:to-modern-primary-700 transition-all duration-200 shadow-lg shadow-modern-primary-500/30">
              Посмотреть взаиморасчеты
            </button>
          </div>
        </div>

        {/* Виджет: Управление заявками */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-modern-gray-900">Управление заявками</h3>
              </div>
              <div className="w-12 h-12 bg-modern-accent-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-modern-accent-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="flex items-center justify-center p-4 bg-modern-primary-50 text-modern-primary-700 rounded-lg hover:bg-modern-primary-100 transition-all duration-200 font-medium border border-modern-primary-200">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Записаться на горячую линию
              </button>
              <button className="flex items-center justify-center p-4 bg-modern-accent-50 text-modern-accent-700 rounded-lg hover:bg-modern-accent-100 transition-all duration-200 font-medium border border-modern-accent-200">
                <PhoneIcon className="h-5 w-5 mr-2" />
                Заказать звонок менеджера
              </button>
              <button className="flex items-center justify-center p-4 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-all duration-200 font-medium">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Написать руководству
              </button>
              <button className="flex items-center justify-center p-4 bg-modern-primary-500 text-white rounded-lg hover:bg-modern-primary-600 transition-all duration-200 font-medium shadow-lg shadow-modern-primary-500/30">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Все заявки
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
