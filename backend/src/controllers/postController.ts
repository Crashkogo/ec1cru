import { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Существующие функции для новостей
export const getNews: RequestHandler = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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

// Существующие функции для акций (Promotions)
export const getPromotions: RequestHandler = async (req, res) => {
  try {
    const promotions = await prisma.promotions.findMany({
      orderBy: { startDate: 'desc' },
    });
    res.status(200).json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPromotion: RequestHandler = async (req, res) => {
  const { title, description, startDate, endDate, isPublished, slug, metaTitle, metaDescription, status } = req.body;

  try {
    const existingPromotion = await prisma.promotions.findUnique({ where: { slug } });
    if (existingPromotion) {
      res.status(400).json({ message: 'Slug already exists' });
      return;
    }

    const newPromotion = await prisma.promotions.create({
      data: {
        title,
        description,
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

// Новые функции для мероприятий (Events)
export const getEvents: RequestHandler = async (req, res) => {
  try {
    const events = await prisma.events.findMany({
      orderBy: { startDate: 'desc' }, // Сортировка по дате начала
    });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEvent: RequestHandler = async (req, res) => {
  const { title, shortDescription, description, startDate, isPublished, status, ours, slug, metaTitle, metaDescription } = req.body;

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
        description,
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

// Существующая функция загрузки изображений (будет использоваться для всех типов)
export const uploadImage: RequestHandler = async (req, res) => {
  if (!req.files || !req.files.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const file = req.files.file as UploadedFile;
  const slug = req.body.slug || 'temp';
  const entity = req.body.entity || 'news'; // По умолчанию news, если не указано
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