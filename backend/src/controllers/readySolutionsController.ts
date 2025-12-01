import { RequestHandler } from "express";
import { prisma, slugify } from "../utils";
import { sanitizeHTMLContent } from "../utils/sanitize.js";

export const getPrograms: RequestHandler = async (req, res) => {
  try {
    const { _start, _end, _sort, _order, q } = req.query;

    let where: any = {};
    if (q) {
      where.OR = [
        { fullName: { contains: q as string, mode: "insensitive" } },
        { shortName: { contains: q as string, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { fullName: "asc" };
    if (_sort && _order) {
      orderBy = { [_sort as string]: (_order as string).toLowerCase() };
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy,
      skip: _start ? parseInt(_start as string) : undefined,
      take:
        _start && _end
          ? parseInt(_end as string) - parseInt(_start as string)
          : undefined,
      select: { id: true, fullName: true, shortName: true, createdAt: true },
    });

    // Получаем общее количество для заголовка X-Total-Count
    const total = await prisma.program.count({ where });

    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    res.status(500).json({ error: "Failed to fetch programs" });
  }
};

export const createProgram: RequestHandler = async (req, res) => {
  const { fullName, shortName } = req.body;
  try {
    if (!fullName || !shortName) {
      res
        .status(400)
        .json({ message: "Full name and short name are required" });
      return;
    }
    const existingProgram = await prisma.program.findFirst({
      where: { fullName },
    });
    if (existingProgram) {
      res
        .status(400)
        .json({ message: "Program with this full name already exists" });
      return;
    }
    const newProgram = await prisma.program.create({
      data: { fullName, shortName },
    });
    res.status(201).json(newProgram);
  } catch (error) {
    console.error("Error creating program:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllReadySolutions: RequestHandler = async (req, res) => {
  try {
    const { _start, _end, _sort, _order, q } = req.query;

    let where: any = {};
    if (q) {
      where.title = { contains: q as string, mode: "insensitive" };
    }

    let orderBy: any = { createdAt: "desc" };
    if (_sort && _order) {
      orderBy = { [_sort as string]: (_order as string).toLowerCase() };
    }

    const solutions = await prisma.readySolution.findMany({
      where,
      orderBy,
      skip: _start ? parseInt(_start as string) : undefined,
      take:
        _start && _end
          ? parseInt(_end as string) - parseInt(_start as string)
          : undefined,
      include: {
        programs: {
          include: {
            program: {
              select: { id: true, fullName: true, shortName: true },
            },
          },
        },
      },
    });

    // Получаем общее количество для заголовка X-Total-Count
    const total = await prisma.readySolution.count({ where });

    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.status(200).json(solutions);
  } catch (error) {
    console.error("Error fetching ready solutions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createReadySolution: RequestHandler = async (req, res) => {
  const {
    type,
    freshSupport,
    title,
    shortDescription,
    fullDescription,
    price,
    images,
    isPublished,
    metaTitle,
    metaDescription,
    programIds,
  } = req.body;
  try {
    const slug = slugify(title, { lower: true, strict: true });
    const existingSolution = await prisma.readySolution.findUnique({
      where: { slug },
    });
    if (existingSolution) {
      res
        .status(400)
        .json({ message: "Solution with this title already exists" });
      return;
    }

    // Правильная обработка price - проверяем на пустую строку, null, undefined
    let priceValue = null;
    if (price !== null && price !== undefined && price !== "") {
      const parsedPrice = parseFloat(price);
      if (!isNaN(parsedPrice)) {
        priceValue = parsedPrice;
      }
    }

    // БЕЗОПАСНОСТЬ: Санитизация HTML контента для защиты от XSS
    const sanitizedFullDescription = sanitizeHTMLContent(fullDescription);

    const solution = await prisma.readySolution.create({
      data: {
        type,
        freshSupport,
        title,
        shortDescription,
        fullDescription: sanitizedFullDescription,
        price: priceValue,
        images,
        isPublished,
        slug,
        metaTitle,
        metaDescription,
        programs: {
          create:
            programIds && Array.isArray(programIds)
              ? programIds.map((programId: number) => ({
                  program: { connect: { id: programId } },
                }))
              : [],
        },
      },
      include: { programs: { include: { program: true } } },
    });
    res.status(201).json(solution);
  } catch (error) {
    console.error("Error creating ready solution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateReadySolution: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const {
    type,
    freshSupport,
    title,
    shortDescription,
    fullDescription,
    price,
    images,
    isPublished,
    metaTitle,
    metaDescription,
    programIds,
  } = req.body;
  try {
    const newSlug = slugify(title, { lower: true, strict: true });

    // Правильная обработка price - проверяем на пустую строку, null, undefined
    let priceValue = null;
    if (price !== null && price !== undefined && price !== "") {
      const parsedPrice = parseFloat(price);
      if (!isNaN(parsedPrice)) {
        priceValue = parsedPrice;
      }
    }

    // БЕЗОПАСНОСТЬ: Санитизация HTML контента для защиты от XSS
    const sanitizedFullDescription = sanitizeHTMLContent(fullDescription);

    const solution = await prisma.readySolution.update({
      where: { slug },
      data: {
        type,
        freshSupport,
        title,
        shortDescription,
        fullDescription: sanitizedFullDescription,
        price: priceValue,
        images,
        isPublished,
        slug: newSlug,
        metaTitle,
        metaDescription,
        programs: {
          deleteMany: {},
          create:
            programIds && Array.isArray(programIds)
              ? programIds.map((programId: number) => ({
                  program: { connect: { id: programId } },
                }))
              : [],
        },
      },
      include: { programs: { include: { program: true } } },
    });
    res.status(200).json(solution);
  } catch (error) {
    console.error("Error updating ready solution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getReadySolutions: RequestHandler = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      search,
      freshSupport,
      programIds,
      type,
    } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);
    const where: any = {};
    if (search)
      where.title = { contains: search as string, mode: "insensitive" };
    if (freshSupport !== undefined)
      where.freshSupport = freshSupport === "true";
    if (type) where.type = type as string;
    if (programIds) {
      const programIdsArray = Array.isArray(programIds)
        ? programIds.map(Number)
        : (programIds as string).split(",").map(Number);
      where.programs = { some: { programId: { in: programIdsArray } } };
    }
    const solutions = await prisma.readySolution.findMany({
      where,
      skip,
      take,
      orderBy: { id: "desc" },
      include: { programs: { include: { program: true } } },
    });
    res.json(solutions);
  } catch (error) {
    console.error("Error fetching ready solutions:", error);
    res.status(500).json({ error: "Failed to fetch ready solutions" });
  }
};

export const getReadySolutionBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const solution = await prisma.readySolution.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        programs: {
          include: {
            program: {
              select: { id: true, fullName: true, shortName: true },
            },
          },
        },
      },
    });
    if (!solution) {
      res.status(404).json({ message: "Solution not found" });
      return;
    }
    res.json(solution);
  } catch (error) {
    console.error("Error fetching ready solution by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Методы для админки (работа с ID)
export const getReadySolutionById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    // Пытаемся определить, это ID или slug
    const parsedId = parseInt(id);
    const isNumericId = !isNaN(parsedId) && parsedId.toString() === id;

    // Проверяем, есть ли аутентификация (для админки)
    const isAuthenticated = !!(req as any).user;

    let solution;

    if (isNumericId) {
      // Если это числовой ID, ищем по ID
      solution = await prisma.readySolution.findUnique({
        where: { id: parsedId },
        include: {
          programs: {
            include: {
              program: {
                select: { id: true, fullName: true, shortName: true },
              },
            },
          },
        },
      });
    } else {
      // Если это slug, ищем по slug
      const whereClause: any = { slug: id };

      // Для публичного доступа фильтруем только опубликованные
      if (!isAuthenticated) {
        whereClause.isPublished = true;
      }

      solution = await prisma.readySolution.findFirst({
        where: whereClause,
        include: {
          programs: {
            include: {
              program: {
                select: { id: true, fullName: true, shortName: true },
              },
            },
          },
        },
      });
    }

    if (!solution) {
      res.status(404).json({ message: "Solution not found" });
      return;
    }
    res.json(solution);
  } catch (error) {
    console.error("Error fetching ready solution by id/slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateReadySolutionById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const {
    type,
    freshSupport,
    title,
    shortDescription,
    fullDescription,
    price,
    images,
    isPublished,
    metaTitle,
    metaDescription,
    programIds,
  } = req.body;
  try {
    const slug = slugify(title, { lower: true, strict: true });

    // Правильная обработка price - проверяем на пустую строку, null, undefined
    let priceValue = null;
    if (price !== null && price !== undefined && price !== "") {
      const parsedPrice = parseFloat(price);
      if (!isNaN(parsedPrice)) {
        priceValue = parsedPrice;
      }
    }

    // БЕЗОПАСНОСТЬ: Санитизация HTML контента для защиты от XSS
    const sanitizedFullDescription = sanitizeHTMLContent(fullDescription);

    const solution = await prisma.readySolution.update({
      where: { id: parseInt(id) },
      data: {
        type,
        freshSupport,
        title,
        shortDescription,
        fullDescription: sanitizedFullDescription,
        price: priceValue,
        images,
        isPublished,
        slug,
        metaTitle,
        metaDescription,
        programs: {
          deleteMany: {},
          create:
            programIds && Array.isArray(programIds)
              ? programIds.map((programId: number) => ({
                  program: { connect: { id: programId } },
                }))
              : [],
        },
      },
      include: {
        programs: {
          include: {
            program: {
              select: { id: true, fullName: true, shortName: true },
            },
          },
        },
      },
    });
    res.status(200).json(solution);
  } catch (error) {
    console.error("Error updating ready solution by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReadySolutionById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.readySolution.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Solution deleted successfully" });
  } catch (error) {
    console.error("Error deleting ready solution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReadySolution: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    await prisma.readySolution.delete({
      where: { slug },
    });
    res.status(200).json({ message: "Solution deleted successfully" });
  } catch (error) {
    console.error("Error deleting ready solution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProgramById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const program = await prisma.program.findUnique({
      where: { id: parseInt(id) },
    });
    if (!program) {
      res.status(404).json({ message: "Program not found" });
      return;
    }
    res.json(program);
  } catch (error) {
    console.error("Error fetching program by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProgramById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { fullName, shortName } = req.body;
  try {
    if (!fullName || !shortName) {
      res
        .status(400)
        .json({ message: "Full name and short name are required" });
      return;
    }

    // Проверяем, что программа с таким названием не существует (исключая текущую)
    const existingProgram = await prisma.program.findFirst({
      where: {
        fullName,
        NOT: { id: parseInt(id) },
      },
    });
    if (existingProgram) {
      res
        .status(400)
        .json({ message: "Program with this full name already exists" });
      return;
    }

    const program = await prisma.program.update({
      where: { id: parseInt(id) },
      data: { fullName, shortName },
    });
    res.json(program);
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProgramById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    // Проверяем, используется ли программа в решениях
    const solutionsCount = await prisma.solutionProgram.count({
      where: { programId: parseInt(id) },
    });

    if (solutionsCount > 0) {
      res.status(400).json({
        message: `Cannot delete program. It is used in ${solutionsCount} solution(s)`,
      });
      return;
    }

    await prisma.program.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Error deleting program:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
