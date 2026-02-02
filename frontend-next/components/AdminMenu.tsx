'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLogout } from 'react-admin';
import {
  HomeIcon,
  NewspaperIcon,
  CalendarDaysIcon,
  GiftIcon,
  CogIcon,
  UsersIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  BuildingOffice2Icon,
  Bars3Icon,
  XMarkIcon,
  EnvelopeIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface AdminMenuProps {
  role: string;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ role }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [postsOpen, setPostsOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [newslettersOpen, setNewslettersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  const dashboardItem = {
    title: 'Dashboard',
    path: '/admin#/',
    icon: HomeIcon,
    exact: true
  };

  const postsItems = [
    {
      title: 'Новости',
      path: '/admin#/news',
      icon: NewspaperIcon
    },
    {
      title: 'Жизнь компании',
      path: '/admin#/company-life',
      icon: BuildingOffice2Icon
    },
    {
      title: 'Мероприятия',
      path: '/admin#/events',
      icon: CalendarDaysIcon
    },
    {
      title: 'Акции',
      path: '/admin#/promotions',
      icon: GiftIcon
    }
  ];

  const pagesItems = [
    {
      title: 'Готовые решения',
      path: '/admin#/ready-solutions',
      icon: BuildingOffice2Icon
    },
    {
      title: 'Курсы',
      path: '/admin#/courses',
      icon: NewspaperIcon
    },
    {
      title: 'Отзывы клиентов',
      path: '/admin#/testimonials',
      icon: ChatBubbleLeftRightIcon
    }
  ];

  const newslettersItems = [
    {
      title: 'Рассылки',
      path: '/admin#/newsletters',
      icon: EnvelopeIcon
    },
    {
      title: 'Отправка рассылок',
      path: '/admin#/newsletters-send',
      icon: PaperAirplaneIcon
    },
    {
      title: 'Подписчики',
      path: '/admin#/subscribers',
      icon: UserGroupIcon
    }
  ];

  const settingsItems = [
    {
      title: 'Программы ГР',
      path: '/admin#/programs',
      icon: CogIcon
    },
    {
      title: 'IT-Тарифы',
      path: '/admin#/tariff-plans',
      icon: CogIcon
    },
    {
      title: 'ИТС Тарифы',
      path: '/admin#/its-tariff-plans',
      icon: CogIcon
    },
    {
      title: 'Сотрудники',
      path: '/admin#/employees',
      icon: UsersIcon
    },
    {
      title: 'Клиенты',
      path: '/admin#/clients',
      icon: UserGroupIcon
    }
  ];

  // Добавляем пункт Пользователи для ADMIN и MODERATOR
  if (['ADMIN', 'MODERATOR'].includes(role)) {
    settingsItems.unshift({
      title: 'Пользователи',
      path: '/admin#/users',
      icon: UsersIcon
    });
  }

  const MenuItem = ({ item, isSettings = false }: { item: any; isSettings?: boolean }) => (
    <a
      href={item.path}
      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-modern-gray-700 hover:bg-modern-gray-100 hover:text-modern-primary-600 ${isSettings ? 'ml-6' : ''}`}
      onClick={() => setIsMobileOpen(false)}
    >
      <item.icon className="h-5 w-5 flex-shrink-0 mr-3" />
      <span className="flex-1">{item.title}</span>
    </a>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-modern-gray-200">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center hover:opacity-80 transition-opacity duration-200"
          aria-label="Перейти на главную страницу сайта"
        >
          <Image
            src="/assets/logo.png"
            alt="1C Support Logo"
            width={150}
            height={48}
            className="h-10 w-auto transition-transform duration-200 group-hover:scale-105"
          />
        </Link>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-modern-gray-100 transition-colors duration-200"
        >
          <XMarkIcon className="h-5 w-5 text-modern-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <MenuItem item={dashboardItem} />

        {/* Посты Section */}
        <div className="pt-2">
          <button
            onClick={() => setPostsOpen(!postsOpen)}
            className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-modern-gray-700 rounded-lg hover:bg-modern-gray-100 hover:text-modern-primary-600 transition-all duration-200"
          >
            <NewspaperIcon className="h-5 w-5 flex-shrink-0 mr-3" />
            <span className="flex-1 text-left">Посты</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${postsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {postsOpen && (
            <div className="mt-2 space-y-1">
              {postsItems.map((item) => (
                <MenuItem key={item.path} item={item} isSettings />
              ))}
            </div>
          )}
        </div>

        {/* Страницы Section */}
        <div className="pt-2">
          <button
            onClick={() => setPagesOpen(!pagesOpen)}
            className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-modern-gray-700 rounded-lg hover:bg-modern-gray-100 hover:text-modern-primary-600 transition-all duration-200"
          >
            <BuildingOffice2Icon className="h-5 w-5 flex-shrink-0 mr-3" />
            <span className="flex-1 text-left">Страницы</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${pagesOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {pagesOpen && (
            <div className="mt-2 space-y-1">
              {pagesItems.map((item) => (
                <MenuItem key={item.path} item={item} isSettings />
              ))}
            </div>
          )}
        </div>

        {/* Управление рассылками Section */}
        <div className="pt-2">
          <button
            onClick={() => setNewslettersOpen(!newslettersOpen)}
            className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-modern-gray-700 rounded-lg hover:bg-modern-gray-100 hover:text-modern-primary-600 transition-all duration-200"
          >
            <EnvelopeIcon className="h-5 w-5 flex-shrink-0 mr-3" />
            <span className="flex-1 text-left">Управление рассылками</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${newslettersOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {newslettersOpen && (
            <div className="mt-2 space-y-1">
              {newslettersItems.map((item) => (
                <MenuItem key={item.path} item={item} isSettings />
              ))}
            </div>
          )}
        </div>

        {/* Настройки Section */}
        <div className="pt-4 border-t border-modern-gray-200 mt-4">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-modern-gray-700 rounded-lg hover:bg-modern-gray-100 hover:text-modern-primary-600 transition-all duration-200"
          >
            <CogIcon className="h-5 w-5 flex-shrink-0 mr-3" />
            <span className="flex-1 text-left">Настройки</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {settingsOpen && (
            <div className="mt-2 space-y-1">
              {settingsItems.map((item) => (
                <MenuItem key={item.path} item={item} isSettings />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-modern-gray-200">
        <button
          onClick={handleLogout}
          className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0 mr-3" />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-modern-gray-50 transition-colors duration-200"
      >
        <Bars3Icon className="h-6 w-6 text-modern-gray-600" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-modern-gray-200 shadow-sm z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-modern-gray-200 shadow-lg transition-transform duration-300 z-50 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminMenu;
