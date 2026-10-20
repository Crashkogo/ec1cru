import express from 'express';
import { getPublicSettings, getSettings, updateSettings, testEmail } from '../controllers/siteSettingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Публичный — нужен middleware/robots.ts на фронте
router.get('/public/site-settings', getPublicSettings);

// Админские
router.get('/admin/site-settings', authMiddleware, getSettings);
router.put('/admin/site-settings', authMiddleware, updateSettings);
router.post('/admin/site-settings/test-email', authMiddleware, testEmail);

export default router;
