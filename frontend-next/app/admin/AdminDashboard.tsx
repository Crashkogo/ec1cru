'use client';

import React from 'react';
import {
  Admin,
  Resource,
  CustomRoutes,
  useRedirect,
} from 'react-admin';
import { Route } from 'react-router-dom';
import { dataProvider } from '@/admin/dataProvider';
import { authProvider } from '@/admin/authProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Card, CardContent } from '@mui/material';
import {
  NewspaperIcon,
  CalendarDaysIcon,
  GiftIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  UserGroupIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import AdminMenu from '@/components/AdminMenu';
import { i18nProvider } from '@/admin/i18nProvider';

// Импорты компонентов для управления постами
import { NewsList } from './resources/news/NewsList';
import { NewsCreate } from './resources/news/NewsCreate';
import { NewsEdit } from './resources/news/NewsEdit';

import { EventsList } from './resources/events/EventsList';
import { EventsCreate } from './resources/events/EventsCreate';
import { EventsEdit } from './resources/events/EventsEdit';

import { PromotionsList } from './resources/promotions/PromotionsList';
import { PromotionsCreate } from './resources/promotions/PromotionsCreate';
import { PromotionsEdit } from './resources/promotions/PromotionsEdit';

import { CompanyLifeList } from './resources/company-life/CompanyLifeList';
import { CompanyLifeCreate } from './resources/company-life/CompanyLifeCreate';
import { CompanyLifeEdit } from './resources/company-life/CompanyLifeEdit';

import { ReadySolutionsList } from './resources/ready-solutions/ReadySolutionsList';
import { ReadySolutionsCreate } from './resources/ready-solutions/ReadySolutionsCreate';
import { ReadySolutionsEdit } from './resources/ready-solutions/ReadySolutionsEdit';

import { CoursesList } from './resources/courses/CoursesList';
import { CoursesCreate } from './resources/courses/CoursesCreate';
import { CoursesEdit } from './resources/courses/CoursesEdit';

import { TestimonialList } from './resources/testimonials/TestimonialList';
import { TestimonialCreate } from './resources/testimonials/TestimonialCreate';
import { TestimonialEdit } from './resources/testimonials/TestimonialEdit';

import { NewslettersList } from './resources/newsletters/NewslettersList';
import { NewslettersCreate } from './resources/newsletters/NewslettersCreate';
import { NewslettersEdit } from './resources/newsletters/NewslettersEdit';
import NewslettersSend from './resources/newsletters/NewslettersSend';

import { SubscribersList } from './resources/subscribers/SubscribersList';
import { SubscribersEdit } from './resources/subscribers/SubscribersEdit';

import { UserList } from './resources/users/UserList';
import { UserCreate } from './resources/users/UserCreate';
import { UserEdit } from './resources/users/UserEdit';
import { UserShow } from './resources/users/UserShow';

import { ProgramsList } from './resources/programs/ProgramsList';
import { ProgramsCreate } from './resources/programs/ProgramsCreate';
import { ProgramsEdit } from './resources/programs/ProgramsEdit';

import { TariffPlansList } from './resources/tariff-plans/TariffPlansList';
import { TariffPlansCreate } from './resources/tariff-plans/TariffPlansCreate';
import { TariffPlansEdit } from './resources/tariff-plans/TariffPlansEdit';

import { ItsTariffPlansList } from './resources/its-tariff-plans/ItsTariffPlansList';
import { ItsTariffPlansCreate } from './resources/its-tariff-plans/ItsTariffPlansCreate';
import { ItsTariffPlansEdit } from './resources/its-tariff-plans/ItsTariffPlansEdit';

import { EmployeesList } from './resources/employees/EmployeesList';
import { EmployeesCreate } from './resources/employees/EmployeesCreate';
import { EmployeesEdit } from './resources/employees/EmployeesEdit';

import { ClientsList } from './resources/clients/ClientsList';
import { ClientsCreate } from './resources/clients/ClientsCreate';
import { ClientsEdit } from './resources/clients/ClientsEdit';

// Временные заглушки для остальных компонентов (будут заменены позже)

const EventRegistrationsList = () => <div>Event Registrations List</div>;

import LoginPage from './LoginPage';

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
  const [subscribersCount, setSubscribersCount] = React.useState<number>(0);

  React.useEffect(() => {
    // Получаем количество активных подписчиков
    const fetchSubscribersCount = async () => {
      try {
        const result = await dataProvider.getList('subscribers', {
          pagination: { page: 1, perPage: 1 },
          sort: { field: 'id', order: 'ASC' },
          filter: { isActive: true },
        });
        setSubscribersCount(result.total);
      } catch (error) {
        console.error('Ошибка при загрузке количества подписчиков:', error);
      }
    };

    fetchSubscribersCount();
  }, []);

  const handleCreateNews = () => {
    redirect('/news/create');
  };

  const handleCreateEvent = () => {
    redirect('/events/create');
  };

  const handleCreatePromotion = () => {
    redirect('/promotions/create');
  };

  const handleCreateCompanyLife = () => {
    redirect('/company-life/create');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-modern-gray-900 mb-2">Dashboard</h1>
        <p className="text-modern-gray-600">Добро пожаловать в панель администратора ООО «Инженер-центр»</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-modern-gray-900 mb-4">Быстрые действия: Создать</h3>
            <div className="space-y-3">
              <button
                onClick={handleCreateNews}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <NewspaperIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Новость</span>
              </button>
              <button
                onClick={handleCreateEvent}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <CalendarDaysIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Мероприятие</span>
              </button>
              <button
                onClick={handleCreateCompanyLife}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <BuildingOffice2Icon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Наша жизнь</span>
              </button>
              <button
                onClick={handleCreatePromotion}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <GiftIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Акция</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Management */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-modern-gray-900 mb-4">Управление рассылками</h3>
            <div className="mb-4 p-3 bg-modern-primary-50 rounded-lg">
              <p className="text-sm text-modern-gray-700">
                Количество подписчиков: <span className="font-bold text-modern-primary-700">{subscribersCount}</span>
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => redirect('/newsletters')}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <EnvelopeIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Рассылки</span>
              </button>
              <button
                onClick={() => redirect('/newsletters/create')}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <EnvelopeIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Создать рассылку</span>
              </button>
              <button
                onClick={() => redirect('/newsletters-send')}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <PaperAirplaneIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Отправка</span>
              </button>
              <button
                onClick={() => redirect('/subscribers')}
                className="w-full flex items-center p-3 text-left rounded-lg hover:bg-modern-gray-50 transition-colors duration-200"
              >
                <UserGroupIcon className="h-5 w-5 text-modern-primary-600 mr-3" />
                <span className="font-medium text-modern-gray-900">Подписчики</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Кастомный Layout
const CustomLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = React.useState('USER');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('role');
      if (storedRole) {
        setRole(storedRole);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <AdminMenu role={role} />
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
const AdminDashboard: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Admin
      layout={CustomLayout}
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      disableTelemetry
      i18nProvider={i18nProvider}
      dashboard={DashboardContent}
    >
      <Resource name="news" list={NewsList} create={NewsCreate} edit={NewsEdit} />
      <Resource name="company-life" list={CompanyLifeList} create={CompanyLifeCreate} edit={CompanyLifeEdit} />
      <Resource name="events" list={EventsList} create={EventsCreate} edit={EventsEdit} />
      <Resource name="promotions" list={PromotionsList} create={PromotionsCreate} edit={PromotionsEdit} />
      <Resource name="courses" list={CoursesList} create={CoursesCreate} edit={CoursesEdit} />
      <Resource name="ready-solutions" list={ReadySolutionsList} create={ReadySolutionsCreate} edit={ReadySolutionsEdit} />
      <Resource name="programs" list={ProgramsList} create={ProgramsCreate} edit={ProgramsEdit} />
      <Resource name="newsletters" list={NewslettersList} create={NewslettersCreate} edit={NewslettersEdit} />
      <Resource name="newsletters-send" list={NewslettersSend} />
      <Resource name="subscribers" list={SubscribersList} edit={SubscribersEdit} />
      <Resource name="testimonials" list={TestimonialList} create={TestimonialCreate} edit={TestimonialEdit} />
      <Resource name="tariff-plans" list={TariffPlansList} create={TariffPlansCreate} edit={TariffPlansEdit} />
      <Resource name="its-tariff-plans" list={ItsTariffPlansList} create={ItsTariffPlansCreate} edit={ItsTariffPlansEdit} />
      <Resource
        name="users"
        list={UserList}
        create={UserCreate}
        edit={UserEdit}
        show={UserShow}
        recordRepresentation="name"
      />
      <Resource name="employees" list={EmployeesList} create={EmployeesCreate} edit={EmployeesEdit} />
      <Resource name="clients" list={ClientsList} create={ClientsCreate} edit={ClientsEdit} />
      <CustomRoutes>
        <Route path="/events/:id/registrations" element={<EventRegistrationsList />} />
      </CustomRoutes>
    </Admin>
  </ThemeProvider>
);

export default AdminDashboard;
