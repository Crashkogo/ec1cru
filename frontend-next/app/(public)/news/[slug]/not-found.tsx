import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewsNotFound() {
  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto text-center">
          <div className="bg-modern-white rounded-xl shadow-modern p-12">
            <h1 className="text-2xl font-bold text-modern-gray-900 mb-4">Новость не найдена</h1>
            <p className="text-modern-gray-600 mb-6">
              Запрашиваемая новость не существует или была удалена
            </p>
            <Link
              href="/news"
              className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Вернуться к новостям
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
