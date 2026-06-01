import { Router, RequestHandler } from "express";
import * as equipmentController from "../controllers/equipmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Публичные маршруты
router.get("/equipment", equipmentController.getEquipment as RequestHandler);
router.get("/equipment/:slug", equipmentController.getEquipmentBySlug as RequestHandler);

// Админские маршруты
router.get("/admin/equipment", authMiddleware, equipmentController.getAllEquipment as RequestHandler);
router.get("/admin/equipment/:id", authMiddleware, equipmentController.getEquipmentById as RequestHandler);
router.post("/equipment", authMiddleware, equipmentController.createEquipment as RequestHandler);
router.patch("/admin/equipment/:id", authMiddleware, equipmentController.updateEquipmentById as RequestHandler);
router.delete("/admin/equipment/:id", authMiddleware, equipmentController.deleteEquipmentById as RequestHandler);
router.post("/admin/equipment/:id/image", authMiddleware, equipmentController.uploadEquipmentImage as RequestHandler);

export default router;
