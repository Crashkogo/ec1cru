import express from 'express';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  loginClient,
  getCurrentClient,
} from '../controllers/clientController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Публичный роут для логина клиентов
router.post('/login', loginClient);

// Защищенный роут для получения текущего клиента (в ЛК)
router.get('/me', authMiddleware, getCurrentClient);

// Админские роуты для управления клиентами (требуют авторизации)
router.get('/', authMiddleware, getClients);
router.get('/:id', authMiddleware, getClientById);
router.post('/', authMiddleware, createClient);
router.put('/:id', authMiddleware, updateClient);
router.delete('/:id', authMiddleware, deleteClient);

export default router;
