import { RequestHandler } from "express";
import { prisma } from "../utils";

// Функция для вычисления актуального статуса акции на основе даты
const calculatePromotionStatus = (endDate: Date): boolean => {
  const now = new Date();
  return now <= endDate; // true - активна, false - завершена
};

export const getPromotionBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const promotion = await prisma.promotions.findUnique({ where: { slug } });
    if (!promotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }

    // Вычисляем актуальный статус на основе даты окончания
    const actualStatus = calculatePromotionStatus(promotion.endDate);

    res.status(200).json({ ...promotion, status: actualStatus });
  } catch (error) {
    console.error("Error fetching promotion by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPromotions: RequestHandler = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      take,
      search,
      status,
      dateFrom,
      dateTo,
    } = req.query;

    // Если передан take, используем старую логику для совместимости
    if (take) {
      const allPromotions = await prisma.promotions.findMany({
        take: parseInt(take as string) * 2,
        where: { isPublished: true },
      });

      const now = new Date();
      const pinnedPromotions = allPromotions.filter(
        (item) => item.isPinned && item.pinnedUntil && new Date(item.pinnedUntil) >= now
      );
      const regularPromotions = allPromotions.filter(
        (item) => !item.isPinned || !item.pinnedUntil || new Date(item.pinnedUntil) < now
      );

      pinnedPromotions.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      regularPromotions.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

      const sortedPromotions = [...pinnedPromotions, ...regularPromotions].slice(0, parseInt(take as string));

      // Вычисляем актуальный статус для каждой акции
      const promotionsWithActualStatus = sortedPromotions.map((promotion) => ({
        ...promotion,
        status: calculatePromotionStatus(promotion.endDate),
      }));

      res.status(200).json(promotionsWithActualStatus);
      return;
    }

    // Новая логика с пагинацией и фильтрами
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const takeNum = parseInt(limit as string);

    const where: any = { isPublished: true };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        {
          shortDescription: { contains: search as string, mode: "insensitive" },
        },
      ];
    }

    if (status === 'true') {
      where.endDate = { gte: new Date() };
    } else if (status === 'false') {
      where.endDate = { lt: new Date() };
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        const endDate = new Date(dateTo as string);
        endDate.setHours(23, 59, 59, 999); // Включаем весь день
        where.createdAt.lte = endDate;
      }
    }

    const allPromotions = await prisma.promotions.findMany({
      where,
    });

    const now = new Date();
    const pinnedPromotions = allPromotions.filter(
      (item) => item.isPinned && item.pinnedUntil && new Date(item.pinnedUntil) >= now
    );
    const regularPromotions = allPromotions.filter(
      (item) => !item.isPinned || !item.pinnedUntil || new Date(item.pinnedUntil) < now
    );

    pinnedPromotions.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    regularPromotions.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    const sortedPromotions = [...pinnedPromotions, ...regularPromotions];
    const paginatedPromotions = sortedPromotions.slice(skip, skip + takeNum);

    // Вычисляем актуальный статус для каждой акции
    const promotionsWithActualStatus = paginatedPromotions.map((promotion) => ({
      ...promotion,
      status: calculatePromotionStatus(promotion.endDate),
    }));

    res.status(200).json(promotionsWithActualStatus);
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

    // Для админки вычисляем актуальный статус и добавляем как отдельное поле
    const promotionsWithCalculatedStatus = promotions.map((promotion) => ({
      ...promotion,
      calculatedStatus: calculatePromotionStatus(promotion.endDate),
    }));

    // Устанавливаем заголовок для React Admin пагинации
    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    res.status(200).json(promotionsWithCalculatedStatus);
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
    isPinned,
    pinnedUntil,
  } = req.body;
  try {
    const existingPromotion = await prisma.promotions.findUnique({
      where: { slug },
    });
    if (existingPromotion) {
      res.status(400).json({ message: "Slug already exists" });
      return;
    }

    let processedPinnedUntil = null;
    if (pinnedUntil) {
      const date = new Date(pinnedUntil);
      date.setHours(23, 59, 59, 999);
      processedPinnedUntil = date;
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
        isPinned: isPinned === "true" || isPinned === true || false,
        pinnedUntil: processedPinnedUntil,
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
    isPinned,
    pinnedUntil,
  } = req.body;
  try {
    const existingPromotion = await prisma.promotions.findUnique({
      where: { slug },
    });
    if (!existingPromotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }

    let processedPinnedUntil = null;
    if (pinnedUntil) {
      const date = new Date(pinnedUntil);
      date.setHours(23, 59, 59, 999);
      processedPinnedUntil = date;
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
        isPinned: isPinned === "true" || isPinned === true || false,
        pinnedUntil: processedPinnedUntil,
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

    // Для админки добавляем вычисленный статус
    const promotionWithCalculatedStatus = {
      ...promotion,
      calculatedStatus: calculatePromotionStatus(promotion.endDate),
    };

    res.status(200).json(promotionWithCalculatedStatus);
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
    isPinned,
    pinnedUntil,
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

    let processedPinnedUntil = pinnedUntil !== undefined ? null : existingPromotion.pinnedUntil;
    if (pinnedUntil) {
      const date = new Date(pinnedUntil);
      date.setHours(23, 59, 59, 999);
      processedPinnedUntil = date;
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
        isPinned: isPinned !== undefined ? (isPinned === "true" || isPinned === true) : existingPromotion.isPinned,
        pinnedUntil: processedPinnedUntil,
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
