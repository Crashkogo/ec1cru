// frontend/src/components/Header.tsx - СОВРЕМЕННАЯ ВЕРСИЯ
import { useState, useEffect, useRef, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, Bars3Icon, XMarkIcon, PhoneIcon, ComputerDesktopIcon, ChevronDownIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { authProvider } from '../admin/authProvider';
import { usePreloadOnHover } from '../utils/preloadRoutes';
import logo from '../assets/logo.png';
import CallbackModal from './CallbackModal'; // Импортируем модальное окно

interface MenuItemSimple {
  title: string;
  path: string;
}

interface SubItem {
  name: string;
  path: string;
}

interface MenuItemWithSubItems {
  title: string;
  items: SubItem[];
}

type MenuItem = MenuItemSimple | MenuItemWithSubItems;

const menuItems: MenuItem[] = [
  { title: 'Новости', path: '/news' },
  { title: 'Акции', path: '/promotions' },
  {
    title: 'Продукты',
    items: [
      { name: 'Программы 1С', path: '/1c-programs' },
      { name: 'Сервисы 1С', path: '/1c-services' },
      { name: 'Оборудование', path: '/equipment' },
      { name: 'Наши разработки', path: '/ready-solutions' },
    ],
  },
  {
    title: 'Услуги',
    items: [
      { name: 'Сопровождение', path: '/support' },
      { name: 'Внедрение', path: '/implementation' },
      { name: 'Доработка', path: '/customization' },
      { name: 'Обновление', path: '/updates' },
      { name: 'Техническое обслуживание', path: '/tech-maintenance' },
    ],
  },
  {
    title: 'Обучение',
    items: [
      { name: 'Курсы 1С', path: '/1c-courses' },
      { name: 'Сертификация', path: '/certification' },
    ],
  },
  {
    title: 'О нас',
    items: [
      { name: 'О компании', path: '/about' },
      { name: 'Супер команда', path: '/team' },
      { name: 'Работа у нас', path: 'https://career-ec.ru/' },
      { name: 'Наша жизнь', path: '/life' },
    ],
  },
];



interface HeaderProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ setShowLogin }, ref) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false); // Состояние для модального окна
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const navigate = useNavigate();
  const { handleMouseEnter } = usePreloadOnHover();

  const closeMenus = () => {
    setOpenDropdown(null);
    setIsMenuOpen(false);
  };

  const handleLoginClick = async () => {
    try {
      await authProvider.checkAuth({});
      const role = localStorage.getItem('role');
      if (role && ['ADMIN', 'MODERATOR', 'EVENTORG', 'ITS', 'DEVDEP'].includes(role)) {
        navigate('/admin/');
      } else if (role === 'CLINE') {
        navigate('/client');
      } else {
        setShowLogin(true);
      }
    } catch {
      setShowLogin(true);
    }
  };



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = !Array.from(dropdownRefs.current.values()).some(
        (ref) => ref && ref.contains(event.target as Node)
      );
      if (clickedOutside) {
        setOpenDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dropdownRefs.current.clear();
  }, []);

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <>
      <header
        ref={ref}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled
          ? 'backdrop-blur-lg bg-white/80 shadow-modern-md border-b border-modern-gray-200/50'
          : 'bg-white/95 backdrop-blur-sm shadow-modern'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                aria-label="Перейти на главную страницу"
                className="group flex items-center"
              >
                <img
                  src={logo}
                  alt="1C Support Logo"
                  className="h-16 w-auto transition-transform duration-200 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Desktop Navigation - центрированное меню */}
            <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-2">
                {menuItems.map((item) => (
                  <div
                    key={item.title}
                    className="relative"
                    ref={(el) => {
                      if (el) {
                        dropdownRefs.current.set(item.title, el);
                      } else {
                        dropdownRefs.current.delete(item.title);
                      }
                    }}
                  >
                    {'items' in item ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.title)}
                          className="group flex items-center px-4 py-2 text-modern-gray-700 hover:text-modern-primary-600 font-medium text-sm transition-all duration-200 rounded-lg hover:bg-modern-gray-50"
                          aria-expanded={openDropdown === item.title}
                          aria-label={`Открыть меню ${item.title}`}
                        >
                          <span>{item.title}</span>
                          <ChevronDownIcon
                            className={`ml-1 h-4 w-4 transition-transform duration-200 ${openDropdown === item.title ? 'rotate-180' : ''
                              }`}
                            aria-hidden="true"
                          />
                        </button>
                        {openDropdown === item.title && (
                          <div className="absolute left-0 mt-2 bg-white border border-modern-gray-200 shadow-modern-lg rounded-xl z-10 transition-all duration-200 ease-out animate-in slide-in-from-top-2">
                            <div className="py-2 w-56">
                              {item.items.map((subItem) => (
                                subItem.path.startsWith('http') ? (
                                  <a
                                    key={subItem.name}
                                    href={subItem.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-4 py-2 text-modern-gray-600 hover:text-modern-primary-600 hover:bg-modern-primary-50 rounded-lg mx-2 transition-all duration-150 text-sm"
                                    onClick={closeMenus}
                                  >
                                    {subItem.name}
                                  </a>
                                ) : (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.path}
                                    onMouseEnter={() => handleMouseEnter(subItem.path)}
                                    className="block px-4 py-2 text-modern-gray-600 hover:text-modern-primary-600 hover:bg-modern-primary-50 rounded-lg mx-2 transition-all duration-150 text-sm"
                                    onClick={closeMenus}
                                  >
                                    {subItem.name}
                                  </Link>
                                )
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        onMouseEnter={() => handleMouseEnter(item.path)}
                        className="flex items-center px-4 py-2 text-modern-gray-700 hover:text-modern-primary-600 font-medium text-sm transition-all duration-200 rounded-lg hover:bg-modern-gray-50"
                        onClick={closeMenus}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => setIsCallbackModalOpen(true)} // Открываем модальное окно
                className="group flex items-center px-5 py-2.5 bg-modern-primary-50 text-modern-primary-700 rounded-xl hover:bg-modern-primary-100 transition-all duration-200 text-sm font-medium border border-modern-primary-200/50"
                aria-label="Заказать звонок"
              >
                <PhoneIcon
                  className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                  aria-hidden="true"
                />
                <span>Заказать звонок</span>
              </button>

              <button
                className="group flex items-center px-5 py-2.5 bg-modern-accent-50 text-modern-accent-700 rounded-xl hover:bg-modern-accent-100 transition-all duration-200 text-sm font-medium border border-modern-accent-200/50"
                aria-label="Удаленный доступ"
              >
                <ComputerDesktopIcon
                  className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                  aria-hidden="true"
                />
                <span>Удаленный доступ</span>
              </button>

              {/* Contact Info */}
              <div className="flex flex-col text-left px-3">
                <a
                  href="tel:+78443300801"
                  className="flex items-center text-modern-gray-700 hover:text-modern-primary-600 transition-colors duration-200 text-sm"
                  aria-label="Позвонить по телефону 8(8443)300-801"
                >
                  <PhoneIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                  8 (8443) 300-801
                </a>
                <a
                  href="mailto:mail@ec-1c.ru"
                  className="flex items-center text-modern-gray-700 hover:text-modern-primary-600 transition-colors duration-200 text-sm"
                  aria-label="Написать на email mail@ec-1c.ru"
                >
                  <EnvelopeIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                  mail@ec-1c.ru
                </a>
              </div>

              <button
                onClick={handleLoginClick}
                onMouseEnter={() => handleMouseEnter('/admin')}
                className="group flex items-center px-4 py-2.5 bg-modern-gray-100 hover:bg-modern-gray-200 text-modern-gray-600 hover:text-modern-gray-800 rounded-xl transition-all duration-200 text-sm font-medium"
                aria-label="Открыть форму входа"
              >
                <UserCircleIcon
                  className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                  aria-hidden="true"
                />
                <span>Войти</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden ml-auto">
              <button
                className="flex items-center justify-center w-10 h-10 text-modern-gray-600 hover:text-modern-primary-600 hover:bg-modern-primary-50 rounded-lg transition-all duration-200 border border-modern-gray-200 hover:border-modern-primary-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-modern-gray-200">
            <nav className="px-4 py-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className="py-1"
                  ref={(el) => {
                    if (el) {
                      dropdownRefs.current.set(item.title, el);
                    } else {
                      dropdownRefs.current.delete(item.title);
                    }
                  }}
                >
                  {'items' in item ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.title)}
                        className="w-full flex items-center justify-between px-3 py-3 text-modern-gray-700 hover:text-modern-primary-600 hover:bg-modern-gray-50 font-medium text-base rounded-lg transition-all duration-200"
                        aria-expanded={openDropdown === item.title}
                      >
                        {item.title}
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform duration-200 ${openDropdown === item.title ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                      {openDropdown === item.title && (
                        <div className="pl-4 pt-2 pb-3 space-y-1">
                          {item.items.map((subItem) => (
                            subItem.path.startsWith('http') ? (
                              <a
                                key={subItem.name}
                                href={subItem.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-6 py-2 text-modern-gray-600 hover:text-modern-primary-600 hover:bg-modern-primary-50 rounded-lg transition-all duration-150 text-sm"
                                onClick={closeMenus}
                              >
                                {subItem.name}
                              </a>
                            ) : (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                onMouseEnter={() => handleMouseEnter(subItem.path)}
                                className="block px-6 py-2 text-modern-gray-600 hover:text-modern-primary-600 hover:bg-modern-primary-50 rounded-lg transition-all duration-150 text-sm"
                                onClick={closeMenus}
                              >
                                {subItem.name}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onMouseEnter={() => handleMouseEnter(item.path)}
                      className="block px-3 py-3 text-modern-gray-700 hover:text-modern-primary-600 hover:bg-modern-gray-50 font-medium rounded-lg transition-all duration-200"
                      onClick={closeMenus}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Action Buttons */}
              <div className="pt-4 mt-4 border-t border-modern-gray-200/50 space-y-2">
                <button
                  onClick={() => {
                    setIsCallbackModalOpen(true); // Открываем модальное окно
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-modern-primary-50 text-modern-primary-700 rounded-xl hover:bg-modern-primary-100 transition-all duration-200 font-medium border border-modern-primary-200/50"
                  aria-label="Заказать звонок"
                >
                  <PhoneIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span>Заказать звонок</span>
                </button>

                <button
                  className="w-full flex items-center justify-center px-4 py-3 bg-modern-accent-50 text-modern-accent-700 rounded-xl hover:bg-modern-accent-100 transition-all duration-200 font-medium border border-modern-accent-200/50"
                  aria-label="Удаленный доступ"
                >
                  <ComputerDesktopIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span>Удаленный доступ</span>
                </button>

                {/* Mobile Contact Info */}
                <div className="flex flex-col items-center space-y-1 py-2">
                  <a
                    href="tel:+78443300801"
                    className="flex items-center text-modern-gray-700 hover:text-modern-primary-600 transition-colors duration-200 text-sm"
                    aria-label="Позвонить по телефону 8(8443)300-801"
                  >
                    <PhoneIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                    8(8443)300-801
                  </a>
                  <a
                    href="mailto:mail@ec-1c.ru"
                    className="flex items-center text-modern-gray-700 hover:text-modern-primary-600 transition-colors duration-200 text-sm"
                    aria-label="Написать на email mail@ec-1c.ru"
                  >
                    <EnvelopeIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                    mail@ec-1c.ru
                  </a>
                </div>

                <button
                  onClick={() => {
                    handleLoginClick();
                    setIsMenuOpen(false);
                  }}
                  onMouseEnter={() => handleMouseEnter('/admin')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-modern-gray-100 text-modern-gray-700 rounded-xl hover:bg-modern-gray-200 transition-all duration-200 font-medium"
                  aria-label="Открыть форму входа"
                >
                  <UserCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span>Личный кабинет</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
      <CallbackModal isOpen={isCallbackModalOpen} onClose={() => setIsCallbackModalOpen(false)} />
    </>
  );
});

export default Header;