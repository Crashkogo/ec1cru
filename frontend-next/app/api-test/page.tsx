'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ApiTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Проверка соединения...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      setResult(`API URL: ${apiUrl}\n\n`);

      // Тест 1: Простой GET запрос
      const healthCheck = await axios.get(`${apiUrl}/api/posts/news?_start=0&_end=1`);
      setResult(prev => prev + `✅ Соединение с API работает\n`);
      setResult(prev => prev + `Статус: ${healthCheck.status}\n\n`);

      // Тест 2: Проверка CORS
      const corsTest = await axios.get(`${apiUrl}/api/posts/news?_start=0&_end=1`, {
        withCredentials: true
      });
      setResult(prev => prev + `✅ CORS настроен правильно (withCredentials работает)\n\n`);

      // Тест 3: Попытка логина с тестовыми данными
      setResult(prev => prev + `Попытка тестового логина...\n`);
      try {
        const loginResponse = await axios.post(
          `${apiUrl}/api/users/login`,
          { name: 'test', password: 'test123' },
          { withCredentials: true }
        );
        setResult(prev => prev + `✅ API логина доступен\n`);
        setResult(prev => prev + `Ответ: ${JSON.stringify(loginResponse.data, null, 2)}\n`);
      } catch (loginError: any) {
        if (loginError.response?.status === 400 || loginError.response?.status === 401) {
          setResult(prev => prev + `✅ API логина доступен (неверные credentials - это норма)\n`);
          setResult(prev => prev + `Ошибка: ${loginError.response?.data?.message}\n`);
        } else {
          throw loginError;
        }
      }

      setResult(prev => prev + `\n✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ!\n`);
      setResult(prev => prev + `\nBackend работает корректно. Вы можете войти в админку.`);

    } catch (error: any) {
      setResult(prev => prev + `\n❌ ОШИБКА:\n`);
      if (error.code === 'ERR_NETWORK') {
        setResult(prev => prev + `Ошибка сети: Backend не запущен или недоступен на ${process.env.NEXT_PUBLIC_API_URL}\n`);
        setResult(prev => prev + `\nПроверьте:\n`);
        setResult(prev => prev + `1. Backend запущен: cd backend && npm run dev\n`);
        setResult(prev => prev + `2. Backend работает на порту 5000\n`);
      } else if (error.response) {
        setResult(prev => prev + `Статус: ${error.response.status}\n`);
        setResult(prev => prev + `Сообщение: ${error.response.data?.message || error.message}\n`);
        setResult(prev => prev + `\nОтвет сервера: ${JSON.stringify(error.response.data, null, 2)}\n`);
      } else {
        setResult(prev => prev + `${error.message}\n`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔧 Тест подключения к API</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Информация</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
            <p><strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
          </div>
        </div>

        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? 'Тестирование...' : 'Запустить тест'}
        </button>

        {result && (
          <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap">
            {result}
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-800">
            <strong>Примечание:</strong> Эта страница предназначена только для отладки.
            Удалите её перед деплоем в production.
          </p>
        </div>
      </div>
    </div>
  );
}
