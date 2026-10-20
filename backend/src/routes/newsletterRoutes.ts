import express from 'express';
import { RequestHandler } from 'express';
import { subscribeNewsletter, confirmSubscription } from '../controllers/newsletterController.js';

const router = express.Router();

// Публичная подписка с double opt-in
router.post('/subscribe', subscribeNewsletter as RequestHandler);

// Подтверждение подписки по токену
router.get('/confirm', confirmSubscription as RequestHandler);

export default router;
