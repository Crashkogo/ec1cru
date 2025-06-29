// src/App.tsx
import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Home from './pages/Home';
import News from './pages/News';
import Promotions from './pages/Promotions';
import Events from './pages/Events';
import Services1C from './pages/1CServices';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Layout from './components/Layout';
import PageWrapper from './components/PageWrapper';
import NewsDetail from './components/NewsDetail';
import PromotionsDetail from './components/PromotionsDetail';
import EventsDetail from './components/EventsDetail';
import ReadySolutionsList from './components/ReadySolutionsList';
import ReadySolutionDetail from './components/ReadySolutionDetail';

// Импорт админских страниц
const NewsList = React.lazy(() => import('./pages/admin/NewsList'));
const NewsCreate = React.lazy(() => import('./pages/admin/NewsCreate'));
const NewsEdit = React.lazy(() => import('./pages/admin/NewsEdit'));
const PromotionsList = React.lazy(() => import('./pages/admin/PromotionsList'));
const PromotionsCreate = React.lazy(() => import('./pages/admin/PromotionsCreate'));
const PromotionsEdit = React.lazy(() => import('./pages/admin/PromotionsEdit'));
const EventsList = React.lazy(() => import('./pages/admin/EventsList'));
const EventsCreate = React.lazy(() => import('./pages/admin/EventsCreate'));
const EventsEdit = React.lazy(() => import('./pages/admin/EventsEdit'));
const ReadySolutionsListAdmin = React.lazy(() => import('./pages/admin/ReadySolutionsList'));
const ReadySolutionsCreate = React.lazy(() => import('./pages/admin/ReadySolutionsCreate'));
const ReadySolutionsEdit = React.lazy(() => import('./pages/admin/ReadySolutionsEdit'));
const UserList = React.lazy(() => import('./pages/admin/UserList'));
const UserCreate = React.lazy(() => import('./pages/admin/UserCreate'));
const UserEdit = React.lazy(() => import('./pages/admin/UserEdit'));
const UserShow = React.lazy(() => import('./pages/admin/UserShow'));
const ProgramsList = React.lazy(() => import('./pages/admin/ProgramsList'));
const ProgramsCreate = React.lazy(() => import('./pages/admin/ProgramsCreate'));
const ProgramsEdit = React.lazy(() => import('./pages/admin/ProgramsEdit'));
const ProgramSettings = React.lazy(() => import('./pages/admin/ProgramSettings'));

// Создаем клиент для React Query
const queryClient = new QueryClient();

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Админские маршруты без Layout */}
              <Route path="/admin" element={<Login />} />
              <Route
                path="/admin/dashboard"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="/admin/news"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <NewsList />
                  </Suspense>
                }
              />
              <Route
                path="/admin/news/create"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <NewsCreate />
                  </Suspense>
                }
              />
              <Route
                path="/admin/news/:id/edit"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <NewsEdit />
                  </Suspense>
                }
              />
              <Route
                path="/admin/promotions"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <PromotionsList />
                  </Suspense>
                }
              />
              <Route
                path="/admin/promotions/create"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <PromotionsCreate />
                  </Suspense>
                }
              />
              <Route
                path="/admin/promotions/:id/edit"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <PromotionsEdit />
                  </Suspense>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <EventsList />
                  </Suspense>
                }
              />
              <Route
                path="/admin/events/create"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <EventsCreate />
                  </Suspense>
                }
              />
              <Route
                path="/admin/events/:id/edit"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <EventsEdit />
                  </Suspense>
                }
              />
              <Route
                path="/admin/ready-solutions"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <ReadySolutionsListAdmin />
                  </Suspense>
                }
              />
              <Route
                path="/admin/ready-solutions/create"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <ReadySolutionsCreate />
                  </Suspense>
                }
              />
              <Route
                path="/admin/ready-solutions/:slug/edit"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <ReadySolutionsEdit />
                  </Suspense>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <UserList />
                  </Suspense>
                }
              />
              <Route
                path="/admin/users/create"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <UserCreate />
                  </Suspense>
                }
              />
              <Route
                path="/admin/users/:id/edit"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <UserEdit />
                  </Suspense>
                }
              />
              <Route
                path="/admin/users/:id"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <UserShow />
                  </Suspense>
                }
              />
              <Route
                path="/admin/programs"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <ProgramsList />
                  </Suspense>
                }
              />
              <Route
                path="/admin/programs/create"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <ProgramsCreate />
                  </Suspense>
                }
              />
              <Route
                path="/admin/programs/:id/edit"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <ProgramsEdit />
                  </Suspense>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <ProgramSettings />
                  </Suspense>
                }
              />

              {/* Публичные маршруты с Layout */}
              <Route
                path="/"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/news"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <News />
                  </Layout>
                }
              />
              <Route
                path="/news/:slug"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <NewsDetail />
                  </Layout>
                }
              />
              <Route
                path="/promotions"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Promotions />
                  </Layout>
                }
              />
              <Route
                path="/promotions/:slug"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <PromotionsDetail />
                  </Layout>
                }
              />
              <Route
                path="/events"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Events />
                  </Layout>
                }
              />
              <Route
                path="/events/:slug"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <EventsDetail />
                  </Layout>
                }
              />
              <Route
                path="/1c-services"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Services1C />
                  </Layout>
                }
              />
              <Route
                path="/ready-solutions"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <ReadySolutionsList />
                  </Layout>
                }
              />
              <Route
                path="/ready-solutions/:slug"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <ReadySolutionDetail />
                  </Layout>
                }
              />
            </Routes>

            {/* Модальное окно логина */}
            {showLogin && (
              <PageWrapper showLogin={showLogin} setShowLogin={setShowLogin} />
            )}
          </div>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;