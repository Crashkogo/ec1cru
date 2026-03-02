'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ClientEmployee } from '@/types/client';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  employee?: ClientEmployee | null;
  onSubmit: (data: {
    name: string;
    position: string;
    phone: string;
    email: string;
    isDefault: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
}

export default function EmployeeModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  employee,
  onSubmit,
}: EmployeeModalProps) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Заполняем форму при редактировании
  useEffect(() => {
    if (isOpen && mode === 'edit' && employee) {
      setName(employee.name);
      setPosition(employee.position);
      setPhone(employee.phone ?? '');
      setEmail(employee.email ?? '');
      setIsDefault(employee.isDefault);
    } else if (isOpen && mode === 'create') {
      setName('');
      setPosition('');
      setPhone('');
      setEmail('');
      setIsDefault(false);
    }
    setError('');
  }, [isOpen, mode, employee]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim()) {
      setError('Имя и должность обязательны');
      return;
    }

    setLoading(true);
    setError('');

    const result = await onSubmit({ name: name.trim(), position: position.trim(), phone: phone.trim(), email: email.trim(), isDefault });

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Произошла ошибка');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-modern-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-modern-gray-900">
            {mode === 'create' ? 'Добавить сотрудника' : 'Редактировать сотрудника'}
          </h2>
          <button onClick={onClose} disabled={loading} className="p-2 hover:bg-modern-gray-100 rounded-lg">
            <XMarkIcon className="h-6 w-6 text-modern-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-modern-gray-700 mb-1">
              Имя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-modern-gray-700 mb-1">
              Должность <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
              placeholder="Бухгалтер"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-modern-gray-700 mb-1">Телефон</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
              placeholder="+7 (900) 000-00-00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-modern-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
              placeholder="ivan@company.ru"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 text-modern-primary-600 border-modern-gray-300 rounded focus:ring-modern-primary-500"
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-modern-gray-700">
              Сотрудник по умолчанию
            </label>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 border border-modern-gray-300 text-modern-gray-700 rounded-lg hover:bg-modern-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white rounded-lg hover:from-modern-primary-600 hover:to-modern-primary-700 transition-all font-semibold shadow-lg shadow-modern-primary-500/30 disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : (mode === 'create' ? 'Добавить' : 'Сохранить')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
