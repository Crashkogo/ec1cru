import { RequestHandler } from 'express';
import { prisma, slugify } from './utils';

export const getPrograms: RequestHandler = async (req, res) => {
  try {
    const programs = await prisma.program.findMany({ select: { id: true, shortName: true } });
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

export const createProgram: RequestHandler = async (req, res) => {
  const { fullName, shortName } = req.body;
  try {
    if (!fullName || !shortName) {
      res.status(400).json({ message: 'Full name and short name are required' });
      return;
    }
    const existingProgram = await prisma.program.findFirst({ where: { fullName } });
    if (existingProgram) {
      res.status(400).json({ message: 'Program with this full name already exists' });
      return;
    }
    const newProgram = await prisma.program.create({ data: { fullName, shortName } });
    res.status(201).json(newProgram);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllReadySolutions: RequestHandler = async (req, res) => {
  try {
    const solutions = await prisma.readySolution.findMany({
      orderBy: { createdAt: 'desc' },
      include: { programs: { include: { program: true } } },
    });
    res.status(200).json(solutions);
  } catch (error) {
    console.error('Error fetching ready solutions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createReadySolution: RequestHandler = async (req, res) => {
  const { type, freshSupport, title, shortDescription, fullDescription, price, images, isPublished, metaTitle, metaDescription, programIds } = req.body;
  try {
    const slug = slugify(title, { lower: true, strict: true });
    const existingSolution = await prisma.readySolution.findUnique({ where: { slug } });
    if (existingSolution) {
      res.status(400).json({ message: 'Solution with this title already exists' });
      return;
    }
    const solution = await prisma.readySolution.create({
      data: {
        type,
        freshSupport,
        title,
        shortDescription,
        fullDescription,
        price: parseFloat(price),
        images,
        isPublished,
        slug,
        metaTitle,
        metaDescription,
        programs: {
          create: programIds && Array.isArray(programIds)
            ? programIds.map((programId: number) => ({ program: { connect: { id: programId } } }))
            : [],
        },
      },
      include: { programs: { include: { program: true } } },
    });
    res.status(201).json(solution);
  } catch (error) {
    console.error('Error creating ready solution:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateReadySolution: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const { type, freshSupport, title, shortDescription, fullDescription, price, images, isPublished, metaTitle, metaDescription, programIds } = req.body;
  try {
    const newSlug = slugify(title, { lower: true, strict: true });
    const solution = await prisma.readySolution.update({
      where: { slug },
      data: {
        type,
        freshSupport,
        title,
        shortDescription,
        fullDescription,
        price: parseFloat(price),
        images,
        isPublished,
        slug: newSlug,
        metaTitle,
        metaDescription,
        programs: {
          deleteMany: {},
          create: programIds && Array.isArray(programIds)
            ? programIds.map((programId: number) => ({ program: { connect: { id: programId } } }))
            : [],
        },
      },
      include: { programs: { include: { program: true } } },
    });
    res.status(200).json(solution);
  } catch (error) {
    console.error('Error updating ready solution:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getReadySolutions: RequestHandler = async (req, res) => {
  try {
    const { page = '1', limit = '10', search, freshSupport, programIds, type } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);
    const where: any = {};
    if (search) where.title = { contains: search as string, mode: 'insensitive' };
    if (freshSupport !== undefined) where.freshSupport = freshSupport === 'true';
    if (type) where.type = type as string;
    if (programIds) {
      const programIdsArray = Array.isArray(programIds) ? programIds.map(Number) : (programIds as string).split(',').map(Number);
      where.programs = { some: { programId: { in: programIdsArray } } };
    }
    const solutions = await prisma.readySolution.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'desc' },
      include: { programs: { include: { program: true } } },
    });
    res.json(solutions);
  } catch (error) {
    console.error('Error fetching ready solutions:', error);
    res.status(500).json({ error: 'Failed to fetch ready solutions' });
  }
};

export const getReadySolutionBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const solution = await prisma.readySolution.findUnique({
      where: { slug, isPublished: true },
      include: { programs: { include: { program: true } } },
    });
    if (!solution) {
      res.status(404).json({ message: 'Solution not found' });
      return;
    }
    res.json(solution);
  } catch (error) {
    console.error('Error fetching ready solution by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};