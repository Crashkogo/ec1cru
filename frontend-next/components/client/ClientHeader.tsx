// components/client/ClientHeader.tsx
'use client';

import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import type { ClientData } from '@/types/client';

interface ClientHeaderProps {
  clientData: ClientData;
  onMenuButtonClick: () => void;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ clientData, onMenuButtonClick }) => {
  return (
    <header className="bg-white border-b border-modern-gray-200 sticky top-0 z-20 shadow-sm lg:ml-64">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuButtonClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-modern-gray-100 transition-colors"
        >
          <Bars3Icon className="h-6 w-6 text-modern-gray-600" />
        </button>

        {/* Title (visible on desktop) - This can be improved with usePathname */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold text-modern-gray-900">
            Личный кабинет
          </h1>
        </div>

        {/* Logo (mobile only, centered when menu button is on the left) */}
        <div className="lg:hidden">
            <div className="flex-1 flex justify-center">
                 <Image src="/logo.png" alt="1C Support" width={100} height={40} className="h-10 w-auto" />
            </div>
        </div>

        {/* Right-side icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-modern-gray-100 transition-colors">
            <BellIcon className="h-6 w-6 text-modern-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User avatar (desktop only) */}
          <div className="hidden lg:flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-modern-primary-500 to-modern-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {clientData?.name?.charAt(0) || 'К'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
