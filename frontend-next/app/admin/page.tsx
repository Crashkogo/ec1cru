'use client';

import dynamic from 'next/dynamic';

// Динамический импорт AdminDashboard без SSR
const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Загрузка панели администратора...</p>
      </div>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminDashboard />;
}
