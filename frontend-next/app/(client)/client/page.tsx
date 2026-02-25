// frontend-next/app/(client)/client/page.tsx
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getDashboardStats } from '@/actions/client-auth';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserCircleIcon,
  PhoneIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import type { ManagerData } from '@/types/client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

// Компонент карточки одного менеджера
function ManagerCard({ manager, title }: { manager: ManagerData; title: string }) {
  const photoSrc = manager.photoUrl ? `${BACKEND_URL}${manager.photoUrl}` : null;
  return (
    <div className="flex items-center gap-4 p-4 bg-modern-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={`${manager.firstName} ${manager.lastName}`}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover shadow"
          />
        ) : (
          <div className="w-14 h-14 bg-gradient-to-br from-modern-primary-500 to-modern-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow">
            {manager.firstName?.charAt(0) || 'М'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-modern-gray-500 mb-0.5">{title}</p>
        <p className="text-base font-bold text-modern-gray-900 truncate">
          {manager.firstName} {manager.lastName}
        </p>
      </div>
    </div>
  );
}
import { WelcomeHeader } from '@/components/client/WelcomeHeader';

// Это серверный компонент, поэтому вся логика выполняется на сервере
export default async function ClientDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }
  const { client: clientData } = session;

  // Загружаем статистику с backend
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Приветствие. Кнопка "Обновить" требует интерактива, поэтому вынесена в клиентский компонент */}
      <WelcomeHeader clientName={clientData.name} />

      {/* Управление заявками — горизонтальная полоса под приветствием */}
      <div className="bg-white rounded-xl shadow-lg border border-modern-gray-200 p-4">
        <h3 className="text-sm font-semibold text-modern-gray-500 uppercase tracking-wide mb-3">Управление заявками</h3>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center px-4 py-2.5 bg-modern-primary-50 text-modern-primary-700 rounded-lg hover:bg-modern-primary-100 transition-all duration-200 font-medium border border-modern-primary-200 text-sm whitespace-nowrap">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            Заявка на линию консультаций
          </button>
          <button className="flex items-center px-4 py-2.5 bg-modern-accent-50 text-modern-accent-700 rounded-lg hover:bg-modern-accent-100 transition-all duration-200 font-medium border border-modern-accent-200 text-sm whitespace-nowrap">
            <WrenchScrewdriverIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            Заявка в технический отдел
          </button>
          <button className="flex items-center px-4 py-2.5 bg-modern-accent-50 text-modern-accent-700 rounded-lg hover:bg-modern-accent-100 transition-all duration-200 font-medium border border-modern-accent-200 text-sm whitespace-nowrap">
            <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            Заказать звонок менеджера
          </button>
          <button className="flex items-center px-4 py-2.5 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-all duration-200 font-medium text-sm whitespace-nowrap">
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            Написать руководству
          </button>
          <a
            href="/client/support"
            className="flex items-center px-4 py-2.5 bg-modern-primary-500 text-white rounded-lg hover:bg-modern-primary-600 transition-all duration-200 font-medium shadow-lg shadow-modern-primary-500/30 text-sm whitespace-nowrap"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            Все заявки
          </a>
        </div>
      </div>

      {/* Сетка виджетов */}
      <div className="grid grid-cols-1 gap-6">
        {/* Виджет: Мои договоры */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-modern-gray-900 mb-6">Мои договоры</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ИТС ПРОФ */}
              <div className="p-4 border-2 border-modern-gray-200 rounded-lg">
                <h4 className="text-base font-semibold text-modern-gray-900 mb-3">ИТС ПРОФ</h4>
                <p className="text-sm text-green-600 font-medium mb-1">Активен до:</p>
                <p className="text-lg font-bold text-green-600">31.12.2025</p>
              </div>

              {/* Линия консультаций */}
              <div className="p-4 border-2 border-modern-gray-200 rounded-lg">
                <h4 className="text-base font-semibold text-modern-gray-900 mb-3">Линия консультаций</h4>
                <p className="text-sm text-green-600 font-medium mb-1">Активен до:</p>
                <p className="text-lg font-bold text-green-600">15.06.2026</p>
              </div>

              {/* Технический отдел */}
              <div className="p-4 border-2 border-modern-gray-200 rounded-lg">
                <h4 className="text-base font-semibold text-modern-gray-900 mb-3">Технический отдел</h4>
                <p className="text-sm text-red-600 font-medium mb-3">Не активен</p>
                <button className="w-full bg-modern-primary-500 hover:bg-modern-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  Хочу договор
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Виджет: Ваши менеджеры */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-modern-gray-900">Ваши менеджеры</h3>
              <div className="w-12 h-12 bg-modern-primary-100 rounded-lg flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-modern-primary-600" />
              </div>
            </div>

            {/* Если ни один менеджер не назначен */}
            {!clientData?.manager && !clientData?.managerTech ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                  Закреплённый менеджер отсутствует, обратитесь к администратору за назначением личного менеджера
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {clientData.manager && (
                  <ManagerCard manager={clientData.manager} title="Менеджер по 1С" />
                )}
                {clientData.managerTech && (
                  <ManagerCard manager={clientData.managerTech} title="Менеджер технического отдела" />
                )}
              </div>
            )}

            <div className="flex items-center justify-center p-3 bg-modern-gray-50 rounded-lg mt-4">
              <PhoneIcon className="h-5 w-5 text-modern-primary-600 mr-3 flex-shrink-0" />
              <a
                href="tel:+78443300801"
                className="text-base font-semibold text-modern-gray-900 hover:text-modern-primary-600 transition-colors"
              >
                8 (8443) 300-801
              </a>
            </div>
          </div>
        </div>

        {/* Виджет: Финансы */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-modern-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-modern-gray-900">Финансы</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Баланс по 1С */}
              <div className="p-4 bg-modern-gray-50 rounded-lg">
                <p className="text-sm text-modern-gray-600 mb-1">Баланс по 1С</p>
                <p className={`text-2xl font-bold ${(stats?.balance || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {(stats?.balance || 0).toLocaleString('ru-RU')} ₽
                </p>
                {(stats?.balance || 0) < 0 && (
                  <p className="text-xs text-red-600 mt-1">Задолженность</p>
                )}
              </div>
              {/* Баланс по техническому обслуживанию */}
              <div className="p-4 bg-modern-gray-50 rounded-lg">
                <p className="text-sm text-modern-gray-600 mb-1">Баланс по техническому обслуживанию</p>
                <p className="text-2xl font-bold text-green-600">
                  0 ₽
                </p>
              </div>
            </div>

            <a
              href="/client/finance"
              className="block w-full text-center bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-modern-primary-600 hover:to-modern-primary-700 transition-all duration-200 shadow-lg shadow-modern-primary-500/30"
            >
              Посмотреть взаиморасчеты
            </a>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
