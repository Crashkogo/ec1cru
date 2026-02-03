import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tariff-plans - Получить все опубликованные тарифы (для frontend)
export const getPublishedTariffPlans = async (req: Request, res: Response) => {
  try {
    const tariffs = await prisma.tariffPlan.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' }
    });
    res.json(tariffs);
  } catch (error) {
    console.error('Error fetching published tariff plans:', error);
    res.status(500).json({ error: 'Failed to fetch tariff plans' });
  }
};

// GET /api/admin/tariff-plans - Получить все тарифы (для админки)
export const getAllTariffPlans = async (req: Request, res: Response) => {
  try {
    console.log('GET /api/admin/tariff-plans called with query:', req.query);
    const _start = parseInt(req.query._start as string) || 0;
    const _end = parseInt(req.query._end as string) || 10;
    const _sort = (req.query._sort as string) || 'order';
    const _order = (req.query._order as string) || 'ASC';

    console.log(`Fetching tariffs: skip=${_start}, take=${_end - _start}, sort=${_sort} ${_order}`);

    // Маппинг полей для сортировки (чтобы React-Admin мог использовать любые поля)
    const sortField = _sort === 'id' ? 'id' : _sort;
    const orderBy: any = { [sortField]: _order.toLowerCase() as 'asc' | 'desc' };

    const tariffs = await prisma.tariffPlan.findMany({
      skip: _start,
      take: _end - _start,
      orderBy
    });

    const total = await prisma.tariffPlan.count();

    console.log(`Found ${tariffs.length} tariffs, total count: ${total}`);
    console.log('Tariffs data:', JSON.stringify(tariffs, null, 2));

    res.set('X-Total-Count', total.toString());
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.json(tariffs);
  } catch (error) {
    console.error('Error fetching all tariff plans:', error);
    res.status(500).json({ error: 'Failed to fetch tariff plans', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// GET /api/admin/tariff-plans/:id - Получить один тариф
export const getTariffPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tariff = await prisma.tariffPlan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!tariff) {
      res.status(404).json({ error: 'Tariff plan not found' });
      return;
    }

    res.json(tariff);
  } catch (error) {
    console.error('Error fetching tariff plan:', error);
    res.status(500).json({ error: 'Failed to fetch tariff plan' });
  }
};

// POST /api/admin/tariff-plans - Создать тариф
export const createTariffPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Creating tariff plan with data:', JSON.stringify(req.body, null, 2));
    const { name, subtitle, columns, rows, footnote, order, isPublished } = req.body;

    // Валидация обязательных полей
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      res.status(400).json({ error: 'Columns array is required' });
      return;
    }
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ error: 'Rows array is required' });
      return;
    }

    const tariff = await prisma.tariffPlan.create({
      data: {
        name,
        subtitle: subtitle || null,
        columns,
        rows,
        footnote: footnote || null,
        order: order || 0,
        isPublished: isPublished !== undefined ? isPublished : true
      }
    });

    console.log('Tariff plan created successfully:', tariff.id);
    res.status(201).json(tariff);
  } catch (error) {
    console.error('Error creating tariff plan:', error);
    res.status(500).json({ error: 'Failed to create tariff plan', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// PUT /api/admin/tariff-plans/:id - Обновить тариф
export const updateTariffPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Updating tariff plan ${id} with data:`, JSON.stringify(req.body, null, 2));
    const { name, subtitle, columns, rows, footnote, order, isPublished } = req.body;

    // Валидация обязательных полей
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      res.status(400).json({ error: 'Columns array is required' });
      return;
    }
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ error: 'Rows array is required' });
      return;
    }

    const tariff = await prisma.tariffPlan.update({
      where: { id: parseInt(id) },
      data: {
        name,
        subtitle: subtitle || null,
        columns,
        rows,
        footnote: footnote || null,
        order,
        isPublished
      }
    });

    console.log('Tariff plan updated successfully:', tariff.id);
    res.json(tariff);
  } catch (error) {
    console.error('Error updating tariff plan:', error);
    res.status(500).json({ error: 'Failed to update tariff plan', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// DELETE /api/admin/tariff-plans/:id - Удалить тариф
export const deleteTariffPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.tariffPlan.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Tariff plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting tariff plan:', error);
    res.status(500).json({ error: 'Failed to delete tariff plan' });
  }
};
