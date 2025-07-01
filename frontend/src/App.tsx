// src/App.tsx
import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// Компоненты, которые нужны сразу (не делаем lazy)
import Home from './pages/Home';
import Layout from './components/Layout';
import PageWrapper from './components/PageWrapper';

// Lazy loading для всех остальных компонентов
const News = React.lazy(() => import('./pages/News'));
const Events = React.lazy(() => import('./pages/Events'));
const Promotions = React.lazy(() => import('./pages/Promotions'));
const Services = React.lazy(() => import('./pages/1CServices'));

// Detail компоненты (самые тяжелые - обязательно lazy)
const NewsDetail = React.lazy(() => import('./components/NewsDetail'));
const EventsDetail = React.lazy(() => import('./components/EventsDetail'));
const PromotionsDetail = React.lazy(() => import('./components/PromotionsDetail'));
const ReadySolutionDetail = React.lazy(() => import('./components/ReadySolutionDetail'));
const ReadySolutionsList = React.lazy(() => import('./components/ReadySolutionsList'));

// Специальные страницы
const Unsubscribe = React.lazy(() => import('./pages/Unsubscribe'));

// Админка
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));

// Создаем клиент для React Query
const queryClient = new QueryClient();

// Компонент Loading для Suspense
const PageLoading: React.FC<{ message?: string }> = ({ message = "Загрузка страницы..." }) => (
  <div className="min-h-screen bg-modern-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-modern-primary-600 mx-auto mb-4"></div>
      <p className="text-modern-gray-600 font-medium">{message}</p>
      <p className="text-modern-gray-500 text-sm mt-2">Пожалуйста, подождите...</p>
    </div>
  </div>
);

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Админка - react-admin управляет всеми внутренними маршрутами */}
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<PageLoading message="Загрузка админ-панели..." />}>
                    <Dashboard />
                  </Suspense>
                }
              />

              {/* Главная страница - без lazy (нужна сразу) */}
              <Route
                path="/"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Home />
                  </Layout>
                }
              />

              {/* Страницы списков - lazy loading */}
              <Route
                path="/news"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Suspense fallback={<PageLoading message="Загрузка новостей..." />}>
                      <News />
                    </Suspense>
                  </Layout>
                }
              />
              <Route
                path="/events"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Suspense fallback={<PageLoading message="Загрузка мероприятий..." />}>
                      <Events />
                    </Suspense>
                  </Layout>
                }
              />
              <Route
                path="/promotions"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Suspense fallback={<PageLoading message="Загрузка акций..." />}>
                      <Promotions />
                    </Suspense>
                  </Layout>
                }
              />
              <Route
                path="/ready-solutions"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Suspense fallback={<PageLoading message="Загрузка готовых решений..." />}>
                      <ReadySolutionsList />
                    </Suspense>
                  </Layout>
                }
              />
              <Route
                path="/1c-services"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Suspense fallback={<PageLoading message="Загрузка сервисов..." />}>
                      <Services />
                    </Suspense>
                  </Layout>
                }
              />

              {/* Detail страницы - обязательно lazy (самые тяжелые) */}
              <Route
                path="/news/:slug"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Suspense fallback={<PageLoading message="Загрузка новости..." />}>
                      <NewsDetail />
                    </Suspense>
                  </Layout>
                }
              />
              <Route
                path="/events/:slug"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Suspense fallback={<PageLoading message="Загрузка мероприятия..." />}>
                      <EventsDetail />
                    </Suspense>
                  </Layout>
                }
              />
              <Route
                path="/promotions/:slug"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Suspense fallback={<PageLoading message="Загрузка акции..." />}>
                      <PromotionsDetail />
                    </Suspense>
                  </Layout>
                }
              />
              <Route
                path="/ready-solutions/:slug"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Suspense fallback={<PageLoading message="Загрузка решения..." />}>
                      <ReadySolutionDetail />
                    </Suspense>
                  </Layout>
                }
              />

              {/* Специальные страницы */}
              <Route
                path="/unsubscribe"
                element={
                  <Suspense fallback={<PageLoading message="Загрузка страницы отписки..." />}>
                    <Unsubscribe />
                  </Suspense>
                }
              />
            </Routes>

            {/* Модальное окно входа для основного сайта */}
            <PageWrapper showLogin={showLogin} setShowLogin={setShowLogin} />
          </div>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;