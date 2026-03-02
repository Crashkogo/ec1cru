'use client';

import { useState, useEffect } from 'react';
import { createTicket, getClientEmployees } from '@/actions/client-auth';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ClientEmployee } from '@/types/client';

const DEPARTMENTS = [
  'Линия консультаций 1С',
  'Отдел внедрения',
  'Отдел сопровождения',
  'IT-аутсорсинг',
] as const;

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTicketModal({ isOpen, onClose, onSuccess }: CreateTicketModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [employees, setEmployees] = useState<ClientEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [error, setError] = useState('');

  // Загружаем сотрудников при открытии формы
  useEffect(() => {
    if (!isOpen) return;
    setLoadingEmployees(true);
    getClientEmployees().then((list) => {
      setEmployees(list);
      const def = list.find((e) => e.isDefault);
      if (def) setEmployeeId(String(def.id));
      setLoadingEmployees(false);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Заполните все обязательные поля');
      return;
    }
    if (!employeeId) {
      setError('Выберите сотрудника');
      return;
    }

    setLoading(true);
    setError('');

    const result = await createTicket(title, description, department, Number(employeeId));

    if (result.success) {
      resetForm();
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Ошибка создания заявки');
    }

    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDepartment(DEPARTMENTS[0]);
    setEmployeeId('');
    setError('');
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-modern-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-modern-gray-900">Создать заявку</h2>
            <p className="text-sm text-modern-gray-600 mt-1">Опишите вашу проблему или вопрос</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-modern-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-modern-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Тема заявки */}
          <div>
            <label className="block text-sm font-medium text-modern-gray-700 mb-2">
              Тема заявки <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
              placeholder="Кратко опишите проблему"
              required
            />
          </div>

          {/* Направление обращения */}
          <div>
            <label className="block text-sm font-medium text-modern-gray-700 mb-2">
              Направление обращения <span className="text-red-500">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Сотрудник */}
          <div>
            <label className="block text-sm font-medium text-modern-gray-700 mb-2">
              Сотрудник <span className="text-red-500">*</span>
            </label>
            {loadingEmployees ? (
              <div className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg bg-modern-gray-50 text-modern-gray-400 text-sm">
                Загрузка сотрудников...
              </div>
            ) : employees.length === 0 ? (
              <div className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-amber-50 text-amber-700 text-sm">
                Нет сотрудников. Добавьте сотрудников в разделе «Сотрудники».
              </div>
            ) : (
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
                required
              >
                <option value="">Выберите сотрудника</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.position}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Описание проблемы */}
          <div>
            <label className="block text-sm font-medium text-modern-gray-700 mb-2">
              Описание проблемы <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
              placeholder="Подробно опишите вашу проблему или вопрос..."
              required
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 border border-modern-gray-300 text-modern-gray-700 rounded-lg hover:bg-modern-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || employees.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white rounded-lg hover:from-modern-primary-600 hover:to-modern-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-modern-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Создание...' : 'Создать заявку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
