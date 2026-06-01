import { RequestHandler } from "express";
import { prisma } from "../utils/index.js";
import { sanitizeHTMLContent } from "../utils/sanitize.js";
import { UploadedFile } from "express-fileupload";
import { path, fs, __dirname } from "../utils/index.js";

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Публичный: получить все опубликованные
export const getEquipment: RequestHandler = async (req, res) => {
  try {
    const { page = "1", limit = "100", search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = { isPublished: true };
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { shortDescription: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const items = await prisma.equipment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Публичный: получить по slug
export const getEquipmentBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const item = await prisma.equipment.findUnique({ where: { slug } });
    if (!item) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching equipment by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Админский: получить все (пагинация React-Admin)
export const getAllEquipment: RequestHandler = async (req, res) => {
  try {
    const start = parseInt(req.query._start as string) || 0;
    const end = parseInt(req.query._end as string) || 10;
    const sortField = (req.query._sort as string) || "createdAt";
    const sortOrder =
      (req.query._order as string)?.toLowerCase() === "asc" ? "asc" : "desc";
    const searchQuery = req.query.q as string;
    const isPublished = req.query.isPublished;

    const where: any = {};
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { shortDescription: { contains: searchQuery, mode: "insensitive" } },
      ];
    }
    if (isPublished !== undefined) {
      where.isPublished = isPublished === "true";
    }

    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    const [items, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        orderBy,
        skip: start,
        take: end - start,
      }),
      prisma.equipment.count({ where }),
    ]);

    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching all equipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Админский: получить по ID
export const getEquipmentById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.equipment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!item) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching equipment by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Создать
export const createEquipment: RequestHandler = async (req, res) => {
  const {
    title,
    shortDescription,
    content,
    price,
    imageUrl,
    isPublished,
    slug,
    metaTitle,
    metaDescription,
  } = req.body;
  try {
    const existing = await prisma.equipment.findUnique({ where: { slug } });
    if (existing) {
      res.status(400).json({ message: "Slug already exists" });
      return;
    }
    const sanitizedContent = sanitizeHTMLContent(content || "");
    const newItem = await prisma.equipment.create({
      data: {
        title,
        shortDescription,
        content: sanitizedContent,
        price: price ? parseFloat(price) : null,
        imageUrl: imageUrl || null,
        isPublished: isPublished === "true" || isPublished === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Обновить по ID
export const updateEquipmentById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    shortDescription,
    content,
    price,
    imageUrl,
    isPublished,
    slug,
    metaTitle,
    metaDescription,
  } = req.body;
  try {
    const existing = await prisma.equipment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.equipment.findUnique({ where: { slug } });
      if (slugExists) {
        res.status(400).json({ message: "Slug already exists" });
        return;
      }
    }
    const sanitizedContent = sanitizeHTMLContent(content || "");
    const updated = await prisma.equipment.update({
      where: { id: parseInt(id) },
      data: {
        title,
        shortDescription,
        content: sanitizedContent,
        price: price !== undefined ? (price ? parseFloat(price) : null) : existing.price,
        imageUrl: imageUrl !== undefined ? imageUrl || null : existing.imageUrl,
        isPublished: isPublished === "true" || isPublished === true,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        slug: slug || existing.slug,
      },
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating equipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Удалить по ID
export const deleteEquipmentById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.equipment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }
    await prisma.equipment.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting equipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Загрузить изображение товара
export const uploadEquipmentImage: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.equipment.findUnique({ where: { id: parseInt(id) } });
    if (!item) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }

    if (!req.files?.image) {
      res.status(400).json({ message: "Файл не передан (поле: image)" });
      return;
    }
    const image = req.files.image as UploadedFile;

    if (!ALLOWED_MIME_TYPES.includes(image.mimetype)) {
      res.status(400).json({ message: "Недопустимый тип файла. Допустимы: JPG, PNG, WEBP" });
      return;
    }
    const ext = path.extname(image.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      res.status(400).json({ message: "Недопустимое расширение файла" });
      return;
    }

    const uploadDir = path.join(__dirname, "../../frontend/public/uploads/equipment", String(id));
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Удаляем старое изображение если есть
    if (item.imageUrl) {
      const oldFile = path.join(__dirname, "../../frontend/public", item.imageUrl);
      if (fs.existsSync(oldFile)) {
        try { fs.unlinkSync(oldFile); } catch { /* ignore */ }
      }
    }

    const fileName = "image" + ext;
    await image.mv(path.join(uploadDir, fileName));

    const imageUrl = `/uploads/equipment/${id}/${fileName}`;
    const updated = await prisma.equipment.update({
      where: { id: parseInt(id) },
      data: { imageUrl },
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error uploading equipment image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
