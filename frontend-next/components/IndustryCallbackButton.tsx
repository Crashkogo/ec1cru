'use client';

import { useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import CallbackModal from '@/components/ui/CallbackModal';

interface IndustryCallbackButtonProps {
  label?: string;
}

export function IndustryCallbackButton({ label = 'Заказать внедрение' }: IndustryCallbackButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-modern-primary-600 text-white rounded-xl font-semibold text-base hover:bg-modern-primary-700 transition-all duration-200 shadow-modern hover:shadow-modern-lg group"
      >
        {label}
        <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
      <CallbackModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
