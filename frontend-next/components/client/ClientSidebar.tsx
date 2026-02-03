// components/client/ClientSidebar.tsx
'use client'; // Директива, объявляющая, что это Клиентский Компонент

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image'; 

// Тип для данных клиента, вы можете вынести его в @/types/index.ts
interface ClientData {
  id: number;
  inn: string;
  name: string;
  manager: {
    firstName: string;
    lastName: string;
  };
}

interface ClientSidebarProps {
  clientData: ClientData;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const menuItems = [
    { title: 'Главная', path: '/client', icon: HomeIcon, exact: true },
    { title: 'Договоры', path: '/client/contracts', icon: DocumentTextIcon },
    { title: 'Финансы', path: '/client/finance', icon: CurrencyDollarIcon },
    { title: 'Поддержка', path: '/client/support', icon: ChatBubbleLeftRightIcon },
    { title: 'Профиль', path: '/client/profile', icon: UserCircleIcon },
];

// Компонент для навигации
const SidebarNav = ({ onLinkClick }: { onLinkClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = (path: string, exact: boolean = false) => {
        if (exact) {
          return pathname === path;
        }
        return pathname.startsWith(path);
    };

    return (
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onLinkClick}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white shadow-lg shadow-modern-primary-500/30'
                    : 'text-modern-gray-700 hover:bg-modern-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
    );
};


// Компонент с информацией о пользователе и кнопкой выхода
const UserInfo = ({ clientData }: { clientData: ClientData }) => {
    // TODO: Заменить на Server Action для выхода
    const handleLogout = () => {
        console.log("Выход...");
        // Здесь будет server action для очистки cookie
        window.location.href = '/';
    };

    return (
        <div className="p-4 border-t border-modern-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-modern-primary-500 to-modern-primary-600 rounded-full flex items-center justify-center text-white font-bold">
              {clientData?.name?.charAt(0) || 'К'}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-modern-gray-900 truncate">
                {clientData?.name || 'Загрузка...'}
              </p>
              <p className="text-xs text-modern-gray-500">ИНН: {clientData?.inn || '---'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Выйти
          </button>
        </div>
    );
};


// Основной компонент сайдбара
const ClientSidebar: React.FC<ClientSidebarProps> = ({ clientData, isSidebarOpen, setIsSidebarOpen }) => {
    return (
    <>
      {/* Sidebar для десктопа */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-modern-gray-200 shadow-sm z-30 flex-col">
        <div className="p-6 border-b border-modern-gray-200">
          <Image src="/logo.png" alt="1C Support" width={120} height={48} className="h-12 w-auto" priority />
          <p className="text-xs text-modern-gray-500 mt-2">Личный кабинет</p>
        </div>
        <SidebarNav />
        <UserInfo clientData={clientData} />
      </aside>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-modern-gray-200 shadow-lg z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="p-6 border-b border-modern-gray-200 flex items-center justify-between">
          <div>
            <Image src="/logo.png" alt="1C Support" width={100} height={40} className="h-10 w-auto" />
            <p className="text-xs text-modern-gray-500 mt-1">Личный кабинет</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-modern-gray-100"
          >
            <XMarkIcon className="h-5 w-5 text-modern-gray-500" />
          </button>
        </div>
        <SidebarNav onLinkClick={() => setIsSidebarOpen(false)} />
        <UserInfo clientData={clientData} />
      </aside>
    </>
  );
};

export default ClientSidebar;
