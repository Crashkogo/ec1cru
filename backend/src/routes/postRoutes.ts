// src/routes/postRoutes.ts
import express from 'express';
import { getAllEvents, getEventBySlug, updateEvent, createNews, uploadImage, moveImagesAfterCreate, getNews, getAllNews, createPromotion, getPromotions, 
    updatePromotion, getPromotionBySlug, getAllPromotions, createEvent, getEvents, getNewsBySlug, updateNews, registerForEvent,
    getEventRegistrations, sendEventReminder, getPrograms, createProgram, getAllReadySolutions, createReadySolution, updateReadySolution } from '../controllers/postController';
import { RequestHandler } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Маршруты для картинок в постах
router.post('/upload-image', uploadImage as RequestHandler);
router.post('/move-images', moveImagesAfterCreate);

// Существующие маршруты для новостей
router.get('/news', getNews as RequestHandler);
router.get('/admin/news', authMiddleware, getAllNews);
router.get('/news/:slug', getNewsBySlug as RequestHandler);
router.post('/news', authMiddleware, createNews as RequestHandler);
router.patch('/news/:slug', authMiddleware, updateNews as RequestHandler);

// Маршруты для акций
router.get('/promotions', getPromotions as RequestHandler);
router.get('/admin/promotions', authMiddleware, getAllPromotions as RequestHandler);
router.get('/promotions/:slug', getPromotionBySlug as RequestHandler);
router.post('/promotions', authMiddleware, createPromotion as RequestHandler);
router.patch('/promotions/:slug', authMiddleware, updatePromotion as RequestHandler);

// Маршруты для мероприятий
router.get('/events', getEvents as RequestHandler);
router.get('/admin/events', authMiddleware, getAllEvents as RequestHandler);
router.get('/events/:slug', getEventBySlug as RequestHandler);
router.post('/events', authMiddleware, createEvent as RequestHandler);
router.patch('/events/:slug', authMiddleware, updateEvent as RequestHandler);

// Регистрация на мероприятие
router.post('/events/:slug/register', registerForEvent as RequestHandler);

// Админка: участники и напоминания
router.get('/admin/events/:slug/registrations', authMiddleware, getEventRegistrations as RequestHandler);
router.post('/admin/events/:eventId/remind', authMiddleware, sendEventReminder as RequestHandler);

// Новые маршруты для программ
router.get('/admin/programs', authMiddleware, getPrograms as RequestHandler); // Список всех программ
router.post('/admin/programs', authMiddleware, createProgram as RequestHandler); // Создание программы
// Новые маршруты для ReadySolution
router.get('/admin/ready-solutions', authMiddleware, getAllReadySolutions as RequestHandler); // Список всех решений
router.post('/admin/ready-solutions', authMiddleware, createReadySolution as RequestHandler); // Создание решения
router.patch('/admin/ready-solutions/:slug', authMiddleware, updateReadySolution as RequestHandler); // Редактирование решения

export default router;