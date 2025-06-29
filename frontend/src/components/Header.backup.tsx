// frontend/src/components/Header.backup.tsx - РЕЗЕРВНАЯ КОПИЯ
import { useState, useEffect, useRef, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, Bars3Icon, XMarkIcon, PhoneIcon, ComputerDesktopIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { authProvider } from '../admin/authProvider';
import logo from '../assets/logo.png';

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

interface MenuItemWithColumns {
    title: string;
    items: { column: string; subItems: SubItem[] }[];
}

type MenuItem = MenuItemSimple | MenuItemWithSubItems | MenuItemWithColumns;

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

function isMenuItemWithSubItems(item: MenuItem): item is MenuItemWithSubItems {
    return 'items' in item && Array.isArray(item.items) && 'name' in item.items[0];
}

function isMenuItemWithColumns(item: MenuItem): item is MenuItemWithColumns {
    return 'items' in item && Array.isArray(item.items) && 'column' in item.items[0];
}

interface HeaderProps {
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ setShowLogin }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const navigate = useNavigate();

    const closeMenus = () => {
        setOpenDropdown(null);
        setIsMenuOpen(false);
    };

    const handleLoginClick = async () => {
        try {
            await authProvider.checkAuth({});
            const role = localStorage.getItem('role');
            if (role && ['ADMIN', 'MODERATOR', 'EVENTORG', 'ITS', 'DEVDEP'].includes(role)) {
                navigate('/admin');
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
        const handleClickOutside = (event: MouseEvent) => {
            const clickedOutside = !Array.from(dropdownRefs.current.values()).some(
                (ref) => ref && ref.contains(event.target as Node)
            );
            if (clickedOutside) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        dropdownRefs.current.clear();
    }, []);

    const toggleDropdown = (title: string) => {
        setOpenDropdown(openDropdown === title ? null : title);
    };

    return (
        <header
            ref={ref}
            className="fixed top-0 left-0 w-full bg-white bg-header-gradient shadow-md z-50"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between">
                <div className="flex-shrink-0 self-center">
                    <Link to="/" aria-label="Перейти на главную страницу">
                        <img src={logo} alt="1C Support Logo" className="h-20 w-auto" />
                    </Link>
                </div>

                <nav className="hidden lg:flex flex-grow items-end ml-16 space-x-8">
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
                                        className="text-textBlue bg-primaryBlue px-3 py-2 rounded-md h-10 flex items-center hover:bg-hoverBlue hover:text-textBlue font-medium text-base transition-colors duration-300 group"
                                        aria-expanded={openDropdown === item.title}
                                        aria-label={`Открыть меню ${item.title}`}
                                    >
                                        <span>{item.title}</span>
                                        <ChevronDownIcon
                                            className="h-4 w-4 ml-1 mt-2 text-textBlue opacity-0 group-hover:opacity-100 transform group-hover:-translate-y-0.5 transition-all duration-200"
                                            aria-hidden="true"
                                        />
                                    </button>
                                    {openDropdown === item.title && (
                                        <div
                                            className="absolute left-0 mt-2 bg-lightGray border border-grayAccent shadow-lg rounded-lg z-10 transition-all duration-300 ease-in-out transform opacity-100 scale-100"
                                            style={{
                                                opacity: openDropdown === item.title ? 1 : 0,
                                                transform: openDropdown === item.title ? 'scale(1)' : 'scale(0.95)',
                                            }}
                                        >
                                            {isMenuItemWithColumns(item) ? (
                                                <div className="grid grid-cols-4 gap-4 p-4 w-[48rem] max-w-[90vw]">
                                                    {item.items.map((column) => (
                                                        <div key={column.column}>
                                                            <h3 className="text-primaryBlue font-semibold mb-2 px-4">
                                                                {column.column}
                                                            </h3>
                                                            {column.subItems.map((subItem) => (
                                                                <Link
                                                                    key={subItem.name}
                                                                    to={subItem.path}
                                                                    className="block px-4 py-2 text-darkGray hover:bg-lightBlue hover:text-darkGray rounded-md transition-colors duration-200"
                                                                    onClick={closeMenus}
                                                                >
                                                                    {subItem.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-2 w-48">
                                                    {isMenuItemWithSubItems(item) &&
                                                        item.items.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                to={subItem.path}
                                                                className="block px-4 py-2 text-darkGray hover:bg-lightBlue hover:text-darkGray rounded-md transition-colors duration-200"
                                                                onClick={closeMenus}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="text-textBlue bg-primaryBlue px-4 py-2 rounded-md h-10 flex items-center hover:bg-hoverBlue hover:text-textBlue font-medium text-base transition-colors duration-300"
                                    onClick={closeMenus}
                                >
                                    {item.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="hidden lg:flex items-end space-x-10">
                    <div className="flex flex-col items-end space-y-2">
                        <button
                            className="bg-accentSkyTransparent text-textBlue px-4 py-2 rounded-md group w-56 hover:bg-accentSky hover:text-textBlue transition-colors duration-300 shadow-sm flex items-center space-x-2 whitespace-nowrap"
                            aria-label="Заказать звонок"
                        >
                            <PhoneIcon
                                className="h-7 w-7 -ml-1 text-textBlue group-hover:scale-105 transition-transform duration-200"
                                aria-hidden="true"
                            />
                            <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                                Заказать звонок
                            </span>
                        </button>
                        <button
                            className="bg-accentSkyTransparent text-textBlue px-4 py-2 rounded-md group w-56 hover:bg-accentSky hover:text-textBlue transition-colors duration-300 shadow-sm flex items-center space-x-2 whitespace-nowrap"
                            aria-label="Удаленный доступ"
                        >
                            <ComputerDesktopIcon
                                className="h-7 w-7 -ml-1 text-textBlue group-hover:scale-105 transition-transform duration-200"
                                aria-hidden="true"
                            />
                            <span className="group-hover:scale-105 transition-transform duration-200 inline-block text-base">
                                Удаленный доступ
                            </span>
                        </button>
                    </div>
                    <div className="self-center">
                        <button
                            onClick={handleLoginClick}
                            className="bg-accentSkyTransparent text-textBlue p-2 rounded-md group w-12 h-12 flex items-center justify-center hover:bg-accentSky hover:text-textBlue transition-colors duration-300 shadow-sm"
                            aria-label="Открыть форму входа"
                        >
                            <UserCircleIcon
                                className="h-7 w-7 text-textBlue group-hover:scale-105 transition-transform duration-200"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>

                <button
                    className="lg:hidden text-darkGray hover:text-primaryBlue self-center"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                >
                    {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
            </div>

            {isMenuOpen && (
                <nav className="lg:hidden bg-white border-t border-grayAccent px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-md">
                    {menuItems.map((item) => (
                        <div
                            key={item.title}
                            className="py-2"
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
                                        className="text-darkGray hover:text-primaryBlue font-medium text-base w-full text-left flex items-center justify-between py-2"
                                        aria-expanded={openDropdown === item.title}
                                        aria-label={
                                            openDropdown === item.title
                                                ? `Закрыть подменю ${item.title}`
                                                : `Открыть подменю ${item.title}`
                                        }
                                    >
                                        {item.title}
                                        <span>{openDropdown === item.title ? '−' : '+'}</span>
                                    </button>
                                    {openDropdown === item.title && (
                                        <div className="pl-4 transition-all duration-200 ease-in-out">
                                            {isMenuItemWithColumns(item) ? (
                                                item.items.map((column) => (
                                                    <div key={column.column} className="py-2">
                                                        <h3 className="text-primaryBlue font-semibold">
                                                            {column.column}
                                                        </h3>
                                                        {column.subItems.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                to={subItem.path}
                                                                className="block py-2 pl-4 text-darkGray hover:bg-lightBlue hover:text-darkGray rounded-md transition-colors duration-200"
                                                                onClick={closeMenus}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ))
                                            ) : (
                                                isMenuItemWithSubItems(item) &&
                                                item.items.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        to={subItem.path}
                                                        className="block py-2 pl-4 text-darkGray hover:bg-lightBlue hover:text-darkGray rounded-md transition-colors duration-200"
                                                        onClick={closeMenus}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="block py-2 pl-4 text-darkGray hover:bg-lightBlue hover:text-darkGray font-medium rounded-md transition-colors duration-200"
                                    onClick={closeMenus}
                                >
                                    {item.title}
                                </Link>
                            )}
                        </div>
                    ))}
                    <div className="py-4 space-y-2">
                        <button
                            className="w-full bg-accentSkyTransparent text-textBlue px-4 py-2 rounded-md group hover:bg-accentSky hover:text-textBlue transition-colors duration-300 shadow-sm flex items-center space-x-2 whitespace-nowrap"
                            aria-label="Заказать звонок"
                        >
                            <PhoneIcon
                                className="h-7 w-7 -ml-1 text-textBlue group-hover:scale-105 transition-transform duration-200"
                                aria-hidden="true"
                            />
                            <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                                Заказать звонок
                            </span>
                        </button>
                        <button
                            className="w-full bg-accentSkyTransparent text-textBlue px-4 py-2 rounded-md group hover:bg-accentSky hover:text-textBlue transition-colors duration-300 shadow-sm flex items-center space-x-2 whitespace-nowrap"
                            aria-label="Удаленный доступ"
                        >
                            <ComputerDesktopIcon
                                className="h-7 w-7 -ml-1 text-textBlue group-hover:scale-105 transition-transform duration-200"
                                aria-hidden="true"
                            />
                            <span className="group-hover:scale-105 transition-transform duration-200 inline-block text-base">
                                Удаленный доступ
                            </span>
                        </button>
                        <button
                            onClick={() => {
                                handleLoginClick();
                                setIsMenuOpen(false);
                            }}
                            className="w-full bg-accentSkyTransparent text-textBlue p-2 rounded-md group h-12 flex items-center justify-center hover:bg-accentSky hover:text-textBlue transition-colors duration-300 shadow-sm"
                            aria-label="Открыть форму входа"
                        >
                            <UserCircleIcon
                                className="h-7 w-7 text-textBlue group-hover:scale-105 transition-transform duration-200"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </nav>
            )}
        </header>
    );
});

export default Header; 