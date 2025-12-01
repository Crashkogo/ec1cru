import express from 'express';
import * as itsTariffPlanController from '../controllers/itsTariffPlanController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Публичный endpoint для получения опубликованных ИТС тарифов
router.get('/its-tariff-plans', itsTariffPlanController.getPublishedItsTariffPlans);

// Админские endpoints (требуют аутентификации)
router.get('/admin/its-tariff-plans', authMiddleware, itsTariffPlanController.getAllItsTariffPlans);
router.get('/admin/its-tariff-plans/:id', authMiddleware, itsTariffPlanController.getItsTariffPlan);
router.post('/admin/its-tariff-plans', authMiddleware, itsTariffPlanController.createItsTariffPlan);
router.put('/admin/its-tariff-plans/:id', authMiddleware, itsTariffPlanController.updateItsTariffPlan);
router.delete('/admin/its-tariff-plans/:id', authMiddleware, itsTariffPlanController.deleteItsTariffPlan);

export default router;
