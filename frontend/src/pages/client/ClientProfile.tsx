import React, { useState, useEffect } from 'react';
import { UserCircleIcon, BuildingOfficeIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface ClientData {
  id: number;
  inn: string;
  name: string;
  manager: {
    firstName: string;
    lastName: string;
  };
}

const ClientProfile: React.FC = () => {
  const [clientData, setClientData] = useState<ClientData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('clientData');
    if (storedData) {
      setClientData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-modern-gray-900">Профиль</h1>
        <p className="text-modern-gray-600 mt-2">Информация о вашей организации</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <h2 className="text-xl font-bold text-modern-gray-900 mb-6">Информация о компании</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                Наименование организации
              </label>
              <div className="flex items-center px-4 py-3 bg-modern-gray-50 rounded-lg">
                <BuildingOfficeIcon className="h-5 w-5 text-modern-gray-400 mr-3" />
                <span className="text-modern-gray-900">{clientData?.name || 'Загрузка...'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-modern-gray-700 mb-2">ИНН</label>
              <div className="px-4 py-3 bg-modern-gray-50 rounded-lg">
                <span className="text-modern-gray-900 font-mono">{clientData?.inn || 'Загрузка...'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                Email (заглушка)
              </label>
              <div className="flex items-center px-4 py-3 bg-modern-gray-50 rounded-lg">
                <EnvelopeIcon className="h-5 w-5 text-modern-gray-400 mr-3" />
                <span className="text-modern-gray-900">info@example.com</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                Телефон (заглушка)
              </label>
              <div className="flex items-center px-4 py-3 bg-modern-gray-50 rounded-lg">
                <PhoneIcon className="h-5 w-5 text-modern-gray-400 mr-3" />
                <span className="text-modern-gray-900">+7 (XXX) XXX-XX-XX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Менеджер */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
          <h2 className="text-xl font-bold text-modern-gray-900 mb-6">Ваш менеджер</h2>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-modern-primary-500 to-modern-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
              {clientData?.manager?.firstName?.charAt(0) || 'М'}
            </div>
            <h3 className="text-lg font-bold text-modern-gray-900">
              {clientData?.manager
                ? `${clientData.manager.firstName} ${clientData.manager.lastName}`
                : 'Загрузка...'}
            </h3>
            <p className="text-sm text-modern-gray-600">Персональный менеджер</p>
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

      {/* Безопасность */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-modern-gray-200">
        <h2 className="text-xl font-bold text-modern-gray-900 mb-6">Безопасность</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-modern-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-modern-gray-900">Пароль</p>
              <p className="text-sm text-modern-gray-600">Последнее изменение: никогда</p>
            </div>
            <button className="px-4 py-2 bg-modern-primary-600 text-white rounded-lg hover:bg-modern-primary-700 transition-all duration-200 font-medium">
              Изменить пароль
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
