import express, { RequestHandler } from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Определяем обработчик как RequestHandler
const protectedRouteHandler: RequestHandler = (req, res) => {
    res.status(200).json({
      message: 'This is a protected route',
      user: req.user, // Теперь req.user должен быть типизирован
    });
  };

router.get('/protected', authMiddleware, protectedRouteHandler);

export default router;