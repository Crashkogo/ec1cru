import express from 'express';
import { createNews, uploadImage, getNews, createPromotion, getPromotions, createEvent, getEvents } from '../controllers/postController';
import { RequestHandler } from 'express';

const router = express.Router();

// Существующие маршруты для новостей
router.get('/news', getNews as RequestHandler);
router.post('/news', createNews as RequestHandler);

// Существующие маршруты для акций (Promotions)
router.get('/promotions', getPromotions as RequestHandler);
router.post('/promotions', createPromotion as RequestHandler);

// Новые маршруты для мероприятий (Events)
router.get('/events', getEvents as RequestHandler);
router.post('/events', createEvent as RequestHandler);

// Маршрут для загрузки изображений
router.post('/upload-image', uploadImage as RequestHandler);

export default router;