// components/client/ChangePasswordButton.tsx
'use client';

import { useState } from 'react';
import { changePassword } from '@/actions/client-auth';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export function ChangePasswordButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Валидация
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Заполните все поля');
      return;
    }

    if (newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (oldPassword === newPassword) {
      setError('Новый пароль должен отличаться от старого');
      return;
    }

    setLoading(true);

    const result = await changePassword(oldPassword, newPassword);

    if (result.success) {
      setSuccess('Пароль успешно изменен');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsOpen(false);
        setSuccess('');
      }, 2000);
    } else {
      setError(result.error || 'Ошибка смены пароля');
    }

    setLoading(false);
  };

  const handleClose = () => {
    if (!loading) {
      setIsOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-modern-primary-600 text-white rounded-lg hover:bg-modern-primary-700 transition-all duration-200 font-medium"
      >
        Изменить пароль
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-modern-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-modern-gray-900">Смена пароля</h2>
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

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                  Текущий пароль <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-modern-gray-500 hover:text-modern-gray-700"
                  >
                    {showOldPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                  Новый пароль <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-modern-gray-500 hover:text-modern-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-modern-gray-500 mt-1">Минимум 6 символов</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-modern-gray-700 mb-2">
                  Подтвердите новый пароль <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 border border-modern-gray-300 rounded-lg focus:ring-2 focus:ring-modern-primary-500 focus:border-transparent disabled:bg-modern-gray-100"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-modern-gray-500 hover:text-modern-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
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
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white rounded-lg hover:from-modern-primary-600 hover:to-modern-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-modern-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Сохранение...' : 'Изменить пароль'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
