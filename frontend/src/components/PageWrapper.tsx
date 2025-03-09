// src/components/PageWrapper.tsx
import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  headerHeight?: number; // Делаем параметр необязательным
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, headerHeight = 112 }) => {
  return (
    <div style={{ paddingTop: `${headerHeight}px` }} className="min-h-screen bg-darkBg">
      {children}
    </div>
  );
};

export default PageWrapper;