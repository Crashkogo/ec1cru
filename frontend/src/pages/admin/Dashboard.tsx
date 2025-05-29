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
import PeopleIcon from '@mui/icons-material/People';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Collapse, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { UserList } from './UserList';
import { UserCreate } from './UserCreate';
import { UserEdit } from './UserEdit';
import { i18nProvider } from '../../admin/i18nProvider';

// MUI тема с цветами из Tailwind
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4FC3F7' }, // accentSky
    secondary: { main: '#8DCEDF' }, // primaryBlue
    text: {
      primary: '#2D6A8B', // textBlue
      secondary: '#333333', // darkGray
    },
    background: {
      default: '#B3E5FC', // accentSky
      paper: '#B3E5FC', // accentSky
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #8DCEDF 0%, #B3E5FC 100%)',
          color: '#2D6A8B',
          boxShadow: 'none',
          zIndex: 1301,
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
          justifyContent: 'flex-start',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #8DCEDF 0%, #B3E5FC 100%)',
          top: '64px',
          height: '100vh',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          background: '#B3E5FC',
        },
        body: {
          background: '#B3E5FC',
        },
      },
    },
  },
});

const MyMenu: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSidebarOpen] = useSidebarState();

  const handleSettingsToggle = () => setSettingsOpen((open) => !open);

  return (
    <Menu
      className="bg-primaryBlue py-2"
      sx={{
        borderRight: 'none',
        py: 2,
      }}
    >
      <Menu.Item
        to="/admin"
        primaryText="Dashboard"
        leftIcon={<DashboardIcon className="text-textBlue" />}
        className="hover:bg-hoverBlue hover:text-textBlue rounded-lg my-1 font-medium text-base transition-colors duration-300 px-4 py-2"
      />
      <Menu.Item
        to="/admin/news"
        primaryText="Новости"
        leftIcon={<ArticleIcon className="text-textBlue" />}
        className="hover:bg-hoverBlue hover:text-textBlue rounded-lg my-1 font-medium text-base transition-colors duration-300 px-4 py-2"
      />
      <Menu.Item
        to="/admin/events"
        primaryText="Мероприятия"
        leftIcon={<EventIcon className="text-textBlue" />}
        className="hover:bg-hoverBlue hover:text-textBlue rounded-lg my-1 font-medium text-base transition-colors duration-300 px-4 py-2"
      />
      <Menu.Item
        to="/admin/promotions"
        primaryText="Акции"
        leftIcon={<LocalOfferIcon className="text-textBlue" />}
        className="hover:bg-hoverBlue hover:text-textBlue rounded-lg my-1 font-medium text-base transition-colors duration-300 px-4 py-2"
      />
      <Menu.Item
        to="/admin/ready-solutions"
        primaryText="Готовые решения"
        leftIcon={<BuildIcon className="text-textBlue" />}
        className="hover:bg-hoverBlue hover:text-textBlue rounded-lg my-1 font-medium text-base transition-colors duration-300 px-4 py-2"
      />

      {/* Настройки */}
      <ListItemButton
        onClick={handleSettingsToggle}
        aria-label="Раскрыть настройки"
        className="hover:bg-hoverBlue hover:text-textBlue rounded-lg my-1 font-medium text-base transition-colors duration-300 px-4 py-2 text-textBlue"
        sx={{
          pl: 2,
          pr: 2,
          mt: 1,
          mb: 0,
          minHeight: 48,
        }}
      >
        <ListItemIcon>
          <SettingsIcon className="text-textBlue" />
        </ListItemIcon>
        {isSidebarOpen && (
          <>
            <ListItemText primary="Настройки" />
            <ExpandMoreIcon
              className="text-textBlue"
              sx={{
                transform: settingsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </>
        )}
      </ListItemButton>
      <Collapse
        in={settingsOpen}
        timeout="auto"
        unmountOnExit
        sx={{
          '& .MuiCollapse-wrapperInner': {
            display: 'block',
          },
        }}
      >
        <Menu.Item
          to="/admin/settings/programs"
          primaryText={isSidebarOpen ? 'Программы' : ''}
          leftIcon={<BuildIcon className="text-textBlue" />}
          className="hover:bg-hoverBlue hover:text-textBlue rounded-lg my-1 font-medium text-base transition-colors duration-300 px-4 py-2"
          sx={{
            pl: isSidebarOpen ? 6 : 2.5,
            minHeight: 40,
          }}
        />
        <Menu.Item
          to="/admin/users"
          primaryText={isSidebarOpen ? 'Пользователи' : ''}
          leftIcon={<PeopleIcon className="text-textBlue" />}
          className="hover:bg-hoverBlue hover:text-textBlue rounded-lg my-1 font-medium text-base transition-colors duration-300 px-4 py-2"
          sx={{
            pl: isSidebarOpen ? 6 : 2.5,
            minHeight: 40,
          }}
        />
      </Collapse>

      <Menu.Item
        to="/"
        primaryText="Главная"
        leftIcon={<HomeIcon className="text-textBlue" />}
        className="hover:bg-hoverBlue hover:text-textBlue rounded-lg my-1 font-medium text-base transition-colors duration-300 px-4 py-2"
        sx={{ mt: 2 }}
      />
    </Menu>
  );
};

const MyAppBar: React.FC = () => {
  return (
    <AppBar
      className="shadow-none"
      style={{
        background: 'linear-gradient(135deg, #8DCEDFAA 0%, #BDEDF6 50%, #E6F5FA 100%)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          className="text-textBlue font-bold"
          sx={{ flexGrow: 1 }}
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
    className="bg-primaryBlue"
    sx={{
      '& .RaLayout-content': {
        marginTop: '0',
        padding: '24px',
        backgroundColor: '#8DCEDF', // primaryBlue
      },
      '& .RaLayout-appFrame': {
        marginTop: '64px',
      },
    }}
  />
);

const PlaceholderList = () => (
  <div className="p-6 bg-lightGray rounded-lg shadow-md text-textBlue">
    Список (в разработке)
  </div>
);

const PlaceholderCreate = () => (
  <div className="p-6 bg-lightGray rounded-lg shadow-md text-textBlue">
    Создание (в разработке)
  </div>
);

const PlaceholderEdit = () => (
  <div className="p-6 bg-lightGray rounded-lg shadow-md text-textBlue">
    Редактирование (в разработке)
  </div>
);

const Dashboard: React.FC = () => (
  <ThemeProvider theme={theme}>
    {/* Глобальные стили для RaSidebar-fixed, RaMenu-open, RaMenu-closed, MuiDrawer-root */}
    <style>{`
      .RaSidebar-fixed, .RaMenu-open, .RaMenu-closed, .MuiDrawer-root {
        background-color: #8DCEDF !important;
      }
      .MuiList-root.RaMenu-open {
        border-right: none !important;
      }
    `}</style>
    <Admin
      basename="/admin"
      layout={MyLayout}
      dataProvider={dataProvider}
      authProvider={authProvider}
      disableTelemetry
      i18nProvider={i18nProvider}
      dashboard={() => (
        <div className="p-6 bg-lightGray rounded-lg shadow-md text-textBlue">
          <h2 className="text-2xl font-bold mb-4">Добро пожаловать в админ-панель!</h2>
          <p>Здесь будут отображаться метрики в будущем.</p>
        </div>
      )}
    >
      <Resource name="news" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
      <Resource name="events" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
      <Resource name="promotions" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
      <Resource name="ready-solutions" list={PlaceholderList} create={PlaceholderCreate} edit={PlaceholderEdit} />
      <Resource name="programs" list={PlaceholderList} />
      <Resource
        name="users"
        list={UserList}
        create={UserCreate}
        edit={UserEdit}
        recordRepresentation="name"
      />
    </Admin>
  </ThemeProvider>
);

export default Dashboard;