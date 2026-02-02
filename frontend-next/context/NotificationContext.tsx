'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NotificationState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

interface NotificationContextType {
  notification: NotificationState;
  showNotification: (message: string, type: 'success' | 'error') => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'success',
    visible: false,
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type, visible: true });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
