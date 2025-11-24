import { Request, Response } from 'express';
import { prisma } from '../utils/index.js';

// Получить все отзывы (публичный доступ, только опубликованные)
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Получить отзыв по slug (публичный доступ)
export const getTestimonialBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { slug },
    });

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    if (!testimonial.isPublished) {
      return res.status(403).json({ error: 'Testimonial is not published' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial by slug:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
};

// Получить отзыв по ID (для админки)
export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(id) },
    });

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial by ID:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
};

// Получить все отзывы для админки (с фильтрами и пагинацией)
export const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const { _start, _end, _sort, _order, q, isPublished } = req.query;

    const start = _start ? parseInt(_start as string) : 0;
    const end = _end ? parseInt(_end as string) : 10;
    const sortField = (_sort as string) || 'createdAt';
    const sortOrder = (_order as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const where: any = {};

    // Фильтр по поиску
    if (q) {
      where.companyName = {
        contains: q as string,
        mode: 'insensitive',
      };
    }

    // Фильтр по статусу публикации
    if (isPublished !== undefined) {
      where.isPublished = isPublished === 'true';
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip: start,
        take: end - start,
      }),
      prisma.testimonial.count({ where }),
    ]);

    res.set('X-Total-Count', total.toString());
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Создать новый отзыв
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { companyName, content, slug, isPublished } = req.body;

    // Проверка уникальности slug
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { slug },
    });

    if (existingTestimonial) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        companyName,
        content,
        slug,
        isPublished: isPublished ?? false,
      },
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

// Обновить отзыв по ID
export const updateTestimonialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { companyName, content, slug, isPublished } = req.body;

    // Проверка существования отзыва
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    // Проверка уникальности slug (если slug изменился)
    if (slug && slug !== existingTestimonial.slug) {
      const slugExists = await prisma.testimonial.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: {
        companyName,
        content,
        slug,
        isPublished,
      },
    });

    res.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

// Удалить отзыв по ID
export const deleteTestimonialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(id) },
    });

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    await prisma.testimonial.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};
