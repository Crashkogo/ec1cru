'use client';

import { useState } from 'react';
import { PhoneIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import CallbackModal from '@/components/ui/CallbackModal';

export function CallRequestTile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-modern-primary-600 to-modern-primary-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <PhoneIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-tight">Заказать звонок</p>
              <p className="text-modern-primary-100 text-sm mt-0.5">
                Ответим на вопросы и подберём решение
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex-shrink-0 flex items-center gap-2 bg-white text-modern-primary-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-modern-primary-50 transition-colors duration-200 shadow-sm"
          >
            Перезвоните мне
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <CallbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
