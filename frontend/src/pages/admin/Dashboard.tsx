import React, { useState } from 'react';
import {
  Admin,
  Resource,
  Layout,
  Menu,
  LayoutProps,
  AppBar,
  Toolbar,
  useSidebarState,
} from 'react-admin';
import { dataProvider } from '../../admin/dataProvider';
import { authProvider } from '../../admin/authProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Collapse, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ProgramSettings from './ProgramSettings';

// MUI тема с цветами из Tailwind
const theme = createTheme({
  palette: {
    mode: 'light', // Можно добавить переключение на 'dark' позже
    primary: { main: '#005B7F' }, // primaryBlue
    secondary: { main: '#B3E5FC' }, // accentSky
    text: {
      primary: '#333333', // darkGray
      secondary: '#2D6A8B', // textBlue
    },
    background: {
      default: '#B3E5FC', // accentSky для унификации фона
      paper: '#FFFFFF', // white для карточек
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#B3E5FC', // accentSky для фона
          color: '#333333', // darkGray для текста
          boxShadow: 'none',
          zIndex: 1301, // Поверх Drawer
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px',
          paddingLeft: '16px',
          paddingRight: '16px',
          display: 'flex',
          justifyContent: 'flex-start', // Заголовок слева
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#B3E5FC', // accentSky
          top: '64px', // Начинается ниже AppBar
          height: '100vh', // Полная высота экрана
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          zIndex: 1300, // Ниже AppBar
          display: 'flex',
          flexDirection: 'column', // Для растяжки Menu
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#B3E5FC', // accentSky для фона страницы
        },
      },
    },
  },
});

const MyMenu: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSidebarOpen] = useSidebarState();

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <Menu
      className="bg-accentSky flex-1" // Растягиваем меню на всю высоту Drawer
      sx={{ minHeight: '100%' }} // Гарантируем минимальную высоту
      aria-label="Меню админ-панели"
    >
      {/* Dashboard */}
      <Menu.Item
        to="/admin"
        primaryText="Dashboard"
        leftIcon={<DashboardIcon className="text-darkGray" />}
        className="text-darkGray hover:bg-hoverBlue font-medium text-base transition-colors duration-300"
      />
      {/* Новости */}
      <Menu.Item
        to="/admin/news"
        primaryText="Новости"
        leftIcon={<ArticleIcon className="text-darkGray" />}
        className="text-darkGray hover:bg-hoverBlue font-medium text-base transition-colors duration-300"
      />
      {/* Мероприятия */}
      <Menu.Item
        to="/admin/events"
        primaryText="Мероприятия"
        leftIcon={<EventIcon className="text-darkGray" />}
        className="text-darkGray hover:bg-hoverBlue font-medium text-base transition-colors duration-300"
      />
      {/* Акции */}
      <Menu.Item
        to="/admin/promotions"
        primaryText="Акции"
        leftIcon={<LocalOfferIcon className="text-darkGray" />}
        className="text-darkGray hover:bg-hoverBlue font-medium text-base transition-colors duration-300"
      />
      {/* Готовые решения */}
      <Menu.Item
        to="/admin/ready-solutions"
        primaryText="Готовые решения"
        leftIcon={<BuildIcon className="text-darkGray" />}
        className="text-darkGray hover:bg-hoverBlue font-medium text-base transition-colors duration-300"
      />
      {/* Настройки (раскрывающееся меню) */}
      <ListItemButton
        onClick={handleSettingsToggle}
        className="text-darkGray hover:bg-hoverBlue"
        aria-label="Раскрыть настройки"
      >
        <ListItemIcon>
          <SettingsIcon className="text-darkGray" />
        </ListItemIcon>
        {isSidebarOpen && (
          <>
            <ListItemText primary="Настройки" />
            <ExpandMoreIcon
              className="text-darkGray "
              sx={{ transform: settingsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            />
          </>
        )}
      </ListItemButton>
      <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
        <Menu.Item
          to="/admin/settings/programs"
          primaryText={isSidebarOpen ? 'Программы' : ''}
          leftIcon={<BuildIcon className="text-darkGray" />}
          className="text-darkGray hover:bg-hoverBlue font-medium text-base transition-colors duration-300"
          sx={{ pl: isSidebarOpen ? 4 : 2.5 }}
        />
      </Collapse>
      {/* Главная */}
      <Menu.Item
        to="/"
        primaryText="Главная"
        leftIcon={<HomeIcon className="text-darkGray" />}
        className="text-darkGray hover:bg-hoverBlue font-medium text-base transition-colors duration-300"
      />
    </Menu>
  );
};

const MyAppBar: React.FC = () => {
  return (
    <AppBar>
      <Toolbar>
        <Typography
          variant="h6"
          className="text-darkGray"
          sx={{ flexGrow: 1 }} // Заголовок занимает всё пространство
          aria-label="Админ-панель"
        >
          Панель администрирования
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

const MyLayout: React.FC<LayoutProps> = (props) => (
  <Layout
    {...props}
    menu={MyMenu}
    appBar={MyAppBar}
    className="bg-accentSky" // Унифицированный фон
    sx={{
      '& .RaLayout-content': {
        marginTop: '0', // Убрали отступ, так как AppBar фиксирован
        padding: '24px', // Внутренние отступы для контента
        backgroundColor: '#B3E5FC', // accentSky для фона контента
      },
      '& .RaLayout-appFrame': {
        marginTop: '64px', // Отступ под AppBar
      },
    }}
  />
);

const PlaceholderList = () => (
  <div className="p-6 bg-white rounded-lg shadow-md text-darkGray">
    Список (в разработке)
  </div>
);

const PlaceholderCreate = () => (
  <div className="p-6 bg-white rounded-lg shadow-md text-darkGray">
    Создание (в разработке)
  </div>
);

const PlaceholderEdit = () => (
  <div className="p-6 bg-white rounded-lg shadow-md text-darkGray">
    Редактирование (в разработке)
  </div>
);

const Dashboard: React.FC = () => (
  <ThemeProvider theme={theme}>
    <Admin
      basename="/admin"
      layout={MyLayout}
      dataProvider={dataProvider}
      authProvider={authProvider}
      disableTelemetry
      dashboard={() => (
        <div className="p-6 bg-white rounded-lg shadow-md text-darkGray">
          <h2 className="text-2xl font-bold mb-4">Добро пожаловать в админ-панель!</h2>
          <p>Здесь будут отображаться метрики в будущем.</p>
        </div>
      )}
    >
      <Resource name="news" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
      <Resource name="events" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
      <Resource name="promotions" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
      <Resource name="ready-solutions" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
      <Resource name="programs" list={ProgramSettings} />
    </Admin>
  </ThemeProvider>
);

export default Dashboard;