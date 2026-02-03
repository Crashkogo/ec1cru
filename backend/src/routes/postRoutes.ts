import express from "express";
import * as newsController from "../controllers/newsController.js";
import * as companyLifeController from "../controllers/companyLifeController.js";
import * as eventsController from "../controllers/eventsController.js";
import * as promotionsController from "../controllers/promotionsController.js";
import * as readySolutionsController from "../controllers/readySolutionsController.js";
import * as testimonialController from "../controllers/testimonialController.js";
import * as uploadController from "../controllers/uploadController.js";
import * as newsletterController from "../controllers/newsletterController.js";
import * as subscribersController from "../controllers/subscribersController.js";
import * as callbackController from '../controllers/callbackController.js';
import { RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/rbacMiddleware.js";

const router = express.Router();

// Маршрут для заказа обратного звонка
router.post("/callback", callbackController.sendCallback as RequestHandler)

// ========== БЕЗОПАСНОСТЬ: Загрузка файлов доступна только администраторам ==========
// Маршруты для картинок в постах
router.post("/upload-image", authMiddleware, requireAdmin, uploadController.uploadImage as RequestHandler);
router.post("/move-images", authMiddleware, requireAdmin, uploadController.moveImagesAfterCreate);
router.post(
  "/upload-gallery-image",
  authMiddleware,
  requireAdmin,
  uploadController.uploadGalleryImage as RequestHandler
);
router.post(
  "/move-gallery-images",
  authMiddleware,
  requireAdmin,
  uploadController.moveGalleryImagesAfterCreate
);

// =============================================================================
// НОВОСТИ
// =============================================================================
// Публичные маршруты
router.get("/news", newsController.getNews as RequestHandler);
router.get("/news/:slug", newsController.getNewsBySlug as RequestHandler);

// БЕЗОПАСНОСТЬ: Админские маршруты доступны только администраторам
router.get(
  "/admin/news",
  authMiddleware,
  requireAdmin,
  newsController.getAllNews as RequestHandler
);
router.get(
  "/news/all",
  authMiddleware,
  requireAdmin,
  newsController.getAllNews as RequestHandler
);
router.get(
  "/admin/news/:id",
  authMiddleware,
  requireAdmin,
  newsController.getNewsById as RequestHandler
);
router.post(
  "/news",
  authMiddleware,
  requireAdmin,
  newsController.createNews as RequestHandler
);
router.put(
  "/news/:slug",
  authMiddleware,
  requireAdmin,
  newsController.updateNews as RequestHandler
);
router.put(
  "/news/id/:id",
  authMiddleware,
  requireAdmin,
  newsController.updateNewsById as RequestHandler
);
router.patch(
  "/admin/news/:id",
  authMiddleware,
  requireAdmin,
  newsController.updateNewsById as RequestHandler
);
router.delete(
  "/news/id/:id",
  authMiddleware,
  requireAdmin,
  newsController.deleteNewsById as RequestHandler
);
router.delete(
  "/admin/news/:id",
  authMiddleware,
  requireAdmin,
  newsController.deleteNewsById as RequestHandler
);

// =============================================================================
// ЖИЗНЬ КОМПАНИИ
// =============================================================================
// Публичные маршруты
router.get("/company-life", companyLifeController.getCompanyLife as RequestHandler);
router.get("/company-life/:slug", companyLifeController.getCompanyLifeBySlug as RequestHandler);

// БЕЗОПАСНОСТЬ: Админские маршруты доступны только администраторам
router.get(
  "/admin/company-life",
  authMiddleware,
  requireAdmin,
  companyLifeController.getAllCompanyLife as RequestHandler
);
router.get(
  "/company-life/all",
  authMiddleware,
  requireAdmin,
  companyLifeController.getAllCompanyLife as RequestHandler
);
router.get(
  "/admin/company-life/:id",
  authMiddleware,
  requireAdmin,
  companyLifeController.getCompanyLifeById as RequestHandler
);
router.post(
  "/company-life",
  authMiddleware,
  requireAdmin,
  companyLifeController.createCompanyLife as RequestHandler
);
router.put(
  "/company-life/:slug",
  authMiddleware,
  requireAdmin,
  companyLifeController.updateCompanyLife as RequestHandler
);
router.put(
  "/company-life/id/:id",
  authMiddleware,
  requireAdmin,
  companyLifeController.updateCompanyLifeById as RequestHandler
);
router.patch(
  "/admin/company-life/:id",
  authMiddleware,
  requireAdmin,
  companyLifeController.updateCompanyLifeById as RequestHandler
);
router.delete(
  "/company-life/id/:id",
  authMiddleware,
  requireAdmin,
  companyLifeController.deleteCompanyLifeById as RequestHandler
);
router.delete(
  "/admin/company-life/:id",
  authMiddleware,
  requireAdmin,
  companyLifeController.deleteCompanyLifeById as RequestHandler
);

// =============================================================================
// МЕРОПРИЯТИЯ
// =============================================================================
// Публичные маршруты
router.get("/events", eventsController.getEvents as RequestHandler);
router.get("/events/recent", eventsController.getRecentEvents as RequestHandler);
router.get("/events/:slug", eventsController.getEventBySlug as RequestHandler);
router.post(
  "/events/:slug/register",
  eventsController.registerForEvent as RequestHandler
);

// БЕЗОПАСНОСТЬ: Админские маршруты доступны только администраторам
router.get(
  "/admin/events",
  authMiddleware,
  requireAdmin,
  eventsController.getAllEvents as RequestHandler
);
router.get(
  "/events/all",
  authMiddleware,
  requireAdmin,
  eventsController.getAllEvents as RequestHandler
);
// ВАЖНО: этот роут должен быть ПЕРЕД /admin/events/:id
router.get(
  "/admin/events/registrations",
  authMiddleware,
  requireAdmin,
  eventsController.getEventRegistrationsByEventId as RequestHandler
);
router.get(
  "/admin/events/:id",
  authMiddleware,
  requireAdmin,
  eventsController.getEventById as RequestHandler
);
router.get(
  "/events/:slug/registrations",
  authMiddleware,
  requireAdmin,
  eventsController.getEventRegistrations as RequestHandler
);
router.post(
  "/events",
  authMiddleware,
  requireAdmin,
  eventsController.createEvent as RequestHandler
);
router.put(
  "/events/id/:id",
  authMiddleware,
  requireAdmin,
  eventsController.updateEventById as RequestHandler
);
router.patch(
  "/admin/events/:id",
  authMiddleware,
  requireAdmin,
  eventsController.updateEventById as RequestHandler
);
router.delete(
  "/events/id/:id",
  authMiddleware,
  requireAdmin,
  eventsController.deleteEventById as RequestHandler
);
router.delete(
  "/admin/events/:id",
  authMiddleware,
  requireAdmin,
  eventsController.deleteEventById as RequestHandler
);

// =============================================================================
// АКЦИИ
// =============================================================================
// Публичные маршруты
router.get("/promotions", promotionsController.getPromotions as RequestHandler);
router.get(
  "/promotions/:slug",
  promotionsController.getPromotionBySlug as RequestHandler
);

// БЕЗОПАСНОСТЬ: Админские маршруты доступны только администраторам
router.get(
  "/admin/promotions",
  authMiddleware,
  requireAdmin,
  promotionsController.getAllPromotions as RequestHandler
);
router.get(
  "/promotions/all",
  authMiddleware,
  requireAdmin,
  promotionsController.getAllPromotions as RequestHandler
);
router.get(
  "/admin/promotions/:id",
  authMiddleware,
  requireAdmin,
  promotionsController.getPromotionById as RequestHandler
);
router.post(
  "/promotions",
  authMiddleware,
  requireAdmin,
  promotionsController.createPromotion as RequestHandler
);
router.put(
  "/promotions/id/:id",
  authMiddleware,
  requireAdmin,
  promotionsController.updatePromotionById as RequestHandler
);
router.patch(
  "/admin/promotions/:id",
  authMiddleware,
  requireAdmin,
  promotionsController.updatePromotionById as RequestHandler
);
router.delete(
  "/promotions/id/:id",
  authMiddleware,
  requireAdmin,
  promotionsController.deletePromotionById as RequestHandler
);
router.delete(
  "/admin/promotions/:id",
  authMiddleware,
  requireAdmin,
  promotionsController.deletePromotionById as RequestHandler
);

// =============================================================================
// ГОТОВЫЕ РЕШЕНИЯ
// =============================================================================
// Публичные маршруты
router.get(
  "/ready-solutions",
  readySolutionsController.getReadySolutions as RequestHandler
);
router.get(
  "/ready-solutions/:id",
  readySolutionsController.getReadySolutionById as RequestHandler
);

// БЕЗОПАСНОСТЬ: Админские маршруты доступны только администраторам
router.get(
  "/admin/ready-solutions",
  authMiddleware,
  requireAdmin,
  readySolutionsController.getAllReadySolutions as RequestHandler
);
router.get(
  "/ready-solutions/all",
  authMiddleware,
  requireAdmin,
  readySolutionsController.getAllReadySolutions as RequestHandler
);
router.get(
  "/admin/ready-solutions/:id",
  authMiddleware,
  requireAdmin,
  readySolutionsController.getReadySolutionById as RequestHandler
);
router.post(
  "/ready-solutions",
  authMiddleware,
  requireAdmin,
  readySolutionsController.createReadySolution as RequestHandler
);
router.post(
  "/admin/ready-solutions",
  authMiddleware,
  requireAdmin,
  readySolutionsController.createReadySolution as RequestHandler
);
router.put(
  "/ready-solutions/:id",
  authMiddleware,
  requireAdmin,
  readySolutionsController.updateReadySolution as RequestHandler
);
router.patch(
  "/admin/ready-solutions/:id",
  authMiddleware,
  requireAdmin,
  readySolutionsController.updateReadySolutionById as RequestHandler
);
router.delete(
  "/ready-solutions/:id",
  authMiddleware,
  requireAdmin,
  readySolutionsController.deleteReadySolution as RequestHandler
);
router.delete(
  "/admin/ready-solutions/:id",
  authMiddleware,
  requireAdmin,
  readySolutionsController.deleteReadySolutionById as RequestHandler
);

// =============================================================================
// ПРОГРАММЫ
// =============================================================================
// Публичный эндпоинт для получения списка программ (без авторизации)
router.get("/programs", readySolutionsController.getPrograms as RequestHandler);

// БЕЗОПАСНОСТЬ: Админские эндпоинты для программ (с авторизацией)
router.get(
  "/admin/programs",
  authMiddleware,
  requireAdmin,
  readySolutionsController.getPrograms as RequestHandler
);
router.get(
  "/admin/programs/:id",
  authMiddleware,
  requireAdmin,
  readySolutionsController.getProgramById as RequestHandler
);
router.post(
  "/admin/programs",
  authMiddleware,
  requireAdmin,
  readySolutionsController.createProgram as RequestHandler
);
router.patch(
  "/admin/programs/:id",
  authMiddleware,
  requireAdmin,
  readySolutionsController.updateProgramById as RequestHandler
);
router.delete(
  "/admin/programs/:id",
  authMiddleware,
  requireAdmin,
  readySolutionsController.deleteProgramById as RequestHandler
);

// =============================================================================
// ШАБЛОНЫ РАССЫЛОК
// =============================================================================
// БЕЗОПАСНОСТЬ: Все маршруты рассылок доступны только администраторам
router.get(
  "/newsletters",
  authMiddleware,
  requireAdmin,
  newsletterController.getNewsletters as RequestHandler
);
router.get(
  "/admin/newsletters",
  authMiddleware,
  requireAdmin,
  newsletterController.getNewsletters as RequestHandler
);
router.get(
  "/newsletters/all",
  authMiddleware,
  requireAdmin,
  newsletterController.getAllNewsletters as RequestHandler
);

// ВАЖНО: Специфичные роуты campaigns ДОЛЖНЫ быть ПЕРЕД роутом /newsletters/:id
// =============================================================================
// УПРАВЛЕНИЕ РАССЫЛКАМИ (campaigns)
// =============================================================================
router.get(
  "/newsletters/campaigns",
  authMiddleware,
  requireAdmin,
  newsletterController.getCampaigns as RequestHandler
);
router.post(
  "/newsletters/send",
  authMiddleware,
  requireAdmin,
  newsletterController.sendNewsletter as RequestHandler
);
router.get(
  "/newsletters/queue/status",
  authMiddleware,
  requireAdmin,
  newsletterController.getQueueStatus as RequestHandler
);
router.post(
  "/newsletters/process-scheduled",
  authMiddleware,
  requireAdmin,
  newsletterController.processScheduledNewsletters as RequestHandler
);
router.post(
  "/newsletters/campaigns/:id/retry",
  authMiddleware,
  requireAdmin,
  newsletterController.retryCampaign as RequestHandler
);
router.get(
  "/newsletters/:id/preview",
  authMiddleware,
  requireAdmin,
  newsletterController.previewNewsletter as RequestHandler
);

// Роуты с параметром :id должны быть ПОСЛЕ специфичных путей
router.get(
  "/newsletters/:id",
  authMiddleware,
  requireAdmin,
  newsletterController.getNewsletterById as RequestHandler
);
router.get(
  "/admin/newsletters/:id",
  authMiddleware,
  requireAdmin,
  newsletterController.getNewsletterById as RequestHandler
);
router.post(
  "/newsletters",
  authMiddleware,
  requireAdmin,
  newsletterController.createNewsletter as RequestHandler
);
router.put(
  "/newsletters/:id",
  authMiddleware,
  requireAdmin,
  newsletterController.updateNewsletterById as RequestHandler
);
router.patch(
  "/admin/newsletters/:id",
  authMiddleware,
  requireAdmin,
  newsletterController.updateNewsletterById as RequestHandler
);
router.delete(
  "/newsletters/:id",
  authMiddleware,
  requireAdmin,
  newsletterController.deleteNewsletterById as RequestHandler
);
router.delete(
  "/admin/newsletters/:id",
  authMiddleware,
  requireAdmin,
  newsletterController.deleteNewsletterById as RequestHandler
);

// =============================================================================
// ПОДПИСЧИКИ
// =============================================================================
// Публичные маршруты
router.post(
  "/subscribers",
  subscribersController.subscribeEmail as RequestHandler
);

// БЕЗОПАСНОСТЬ: DELETE /subscribers/:id удален - используйте GET /unsubscribe?token=... для публичной отписки
// Прямая отписка по ID доступна только администраторам через DELETE /subscribers/:id (см. ниже)

// БЕЗОПАСНОСТЬ: Админские маршруты доступны только администраторам
router.get(
  "/subscribers",
  authMiddleware,
  requireAdmin,
  subscribersController.getSubscribers as RequestHandler
);
router.get(
  "/admin/subscribers",
  authMiddleware,
  requireAdmin,
  subscribersController.getSubscribers as RequestHandler
);
router.get(
  "/admin/subscribers/:id",
  authMiddleware,
  requireAdmin,
  subscribersController.getSubscriberById as RequestHandler
);
router.patch(
  "/admin/subscribers/:id",
  authMiddleware,
  requireAdmin,
  subscribersController.updateSubscriber as RequestHandler
);
router.delete(
  "/admin/subscribers/:id",
  authMiddleware,
  requireAdmin,
  subscribersController.deleteSubscriber as RequestHandler
);

// Публичная отписка по токену
router.get(
  "/unsubscribe",
  newsletterController.unsubscribeByToken as RequestHandler
);

// =============================================================================
// ОТЗЫВЫ
// =============================================================================
// Публичные маршруты
router.get("/testimonials", testimonialController.getTestimonials as RequestHandler);
router.get("/testimonials/:slug", testimonialController.getTestimonialBySlug as RequestHandler);

// БЕЗОПАСНОСТЬ: Админские маршруты доступны только администраторам
router.get(
  "/admin/testimonials",
  authMiddleware,
  requireAdmin,
  testimonialController.getAllTestimonials as RequestHandler
);
router.get(
  "/admin/testimonials/:id",
  authMiddleware,
  requireAdmin,
  testimonialController.getTestimonialById as RequestHandler
);
router.post(
  "/testimonials",
  authMiddleware,
  requireAdmin,
  testimonialController.createTestimonial as RequestHandler
);
router.patch(
  "/admin/testimonials/:id",
  authMiddleware,
  requireAdmin,
  testimonialController.updateTestimonialById as RequestHandler
);
router.delete(
  "/admin/testimonials/:id",
  authMiddleware,
  requireAdmin,
  testimonialController.deleteTestimonialById as RequestHandler
);

export default router;
