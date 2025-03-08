import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  headerHeight: number;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, headerHeight }) => {
  return (
    <div style={{ paddingTop: `${headerHeight}px` }}>
      {children}
    </div>
  );
};

export default PageWrapper;