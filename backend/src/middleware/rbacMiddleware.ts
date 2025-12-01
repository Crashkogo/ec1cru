import { RequestHandler, Request } from 'express';

// ========== RBAC MIDDLEWARE: Проверка ролей пользователей ==========
// Этот middleware предоставляет гибкую систему контроля доступа на основе ролей

// Расширяем тип Request для добавления user
interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string };
}

/**
 * Создаёт middleware для проверки роли пользователя
 * @param allowedRoles - массив разрешённых ролей или одна роль
 * @returns Express middleware
 *
 * @example
 * // Разрешить доступ только админам
 * router.post('/users', requireRole('ADMIN'), createUser);
 *
 * @example
 * // Разрешить доступ админам и модераторам
 * router.put('/posts/:id', requireRole(['ADMIN', 'MODERATOR']), updatePost);
 */
export const requireRole = (allowedRoles: string | string[]): RequestHandler => {
  return (req: AuthenticatedRequest, res, next) => {
    // Проверяем наличие данных пользователя (должен быть установлен authMiddleware)
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: Authentication required' });
      return;
    }

    // Нормализуем allowedRoles к массиву
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Проверяем, есть ли роль пользователя в списке разрешённых
    if (!rolesArray.includes(req.user.role)) {
      res.status(403).json({
        message: `Forbidden: This action requires one of the following roles: ${rolesArray.join(', ')}`,
        userRole: req.user.role
      });
      return;
    }

    // Роль подходит - продолжаем
    next();
  };
};

/**
 * Middleware для проверки, что пользователь - администратор
 * Это сокращённая версия requireRole('ADMIN')
 */
export const requireAdmin: RequestHandler = requireRole('ADMIN');

/**
 * Middleware для проверки, что пользователь - админ или модератор
 */
export const requireAdminOrModerator: RequestHandler = requireRole(['ADMIN', 'MODERATOR']);
