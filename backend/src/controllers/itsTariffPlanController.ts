import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sanitizeText } from '../utils/sanitize.js';

const prisma = new PrismaClient();

// GET /api/its-tariff-plans - Получить все опубликованные ИТС тарифы (для frontend)
export const getPublishedItsTariffPlans = async (req: Request, res: Response) => {
  try {
    const tariffs = await prisma.itsTariffPlan.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' }
    });
    res.json(tariffs);
  } catch (error) {
    console.error('Error fetching published ITS tariff plans:', error);
    res.status(500).json({ error: 'Failed to fetch ITS tariff plans' });
  }
};

// GET /api/admin/its-tariff-plans - Получить все ИТС тарифы (для админки)
export const getAllItsTariffPlans = async (req: Request, res: Response) => {
  try {
    console.log('GET /api/admin/its-tariff-plans called with query:', req.query);
    const _start = parseInt(req.query._start as string) || 0;
    const _end = parseInt(req.query._end as string) || 10;
    const _sort = (req.query._sort as string) || 'order';
    const _order = (req.query._order as string) || 'ASC';

    console.log(`Fetching ITS tariffs: skip=${_start}, take=${_end - _start}, sort=${_sort} ${_order}`);

    const sortField = _sort === 'id' ? 'id' : _sort;
    const orderBy: any = { [sortField]: _order.toLowerCase() as 'asc' | 'desc' };

    const tariffs = await prisma.itsTariffPlan.findMany({
      skip: _start,
      take: _end - _start,
      orderBy
    });

    const total = await prisma.itsTariffPlan.count();

    console.log(`Found ${tariffs.length} ITS tariffs, total count: ${total}`);

    res.set('X-Total-Count', total.toString());
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.json(tariffs);
  } catch (error) {
    console.error('Error fetching all ITS tariff plans:', error);
    res.status(500).json({ error: 'Failed to fetch ITS tariff plans', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// GET /api/admin/its-tariff-plans/:id - Получить один ИТС тариф
export const getItsTariffPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tariff = await prisma.itsTariffPlan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!tariff) {
      return res.status(404).json({ error: 'ITS Tariff plan not found' });
    }

    res.json(tariff);
  } catch (error) {
    console.error('Error fetching ITS tariff plan:', error);
    res.status(500).json({ error: 'Failed to fetch ITS tariff plan' });
  }
};

// POST /api/admin/its-tariff-plans - Создать ИТС тариф
export const createItsTariffPlan = async (req: Request, res: Response) => {
  try {
    console.log('Creating ITS tariff plan with data:', JSON.stringify(req.body, null, 2));
    const { title, rows, order, isPublished } = req.body;

    // Валидация обязательных полей
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'Rows array is required' });
    }

    // БЕЗОПАСНОСТЬ: Санитизация текстов строк (удаляем HTML теги)
    const sanitizedRows = rows.map((row: any) => ({
      ...row,
      text: row.text ? sanitizeText(row.text) : ''
    }));

    const tariff = await prisma.itsTariffPlan.create({
      data: {
        title,
        rows: sanitizedRows,
        order: order || 0,
        isPublished: isPublished !== undefined ? isPublished : true
      }
    });

    console.log('ITS Tariff plan created successfully:', tariff.id);
    res.status(201).json(tariff);
  } catch (error) {
    console.error('Error creating ITS tariff plan:', error);
    res.status(500).json({ error: 'Failed to create ITS tariff plan', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// PUT /api/admin/its-tariff-plans/:id - Обновить ИТС тариф
export const updateItsTariffPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Updating ITS tariff plan ${id} with data:`, JSON.stringify(req.body, null, 2));
    const { title, rows, order, isPublished } = req.body;

    // Валидация обязательных полей
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'Rows array is required' });
    }

    // БЕЗОПАСНОСТЬ: Санитизация текстов строк (удаляем HTML теги)
    const sanitizedRows = rows.map((row: any) => ({
      ...row,
      text: row.text ? sanitizeText(row.text) : ''
    }));

    const tariff = await prisma.itsTariffPlan.update({
      where: { id: parseInt(id) },
      data: {
        title,
        rows: sanitizedRows,
        order,
        isPublished
      }
    });

    console.log('ITS Tariff plan updated successfully:', tariff.id);
    res.json(tariff);
  } catch (error) {
    console.error('Error updating ITS tariff plan:', error);
    res.status(500).json({ error: 'Failed to update ITS tariff plan', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// DELETE /api/admin/its-tariff-plans/:id - Удалить ИТС тариф
export const deleteItsTariffPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.itsTariffPlan.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'ITS Tariff plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting ITS tariff plan:', error);
    res.status(500).json({ error: 'Failed to delete ITS tariff plan' });
  }
};
