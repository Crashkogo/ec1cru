import React, { Suspense, useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PageWrapper from './components/PageWrapper';

const App: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
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

          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;