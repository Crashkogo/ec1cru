import express from "express";
import * as newsController from "../controllers/newsController";
import * as companyLifeController from "../controllers/companyLifeController";
import * as eventsController from "../controllers/eventsController";
import * as promotionsController from "../controllers/promotionsController";
import * as readySolutionsController from "../controllers/readySolutionsController";
import * as testimonialController from "../controllers/testimonialController";
import * as uploadController from "../controllers/uploadController";
import * as newsletterController from "../controllers/newsletterController";
import * as subscribersController from "../controllers/subscribersController";
import * as callbackController from '../controllers/callbackController';
import { RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Маршрут для заказа обратного звонка
router.post("/callback", callbackController.sendCallback as RequestHandler)


// Маршруты для картинок в постах
router.post("/upload-image", uploadController.uploadImage as RequestHandler);
router.post("/move-images", uploadController.moveImagesAfterCreate);
router.post(
  "/upload-gallery-image",
  uploadController.uploadGalleryImage as RequestHandler
);
router.post(
  "/move-gallery-images",
  uploadController.moveGalleryImagesAfterCreate
);

// =============================================================================
// НОВОСТИ
// =============================================================================
// Публичные маршруты
router.get("/news", newsController.getNews as RequestHandler);
router.get("/news/:slug", newsController.getNewsBySlug as RequestHandler);

// Админские маршруты
router.get(
  "/admin/news",
  authMiddleware,
  newsController.getAllNews as RequestHandler
);
router.get(
  "/news/all",
  authMiddleware,
  newsController.getAllNews as RequestHandler
);
router.get(
  "/admin/news/:id",
  authMiddleware,
  newsController.getNewsById as RequestHandler
);
router.post(
  "/news",
  authMiddleware,
  newsController.createNews as RequestHandler
);
router.put(
  "/news/:slug",
  authMiddleware,
  newsController.updateNews as RequestHandler
);
router.put(
  "/news/id/:id",
  authMiddleware,
  newsController.updateNewsById as RequestHandler
);
router.patch(
  "/admin/news/:id",
  authMiddleware,
  newsController.updateNewsById as RequestHandler
);
router.delete(
  "/news/id/:id",
  authMiddleware,
  newsController.deleteNewsById as RequestHandler
);
router.delete(
  "/admin/news/:id",
  authMiddleware,
  newsController.deleteNewsById as RequestHandler
);

// =============================================================================
// ЖИЗНЬ КОМПАНИИ
// =============================================================================
// Публичные маршруты
router.get("/company-life", companyLifeController.getCompanyLife as RequestHandler);
router.get("/company-life/:slug", companyLifeController.getCompanyLifeBySlug as RequestHandler);

// Админские маршруты
router.get(
  "/admin/company-life",
  authMiddleware,
  companyLifeController.getAllCompanyLife as RequestHandler
);
router.get(
  "/company-life/all",
  authMiddleware,
  companyLifeController.getAllCompanyLife as RequestHandler
);
router.get(
  "/admin/company-life/:id",
  authMiddleware,
  companyLifeController.getCompanyLifeById as RequestHandler
);
router.post(
  "/company-life",
  authMiddleware,
  companyLifeController.createCompanyLife as RequestHandler
);
router.put(
  "/company-life/:slug",
  authMiddleware,
  companyLifeController.updateCompanyLife as RequestHandler
);
router.put(
  "/company-life/id/:id",
  authMiddleware,
  companyLifeController.updateCompanyLifeById as RequestHandler
);
router.patch(
  "/admin/company-life/:id",
  authMiddleware,
  companyLifeController.updateCompanyLifeById as RequestHandler
);
router.delete(
  "/company-life/id/:id",
  authMiddleware,
  companyLifeController.deleteCompanyLifeById as RequestHandler
);
router.delete(
  "/admin/company-life/:id",
  authMiddleware,
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

// Админские маршруты
router.get(
  "/admin/events",
  authMiddleware,
  eventsController.getAllEvents as RequestHandler
);
router.get(
  "/events/all",
  authMiddleware,
  eventsController.getAllEvents as RequestHandler
);
// ВАЖНО: этот роут должен быть ПЕРЕД /admin/events/:id
router.get(
  "/admin/events/registrations",
  authMiddleware,
  eventsController.getEventRegistrationsByEventId as RequestHandler
);
router.get(
  "/admin/events/:id",
  authMiddleware,
  eventsController.getEventById as RequestHandler
);
router.get(
  "/events/:slug/registrations",
  authMiddleware,
  eventsController.getEventRegistrations as RequestHandler
);
router.post(
  "/events",
  authMiddleware,
  eventsController.createEvent as RequestHandler
);
router.put(
  "/events/id/:id",
  authMiddleware,
  eventsController.updateEventById as RequestHandler
);
router.patch(
  "/admin/events/:id",
  authMiddleware,
  eventsController.updateEventById as RequestHandler
);
router.delete(
  "/events/id/:id",
  authMiddleware,
  eventsController.deleteEventById as RequestHandler
);
router.delete(
  "/admin/events/:id",
  authMiddleware,
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

// Админские маршруты
router.get(
  "/admin/promotions",
  authMiddleware,
  promotionsController.getAllPromotions as RequestHandler
);
router.get(
  "/promotions/all",
  authMiddleware,
  promotionsController.getAllPromotions as RequestHandler
);
router.get(
  "/admin/promotions/:id",
  authMiddleware,
  promotionsController.getPromotionById as RequestHandler
);
router.post(
  "/promotions",
  authMiddleware,
  promotionsController.createPromotion as RequestHandler
);
router.put(
  "/promotions/id/:id",
  authMiddleware,
  promotionsController.updatePromotionById as RequestHandler
);
router.patch(
  "/admin/promotions/:id",
  authMiddleware,
  promotionsController.updatePromotionById as RequestHandler
);
router.delete(
  "/promotions/id/:id",
  authMiddleware,
  promotionsController.deletePromotionById as RequestHandler
);
router.delete(
  "/admin/promotions/:id",
  authMiddleware,
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

// Админские маршруты
router.get(
  "/admin/ready-solutions",
  authMiddleware,
  readySolutionsController.getAllReadySolutions as RequestHandler
);
router.get(
  "/ready-solutions/all",
  authMiddleware,
  readySolutionsController.getAllReadySolutions as RequestHandler
);
router.get(
  "/admin/ready-solutions/:id",
  authMiddleware,
  readySolutionsController.getReadySolutionById as RequestHandler
);
router.post(
  "/ready-solutions",
  authMiddleware,
  readySolutionsController.createReadySolution as RequestHandler
);
router.post(
  "/admin/ready-solutions",
  authMiddleware,
  readySolutionsController.createReadySolution as RequestHandler
);
router.put(
  "/ready-solutions/:id",
  authMiddleware,
  readySolutionsController.updateReadySolution as RequestHandler
);
router.patch(
  "/admin/ready-solutions/:id",
  authMiddleware,
  readySolutionsController.updateReadySolutionById as RequestHandler
);
router.delete(
  "/ready-solutions/:id",
  authMiddleware,
  readySolutionsController.deleteReadySolution as RequestHandler
);
router.delete(
  "/admin/ready-solutions/:id",
  authMiddleware,
  readySolutionsController.deleteReadySolutionById as RequestHandler
);

// =============================================================================
// ПРОГРАММЫ
// =============================================================================
// Публичный эндпоинт для получения списка программ (без авторизации)
router.get("/programs", readySolutionsController.getPrograms as RequestHandler);

// Админские эндпоинты для программ (с авторизацией)
router.get(
  "/admin/programs",
  authMiddleware,
  readySolutionsController.getPrograms as RequestHandler
);
router.get(
  "/admin/programs/:id",
  authMiddleware,
  readySolutionsController.getProgramById as RequestHandler
);
router.post(
  "/admin/programs",
  authMiddleware,
  readySolutionsController.createProgram as RequestHandler
);
router.patch(
  "/admin/programs/:id",
  authMiddleware,
  readySolutionsController.updateProgramById as RequestHandler
);
router.delete(
  "/admin/programs/:id",
  authMiddleware,
  readySolutionsController.deleteProgramById as RequestHandler
);

// =============================================================================
// ШАБЛОНЫ РАССЫЛОК
// =============================================================================
// Публичные маршруты
router.get(
  "/newsletters",
  newsletterController.getNewsletters as RequestHandler
);

// Админские маршруты
router.get(
  "/admin/newsletters",
  newsletterController.getNewsletters as RequestHandler
);
router.get(
  "/newsletters/all",
  authMiddleware,
  newsletterController.getAllNewsletters as RequestHandler
);

// ВАЖНО: Специфичные роуты campaigns ДОЛЖНЫ быть ПЕРЕД роутом /newsletters/:id
// =============================================================================
// УПРАВЛЕНИЕ РАССЫЛКАМИ (campaigns)
// =============================================================================
router.get(
  "/newsletters/campaigns",
  authMiddleware,
  newsletterController.getCampaigns as RequestHandler
);
router.post(
  "/newsletters/send",
  authMiddleware,
  newsletterController.sendNewsletter as RequestHandler
);
router.get(
  "/newsletters/queue/status",
  authMiddleware,
  newsletterController.getQueueStatus as RequestHandler
);
router.post(
  "/newsletters/process-scheduled",
  authMiddleware,
  newsletterController.processScheduledNewsletters as RequestHandler
);
router.post(
  "/newsletters/campaigns/:id/retry",
  authMiddleware,
  newsletterController.retryCampaign as RequestHandler
);
router.get(
  "/newsletters/:id/preview",
  authMiddleware,
  newsletterController.previewNewsletter as RequestHandler
);

// Роуты с параметром :id должны быть ПОСЛЕ специфичных путей
router.get(
  "/newsletters/:id",
  authMiddleware,
  newsletterController.getNewsletterById as RequestHandler
);
router.get(
  "/admin/newsletters/:id",
  authMiddleware,
  newsletterController.getNewsletterById as RequestHandler
);
router.post(
  "/newsletters",
  newsletterController.createNewsletter as RequestHandler
);
router.put(
  "/newsletters/:id",
  authMiddleware,
  newsletterController.updateNewsletterById as RequestHandler
);
router.patch(
  "/admin/newsletters/:id",
  authMiddleware,
  newsletterController.updateNewsletterById as RequestHandler
);
router.delete(
  "/newsletters/:id",
  authMiddleware,
  newsletterController.deleteNewsletterById as RequestHandler
);
router.delete(
  "/admin/newsletters/:id",
  authMiddleware,
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
router.delete(
  "/subscribers/:id",
  subscribersController.unsubscribeEmail as RequestHandler
);

// Админские маршруты
router.get(
  "/subscribers",
  authMiddleware,
  subscribersController.getSubscribers as RequestHandler
);
router.get(
  "/admin/subscribers",
  authMiddleware,
  subscribersController.getSubscribers as RequestHandler
);
router.get(
  "/admin/subscribers/:id",
  authMiddleware,
  subscribersController.getSubscriberById as RequestHandler
);
router.patch(
  "/admin/subscribers/:id",
  authMiddleware,
  subscribersController.updateSubscriber as RequestHandler
);
router.delete(
  "/admin/subscribers/:id",
  authMiddleware,
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

// Админские маршруты
router.get(
  "/admin/testimonials",
  authMiddleware,
  testimonialController.getAllTestimonials as RequestHandler
);
router.get(
  "/admin/testimonials/:id",
  authMiddleware,
  testimonialController.getTestimonialById as RequestHandler
);
router.post(
  "/testimonials",
  authMiddleware,
  testimonialController.createTestimonial as RequestHandler
);
router.patch(
  "/admin/testimonials/:id",
  authMiddleware,
  testimonialController.updateTestimonialById as RequestHandler
);
router.delete(
  "/admin/testimonials/:id",
  authMiddleware,
  testimonialController.deleteTestimonialById as RequestHandler
);

export default router;
