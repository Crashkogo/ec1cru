'use server';

// Server Actions для клиентской аутентификации и операций
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import type { ClientData, Invoice, Contract, Ticket, DashboardStats } from '@/types/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Вход клиента в систему
 */
export async function loginClient(inn: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await axios.post(
      `${API_URL}/api/clients/login`,
      { inn, password },
      { withCredentials: true }
    );

    const { token, client } = response.data;

    // Устанавливаем токен в HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('clientToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 дней
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка входа в систему',
    };
  }
}

/**
 * Выход клиента из системы
 */
export async function logoutClient() {
  try {
    // Отправляем запрос на backend для очистки session
    await axios.post(
      `${API_URL}/api/clients/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error('Logout error:', error);
  }

  // Удаляем cookie на клиенте
  const cookieStore = await cookies();
  cookieStore.delete('clientToken');

  redirect('/');
}

/**
 * Получение профиля клиента
 */
export async function getClientProfile(): Promise<ClientData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('clientToken')?.value;

    if (!token) {
      return null;
    }

    const response = await axios.get(`${API_URL}/api/clients/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
}

/**
 * Смена пароля клиента
 */
export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('clientToken')?.value;

    if (!token) {
      return { success: false, error: 'Не авторизован' };
    }

    await axios.post(
      `${API_URL}/api/clients/change-password`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error('Change password error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка смены пароля',
    };
  }
}

/**
 * Получение списка счетов/инвойсов
 */
export async function getInvoices(): Promise<Invoice[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('clientToken')?.value;

    if (!token) {
      return [];
    }

    const response = await axios.get(`${API_URL}/api/clients/invoices`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Get invoices error:', error);
    return [];
  }
}

/**
 * Получение списка договоров
 */
export async function getContracts(): Promise<Contract[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('clientToken')?.value;

    if (!token) {
      return [];
    }

    const response = await axios.get(`${API_URL}/api/clients/contracts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Get contracts error:', error);
    return [];
  }
}

/**
 * Получение списка заявок/тикетов
 */
export async function getTickets(): Promise<Ticket[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('clientToken')?.value;

    if (!token) {
      return [];
    }

    const response = await axios.get(`${API_URL}/api/clients/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Get tickets error:', error);
    return [];
  }
}

/**
 * Создание новой заявки
 */
export async function createTicket(
  title: string,
  description: string,
  priority: 'low' | 'medium' | 'high'
): Promise<{ success: boolean; error?: string; ticket?: Ticket }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('clientToken')?.value;

    if (!token) {
      return { success: false, error: 'Не авторизован' };
    }

    const response = await axios.post(
      `${API_URL}/api/clients/tickets`,
      { title, description, priority },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, ticket: response.data };
  } catch (error: any) {
    console.error('Create ticket error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка создания заявки',
    };
  }
}

/**
 * Получение статистики для dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('clientToken')?.value;

    if (!token) {
      return null;
    }

    const response = await axios.get(`${API_URL}/api/clients/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return null;
  }
}
