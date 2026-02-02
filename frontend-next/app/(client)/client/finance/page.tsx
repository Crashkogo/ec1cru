import React from 'react';
import { getInvoices } from '@/actions/client-auth';
import {
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const statusConfig = {
  paid: {
    label: 'Оплачен',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon,
  },
  pending: {
    label: 'Ожидает оплаты',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon,
  },
  overdue: {
    label: 'Просрочен',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon,
  },
};

export default async function ClientFinancePage() {
  // Загружаем реальные данные через Server Action
  const invoices = await getInvoices();

  // Вычисляем статистику
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPending = invoices
    .filter((inv) => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-modern-gray-900">Финансы</h1>
        <p className="text-modern-gray-600 mt-2">Управление счетами и платежами</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-modern-gray-600">Оплачено</h3>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{totalPaid.toLocaleString('ru-RU')} ₽</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-modern-gray-600">К оплате</h3>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{totalPending.toLocaleString('ru-RU')} ₽</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-modern-gray-600">Всего счетов</h3>
            <div className="w-10 h-10 bg-modern-primary-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-5 w-5 text-modern-primary-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-modern-gray-900">{invoices.length}</p>
        </div>
      </div>

      {/* Список счетов */}
      <div className="bg-white rounded-xl shadow-lg border border-modern-gray-200 overflow-hidden">
        <div className="p-6 border-b border-modern-gray-200">
          <h2 className="text-xl font-bold text-modern-gray-900">Счета</h2>
          <p className="text-sm text-modern-gray-600 mt-1">История выставленных счетов</p>
        </div>

        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <CurrencyDollarIcon className="h-16 w-16 text-modern-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-modern-gray-900 mb-2">Нет счетов</h3>
            <p className="text-modern-gray-600">У вас пока нет выставленных счетов</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-modern-gray-50 border-b border-modern-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-modern-gray-700 uppercase tracking-wider">
                    Номер
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-modern-gray-700 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-modern-gray-700 uppercase tracking-wider">
                    Описание
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-modern-gray-700 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-modern-gray-700 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-modern-gray-700 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-modern-gray-200">
                {invoices.map((invoice) => {
                  const status = statusConfig[invoice.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  const formattedDate = new Date(invoice.date).toLocaleDateString('ru-RU');

                  return (
                    <tr key={invoice.id} className="hover:bg-modern-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-modern-gray-900">
                          {invoice.number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-modern-gray-600">{formattedDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-modern-gray-900">{invoice.description || 'Без описания'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-modern-gray-900">
                          {invoice.amount.toLocaleString('ru-RU')} ₽
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="inline-flex items-center px-3 py-2 border border-modern-primary-500 text-modern-primary-600 rounded-lg hover:bg-modern-primary-50 transition-all duration-200 text-sm font-medium">
                          <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {invoices.length > 0 && (
          <div className="px-6 py-4 bg-modern-gray-50 border-t border-modern-gray-200 flex items-center justify-between">
            <p className="text-sm text-modern-gray-600">
              Показано <span className="font-semibold">{invoices.length}</span> из{' '}
              <span className="font-semibold">{invoices.length}</span> счетов
            </p>
          </div>
        )}
      </div>

      {/* Быстрые действия */}
      <div className="bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 rounded-xl p-6 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-4">Нужна помощь с оплатой?</h3>
        <p className="text-modern-primary-100 mb-4">
          Свяжитесь с вашим менеджером для уточнения деталей платежа или настройки автоплатежа
        </p>
        <button className="bg-white text-modern-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-modern-gray-100 transition-all duration-200">
          Связаться с менеджером
        </button>
      </div>
    </div>
  );
}
