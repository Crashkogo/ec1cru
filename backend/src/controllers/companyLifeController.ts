import { RequestHandler } from "express";
import { prisma } from "../utils/index.js";
import { sanitizeHTMLContent } from "../utils/sanitize.js";

export const getCompanyLifeBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const companyLife = await prisma.companyLife.findUnique({ where: { slug } });
    if (!companyLife) {
      res.status(404).json({ message: "Company life post not found" });
      return;
    }
    res.status(200).json(companyLife);
  } catch (error) {
    console.error("Error fetching company life post by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompanyLifeById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    // Сначала пробуем найти по ID
    let companyLife = await prisma.companyLife.findUnique({
      where: { id: parseInt(id) },
    });

    // Если не найдено по ID, пробуем по slug
    if (!companyLife) {
      companyLife = await prisma.companyLife.findUnique({ where: { slug: id } });
    }

    if (!companyLife) {
      res.status(404).json({ message: "Company life post not found" });
      return;
    }
    res.status(200).json(companyLife);
  } catch (error) {
    console.error("Error fetching company life post by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompanyLife: RequestHandler = async (req, res) => {
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
      const allCompanyLife = await prisma.companyLife.findMany({
        take: parseInt(take as string) * 2,
        where: { isPublished: true },
      });

      const now = new Date();
      const pinnedPosts = allCompanyLife.filter(
        (item) => item.isPinned && item.pinnedUntil && new Date(item.pinnedUntil) >= now
      );
      const regularPosts = allCompanyLife.filter(
        (item) => !item.isPinned || !item.pinnedUntil || new Date(item.pinnedUntil) < now
      );

      pinnedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      regularPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const sortedPosts = [...pinnedPosts, ...regularPosts].slice(0, parseInt(take as string));

      res.status(200).json(sortedPosts);
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

    const allCompanyLife = await prisma.companyLife.findMany({
      where,
    });

    const now = new Date();
    const pinnedPosts = allCompanyLife.filter(
      (item) => item.isPinned && item.pinnedUntil && new Date(item.pinnedUntil) >= now
    );
    const regularPosts = allCompanyLife.filter(
      (item) => !item.isPinned || !item.pinnedUntil || new Date(item.pinnedUntil) < now
    );

    pinnedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    regularPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const sortedPosts = [...pinnedPosts, ...regularPosts];
    const paginatedPosts = sortedPosts.slice(skip, skip + takeNum);

    res.status(200).json(paginatedPosts);
  } catch (error) {
    console.error("Error fetching company life posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCompanyLife: RequestHandler = async (req, res) => {
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

    const [companyLife, total] = await Promise.all([
      prisma.companyLife.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.companyLife.count({ where }),
    ]);

    // Устанавливаем заголовок для React Admin пагинации
    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    res.status(200).json(companyLife);
  } catch (error) {
    console.error("Error fetching all company life posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createCompanyLife: RequestHandler = async (req, res) => {
  const {
    title,
    shortDescription,
    content,
    isPublished,
    slug,
    metaTitle,
    metaDescription,
    isPinned,
    pinnedUntil,
  } = req.body;
  try {
    const existingCompanyLife = await prisma.companyLife.findUnique({ where: { slug } });
    if (existingCompanyLife) {
      res.status(400).json({ message: "Slug already exists" });
      return;
    }

    let processedPinnedUntil = null;
    if (pinnedUntil) {
      const date = new Date(pinnedUntil);
      date.setHours(23, 59, 59, 999);
      processedPinnedUntil = date;
    }

    // БЕЗОПАСНОСТЬ: Санитизация HTML контента для защиты от XSS
    const sanitizedContent = sanitizeHTMLContent(content);

    const newCompanyLife = await prisma.companyLife.create({
      data: {
        title,
        shortDescription,
        content: sanitizedContent,
        isPublished: isPublished === "true" || isPublished === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        isPinned: isPinned === "true" || isPinned === true || false,
        pinnedUntil: processedPinnedUntil,
      },
    });
    res.status(201).json(newCompanyLife);
  } catch (error) {
    console.error("Error creating company life post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCompanyLife: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const {
    title,
    shortDescription,
    content,
    isPublished,
    metaTitle,
    metaDescription,
    isPinned,
    pinnedUntil,
  } = req.body;
  try {
    const existingCompanyLife = await prisma.companyLife.findUnique({ where: { slug } });
    if (!existingCompanyLife) {
      res.status(404).json({ message: "Company life post not found" });
      return;
    }

    let processedPinnedUntil = null;
    if (pinnedUntil) {
      const date = new Date(pinnedUntil);
      date.setHours(23, 59, 59, 999);
      processedPinnedUntil = date;
    }

    // БЕЗОПАСНОСТЬ: Санитизация HTML контента для защиты от XSS
    const sanitizedContent = sanitizeHTMLContent(content);

    const updatedCompanyLife = await prisma.companyLife.update({
      where: { slug },
      data: {
        title,
        shortDescription,
        content: sanitizedContent,
        isPublished: isPublished === "true" || isPublished === true,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        isPinned: isPinned === "true" || isPinned === true || false,
        pinnedUntil: processedPinnedUntil,
      },
    });
    res.status(200).json(updatedCompanyLife);
  } catch (error) {
    console.error("Error updating company life post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCompanyLifeById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    shortDescription,
    content,
    isPublished,
    metaTitle,
    metaDescription,
    slug,
    isPinned,
    pinnedUntil,
  } = req.body;
  try {
    // Ищем пост по ID
    const existingCompanyLife = await prisma.companyLife.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCompanyLife) {
      res.status(404).json({ message: "Company life post not found" });
      return;
    }

    // Проверяем, не занят ли новый slug другим постом
    if (slug && slug !== existingCompanyLife.slug) {
      const slugExists = await prisma.companyLife.findUnique({ where: { slug } });
      if (slugExists) {
        res.status(400).json({ message: "Slug already exists" });
        return;
      }
    }

    let processedPinnedUntil = pinnedUntil !== undefined ? null : existingCompanyLife.pinnedUntil;
    if (pinnedUntil) {
      const date = new Date(pinnedUntil);
      date.setHours(23, 59, 59, 999);
      processedPinnedUntil = date;
    }

    // БЕЗОПАСНОСТЬ: Санитизация HTML контента для защиты от XSS
    const sanitizedContent = sanitizeHTMLContent(content);

    const updatedCompanyLife = await prisma.companyLife.update({
      where: { id: parseInt(id) },
      data: {
        title,
        shortDescription,
        content: sanitizedContent,
        isPublished: isPublished === "true" || isPublished === true,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        slug: slug || existingCompanyLife.slug,
        isPinned: isPinned !== undefined ? (isPinned === "true" || isPinned === true) : existingCompanyLife.isPinned,
        pinnedUntil: processedPinnedUntil,
      },
    });
    res.status(200).json(updatedCompanyLife);
  } catch (error) {
    console.error("Error updating company life post by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCompanyLifeById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const existingCompanyLife = await prisma.companyLife.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingCompanyLife) {
      res.status(404).json({ message: "Company life post not found" });
      return;
    }
    await prisma.companyLife.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Company life post deleted successfully" });
  } catch (error) {
    console.error("Error deleting company life post by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCompanyLife: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const existingCompanyLife = await prisma.companyLife.findUnique({ where: { slug } });
    if (!existingCompanyLife) {
      res.status(404).json({ message: "Company life post not found" });
      return;
    }
    await prisma.companyLife.delete({ where: { slug } });
    res.status(200).json({ message: "Company life post deleted successfully" });
  } catch (error) {
    console.error("Error deleting company life post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
