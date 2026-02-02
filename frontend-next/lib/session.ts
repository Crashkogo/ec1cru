// lib/session.ts - Управление сессиями клиента
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import type { SessionData, ClientData } from '@/types/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Получение секретного ключа в формате, который понимает jose
function getSecretKey() {
  return new TextEncoder().encode(JWT_SECRET);
}

/**
 * Получает данные сессии из HTTP-only cookie
 * Используется в Server Components и Server Actions
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('clientToken')?.value;

    if (!token) {
      return null;
    }

    // Верифицируем и декодируем JWT токен
    const { payload } = await jwtVerify(token, getSecretKey());

    // Проверяем роль - должен быть CLIENT
    if (payload.role !== 'CLIENT') {
      return null;
    }

    // Извлекаем данные клиента из токена
    const clientData = payload.client as ClientData;

    return {
      token,
      role: 'CLIENT',
      client: clientData,
    };
  } catch (error) {
    // Токен истёк, невалиден или другая ошибка
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
