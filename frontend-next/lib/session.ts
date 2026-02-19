// lib/session.ts - Управление сессиями клиента
import { cookies } from 'next/headers';
import type { SessionData, ClientData } from '@/types/client';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Получает данные сессии из HTTP-only cookie.
 * Верификация токена выполняется на бэкенде через /api/clients/me.
 * Используется в Server Components и Server Actions.
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('clientToken')?.value;

    if (!token) {
      return null;
    }

    // Проверяем токен и получаем данные клиента через бэкенд
    const response = await fetch(`${API_URL}/api/clients/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const clientData: ClientData = await response.json();

    return {
      token,
      role: 'CLIENT',
      client: clientData,
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

/**
 * Получает только данные клиента (без токена)
 */
export async function getClientData(): Promise<ClientData | null> {
  const session = await getSession();
  return session?.client || null;
}

/**
 * Проверяет, авторизован ли клиент
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Очищает сессию (используется при logout)
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('clientToken');
  cookieStore.delete('clientData'); // на случай если есть дополнительная cookie
}
