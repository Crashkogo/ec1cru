import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import logo from '../../assets/logo.png';

interface ClientLayoutProps {
  children: React.ReactNode;
}

interface ClientData {
  id: number;
  inn: string;
  name: string;
  manager: {
    firstName: string;
    lastName: string;
  };
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Загружаем данные клиента из localStorage
    const storedData = localStorage.getItem('clientData');
    if (storedData) {
      setClientData(JSON.parse(storedData));
    } else {
      // Если данных нет, перенаправляем на главную
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('clientData');
    navigate('/');
  };

  const menuItems = [
    { title: 'Главная', path: '/client', icon: HomeIcon, exact: true },
    { title: 'Договоры', path: '/client/contracts', icon: DocumentTextIcon },
    { title: 'Финансы', path: '/client/finance', icon: CurrencyDollarIcon },
    { title: 'Поддержка', path: '/client/support', icon: ChatBubbleLeftRightIcon },
    { title: 'Профиль', path: '/client/profile', icon: UserCircleIcon },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-modern-gray-50 to-modern-gray-100">
      {/* Sidebar для десктопа */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-modern-gray-200 shadow-sm z-30 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-modern-gray-200">
          <img src={logo} alt="1C Support" className="h-12 w-auto" />
          <p className="text-xs text-modern-gray-500 mt-2">Личный кабинет</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
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

        {/* User Info */}
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
        {/* Logo */}
        <div className="p-6 border-b border-modern-gray-200 flex items-center justify-between">
          <div>
            <img src={logo} alt="1C Support" className="h-10 w-auto" />
            <p className="text-xs text-modern-gray-500 mt-1">Личный кабинет</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-modern-gray-100"
          >
            <XMarkIcon className="h-5 w-5 text-modern-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white shadow-lg'
                    : 'text-modern-gray-700 hover:bg-modern-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
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
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-modern-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-modern-gray-100 transition-colors"
            >
              <Bars3Icon className="h-6 w-6 text-modern-gray-600" />
            </button>

            {/* Title (visible on desktop) */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-modern-gray-900">
                {menuItems.find((item) => isActive(item.path, item.exact))?.title || 'Личный кабинет'}
              </h1>
            </div>

            {/* Logo (mobile only) */}
            <div className="lg:hidden">
              <img src={logo} alt="1C Support" className="h-10 w-auto" />
            </div>

            {/* Notifications */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-modern-gray-100 transition-colors">
                <BellIcon className="h-6 w-6 text-modern-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User avatar (desktop only) */}
              <div className="hidden lg:flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-modern-primary-500 to-modern-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {clientData?.name?.charAt(0) || 'К'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-modern-gray-900">
                    {clientData?.name || 'Загрузка...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
