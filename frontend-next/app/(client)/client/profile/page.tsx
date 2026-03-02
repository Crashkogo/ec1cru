import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { BuildingOfficeIcon, LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { ChangePasswordButton } from '@/components/client/ChangePasswordButton';
import type { ManagerData } from '@/types/client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')
  || '';

function ManagerCard({ manager, title }: { manager: ManagerData; title: string }) {
  const photoSrc = manager.photoUrl ? `${BACKEND_URL}${manager.photoUrl}` : null;
  return (
    <div className="flex items-center gap-4 p-4 bg-modern-gray-50 rounded-xl border border-modern-gray-200">
      <div className="flex-shrink-0">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={`${manager.firstName} ${manager.lastName}`}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover shadow"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-modern-primary-500 to-modern-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow">
            {manager.firstName?.charAt(0) || 'М'}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-modern-gray-500 mb-0.5">{title}</p>
        <p className="text-base font-bold text-modern-gray-900">
          {manager.firstName} {manager.lastName}
        </p>
      </div>
    </div>
  );
}

export default async function ClientProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }
  const { client: clientData } = session;
  const hasManagers = clientData.manager || clientData.managerTech;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-modern-gray-900">Профиль</h1>
        <p className="text-modern-gray-600 mt-2">Информация о вашей организации</p>
      </div>

      {/* Верхняя строка: Организация + Безопасность */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Организация */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-modern-primary-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="h-5 w-5 text-modern-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-modern-gray-900">Организация</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-modern-gray-500 uppercase tracking-wide mb-1">
                Наименование
              </label>
              <p className="text-base font-semibold text-modern-gray-900">{clientData.name}</p>
            </div>
            <div className="border-t border-modern-gray-100 pt-4">
              <label className="block text-xs font-medium text-modern-gray-500 uppercase tracking-wide mb-1">
                ИНН
              </label>
              <p className="text-base font-mono text-modern-gray-900">{clientData.inn}</p>
            </div>
          </div>
        </div>

        {/* Безопасность */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-modern-gray-100 rounded-lg flex items-center justify-center">
              <LockClosedIcon className="h-5 w-5 text-modern-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-modern-gray-900">Безопасность</h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-modern-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-modern-gray-900">Пароль</p>
              <p className="text-sm text-modern-gray-500">Вход по ИНН и паролю</p>
            </div>
            <ChangePasswordButton />
          </div>
        </div>
      </div>

      {/* Нижняя строка: Менеджеры */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-modern-primary-100 rounded-lg flex items-center justify-center">
            <UserCircleIcon className="h-5 w-5 text-modern-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-modern-gray-900">Ваши менеджеры</h2>
        </div>

        {!hasManagers ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 text-center">
              Закреплённый менеджер отсутствует. Обратитесь к администратору за назначением личного менеджера.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clientData.manager && (
              <ManagerCard manager={clientData.manager} title="Менеджер по 1С" />
            )}
            {clientData.managerTech && (
              <ManagerCard manager={clientData.managerTech} title="Менеджер технического отдела" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
