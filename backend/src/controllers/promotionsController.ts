import { RequestHandler } from "express";
import { prisma } from "./utils";

export const getPromotionBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const promotion = await prisma.promotions.findUnique({ where: { slug } });
    if (!promotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }
    res.status(200).json(promotion);
  } catch (error) {
    console.error("Error fetching promotion by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPromotions: RequestHandler = async (req, res) => {
  try {
    const take = parseInt(req.query.take as string) || undefined;
    const promotions = await prisma.promotions.findMany({
      orderBy: { createdAt: "desc" },
      take,
      where: { isPublished: true },
    });
    res.status(200).json(promotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPromotions: RequestHandler = async (req, res) => {
  try {
    // Поддержка пагинации
    const page = parseInt(req.query._start as string) || 0;
    const limit = parseInt(req.query._end as string) || 10;
    const skip = page;
    const take = limit - page;

    // Поддержка сортировки
    const sortField = (req.query._sort as string) || "createdAt";
    const sortOrder =
      (req.query._order as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    // Поддержка поиска
    const searchQuery = req.query.q as string;
    const isPublished = req.query.isPublished;
    const status = req.query.status;

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

    if (status !== undefined) {
      where.status = status === "true";
    }

    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    const [promotions, total] = await Promise.all([
      prisma.promotions.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.promotions.count({ where }),
    ]);

    // Устанавливаем заголовок для React Admin пагинации
    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    res.status(200).json(promotions);
  } catch (error) {
    console.error("Error fetching all promotions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPromotion: RequestHandler = async (req, res) => {
  const {
    title,
    shortDescription,
    content,
    startDate,
    endDate,
    isPublished,
    slug,
    metaTitle,
    metaDescription,
    status,
  } = req.body;
  try {
    const existingPromotion = await prisma.promotions.findUnique({
      where: { slug },
    });
    if (existingPromotion) {
      res.status(400).json({ message: "Slug already exists" });
      return;
    }
    const newPromotion = await prisma.promotions.create({
      data: {
        title,
        shortDescription,
        content,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isPublished: isPublished === "true" || isPublished === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        status: status === "true" || status === true,
      },
    });
    res.status(201).json(newPromotion);
  } catch (error) {
    console.error("Error creating promotion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePromotion: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const {
    title,
    shortDescription,
    content,
    startDate,
    endDate,
    isPublished,
    metaTitle,
    metaDescription,
    status,
  } = req.body;
  try {
    const existingPromotion = await prisma.promotions.findUnique({
      where: { slug },
    });
    if (!existingPromotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }
    const updatedPromotion = await prisma.promotions.update({
      where: { slug },
      data: {
        title,
        shortDescription,
        content,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isPublished: isPublished === "true" || isPublished === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        status: status === "true" || status === true,
      },
    });
    res.status(200).json(updatedPromotion);
  } catch (error) {
    console.error("Error updating promotion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPromotionById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    // Сначала пробуем найти по ID
    let promotion = await prisma.promotions.findUnique({
      where: { id: parseInt(id) },
    });

    // Если не найдено по ID, пробуем по slug
    if (!promotion) {
      promotion = await prisma.promotions.findUnique({
        where: { slug: id },
      });
    }

    if (!promotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }
    res.status(200).json(promotion);
  } catch (error) {
    console.error("Error fetching promotion by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePromotionById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    shortDescription,
    content,
    startDate,
    endDate,
    isPublished,
    status,
    slug,
    metaTitle,
    metaDescription,
  } = req.body;
  try {
    // Ищем акцию по ID
    const existingPromotion = await prisma.promotions.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPromotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }

    // Проверяем, не занят ли новый slug другой акцией
    if (slug && slug !== existingPromotion.slug) {
      const slugExists = await prisma.promotions.findUnique({
        where: { slug },
      });
      if (slugExists) {
        res.status(400).json({ message: "Slug already exists" });
        return;
      }
    }

    const updatedPromotion = await prisma.promotions.update({
      where: { id: parseInt(id) },
      data: {
        title,
        shortDescription,
        content,
        startDate: startDate
          ? new Date(startDate)
          : existingPromotion.startDate,
        endDate: endDate ? new Date(endDate) : existingPromotion.endDate,
        isPublished: isPublished === "true" || isPublished === true,
        status: status === "true" || status === true,
        slug: slug || existingPromotion.slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });
    res.status(200).json(updatedPromotion);
  } catch (error) {
    console.error("Error updating promotion by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePromotionById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const existingPromotion = await prisma.promotions.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingPromotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }
    await prisma.promotions.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (error) {
    console.error("Error deleting promotion by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
