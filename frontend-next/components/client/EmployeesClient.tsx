'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, StarIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { createClientEmployee, updateClientEmployee, deleteClientEmployee } from '@/actions/client-auth';
import EmployeeModal from './EmployeeModal';
import type { ClientEmployee } from '@/types/client';

interface EmployeesClientProps {
  employees: ClientEmployee[];
}

export default function EmployeesClient({ employees: initial }: EmployeesClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<ClientEmployee | null>(null);

  const refresh = () => router.refresh();

  const handleCreate = async (data: Parameters<typeof createClientEmployee>[0]) => {
    const result = await createClientEmployee(data);
    if (result.success) refresh();
    return result;
  };

  const handleEdit = async (data: Parameters<typeof createClientEmployee>[0]) => {
    if (!editEmployee) return { success: false, error: 'Нет выбранного сотрудника' };
    const result = await updateClientEmployee(editEmployee.id, data);
    if (result.success) refresh();
    return result;
  };

  const handleSetDefault = async (emp: ClientEmployee) => {
    if (emp.isDefault) return;
    await updateClientEmployee(emp.id, {
      name: emp.name,
      position: emp.position,
      phone: emp.phone ?? '',
      email: emp.email ?? '',
      isDefault: true,
    });
    refresh();
  };

  const handleDelete = async (emp: ClientEmployee) => {
    if (!confirm(`Удалить сотрудника «${emp.name}»?`)) return;
    await deleteClientEmployee(emp.id);
    refresh();
  };

  const openCreate = () => {
    setEditEmployee(null);
    setModalOpen(true);
  };

  const openEdit = (emp: ClientEmployee) => {
    setEditEmployee(emp);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-modern-gray-900">Сотрудники</h1>
          <p className="text-modern-gray-600 mt-2">Список сотрудников для подачи заявок</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white rounded-lg hover:from-modern-primary-600 hover:to-modern-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-modern-primary-500/30"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Добавить сотрудника
        </button>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-xl shadow-lg border border-modern-gray-200 overflow-hidden">
        {initial.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-modern-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="h-8 w-8 text-modern-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-modern-gray-900 mb-2">Нет сотрудников</h3>
            <p className="text-modern-gray-600 mb-4">
              Добавьте сотрудников, чтобы выбирать их при создании заявок
            </p>
            <button
              onClick={openCreate}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white rounded-lg hover:from-modern-primary-600 hover:to-modern-primary-700 transition-all font-semibold shadow-lg shadow-modern-primary-500/30"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Добавить первого сотрудника
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-modern-gray-50 border-b border-modern-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-modern-gray-600 uppercase tracking-wider">Имя</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-modern-gray-600 uppercase tracking-wider">Должность</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-modern-gray-600 uppercase tracking-wider">Телефон</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-modern-gray-600 uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-modern-gray-600 uppercase tracking-wider">По умолч.</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-modern-gray-600 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-modern-gray-200">
                {initial.map((emp) => (
                  <tr key={emp.id} className="hover:bg-modern-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-modern-gray-900">{emp.name}</td>
                    <td className="px-6 py-4 text-sm text-modern-gray-600">{emp.position}</td>
                    <td className="px-6 py-4 text-sm text-modern-gray-600">{emp.phone || '—'}</td>
                    <td className="px-6 py-4 text-sm text-modern-gray-600">{emp.email || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleSetDefault(emp)}
                        title={emp.isDefault ? 'Сотрудник по умолчанию' : 'Сделать по умолчанию'}
                        className="p-1 rounded hover:bg-amber-50 transition-colors"
                      >
                        {emp.isDefault ? (
                          <StarSolidIcon className="h-5 w-5 text-amber-400" />
                        ) : (
                          <StarIcon className="h-5 w-5 text-modern-gray-300 hover:text-amber-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(emp)}
                          className="p-2 text-modern-gray-500 hover:text-modern-primary-600 hover:bg-modern-primary-50 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp)}
                          className="p-2 text-modern-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        mode={editEmployee ? 'edit' : 'create'}
        employee={editEmployee}
        onSubmit={editEmployee ? handleEdit : handleCreate}
      />
    </div>
  );
}
