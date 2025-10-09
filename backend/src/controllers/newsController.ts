import { RequestHandler } from "express";
import { prisma } from "../utils";

export const getNewsBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const news = await prisma.news.findUnique({ where: { slug } });
    if (!news) {
      res.status(404).json({ message: "News not found" });
      return;
    }
    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNewsById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    // Сначала пробуем найти по ID
    let news = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });

    // Если не найдено по ID, пробуем по slug
    if (!news) {
      news = await prisma.news.findUnique({ where: { slug: id } });
    }

    if (!news) {
      res.status(404).json({ message: "News not found" });
      return;
    }
    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNews: RequestHandler = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      take,
      search,
      dateFrom,
      dateTo,
    } = req.query;

    // Если передан take, используем старую логику для совместимости
    if (take) {
      const news = await prisma.news.findMany({
        orderBy: { createdAt: "desc" },
        take: parseInt(take as string),
        where: { isPublished: true },
      });
      res.status(200).json(news);
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

    const news = await prisma.news.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: takeNum,
    });

    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllNews: RequestHandler = async (req, res) => {
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

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.news.count({ where }),
    ]);

    // Устанавливаем заголовок для React Admin пагинации
    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching all news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createNews: RequestHandler = async (req, res) => {
  const {
    title,
    shortDescription,
    content,
    isPublished,
    slug,
    metaTitle,
    metaDescription,
  } = req.body;
  try {
    const existingNews = await prisma.news.findUnique({ where: { slug } });
    if (existingNews) {
      res.status(400).json({ message: "Slug already exists" });
      return;
    }
    const newNews = await prisma.news.create({
      data: {
        title,
        shortDescription,
        content,
        isPublished: isPublished === "true" || isPublished === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });
    res.status(201).json(newNews);
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNews: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const {
    title,
    shortDescription,
    content,
    isPublished,
    metaTitle,
    metaDescription,
  } = req.body;
  try {
    const existingNews = await prisma.news.findUnique({ where: { slug } });
    if (!existingNews) {
      res.status(404).json({ message: "News not found" });
      return;
    }
    const updatedNews = await prisma.news.update({
      where: { slug },
      data: {
        title,
        shortDescription,
        content,
        isPublished: isPublished === "true" || isPublished === true,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });
    res.status(200).json(updatedNews);
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNewsById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    shortDescription,
    content,
    isPublished,
    metaTitle,
    metaDescription,
    slug,
  } = req.body;
  try {
    // Ищем новость по ID
    const existingNews = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingNews) {
      res.status(404).json({ message: "News not found" });
      return;
    }

    // Проверяем, не занят ли новый slug другой новостью
    if (slug && slug !== existingNews.slug) {
      const slugExists = await prisma.news.findUnique({ where: { slug } });
      if (slugExists) {
        res.status(400).json({ message: "Slug already exists" });
        return;
      }
    }

    const updatedNews = await prisma.news.update({
      where: { id: parseInt(id) },
      data: {
        title,
        shortDescription,
        content,
        isPublished: isPublished === "true" || isPublished === true,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        slug: slug || existingNews.slug,
      },
    });
    res.status(200).json(updatedNews);
  } catch (error) {
    console.error("Error updating news by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNewsById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const existingNews = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingNews) {
      res.status(404).json({ message: "News not found" });
      return;
    }
    await prisma.news.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNews: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const existingNews = await prisma.news.findUnique({ where: { slug } });
    if (!existingNews) {
      res.status(404).json({ message: "News not found" });
      return;
    }
    await prisma.news.delete({ where: { slug } });
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
