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
import { ThemeProvider } from '@mui/material/styles';
import { adminTheme } from './adminTheme';
import { CssBaseline } from '@mui/material';
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

import { TeamMembersList }   from './resources/team-members/TeamMembersList';
import { TeamMembersCreate } from './resources/team-members/TeamMembersCreate';
import { TeamMembersEdit }   from './resources/team-members/TeamMembersEdit';

import { ClientsList } from './resources/clients/ClientsList';
import { ClientsCreate } from './resources/clients/ClientsCreate';
import { ClientsEdit } from './resources/clients/ClientsEdit';

import { EquipmentList }   from './resources/equipment/EquipmentList';
import { EquipmentCreate } from './resources/equipment/EquipmentCreate';
import { EquipmentEdit }   from './resources/equipment/EquipmentEdit';

// Временные заглушки для остальных компонентов (будут заменены позже)

const EventRegistrationsList = () => <div>Event Registrations List</div>;

import LoginPage from './LoginPage';

// Главный Dashboard компонент
const DashboardContent: React.FC = () => {
  const redirect = useRedirect();
  const [subscribersCount, setSubscribersCount] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchSubscribersCount = async () => {
      try {
        const result = await dataProvider.getList('subscribers', {
          pagination: { page: 1, perPage: 1 },
          sort: { field: 'id', order: 'ASC' },
          filter: { isActive: true },
        });
        setSubscribersCount(result.total ?? 0);
      } catch (error) {
        console.error('Ошибка при загрузке количества подписчиков:', error);
      }
    };
    fetchSubscribersCount();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Добро пожаловать в панель администратора ООО «Инженер-центр»</p>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Подписчики', value: subscribersCount, icon: UserGroupIcon, color: 'text-blue-600 bg-blue-50' },
          { label: 'Новости', value: '—', icon: NewspaperIcon, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Мероприятия', value: '—', icon: CalendarDaysIcon, color: 'text-violet-600 bg-violet-50' },
          { label: 'Рассылки', value: '—', icon: EnvelopeIcon, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Быстрые действия</h3>
          <div className="space-y-1">
            {[
              { label: 'Новость', icon: NewspaperIcon, action: () => redirect('/news/create') },
              { label: 'Мероприятие', icon: CalendarDaysIcon, action: () => redirect('/events/create') },
              { label: 'Жизнь компании', icon: BuildingOffice2Icon, action: () => redirect('/company-life/create') },
              { label: 'Акция', icon: GiftIcon, action: () => redirect('/promotions/create') },
            ].map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center px-3 py-2.5 text-sm text-left rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                  <Icon className="h-4 w-4 text-blue-600" />
                </span>
                <span className="font-medium text-slate-700 group-hover:text-slate-900">Создать: {label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-3">Управление рассылками</h3>
          <div className="mb-4 flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <UserGroupIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-slate-700">
              Активных подписчиков: <span className="font-bold text-blue-700">{subscribersCount}</span>
            </p>
          </div>
          <div className="space-y-1">
            {[
              { label: 'Рассылки', icon: EnvelopeIcon, path: '/newsletters' },
              { label: 'Создать рассылку', icon: EnvelopeIcon, path: '/newsletters/create' },
              { label: 'Отправка', icon: PaperAirplaneIcon, path: '/newsletters-send' },
              { label: 'Подписчики', icon: UserGroupIcon, path: '/subscribers' },
            ].map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => redirect(path)}
                className="w-full flex items-center px-3 py-2.5 text-sm text-left rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-slate-200 transition-colors">
                  <Icon className="h-4 w-4 text-slate-600" />
                </span>
                <span className="font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
              </button>
            ))}
          </div>
        </div>
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
      if (storedRole) setRole(storedRole);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>
      <AdminMenu role={role} />
      <div className="lg:ml-64 relative">
        <main className="p-6 md:p-8 lg:p-10 min-h-screen bg-slate-100/95 lg:rounded-tl-2xl">
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
  <ThemeProvider theme={adminTheme}>
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
      <Resource name="team-members" list={TeamMembersList} create={TeamMembersCreate} edit={TeamMembersEdit} />
      <Resource name="clients" list={ClientsList} create={ClientsCreate} edit={ClientsEdit} />
      <Resource name="equipment" list={EquipmentList} create={EquipmentCreate} edit={EquipmentEdit} />
      <CustomRoutes>
        <Route path="/events/:id/registrations" element={<EventRegistrationsList />} />
      </CustomRoutes>
    </Admin>
  </ThemeProvider>
);

export default AdminDashboard;
