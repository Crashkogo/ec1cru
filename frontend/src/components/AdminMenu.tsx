import React from 'react';
import { NavLink } from 'react-router-dom';

interface AdminMenuProps {
  role: string;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ role }) => {
  return (
    <nav className="bg-darkBg p-4 border border-yellowAccent rounded-lg">
      <ul className="flex space-x-8 justify-center">
        <li>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `text-whiteText ${isActive ? 'text-yellowAccent' : 'hover:text-yellowAccent'}`
            }
          >
            Главная
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/news"
            className={({ isActive }) =>
              `text-whiteText ${isActive ? 'text-yellowAccent' : 'hover:text-yellowAccent'}`
            }
          >
            Новости
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `text-whiteText ${isActive ? 'text-yellowAccent' : 'hover:text-yellowAccent'}`
            }
          >
            Мероприятия
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/promotions"
            className={({ isActive }) =>
              `text-whiteText ${isActive ? 'text-yellowAccent' : 'hover:text-yellowAccent'}`
            }
          >
            Акции
          </NavLink>
        </li>
        {['ADMIN', 'MODERATOR'].includes(role) && (
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `text-whiteText ${isActive ? 'text-yellowAccent' : 'hover:text-yellowAccent'}`
              }
            >
              Пользователи
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default AdminMenu;