import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';


// Предполагаем, что тип для decoded уже определён глобально
export const authMiddleware: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).send('Access denied. No token provided.');
    return; // Не возвращаем Response явно
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
    return; // Не возвращаем Response явно
  }
};