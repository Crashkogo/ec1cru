// backend/src/routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser, getUsers, updateUser, getCurrentUser, getUserById, deleteUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'This is a protected route',
    user: req.user,
  });
});
router.get('/', authMiddleware, getUsers);
router.put('/:id', authMiddleware, updateUser);
router.get('/:id', authMiddleware, getUserById); // Добавлен authMiddleware
router.delete('/:id', authMiddleware, deleteUser); // Добавлен authMiddleware

export default router;