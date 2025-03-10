import express, { RequestHandler } from 'express';
import { registerUser, loginUser, getUsers, updateUser } from '../controllers/userController'; // Добавили updateUser
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'This is a protected route',
    user: req.user,
  });
});
router.get('/', authMiddleware, getUsers);
router.put('/:id', authMiddleware, updateUser);

export default router;