import React from 'react';
import {
  Admin,
  Resource,
  LayoutProps,
  usePermissions,
  useRedirect,
  CustomRoutes
} from 'react-admin';
import { Route } from 'react-router-dom';
import { dataProvider } from '../../admin/dataProvider';
import { authProvider } from '../../admin/authProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Card, CardContent } from '@mui/material';
import {
  NewspaperIcon,
  CalendarDaysIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import AdminMenu from '../../components/AdminMenu';
import { UserList } from './UserList';
import { UserCreate } from './UserCreate';
import { UserEdit } from './UserEdit';
import { UserShow } from './UserShow';
import { NewsList } from './NewsList';
import { NewsCreate } from './NewsCreate';
import { NewsEdit } from './NewsEdit';
import { EventsList } from './EventsList';
import { EventsCreate } from './EventsCreate';
import { EventsEdit } from './EventsEdit';
import { PromotionsList } from './PromotionsList';
import { PromotionsCreate } from './PromotionsCreate';
import { PromotionsEdit } from './PromotionsEdit';
import ReadySolutionsList from './ReadySolutionsList';
import ReadySolutionsCreate from './ReadySolutionsCreate';
import ReadySolutionsEdit from './ReadySolutionsEdit';
import { ProgramsList } from './ProgramsList';
import { ProgramsCreate } from './ProgramsCreate';
import { ProgramsEdit } from './ProgramsEdit';
import { NewslettersList } from './NewslettersList';
import { NewslettersCreate } from './NewslettersCreate';
import { NewslettersEdit } from './NewslettersEdit';
import NewslettersSend from './NewslettersSend';
import { SubscribersList } from './SubscribersList';
import { SubscribersEdit } from './SubscribersEdit';
import { EventRegistrationsList } from './EventRegistrationsList';
import { TariffPlansList } from './TariffPlansList';
import { TariffPlansCreate } from './TariffPlansCreate';
import { TariffPlansEdit } from './TariffPlansEdit';
import { CoursesList } from './CoursesList';
import { CoursesCreate } from './CoursesCreate';
import { CoursesEdit } from './CoursesEdit';
import { i18nProvider } from '../../admin/i18nProvider';
import LoginPage from './Login';

// Современная тема в стиле основного сайта
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1f2937',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e5e7eb',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '0.75rem',
        },
      },
    },
  },
});



// Главный Dashboard компонент
const DashboardContent: React.FC = () => {
  const redirect = useRedirect();

  const handleCreateNews = () => {
    redirect('/admin/news/create');
  };

  const handleCreateEvent = () => {
    redirect('/admin/events/create');
  };

  const handleCreatePromotion = () => {
    redirect('/admin/promotions/create');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-modern-gray-900 mb-2">Dashboard</h1>
        <p className="text-modern-gray-600">Добро пожаловать в панель администратора ООО «Инженер-центр»</p>
      </div>

      {/* Quick Actions */}
      <div className="max-w-lg">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-modern-gray-900 mb-4">Быстрые действия</h3>
            <div className="space-y-3">
              <button
                onClick={handleCreateNews}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <NewspaperIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Добавить новость</span>
              </button>
              <button
                onClick={handleCreateEvent}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <CalendarDaysIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Создать мероприятие</span>
              </button>
              <button
                onClick={handleCreatePromotion}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <GiftIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Добавить акцию</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Кастомный Layout
const CustomLayout: React.FC<LayoutProps> = ({ children }) => {
  const { permissions } = usePermissions();

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <AdminMenu role={permissions || 'USER'} />
      <div className="lg:ml-64">
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Главный Dashboard компонент
const Dashboard: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Admin
      basename="/admin"
      layout={CustomLayout}
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      disableTelemetry
      i18nProvider={i18nProvider}
      dashboard={DashboardContent}
    >
      <Resource name="news" list={NewsList} create={NewsCreate} edit={NewsEdit} />
      <Resource name="events" list={EventsList} create={EventsCreate} edit={EventsEdit} />
      <Resource name="promotions" list={PromotionsList} create={PromotionsCreate} edit={PromotionsEdit} />
      <Resource name="courses" list={CoursesList} create={CoursesCreate} edit={CoursesEdit} />
      <Resource name="ready-solutions" list={ReadySolutionsList} create={ReadySolutionsCreate} edit={ReadySolutionsEdit} />
      <Resource name="programs" list={ProgramsList} create={ProgramsCreate} edit={ProgramsEdit} />
      <Resource name="newsletters" list={NewslettersList} create={NewslettersCreate} edit={NewslettersEdit} />
      <Resource name="newsletters-send" list={NewslettersSend} />
      <Resource name="subscribers" list={SubscribersList} edit={SubscribersEdit} />
      <Resource name="tariff-plans" list={TariffPlansList} create={TariffPlansCreate} edit={TariffPlansEdit} />
      <Resource
        name="users"
        list={UserList}
        create={UserCreate}
        edit={UserEdit}
        show={UserShow}
        recordRepresentation="name"
      />
      <CustomRoutes>
        <Route path="/events/:id/registrations" element={<EventRegistrationsList />} />
      </CustomRoutes>
    </Admin>
  </ThemeProvider>
);

export default Dashboard;