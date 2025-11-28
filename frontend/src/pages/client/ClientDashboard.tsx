import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
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

  useEffect(() => {
    const storedData = localStorage.getItem('clientData');
    if (storedData) {
      setClientData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Приветствие */}
      <div className="bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">
          Добро пожаловать, {clientData?.name || 'Загрузка...'}!
        </h1>
        <p className="text-modern-primary-100">
          Здесь вы можете управлять договорами, финансами и заявками
        </p>
      </div>

      {/* Сетка виджетов */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Виджет: Статус ИТС */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-modern-gray-900">Статус ИТС</h3>
                <p className="text-sm text-modern-gray-500 mt-1">Техническая поддержка</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ● Активен
                </span>
              </div>

              <div className="text-2xl font-bold text-modern-gray-900">{mockITSStatus.type}</div>

              <div className="flex items-center text-modern-gray-600">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">Действителен до {mockITSStatus.validUntil}</span>
              </div>
            </div>

            <button className="mt-6 w-full bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-modern-primary-600 hover:to-modern-primary-700 transition-all duration-200 shadow-lg shadow-modern-primary-500/30">
              Продлить
            </button>
          </div>
        </div>

        {/* Виджет: Ваш Менеджер */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-modern-gray-900">Ваш менеджер</h3>
                <p className="text-sm text-modern-gray-500 mt-1">Персональная поддержка</p>
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

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-modern-primary-50 text-modern-primary-700 rounded-lg hover:bg-modern-primary-100 transition-all duration-200 font-medium border border-modern-primary-200">
                <PhoneIcon className="h-5 w-5 mr-2" />
                Позвонить
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-all duration-200 font-medium">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Написать
              </button>
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

            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg shadow-green-500/30">
              Оплатить онлайн
            </button>
          </div>
        </div>

        {/* Виджет: Заявки */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-modern-gray-900">Последние заявки</h3>
                <p className="text-sm text-modern-gray-500 mt-1">Обращения в поддержку</p>
              </div>
              <div className="w-12 h-12 bg-modern-accent-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-modern-accent-600" />
              </div>
            </div>

            <div className="space-y-3">
              {mockRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 bg-modern-gray-50 rounded-lg hover:bg-modern-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-modern-gray-900">{request.title}</p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'В работе'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-xs text-modern-gray-500">{request.date}</p>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full text-modern-primary-600 hover:text-modern-primary-700 font-medium text-sm py-2 transition-colors">
              Посмотреть все заявки →
            </button>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
        <h3 className="text-lg font-semibold text-modern-gray-900 mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-modern-gray-200 rounded-lg hover:border-modern-primary-500 hover:bg-modern-primary-50 transition-all duration-200 text-left">
            <DocumentTextIcon className="h-6 w-6 text-modern-primary-600 mb-2" />
            <p className="font-semibold text-modern-gray-900">Договоры</p>
            <p className="text-sm text-modern-gray-500">Посмотреть документы</p>
          </button>
          <button className="p-4 border-2 border-modern-gray-200 rounded-lg hover:border-modern-primary-500 hover:bg-modern-primary-50 transition-all duration-200 text-left">
            <CurrencyDollarIcon className="h-6 w-6 text-modern-primary-600 mb-2" />
            <p className="font-semibold text-modern-gray-900">Счета</p>
            <p className="text-sm text-modern-gray-500">Оплатить онлайн</p>
          </button>
          <button className="p-4 border-2 border-modern-gray-200 rounded-lg hover:border-modern-primary-500 hover:bg-modern-primary-50 transition-all duration-200 text-left">
            <DocumentTextIcon className="h-6 w-6 text-modern-primary-600 mb-2" />
            <p className="font-semibold text-modern-gray-900">Новая заявка</p>
            <p className="text-sm text-modern-gray-500">Обратиться в поддержку</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
