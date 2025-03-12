import express from 'express';
import { createNews, uploadImage, getNews, getAllNews, createPromotion, getPromotions, createEvent, getEvents, getNewsBySlug, updateNews  } from '../controllers/postController';
import { RequestHandler } from 'express';

const router = express.Router();

// Существующие маршруты для новостей
router.get('/news', getNews as RequestHandler);
router.get('/admin/news', getAllNews);
router.get('/news/:slug', getNewsBySlug as RequestHandler); // Новый маршрут для получения новости
router.post('/news', createNews as RequestHandler);
router.patch('/news/:slug', updateNews as RequestHandler); // Новый маршрут для обновления новости
router.post('/upload-image', uploadImage as RequestHandler);

// Существующие маршруты для акций (Promotions)
router.get('/promotions', getPromotions as RequestHandler);
router.post('/promotions', createPromotion as RequestHandler);

// Новые маршруты для мероприятий (Events)
router.get('/events', getEvents as RequestHandler);
router.post('/events', createEvent as RequestHandler);

// Маршрут для загрузки изображений
router.post('/upload-image', uploadImage as RequestHandler);

export default router;