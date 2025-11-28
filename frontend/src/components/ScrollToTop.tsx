import React, { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Показывать кнопку при прокрутке вниз на 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Плавная прокрутка наверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Добавляем слушатель события прокрутки
    window.addEventListener('scroll', toggleVisibility);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-modern-primary-600 text-white rounded-full shadow-lg hover:bg-modern-primary-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-modern-primary-500 focus:ring-offset-2"
          aria-label="Прокрутить наверх"
          title="Прокрутить наверх"
        >
          <ChevronUpIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
