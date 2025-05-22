// frontend/src/App.tsx
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // Добавляем HelmetProvider
import Header from './components/Header';
import Home from './pages/Home';
import PageWrapper from './components/PageWrapper';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import NewsDetail from './components/NewsDetail';
import PromotionsDetail from './components/PromotionsDetail';
import EventsDetail from './components/EventsDetail';
import ReadySolutionsList from './components/ReadySolutionsList';
import ReadySolutionDetail from './components/ReadySolutionDetail';

const App: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        setShowLogin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <HelmetProvider> {/* Оборачиваем приложение в HelmetProvider */}
      <Router>
        <div className="w-full h-full">
          <Header ref={headerRef} setShowLogin={setShowLogin} />
          <Suspense fallback={<div className="text-darkGray">Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <PageWrapper headerHeight={headerHeight}>
                    <Home />
                  </PageWrapper>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <PageWrapper headerHeight={headerHeight}>
                    <Dashboard />
                  </PageWrapper>
                }
              />
              <Route
                path="/news/:slug"
                element={
                  <PageWrapper headerHeight={headerHeight}>
                    <NewsDetail />
                  </PageWrapper>
                }
              />
              <Route
                path="/promotions/:slug"
                element={
                  <PageWrapper headerHeight={headerHeight}>
                    <PromotionsDetail />
                  </PageWrapper>
                }
              />
              <Route
                path="/events/:slug"
                element={
                  <PageWrapper headerHeight={headerHeight}>
                    <EventsDetail />
                  </PageWrapper>
                }
              />
              <Route
                path="/ready-solutions"
                element={
                  <PageWrapper headerHeight={headerHeight}>
                    <ReadySolutionsList />
                  </PageWrapper>
                }
              />
              <Route
                path="/ready-solutions/:slug"
                element={
                  <PageWrapper headerHeight={headerHeight}>
                    <ReadySolutionDetail />
                  </PageWrapper>
                }
              />
            </Routes>
            {showLogin && <Login onClose={() => setShowLogin(false)} />}
          </Suspense>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;