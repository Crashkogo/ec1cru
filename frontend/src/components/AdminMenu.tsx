import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface AdminMenuProps {
  role: string;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ role }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: HomeIcon,
      exact: true
    },
    {
      title: 'Новости',
      path: '/admin/news',
      icon: NewspaperIcon
    },
    {
      title: 'Жизнь компании',
      path: '/admin/company-life',
      icon: BuildingOffice2Icon
    },
    {
      title: 'Мероприятия',
      path: '/admin/events',
      icon: CalendarDaysIcon
    },
    {
      title: 'Акции',
      path: '/admin/promotions',
      icon: GiftIcon
    },
    {
      title: 'Курсы',
      path: '/admin/courses',
      icon: NewspaperIcon
    },
    {
      title: 'Готовые решения',
      path: '/admin/ready-solutions',
      icon: BuildingOffice2Icon
    },
    {
      title: 'Рассылки',
      path: '/admin/newsletters',
      icon: EnvelopeIcon
    },
    {
      title: 'Отправка рассылок',
      path: '/admin/newsletters-send',
      icon: PaperAirplaneIcon
    },
    {
      title: 'Подписчики',
      path: '/admin/subscribers',
      icon: UserGroupIcon
    }
  ];

  const settingsItems = [
    {
      title: 'Программы',
      path: '/admin/programs',
      icon: CogIcon
    },
    {
      title: 'IT-Тарифы',
      path: '/admin/tariff-plans',
      icon: CogIcon
    }
  ];

  if (['ADMIN', 'MODERATOR'].includes(role)) {
    menuItems.push({
      title: 'Пользователи',
      path: '/admin/users',
      icon: UsersIcon
    });
  }

  const MenuItem = ({ item, isSettings = false }: { item: any; isSettings?: boolean }) => (
    <NavLink
      to={item.path}
      end={item.exact}
      className={({ isActive }) =>
        `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
          ? 'bg-modern-primary-600 text-white shadow-lg'
          : 'text-modern-gray-700 hover:bg-modern-gray-100 hover:text-modern-primary-600'
        } ${isSettings ? 'ml-6' : ''}`
      }
      onClick={() => setIsMobileOpen(false)}
    >
      <item.icon className="h-5 w-5 flex-shrink-0 mr-3" />
      <span className="flex-1">{item.title}</span>
    </NavLink>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-modern-gray-200">
        <h2 className="text-xl font-bold text-modern-gray-900">1С Админ</h2>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-modern-gray-100 transition-colors duration-200"
        >
          <XMarkIcon className="h-5 w-5 text-modern-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} />
        ))}

        {/* Settings Section */}
        <div className="pt-4 border-t border-modern-gray-200 mt-4">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-modern-gray-700 rounded-lg hover:bg-modern-gray-100 hover:text-modern-primary-600 transition-all duration-200"
          >
            <CogIcon className="h-5 w-5 flex-shrink-0 mr-3" />
            <span className="flex-1 text-left">Настройки</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''
                }`}
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