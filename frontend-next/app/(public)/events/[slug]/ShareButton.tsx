'use client';

import { ShareIcon } from '@heroicons/react/24/outline';

interface ShareButtonProps {
  title: string;
  description: string;
}

export default function ShareButton({ title, description }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-colors duration-200 text-sm font-medium"
    >
      <ShareIcon className="h-4 w-4 mr-2" />
      Поделиться
    </button>
  );
}
