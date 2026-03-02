import express from 'express';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  loginClient,
  getCurrentClient,
  getClientProfile,
  logoutClientAction,
  changeClientPassword,
  getClientInvoices,
  getClientContracts,
  getClientTickets,
  createClientTicket,
  getClientDashboard,
  getClientEmployees,
  createClientEmployee,
  updateClientEmployee,
  deleteClientEmployee,
} from '../controllers/clientController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Публичный роут для логина клиентов
router.post('/login', loginClient);

// Личный кабинет — фиксированные маршруты ПЕРЕД /:id
router.get('/me',              authMiddleware, getCurrentClient);
router.get('/profile',         authMiddleware, getClientProfile);
router.post('/logout',         logoutClientAction);
router.post('/change-password', authMiddleware, changeClientPassword);
router.get('/invoices',        authMiddleware, getClientInvoices);
router.get('/contracts',       authMiddleware, getClientContracts);
router.get('/tickets',         authMiddleware, getClientTickets);
router.post('/tickets',        authMiddleware, createClientTicket);
router.get('/dashboard',       authMiddleware, getClientDashboard);

// Сотрудники клиента (для создания заявок)
router.get('/employees',        authMiddleware, getClientEmployees);
router.post('/employees',       authMiddleware, createClientEmployee);
router.put('/employees/:id',    authMiddleware, updateClientEmployee);
router.delete('/employees/:id', authMiddleware, deleteClientEmployee);

// Админские роуты для управления клиентами (требуют авторизации)
router.get('/',      authMiddleware, getClients);
router.get('/:id',   authMiddleware, getClientById);
router.post('/',     authMiddleware, createClient);
router.put('/:id',   authMiddleware, updateClient);
router.delete('/:id', authMiddleware, deleteClient);

export default router;
