'use client';

import { useEffect, useState } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Вернуться в начало страницы"
      className="fixed bottom-8 right-6 z-40 w-12 h-12 rounded-full bg-modern-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-modern-primary-700 transition-colors duration-200"
    >
      <ChevronUpIcon className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTopButton;
