import { RequestHandler, Request } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

// Расширяем тип Request для добавления user
interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string };
}

export const authMiddleware: RequestHandler = (req: AuthenticatedRequest, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('AuthMiddleware: authHeader:', authHeader); // Отладка: заголовок авторизации

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('AuthMiddleware: No token provided');
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('AuthMiddleware: token:', token); // Отладка: извлечённый токен

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    console.log('AuthMiddleware: decoded:', decoded); // Отладка: декодированный токен
    req.user = decoded;
    next();
  } catch (error) {
    console.error('AuthMiddleware: Invalid token:', error); // Отладка: ошибка верификации
    res.status(401).json({ message: 'Invalid token.' });
    return;
  }
};