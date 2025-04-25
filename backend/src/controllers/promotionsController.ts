import { RequestHandler } from 'express';
import { prisma } from './utils';

export const getPromotionBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const promotion = await prisma.promotions.findUnique({ where: { slug } });
    if (!promotion) {
      res.status(404).json({ message: 'Promotion not found' });
      return;
    }
    res.status(200).json(promotion);
  } catch (error) {
    console.error('Error fetching promotion by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPromotions: RequestHandler = async (req, res) => {
  try {
    const take = parseInt(req.query.take as string) || undefined;
    const promotions = await prisma.promotions.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      where: { isPublished: true },
    });
    res.status(200).json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllPromotions: RequestHandler = async (req, res) => {
  try {
    const promotions = await prisma.promotions.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json(promotions);
  } catch (error) {
    console.error('Error fetching all promotions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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
        shortDescription,
        content,
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

export const updatePromotion: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const { title, shortDescription, content, startDate, endDate, isPublished, metaTitle, metaDescription, status } = req.body;
  try {
    const existingPromotion = await prisma.promotions.findUnique({ where: { slug } });
    if (!existingPromotion) {
      res.status(404).json({ message: 'Promotion not found' });
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
        isPublished: isPublished === 'true' || isPublished === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        status: status === 'true' || status === true,
      },
    });
    res.status(200).json(updatedPromotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};