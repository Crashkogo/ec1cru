import { Router, RequestHandler } from "express";
import * as coursesController from "../controllers/coursesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Публичные маршруты
router.get("/courses", coursesController.getCourses as RequestHandler);
router.get("/courses/:slug", coursesController.getCourseBySlug as RequestHandler);

// Админские маршруты (требуют аутентификацию)
router.get(
  "/admin/courses",
  authMiddleware,
  coursesController.getAllCourses as RequestHandler
);

router.get(
  "/admin/courses/:id",
  authMiddleware,
  coursesController.getCourseById as RequestHandler
);

router.post(
  "/courses",
  authMiddleware,
  coursesController.createCourse as RequestHandler
);

router.patch(
  "/admin/courses/:id",
  authMiddleware,
  coursesController.updateCourseById as RequestHandler
);

router.delete(
  "/admin/courses/:id",
  authMiddleware,
  coursesController.deleteCourseById as RequestHandler
);

export default router;
