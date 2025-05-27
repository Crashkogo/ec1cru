import { RequestHandler, Request } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

// Расширяем тип Request для добавления user
interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string };
}

export const authMiddleware: RequestHandler = (req: AuthenticatedRequest, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).send('Access denied. No token provided.');
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
    return;
  }
};