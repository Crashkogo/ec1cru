// components/client/WelcomeHeader.tsx
'use client';

import { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface WelcomeHeaderProps {
    clientName: string;
}

export function WelcomeHeader({ clientName }: WelcomeHeaderProps) {
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const handleRefresh = () => {
        setLastUpdate(new Date());
        // TODO: В будущем здесь можно будет вызвать server action для обновления данных
    };

    const formatDate = (date: Date) => {
        return date.toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
    };

    return (
        <div className="bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">
                    Добро пожаловать, {clientName}!
                    </h1>
                    <p className="text-modern-primary-100">
                    Здесь вы можете управлять договорами, финансами и заявками
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRefresh}
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                        aria-label="Обновить данные"
                    >
                    <ArrowPathIcon className="h-6 w-6 text-white" />
                    </button>
                    <div className="text-right">
                    <p className="text-sm text-modern-primary-100">Дата обновления данных:</p>
                    <p className="text-sm font-semibold">{formatDate(lastUpdate)}</p>
                    </div>
                </div>
            </div>
      </div>
    )
}
