import express from 'express';
import * as tariffPlansController from '../controllers/tariffPlansController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Публичный endpoint
router.get('/tariff-plans', tariffPlansController.getPublishedTariffPlans);

// Админские endpoints (требуют аутентификации)
router.get('/admin/tariff-plans', authMiddleware, tariffPlansController.getAllTariffPlans);
router.get('/admin/tariff-plans/:id', authMiddleware, tariffPlansController.getTariffPlan);
router.post('/admin/tariff-plans', authMiddleware, tariffPlansController.createTariffPlan);
router.put('/admin/tariff-plans/:id', authMiddleware, tariffPlansController.updateTariffPlan);
router.delete('/admin/tariff-plans/:id', authMiddleware, tariffPlansController.deleteTariffPlan);

export default router;
