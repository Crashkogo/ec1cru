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
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon
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
    },
    {
      title: 'Оборудование',
      path: '/admin#/equipment',
      icon: ComputerDesktopIcon
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
      title: 'Команда сайта',
      path: '/admin#/team-members',
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

  const MenuItem = ({ item, isSettings = false }: { item: any; isSettings?: boolean }) => {
    const isActive = typeof window !== 'undefined' &&
      window.location.hash.startsWith('#' + (item.path.split('#')[1] || ''));
    return (
      <a
        href={item.path}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${isSettings ? 'ml-4' : ''} ${
          isActive
            ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-500 pl-2'
            : 'text-slate-300 hover:bg-white/[0.08] hover:text-white border-l-2 border-transparent'
        }`}
        onClick={() => setIsMobileOpen(false)}
      >
        <item.icon className={`h-4 w-4 flex-shrink-0 mr-3 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
        <span className="flex-1">{item.title}</span>
      </a>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
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
            className="h-10 w-auto transition-transform duration-200 group-hover:scale-105 brightness-0 invert opacity-90"
          />
        </Link>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors duration-200"
        >
          <XMarkIcon className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {/* Dashboard */}
        <MenuItem item={dashboardItem} />

        {/* Посты Section */}
        <div className="pt-1">
          <button
            onClick={() => setPostsOpen(!postsOpen)}
            className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-white/[0.06] hover:text-white transition-all duration-150"
          >
            <NewspaperIcon className="h-4 w-4 flex-shrink-0 mr-3 text-slate-400 group-hover:text-slate-200" />
            <span className="flex-1 text-left">Посты</span>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${postsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {postsOpen && (
            <div className="mt-1 space-y-0.5">
              {postsItems.map((item) => (
                <MenuItem key={item.path} item={item} isSettings />
              ))}
            </div>
          )}
        </div>

        {/* Страницы Section */}
        <div className="pt-1">
          <button
            onClick={() => setPagesOpen(!pagesOpen)}
            className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-white/[0.06] hover:text-white transition-all duration-150"
          >
            <BuildingOffice2Icon className="h-4 w-4 flex-shrink-0 mr-3 text-slate-400 group-hover:text-slate-200" />
            <span className="flex-1 text-left">Страницы</span>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${pagesOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {pagesOpen && (
            <div className="mt-1 space-y-0.5">
              {pagesItems.map((item) => (
                <MenuItem key={item.path} item={item} isSettings />
              ))}
            </div>
          )}
        </div>

        {/* Управление рассылками Section */}
        <div className="pt-1">
          <button
            onClick={() => setNewslettersOpen(!newslettersOpen)}
            className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-white/[0.06] hover:text-white transition-all duration-150"
          >
            <EnvelopeIcon className="h-4 w-4 flex-shrink-0 mr-3 text-slate-400 group-hover:text-slate-200" />
            <span className="flex-1 text-left">Управление рассылками</span>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${newslettersOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {newslettersOpen && (
            <div className="mt-1 space-y-0.5">
              {newslettersItems.map((item) => (
                <MenuItem key={item.path} item={item} isSettings />
              ))}
            </div>
          )}
        </div>

        {/* Настройки Section */}
        <div className="pt-4 border-t border-white/[0.06] mt-4">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-white/[0.06] hover:text-white transition-all duration-150"
          >
            <CogIcon className="h-4 w-4 flex-shrink-0 mr-3 text-slate-400 group-hover:text-slate-200" />
            <span className="flex-1 text-left">Настройки</span>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {settingsOpen && (
            <div className="mt-1 space-y-0.5">
              {settingsItems.map((item) => (
                <MenuItem key={item.path} item={item} isSettings />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 flex-shrink-0 mr-3" />
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900/90 shadow-lg hover:bg-slate-800 transition-colors duration-200"
      >
        <Bars3Icon className="h-6 w-6 text-slate-300" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-slate-900/90 backdrop-blur-xl border-r border-white/[0.06] shadow-2xl z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-slate-900/90 backdrop-blur-xl border-r border-white/[0.06] shadow-2xl transition-transform duration-300 z-50 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminMenu;
