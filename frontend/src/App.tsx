import React, { Suspense, useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PageWrapper from './components/PageWrapper';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import NewsDetail from './components/NewsDetail';

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
    <Router>
      <div className="w-full">
        <Header ref={headerRef} />
        <Suspense fallback={<div className="text-whiteText">Loading...</div>}>
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
          </Routes>
          {showLogin && <Login onClose={() => setShowLogin(false)} />}
        </Suspense>
      </div>
    </Router>
  );
};

export default App;