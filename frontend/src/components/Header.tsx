import { useState, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaGlobe, FaSearch } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Импорт логотипа

// Определяем интерфейс для пропсов
interface HeaderProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ setShowLogin }, ref) => {
  const handlePhoneClick = () => {
    setShowLogin(true); // Открываем модальное окно при клике
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const menuItems = [
    {
      title: 'Компания',
      items: [
        { name: 'О компании', path: '/about' },
        { name: 'Статусы компании', path: '/company-statuses' },
        { name: 'Наши сотрудники', path: '/our-team' },
        { name: 'Реквизиты', path: '/requisites' },
        { name: 'Политика конфиденциальности', path: '/privacy-policy' },
        { name: 'Соглашение на обработку персональных данных', path: '/data-processing-agreement' },
      ],
    },
    {
      title: 'Обслуживание и услуги',
      items: [
        { name: 'Сопровождение 1С', path: '/support-1c' },
        { name: 'Внедрение', path: '/implementation' },
        { name: 'Готовые решения', path: '/ready-solutions' },
        { name: 'Автоматизация', path: '/automation' },
        { name: 'Обучение 1С', path: '/training-1c' },
        { name: 'Внешний IT-отдел', path: '/external-it' },
      ],
    },
    {
      title: 'Купить 1С',
      items: [
        { name: 'Программы для учета', path: '/accounting-software' },
        { name: 'Отраслевые решения', path: '/industry-solutions' },
        { name: 'Сервисы 1С', path: '/1c-services' },
        { name: 'Прочее', path: '/miscellaneous' },
      ],
    },
    {
      title: 'Наш опыт',
      items: [
        { name: 'Кейсы клиентов', path: '/client-cases' },
        { name: 'Что мы автоматизируем у себя', path: '/internal-automation' },
        { name: 'Отзывы о нашей работе', path: '/reviews' },
      ],
    },
  ];

  return (
    <header
      ref={ref}
      className="fixed top-0 left-0 w-full bg-darkBg text-whiteText p-4 shadow-md border-b-2 border-yellowAccent z-50"
    >
      <div className="container flex items-end justify-between h-full">
        {/* Логотип */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="1C Support Logo" className="w-[295px] h-[80px]" />
        </Link>

        {/* Меню */}
        <nav className="hidden md:flex space-x-4 flex-grow justify-center h-full">
          {menuItems.map((menu) => (
            <div key={menu.title} className="relative group">
              {/* Основной пункт меню */}
              <div
                className="text-whiteText hover:text-yellowAccent px-7 rounded-md text-base font-medium transition-colors duration-300 cursor-pointer"
                onMouseEnter={() => setIsSearchOpen(false)}
              >
                {menu.title}
              </div>

              {/* Выпадающее подменю */}
              <div className="absolute left-0 mt-2 w-64 bg-darkBg border border-yellowAccent shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                {menu.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block px-4 py-2 text-whiteText hover:bg-yellowAccent hover:text-darkBg transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Правая часть: Поиск и контактная информация */}
        <div className="flex items-center space-x-6 h-full">
          {/* Кнопка поиска */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-whiteText hover:text-yellowAccent p-2 rounded-full bg-yellowAccent hover:bg-yellow-600 transition-colors duration-300 self-center"
          >
            <FaSearch />
          </button>

          {/* Окно поиска */}
          <div
            className={`absolute top-20 right-4 w-64 bg-darkBg border border-yellowAccent rounded-md shadow-lg transition-all duration-300 ease-in-out transform ${
              isSearchOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
            } origin-top z-20`}
          >
            <input
              type="text"
              placeholder="Поиск..."
              className="w-full p-2 bg-darkBg text-whiteText border-b border-yellowAccent focus:outline-none focus:border-yellow-600"
            />
          </div>

          {/* Контактная информация */}
          <div className="hidden md:block text-right self-end">
            <div className="flex items-center space-x-2 mb-1">
              <FaPhone
                className="text-yellowAccent cursor-pointer"
                onClick={handlePhoneClick} // Обработчик клика
              />
              <span>8 (8443) 300-801</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <FaEnvelope className="text-yellowAccent" />
              <span>mail@ec-1c.ru</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaGlobe className="text-yellowAccent" />
              <Link to="/contacts" className="hover:text-yellowAccent hover:underline text-inherit">
                Мы на карте
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;