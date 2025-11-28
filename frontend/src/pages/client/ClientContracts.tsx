import React from 'react';
import { DocumentTextIcon, DocumentArrowDownIcon, CalendarIcon } from '@heroicons/react/24/outline';

// Mock данные для договоров
const mockContracts = [
  {
    id: 1,
    number: 'ДОГ-2024-001',
    title: 'Договор на оказание услуг ИТС',
    startDate: '01.01.2024',
    endDate: '31.12.2025',
    status: 'active',
    description: 'Договор на информационно-технологическое сопровождение 1С:Бухгалтерия',
  },
  {
    id: 2,
    number: 'ДОГ-2023-045',
    title: 'Договор на внедрение',
    startDate: '15.06.2023',
    endDate: '15.12.2023',
    status: 'completed',
    description: 'Договор на внедрение модуля управления торговлей',
  },
  {
    id: 3,
    number: 'ДОГ-2025-003',
    title: 'Абонентское обслуживание',
    startDate: '01.01.2025',
    endDate: '31.12.2025',
    status: 'active',
    description: 'Ежемесячное абонентское обслуживание программных продуктов 1С',
  },
];

const statusConfig = {
  active: { label: 'Активен', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Завершен', color: 'bg-gray-100 text-gray-800' },
  pending: { label: 'На согласовании', color: 'bg-yellow-100 text-yellow-800' },
};

const ClientContracts: React.FC = () => {
  const activeCount = mockContracts.filter((c) => c.status === 'active').length;
  const completedCount = mockContracts.filter((c) => c.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-modern-gray-900">Договоры</h1>
        <p className="text-modern-gray-600 mt-2">Управление договорами и соглашениями</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-modern-gray-600">Всего договоров</h3>
            <DocumentTextIcon className="h-5 w-5 text-modern-gray-400" />
          </div>
          <p className="text-3xl font-bold text-modern-gray-900">{mockContracts.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-modern-gray-600">Активные</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-green-600">{activeCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-modern-gray-600">Завершенные</h3>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-gray-600">{completedCount}</p>
        </div>
      </div>

      {/* Список договоров */}
      <div className="space-y-4">
        {mockContracts.map((contract) => {
          const status = statusConfig[contract.status as keyof typeof statusConfig];

          return (
            <div
              key={contract.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-modern-gray-900">{contract.title}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-modern-gray-600 mb-3">{contract.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-modern-gray-500">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      <span>{contract.number}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {contract.startDate} - {contract.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button className="inline-flex items-center px-4 py-2 border border-modern-primary-500 text-modern-primary-600 rounded-lg hover:bg-modern-primary-50 transition-all duration-200 text-sm font-medium whitespace-nowrap">
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    Скачать PDF
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-all duration-200 text-sm font-medium whitespace-nowrap">
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Помощь */}
      <div className="bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 rounded-xl p-6 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-2">Нужна помощь с договором?</h3>
        <p className="text-modern-primary-100 mb-4">
          Свяжитесь с вашим менеджером для получения дополнительной информации или внесения изменений в договор
        </p>
        <button className="bg-white text-modern-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-modern-gray-100 transition-all duration-200">
          Связаться с менеджером
        </button>
      </div>
    </div>
  );
};

export default ClientContracts;
