import { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Получение новостей
export const getNews: RequestHandler = async (req, res) => {
  try {
    const take = parseInt(req.query.take as string) || undefined; // Получаем параметр take
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take, // Ограничиваем количество записей
      where: { isPublished: true }, // Показываем только опубликованные новости
    });
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Новый роут для админки (все новости)
export const getAllNews: RequestHandler = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching all news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Создание новости
export const createNews: RequestHandler = async (req, res) => {
  const { title, shortDescription, content, isPublished, slug, metaTitle, metaDescription } = req.body;

  try {
    const existingNews = await prisma.news.findUnique({ where: { slug } });
    if (existingNews) {
      res.status(400).json({ message: 'Slug already exists' });
      return;
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        shortDescription,
        content,
        isPublished: isPublished === 'true' || isPublished === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });

    res.status(201).json(newNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Обновление новости
export const updateNews: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const { title, shortDescription, content, isPublished, metaTitle, metaDescription } = req.body;

  try {
    const existingNews = await prisma.news.findUnique({ where: { slug } });
    if (!existingNews) {
      res.status(404).json({ message: 'News not found' });
      return; // Просто прерываем выполнение, не возвращаем Response
    }

    const updatedNews = await prisma.news.update({
      where: { slug },
      data: {
        title,
        shortDescription,
        content,
        isPublished: isPublished === 'true' || isPublished === true,
        slug, // Оставляем тот же slug, чтобы не менять уникальный идентификатор
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });

    res.status(200).json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Получение акций
export const getPromotions: RequestHandler = async (req, res) => {
  try {
    const promotions = await prisma.promotions.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Создание акции
export const createPromotion: RequestHandler = async (req, res) => {
  const { title, shortDescription, content, startDate, endDate, isPublished, slug, metaTitle, metaDescription, status } = req.body;

  try {
    const existingPromotion = await prisma.promotions.findUnique({ where: { slug } });
    if (existingPromotion) {
      res.status(400).json({ message: 'Slug already exists' });
      return;
    }

    const newPromotion = await prisma.promotions.create({
      data: {
        title,
        shortDescription, // Исправлено с "shordDescription" на "shortDescription"
        content, // Добавлено обязательное поле
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isPublished: isPublished === 'true' || isPublished === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        status: status === 'true' || status === true,
      },
    });

    res.status(201).json(newPromotion);
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Получение событий
export const getEvents: RequestHandler = async (req, res) => {
  try {
    const events = await prisma.events.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Создание события
export const createEvent: RequestHandler = async (req, res) => {
  const { title, shortDescription, content, startDate, isPublished, status, ours, slug, metaTitle, metaDescription } = req.body;

  try {
    const existingEvent = await prisma.events.findUnique({ where: { slug } });
    if (existingEvent) {
      res.status(400).json({ message: 'Slug already exists' });
      return;
    }

    const newEvent = await prisma.events.create({
      data: {
        title,
        shortDescription,
        content, // Добавлено обязательное поле
        startDate: new Date(startDate),
        isPublished: isPublished === 'true' || isPublished === true,
        status: status === 'true' || status === true,
        ours: ours === 'true' || ours === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Загрузка изображений
export const uploadImage: RequestHandler = async (req, res) => {
  if (!req.files || !req.files.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const file = req.files.file as UploadedFile;
  const slug = req.body.slug || 'temp';
  const entity = req.body.entity || 'news';
  const uploadDir = path.join(__dirname, '../../frontend/public/uploads', entity, slug);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  try {
    await file.mv(filePath);
    const imageUrl = `/uploads/${entity}/${slug}/${fileName}`;
    res.json({ location: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

// Получение новости по slug
export const getNewsBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;

  try {
    const news = await prisma.news.findUnique({
      where: { slug },
    });

    if (!news) {
      res.status(404).json({ message: 'News not found' });
      return; // Просто прерываем выполнение, не возвращаем Response
    }

    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

