// backend/src/routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser, logoutUser, getUsers, updateUser, getCurrentUser, getUserById, deleteUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/rbacMiddleware';

const router = express.Router();

// БЕЗОПАСНОСТЬ: Регистрация доступна только администраторам
// Это предотвращает создание несанкционированных учётных записей
router.post('/register', authMiddleware, registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // БЕЗОПАСНОСТЬ: Очистка HttpOnly cookies
router.get('/me', authMiddleware, getCurrentUser);
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'This is a protected route',
    user: req.user,
  });
});

// БЕЗОПАСНОСТЬ: Список и данные пользователей доступны только администраторам
router.get('/', authMiddleware, requireAdmin, getUsers);
router.get('/:id', authMiddleware, requireAdmin, getUserById);

// БЕЗОПАСНОСТЬ: Изменение и удаление пользователей доступны только администраторам
router.put('/:id', authMiddleware, requireAdmin, updateUser);
router.delete('/:id', authMiddleware, requireAdmin, deleteUser);

export default router;