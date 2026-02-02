'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, defaultOpen = false, id }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div id={id} className="border border-modern-gray-200 rounded-xl overflow-hidden mb-3 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-modern-gray-50 transition-colors duration-200"
      >
        <h3 className="text-lg font-semibold text-modern-gray-900 text-left">{title}</h3>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-modern-primary-600 flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-modern-primary-600 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-modern-gray-700 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
