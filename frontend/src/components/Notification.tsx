import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useNotification } from '../context/NotificationContext';

const Notification: React.FC = () => {
  const { notification, hideNotification } = useNotification();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (notification.visible) {
      setIsFadingOut(false);

      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 3000);

      const hideTimer = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [notification, hideNotification]);

  if (!notification.visible) {
    return null;
  }

  const isSuccess = notification.type === 'success';

  return (
    <div
      className={`fixed bottom-5 right-5 w-full max-w-sm rounded-xl shadow-modern-lg p-4 flex items-start transition-all duration-500 transform z-[100] ${
        isFadingOut ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
      } ${
        isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}
    >
      <div className="flex-shrink-0">
        {isSuccess ? (
          <CheckCircleIcon className="h-6 w-6 text-green-500" />
        ) : (
          <XCircleIcon className="h-6 w-6 text-red-500" />
        )}
      </div>
      <div className="ml-3">
        <p
          className={`font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
          {notification.message}
        </p>
      </div>
    </div>
  );
};

export default Notification;
