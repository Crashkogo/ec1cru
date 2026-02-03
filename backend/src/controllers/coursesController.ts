import { RequestHandler } from "express";
import { prisma } from "../utils/index.js";
import { sanitizeHTMLContent } from "../utils/sanitize.js";

export const getCourseBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourseById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    // Сначала пробуем найти по ID
    let course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    // Если не найдено по ID, пробуем по slug
    if (!course) {
      course = await prisma.course.findUnique({ where: { slug: id } });
    }

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourses: RequestHandler = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      take,
      search,
    } = req.query;

    // Если передан take, используем старую логику для совместимости
    if (take) {
      const courses = await prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        take: parseInt(take as string),
        where: { isPublished: true },
      });
      res.status(200).json(courses);
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

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: takeNum,
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCourses: RequestHandler = async (req, res) => {
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

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.course.count({ where }),
    ]);

    // Устанавливаем заголовок для React Admin пагинации
    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching all courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createCourse: RequestHandler = async (req, res) => {
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
    const existingCourse = await prisma.course.findUnique({ where: { slug } });
    if (existingCourse) {
      res.status(400).json({ message: "Slug already exists" });
      return;
    }

    // БЕЗОПАСНОСТЬ: Санитизация HTML контента для защиты от XSS
    const sanitizedContent = sanitizeHTMLContent(content);

    const newCourse = await prisma.course.create({
      data: {
        title,
        shortDescription,
        content: sanitizedContent,
        isPublished: isPublished === "true" || isPublished === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCourse: RequestHandler = async (req, res) => {
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
    const existingCourse = await prisma.course.findUnique({ where: { slug } });
    if (!existingCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // БЕЗОПАСНОСТЬ: Санитизация HTML контента для защиты от XSS
    const sanitizedContent = sanitizeHTMLContent(content);

    const updatedCourse = await prisma.course.update({
      where: { slug },
      data: {
        title,
        shortDescription,
        content: sanitizedContent,
        isPublished: isPublished === "true" || isPublished === true,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCourseById: RequestHandler = async (req, res) => {
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
    // Ищем курс по ID
    const existingCourse = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Проверяем, не занят ли новый slug другим курсом
    if (slug && slug !== existingCourse.slug) {
      const slugExists = await prisma.course.findUnique({ where: { slug } });
      if (slugExists) {
        res.status(400).json({ message: "Slug already exists" });
        return;
      }
    }

    // БЕЗОПАСНОСТЬ: Санитизация HTML контента для защиты от XSS
    const sanitizedContent = sanitizeHTMLContent(content);

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        shortDescription,
        content: sanitizedContent,
        isPublished: isPublished === "true" || isPublished === true,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        slug: slug || existingCourse.slug,
      },
    });
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCourseById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const existingCourse = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    await prisma.course.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCourse: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const existingCourse = await prisma.course.findUnique({ where: { slug } });
    if (!existingCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    await prisma.course.delete({ where: { slug } });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
