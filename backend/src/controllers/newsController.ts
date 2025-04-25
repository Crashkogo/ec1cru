import { RequestHandler } from 'express';
import { prisma } from './utils';

export const getNewsBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const news = await prisma.news.findUnique({ where: { slug } });
    if (!news) {
      res.status(404).json({ message: 'News not found' });
      return;
    }
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getNews: RequestHandler = async (req, res) => {
  try {
    const take = parseInt(req.query.take as string) || undefined;
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      where: { isPublished: true },
    });
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllNews: RequestHandler = async (req, res) => {
  try {
    const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching all news:', error);
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

export const updateNews: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const { title, shortDescription, content, isPublished, metaTitle, metaDescription } = req.body;
  try {
    const existingNews = await prisma.news.findUnique({ where: { slug } });
    if (!existingNews) {
      res.status(404).json({ message: 'News not found' });
      return;
    }
    const updatedNews = await prisma.news.update({
      where: { slug },
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
    res.status(200).json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};