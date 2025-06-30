// src/App.tsx
import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// Основные страницы
import Home from './pages/Home';
import News from './pages/News';
import Events from './pages/Events';
import Promotions from './pages/Promotions';
import Services from './pages/1CServices';

// Detail компоненты
import NewsDetail from './components/NewsDetail';
import EventsDetail from './components/EventsDetail';
import PromotionsDetail from './components/PromotionsDetail';
import ReadySolutionDetail from './components/ReadySolutionDetail';
import ReadySolutionsList from './components/ReadySolutionsList';

// Компоненты
import Layout from './components/Layout';
import PageWrapper from './components/PageWrapper';

// Админка - только Dashboard (react-admin)
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));

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
              {/* Админка - react-admin управляет всеми внутренними маршрутами */}
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <Dashboard />
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
              <Route
                path="/1c-services"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <Services />
                  </Layout>
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