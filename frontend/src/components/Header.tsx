// frontend/src/components/Header.tsx
import { useState, useEffect, useRef, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';

// Тип для простого пункта меню
interface MenuItemSimple {
  title: string;
  path: string;
}

// Тип для пункта меню с подменю (один столбец)
interface MenuItemWithSubItems {
  title: string;
  items: { name: string; path: string }[];
}

// Тип для пункта меню с подменю в виде столбцов (для "Услуги")
interface MenuItemWithColumns {
  title: string;
  items: { column: string; subItems: { name: string; path: string }[] }[];
}

// Объединяем все возможные типы меню
type MenuItem = MenuItemSimple | MenuItemWithSubItems | MenuItemWithColumns;

// Структура меню
const menuItems: MenuItem[] = [
  {
    title: 'Компания',
    items: [
      { name: 'Информация', path: '/about' },
      { name: 'Наша команда', path: '/team' },
      { name: 'Вакансии', path: '/careers' },
      { name: 'Наша жизнь', path: '/life' },
    ],
  },
  {
    title: 'Услуги',
    items: [
      {
        column: 'Поддержка',
        subItems: [
          { name: 'Сопровождение 1С', path: '/support-1c' },
          { name: 'Техподдержка', path: '/tech-support' },
          { name: 'Консультации', path: '/consulting' },
          { name: 'Обновления', path: '/updates' },
        ],
      },
      {
        column: 'Автоматизация',
        subItems: [
          { name: 'Внедрение 1С', path: '/implementation' },
          { name: 'Интеграции', path: '/integrations' },
          { name: 'Кастомизация', path: '/customization' },
          { name: 'Роботизация', path: '/robotization' },
        ],
      },
      {
        column: 'IT-аутсорсинг',
        subItems: [
          { name: 'Обслуживание ПК', path: '/pc-maintenance' },
          { name: 'Сетевые решения', path: '/network-solutions' },
          { name: 'Серверы', path: '/servers' },
          { name: 'Безопасность', path: '/security' },
        ],
      },
      {
        column: 'Обучение',
        subItems: [
          { name: 'Курсы 1С', path: '/1c-courses' },
          { name: 'Вебинары', path: '/webinars' },
          { name: 'Сертификация', path: '/certification' },
          { name: 'Тренинги', path: '/trainings' },
        ],
      },
    ],
  },
  { title: 'Клиенты', path: '/clients' },
  { title: 'Акции', path: '/promotions' },
  { title: 'Новости', path: '/news' },
];

interface HeaderProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  showLogin: boolean;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ setShowLogin, showLogin }, ref) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Закрытие выпадающего меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      let clickedOutside = true;
      dropdownRefs.current.forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          clickedOutside = false;
        }
      });
      if (clickedOutside) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Переключение выпадающего меню
  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <header ref={ref} className="fixed top-0 left-0 w-full bg-lightPurple shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between">
        {/* Секция 1: Логотип */}
        <div className="flex-shrink-0 self-center">
          <Link to="/">
            <img src={logo} alt="1C Support Logo" className="h-20 w-auto" />
          </Link>
        </div>

        {/* Секция 2: Навигация для десктопа */}
        <nav className="hidden lg:flex flex-grow items-end ml-16 space-x-8">
          {menuItems.map((item) => (
            <div
              key={item.title}
              className="relative"
              ref={(el) => el && dropdownRefs.current.set(item.title, el)}
            >
              {'items' in item ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className="text-white bg-darkPurple px-4 py-2 rounded-md h-10 flex items-center hover:text-hoverButton outline-none font-medium text-base transition-colors duration-300"
                    aria-expanded={openDropdown === item.title}
                    aria-label={`Открыть меню ${item.title}`}
                  >
                    {item.title}
                  </button>
                  {openDropdown === item.title && (
                    <div
                      className="absolute left-0 mt-2 bg-white border border-grayAccent shadow-lg rounded-lg z-10 transition-all duration-200 ease-in-out transform opacity-100 scale-100"
                      style={{ opacity: openDropdown === item.title ? 1 : 0, transform: openDropdown === item.title ? 'scale(1)' : 'scale(0.95)' }}
                    >
                      {'items' in item && Array.isArray(item.items) && 'subItems' in (item.items[0] || {}) ? (
                        <div className="grid grid-cols-4 gap-4 p-4 w-[48rem] max-w-[90vw]">
                          {item.items.map((column) => (
                            'subItems' in column && (
                              <div key={column.column}>
                                <h3 className="text-darkPurple font-semibold mb-2 px-4">{column.column}</h3>
                                {column.subItems.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.path}
                                    className="block px-4 py-2 text-darkGray hover:bg-lightPurple hover:text-white transition-colors duration-200"
                                    onClick={() => {
                                      setOpenDropdown(null);
                                      setIsMenuOpen(false);
                                    }}
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            )
                          ))}
                        </div>
                      ) : (
                        <div className="py-2 w-48">
                          {'items' in item &&
                            Array.isArray(item.items) &&
                            item.items.map((subItem) => (
                              !('subItems' in subItem) && (
                                <Link
                                  key={subItem.name}
                                  to={subItem.path}
                                  className="block px-4 py-2 text-darkGray hover:bg-lightPurple hover:text-white transition-colors duration-200"
                                  onClick={() => {
                                    setOpenDropdown(null);
                                    setIsMenuOpen(false);
                                  }}
                                >
                                  {subItem.name}
                                </Link>
                              )
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className="text-white bg-darkPurple px-4 py-2 rounded-md h-10 flex items-center hover:text-hoverButton outline-none font-medium text-base transition-colors duration-300"
                  onClick={() => {
                    setOpenDropdown(null);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Секция 3 и 4: Кнопки и иконка логина */}
        <div className="hidden lg:flex items-center space-x-10">
          {/* Секция 3: Кнопки "Заказать звонок" и "Удаленный доступ" */}
          <div className="flex flex-col items-end space-y-2">
            <button className="bg-orange text-white px-4 py-2 rounded-md group w-48">
              <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                Заказать звонок
              </span>
            </button>
            <button className="bg-darkPurple text-white px-4 py-2 rounded-md group w-48">
              <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                Удаленный доступ
              </span>
            </button>
          </div>
          {/* Секция 4: Кнопка логина */}
          <div className="self-center">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-darkPurple p-2 rounded-md hover:bg-darkPurple/90 outline-none transition-colors duration-300"
              aria-label="Открыть форму входа"
            >
              <UserCircleIcon className="h-8 w-8 text-white hover:text-hoverButton transition-colors duration-300" />
            </button>
          </div>
        </div>

        {/* Гамбургер-меню для мобильных */}
        <button
          className="lg:hidden text-darkGray hover:text-darkPurple self-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-white border-t border-grayAccent px-4 py-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {menuItems.map((item) => (
            <div
              key={item.title}
              className="py-2"
              ref={(el) => el && dropdownRefs.current.set(item.title, el)}
            >
              {'items' in item ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className="text-darkGray hover:text-darkPurple font-medium text-base w-full text-left"
                    aria-expanded={openDropdown === item.title}
                    aria-label={openDropdown === item.title ? `Закрыть подменю ${item.title}` : `Открыть подменю ${item.title}`}
                  >
                    {item.title}
                  </button>
                  {openDropdown === item.title && (
                    <div className="pl-4 transition-all duration-200 ease-in-out">
                      {'items' in item && Array.isArray(item.items) && 'subItems' in (item.items[0] || {}) ? (
                        item.items.map((column) => (
                          'subItems' in column && (
                            <div key={column.column} className="py-2">
                              <h3 className="text-darkPurple font-semibold">{column.column}</h3>
                              {column.subItems.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.path}
                                  className="block py-2 text-darkGray hover:text-darkPurple"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          )
                        ))
                      ) : (
                        'items' in item &&
                        Array.isArray(item.items) &&
                        item.items.map((subItem) => (
                          !('subItems' in subItem) && (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="block py-2 text-darkGray hover:text-darkPurple"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setOpenDropdown(null);
                              }}
                            >
                              {subItem.name}
                            </Link>
                          )
                        ))
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className="block py-2 text-darkGray hover:text-darkPurple font-medium"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setOpenDropdown(null);
                  }}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
          <div className="py-2 space-y-2">
            <button className="w-full bg-orange text-white px-4 py-2 rounded-md group">
              <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                Заказать звонок
              </span>
            </button>
            <button className="w-full bg-darkPurple text-white px-4 py-2 rounded-md group">
              <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                Удаленный доступ
              </span>
            </button>
            <button
              className="w-full text-darkGray hover:text-darkPurple text-left"
              onClick={() => {
                setShowLogin(true);
                setIsMenuOpen(false);
              }}
            >
              Войти
            </button>
          </div>
        </nav>
      )}
    </header>
  );
});

export default Header;