import express from "express";
import * as newsController from "../controllers/newsController";
import * as eventsController from "../controllers/eventsController";
import * as promotionsController from "../controllers/promotionsController";
import * as readySolutionsController from "../controllers/readySolutionsController";
import * as uploadController from "../controllers/uploadController";
import { RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Маршруты для картинок в постах
router.post("/upload-image", uploadController.uploadImage as RequestHandler);
router.post("/move-images", uploadController.moveImagesAfterCreate);

// Существующие маршруты для новостей
router.get("/news", newsController.getNews as RequestHandler);
router.get("/admin/news", authMiddleware, newsController.getAllNews);
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
router.patch(
  "/admin/news/:id",
  authMiddleware,
  newsController.updateNewsById as RequestHandler
);
router.delete(
  "/admin/news/:id",
  authMiddleware,
  newsController.deleteNewsById as RequestHandler
);
// Публичные маршруты работают со slug
router.get("/news/:slug", newsController.getNewsBySlug as RequestHandler);
router.patch(
  "/news/:slug",
  authMiddleware,
  newsController.updateNews as RequestHandler
);
router.delete(
  "/news/:slug",
  authMiddleware,
  newsController.deleteNews as RequestHandler
);

// Маршруты для акций
router.get("/promotions", promotionsController.getPromotions as RequestHandler);
router.get(
  "/admin/promotions",
  authMiddleware,
  promotionsController.getAllPromotions as RequestHandler
);
router.get(
  "/admin/promotions/:id",
  authMiddleware,
  promotionsController.getPromotionById as RequestHandler
);
router.get(
  "/promotions/:slug",
  promotionsController.getPromotionBySlug as RequestHandler
);
router.post(
  "/promotions",
  authMiddleware,
  promotionsController.createPromotion as RequestHandler
);
router.patch(
  "/admin/promotions/:id",
  authMiddleware,
  promotionsController.updatePromotionById as RequestHandler
);
router.delete(
  "/admin/promotions/:id",
  authMiddleware,
  promotionsController.deletePromotionById as RequestHandler
);
// Публичные маршруты работают со slug
router.patch(
  "/promotions/:slug",
  authMiddleware,
  promotionsController.updatePromotion as RequestHandler
);

// Маршруты для мероприятий
router.get("/events", eventsController.getEvents as RequestHandler);
router.get(
  "/admin/events",
  authMiddleware,
  eventsController.getAllEvents as RequestHandler
);
router.get(
  "/admin/events/:id",
  authMiddleware,
  eventsController.getEventById as RequestHandler
);
router.get("/events/:slug", eventsController.getEventBySlug as RequestHandler);
router.post(
  "/events",
  authMiddleware,
  eventsController.createEvent as RequestHandler
);
router.patch(
  "/admin/events/:id",
  authMiddleware,
  eventsController.updateEventById as RequestHandler
);
router.delete(
  "/admin/events/:id",
  authMiddleware,
  eventsController.deleteEventById as RequestHandler
);
// Публичные маршруты работают со slug
router.patch(
  "/events/:slug",
  authMiddleware,
  eventsController.updateEvent as RequestHandler
);

// Регистрация на мероприятие
router.post(
  "/events/:slug/register",
  eventsController.registerForEvent as RequestHandler
);

// Админка: участники и напоминания
router.get(
  "/admin/events/:slug/registrations",
  authMiddleware,
  eventsController.getEventRegistrations as RequestHandler
);
router.post(
  "/admin/events/:eventId/remind",
  authMiddleware,
  eventsController.sendEventReminder as RequestHandler
);

// Новые маршруты для программ
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
router.get("/programs", readySolutionsController.getPrograms as RequestHandler);

// Новые маршруты для ReadySolution
router.get(
  "/admin/ready-solutions",
  authMiddleware,
  readySolutionsController.getAllReadySolutions as RequestHandler
);
router.get(
  "/admin/ready-solutions/:id",
  authMiddleware,
  readySolutionsController.getReadySolutionById as RequestHandler
);
router.post(
  "/admin/ready-solutions",
  authMiddleware,
  readySolutionsController.createReadySolution as RequestHandler
);
router.patch(
  "/admin/ready-solutions/:id",
  authMiddleware,
  readySolutionsController.updateReadySolutionById as RequestHandler
);
router.delete(
  "/admin/ready-solutions/:id",
  authMiddleware,
  readySolutionsController.deleteReadySolutionById as RequestHandler
);
// Публичные маршруты работают со slug
router.get(
  "/ready-solutions",
  readySolutionsController.getReadySolutions as RequestHandler
);
router.get(
  "/ready-solutions/:slug",
  readySolutionsController.getReadySolutionBySlug as RequestHandler
);
router.patch(
  "/ready-solutions/:slug",
  authMiddleware,
  readySolutionsController.updateReadySolution as RequestHandler
);
router.delete(
  "/ready-solutions/:slug",
  authMiddleware,
  readySolutionsController.deleteReadySolution as RequestHandler
);

// Маршруты для галереи ReadySolution
router.post(
  "/upload-gallery-image",
  authMiddleware,
  uploadController.uploadGalleryImage as RequestHandler
);
router.post(
  "/move-gallery-images",
  authMiddleware,
  uploadController.moveGalleryImagesAfterCreate as RequestHandler
);

export default router;
