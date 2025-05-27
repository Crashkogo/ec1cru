// src/pages/admin/Dashboard.tsx
import { Admin, Resource, Layout, Menu, LayoutProps } from 'react-admin';
import { dataProvider } from '../../admin/dataProvider';
import { authProvider } from '../../admin/authProvider';
import { ProgramList, ProgramCreate, ProgramEdit } from './Settings';
import { createTheme } from '@mui/material/styles';

// Кастомная тема
const theme = createTheme({
  palette: {
    primary: { main: '#1E3A8A' }, // Синий для 1С
    secondary: { main: '#F97316' }, // Оранжевый акцент
  },
});

// Кастомное меню
const MyMenu = () => (
  <Menu>
    <Menu.Item to="/" primaryText="Главная" /> {/* /admin */}
    <Menu.Item to="/news" primaryText="Новости" /> {/* /admin/news */}
    <Menu.Item to="/events" primaryText="Мероприятия" /> {/* /admin/events */}
    <Menu.Item to="/promotions" primaryText="Акции" /> {/* /admin/promotions */}
    <Menu.Item to="/ready-solutions" primaryText="Готовые решения" /> {/* /admin/ready-solutions */}
    <Menu.Item to="/programs" primaryText="Настройки" /> {/* /admin/programs */}
  </Menu>
);

// Кастомный макет
const MyLayout = (props: LayoutProps) => <Layout {...props} menu={MyMenu} />;

// Заглушки для ресурсов
const PlaceholderList = () => <div className="p-6 bg-white rounded-lg shadow-md">Список (в разработке)</div>;
const PlaceholderCreate = () => <div className="p-6 bg-white rounded-lg shadow-md">Создание (в разработке)</div>;
const PlaceholderEdit = () => <div className="p-6 bg-white rounded-lg shadow-md">Редактирование (в разработке)</div>;

const Dashboard = () => (
  <Admin
    basename="/admin" // Указываем базовый путь
    theme={theme}
    layout={MyLayout}
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={() => (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-darkGray mb-4">Добро пожаловать в админ-панель!</h2>
        <p className="text-darkGray">Здесь будут отображаться метрики в будущем.</p>
      </div>
    )}
  >
    <Resource name="news" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
    <Resource name="events" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
    <Resource name="promotions" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
    <Resource name="readySolutions" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
    <Resource name="programs" list={ProgramList} create={ProgramCreate} edit={ProgramEdit} />
  </Admin>
);

export default Dashboard;