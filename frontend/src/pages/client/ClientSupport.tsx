import React, { useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

// Mock данные для заявок
const mockTickets = [
  {
    id: 1,
    title: 'Обновление конфигурации 1С:Бухгалтерия',
    description: 'Необходимо обновить конфигурацию до последней версии',
    status: 'in_progress',
    createdAt: '2025-11-25 14:30',
    updatedAt: '2025-11-26 10:15',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Консультация по учету НДС',
    description: 'Вопрос по правильному отражению НДС в учетной системе',
    status: 'completed',
    createdAt: '2025-11-20 09:00',
    updatedAt: '2025-11-21 16:45',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Ошибка при проведении документа',
    description: 'При проведении накладной возникает ошибка "Недостаточно прав"',
    status: 'new',
    createdAt: '2025-11-27 11:20',
    updatedAt: '2025-11-27 11:20',
    priority: 'high',
  },
  {
    id: 4,
    title: 'Настройка печатных форм',
    description: 'Требуется настроить печатную форму счета-фактуры',
    status: 'completed',
    createdAt: '2025-11-15 15:00',
    updatedAt: '2025-11-18 12:30',
    priority: 'low',
  },
];

const statusConfig = {
  new: {
    label: 'Новая',
    color: 'bg-blue-100 text-blue-800',
    icon: ClockIcon,
  },
  in_progress: {
    label: 'В работе',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon,
  },
  completed: {
    label: 'Выполнена',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon,
  },
  cancelled: {
    label: 'Отменена',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon,
  },
};

const priorityConfig = {
  low: { label: 'Низкий', color: 'text-green-600' },
  medium: { label: 'Средний', color: 'text-yellow-600' },
  high: { label: 'Высокий', color: 'text-red-600' },
};

const ClientSupport: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  const newTicketsCount = mockTickets.filter((t) => t.status === 'new').length;
  const inProgressCount = mockTickets.filter((t) => t.status === 'in_progress').length;
  const completedCount = mockTickets.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-modern-gray-900">Поддержка</h1>
          <p className="text-modern-gray-600 mt-2">Управление заявками и обращениями</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white rounded-lg hover:from-modern-primary-600 hover:to-modern-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-modern-primary-500/30"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Создать заявку
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-modern-gray-600">Всего заявок</h3>
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-modern-gray-400" />
          </div>
          <p className="text-3xl font-bold text-modern-gray-900">{mockTickets.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-modern-gray-600">Новые</h3>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{newTicketsCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-modern-gray-600">В работе</h3>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{inProgressCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-modern-gray-600">Выполнены</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        </div>
      </div>

      {/* Список заявок */}
      <div className="bg-white rounded-xl shadow-lg border border-modern-gray-200 overflow-hidden">
        <div className="p-6 border-b border-modern-gray-200">
          <h2 className="text-xl font-bold text-modern-gray-900">Мои заявки</h2>
          <p className="text-sm text-modern-gray-600 mt-1">История обращений в техподдержку</p>
        </div>

        <div className="divide-y divide-modern-gray-200">
          {mockTickets.map((ticket) => {
            const status = statusConfig[ticket.status as keyof typeof statusConfig];
            const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig];
            const StatusIcon = status.icon;

            return (
              <div
                key={ticket.id}
                className={`p-6 hover:bg-modern-gray-50 transition-colors cursor-pointer ${
                  selectedTicket === ticket.id ? 'bg-modern-primary-50' : ''
                }`}
                onClick={() => setSelectedTicket(ticket.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-modern-gray-900">
                        {ticket.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-modern-gray-600 mb-3">{ticket.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-modern-gray-500">
                      <span>Заявка #{ticket.id}</span>
                      <span>•</span>
                      <span>Создана: {ticket.createdAt}</span>
                      <span>•</span>
                      <span className={`font-semibold ${priority.color}`}>
                        Приоритет: {priority.label}
                      </span>
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 border border-modern-primary-500 text-modern-primary-600 rounded-lg hover:bg-modern-primary-50 transition-all duration-200 text-sm font-medium">
                    Подробнее
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Модальное окно создания заявки (заглушка) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-modern-gray-200">
              <h2 className="text-2xl font-bold text-modern-gray-900">Создать заявку</h2>
              <p className="text-sm text-modern-gray-600 mt-1">Опишите вашу проблему или вопрос</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                  Тема заявки
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent"
                  placeholder="Кратко опишите проблему"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                  Приоритет
                </label>
                <select className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent">
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                  Описание проблемы
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent"
                  placeholder="Подробно опишите вашу проблему или вопрос..."
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-modern-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border border-modern-gray-300 text-modern-gray-700 rounded-lg hover:bg-modern-gray-50 transition-all duration-200 font-medium"
              >
                Отмена
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white rounded-lg hover:from-modern-primary-600 hover:to-modern-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-modern-primary-500/30">
                Создать заявку
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Полезная информация */}
      <div className="bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 rounded-xl p-6 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-2">База знаний</h3>
        <p className="text-modern-primary-100 mb-4">
          Часто задаваемые вопросы и решения типовых проблем
        </p>
        <button className="bg-white text-modern-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-modern-gray-100 transition-all duration-200">
          Перейти в базу знаний
        </button>
      </div>
    </div>
  );
};

export default ClientSupport;
