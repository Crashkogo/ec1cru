import { RequestHandler, Request } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

// Расширяем тип Request для добавления user
interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string };
}

// ========== БЕЗОПАСНОСТЬ: Проверка JWT токенов ==========
// Middleware проверяет наличие и валидность JWT токена из HttpOnly cookie или заголовка Authorization
export const authMiddleware: RequestHandler = (req: AuthenticatedRequest, res, next) => {
  // БЕЗОПАСНОСТЬ: Приоритет - HttpOnly cookie (защита от XSS)
  // Fallback - Authorization header (для совместимости и API клиентов)
  let token = req.cookies?.authToken;

  // Если токена нет в cookie, проверяем заголовок Authorization (для обратной совместимости)
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    // БЕЗОПАСНОСТЬ: Не логируем детали токена или ошибки в production
    // В development можно раскомментировать для отладки:
    // console.error('Invalid token:', error);
    res.status(401).json({ message: 'Invalid token.' });
    return;
  }
};