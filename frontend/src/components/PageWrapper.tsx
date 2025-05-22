import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  headerHeight?: number;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, headerHeight = 64 }) => {
  return (
    <div style={{ paddingTop: `${headerHeight}px` }} className="h-full min-h-screen bg-lightGray">
      {children}
    </div>
  );
};

export default PageWrapper;