// frontend/src/App.tsx
import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Admin, Resource } from 'react-admin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { dataProvider } from './admin/dataProvider';
import { authProvider } from './admin/authProvider';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import NewsDetail from './components/NewsDetail';
import PromotionsDetail from './components/PromotionsDetail';
import EventsDetail from './components/EventsDetail';
import ReadySolutionsList from './components/ReadySolutionsList';
import ReadySolutionDetail from './components/ReadySolutionDetail';
import PageWrapper from './components/PageWrapper';
import Header from './components/Header';
import Dashboard from './pages/admin/Dashboard'; // Импортируем кастомный дашборд

// Создаем QueryClient
const queryClient = new QueryClient();

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <Suspense fallback={<div className="text-darkGray">Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <Header setShowLogin={setShowLogin} />
                    <PageWrapper>
                      <Home />
                    </PageWrapper>
                  </div>
                }
              />
              <Route
                path="/news/:slug"
                element={
                  <div>
                    <Header setShowLogin={setShowLogin} />
                    <PageWrapper>
                      <NewsDetail />
                    </PageWrapper>
                  </div>
                }
              />
              <Route
                path="/promotions/:slug"
                element={
                  <div>
                    <Header setShowLogin={setShowLogin} />
                    <PageWrapper>
                      <PromotionsDetail />
                    </PageWrapper>
                  </div>
                }
              />
              <Route
                path="/events/:slug"
                element={
                  <div>
                    <Header setShowLogin={setShowLogin} />
                    <PageWrapper>
                      <EventsDetail />
                    </PageWrapper>
                  </div>
                }
              />
              <Route
                path="/ready-solutions"
                element={
                  <div>
                    <Header setShowLogin={setShowLogin} />
                    <PageWrapper>
                      <ReadySolutionsList />
                    </PageWrapper>
                  </div>
                }
              />
              <Route
                path="/ready-solutions/:slug"
                element={
                  <div>
                    <Header setShowLogin={setShowLogin} />
                    <PageWrapper>
                      <ReadySolutionDetail />
                    </PageWrapper>
                  </div>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <Admin
                    dataProvider={dataProvider}
                    authProvider={authProvider}
                    loginPage={Login}
                    dashboard={Dashboard}
                    basename="/admin"
                  >
                    {/* Минимальный ресурс для проверки */}
                    <Resource
                      name="programs"
                      list={() => <div>Список программ</div>} // Временная заглушка
                    />
                  </Admin>
                }
              />
              <Route path="/client" element={<div>Личный кабинет клиента (будет позже)</div>} />
            </Routes>
            {showLogin && <Login onClose={() => setShowLogin(false)} />}
          </Suspense>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;