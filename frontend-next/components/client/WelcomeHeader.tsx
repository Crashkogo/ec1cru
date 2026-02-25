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
        <div className="bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">
                    Добро пожаловать, {clientName}!
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                    <p className="text-xs text-modern-primary-100">Обновлено:</p>
                    <p className="text-xs font-semibold">{formatDate(lastUpdate)}</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                        aria-label="Обновить данные"
                    >
                    <ArrowPathIcon className="h-5 w-5 text-white" />
                    </button>
                </div>
            </div>
      </div>
    )
}
