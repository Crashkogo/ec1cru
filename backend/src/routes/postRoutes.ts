import express from 'express';
import { getAllEvents, getEventBySlug,  updateEvent , createNews, uploadImage, moveImagesAfterCreate, getNews, getAllNews, createPromotion, getPromotions, updatePromotion, getPromotionBySlug, getAllPromotions, createEvent, getEvents, getNewsBySlug, updateNews  } from '../controllers/postController';
import { RequestHandler } from 'express';

const router = express.Router();
//Маршруты для картинок в постах
router.post('/upload-image', uploadImage as RequestHandler);
router.post('/move-images', moveImagesAfterCreate); // Новый маршрут для перемещения
// Существующие маршруты для новостей
router.get('/news', getNews as RequestHandler);
router.get('/admin/news', getAllNews);
router.get('/news/:slug', getNewsBySlug as RequestHandler); // Новый маршрут для получения новости
router.post('/news', createNews as RequestHandler);
router.patch('/news/:slug', updateNews as RequestHandler); // Новый маршрут для обновления новости

// Существующие маршруты для акций (Promotions)
// Маршруты для акций
router.get('/promotions', getPromotions as RequestHandler); // Получение опубликованных и активных акций
router.get('/admin/promotions', getAllPromotions as RequestHandler); // Получение всех акций для админки
router.get('/promotions/:slug', getPromotionBySlug as RequestHandler); // Получение акции по slug
router.post('/promotions', createPromotion as RequestHandler); // Создание новой акции
router.patch('/promotions/:slug', updatePromotion as RequestHandler); // Обновление акции по slug
// Новые маршруты для мероприятий (Events)
// Маршруты для мероприятий
router.get('/events', getEvents as RequestHandler); // Получение опубликованных и предстоящих мероприятий
router.get('/admin/events', getAllEvents as RequestHandler); // Получение всех мероприятий для админки
router.get('/events/:slug', getEventBySlug as RequestHandler); // Получение мероприятия по slug
router.post('/events', createEvent as RequestHandler); // Создание нового мероприятия
router.patch('/events/:slug', updateEvent as RequestHandler); // Обновление мероприятия по slug

// Маршрут для загрузки изображений
router.post('/upload-image', uploadImage as RequestHandler);

export default router;