'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GiCookie } from 'react-icons/gi';

const CONSENT_KEY = 'cookieConsent';

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-modern-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <GiCookie className="w-6 h-6 text-amber-500" />
          </span>
          <p className="text-sm text-modern-gray-600">
            Мы используем файлы cookie для обеспечения работы сайта и анализа трафика.
            Продолжая использование сайта, вы соглашаетесь с нашей{' '}
            <Link
              href="/privacy-policy"
              className="text-modern-primary-600 hover:underline font-medium"
            >
              Политикой конфиденциальности
            </Link>
            .
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="flex-shrink-0 px-5 py-2 bg-modern-primary-600 text-white text-sm font-medium rounded-lg hover:bg-modern-primary-700 transition-colors duration-200 whitespace-nowrap"
        >
          Принять
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
