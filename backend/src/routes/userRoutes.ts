import express from 'express';
import { registerUser, loginUser, getUsers, updateUser, getCurrentUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser); // Новый маршрут
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'This is a protected route',
    user: req.user,
  });
});
router.get('/', authMiddleware, getUsers);
router.put('/:id', authMiddleware, updateUser);

export default router;