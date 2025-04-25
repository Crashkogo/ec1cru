import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import axios from 'axios';
import 'dotenv/config';
import slugify from 'slugify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: 'smtp.timeweb.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const registerForEvent: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const { name, phone, email, recaptchaToken } = req.body;

  try {
    const recaptchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.CAPTCHA_SECRET,
          response: recaptchaToken,
        },
      }
    );

    const { success, score } = recaptchaResponse.data;

    if (!success || score < 0.5) {
      res.status(400).json({ message: 'Ошибка проверки reCAPTCHA: подозрение на бота' });
      return;
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    res.status(500).json({ message: 'Ошибка проверки reCAPTCHA' });
    return;
  }

  try {
    const event = await prisma.events.findUnique({
      where: { slug },
    });

    if (!event || !event.ours || new Date() >= new Date(event.startDate)) {
      res.status(400).json({ message: 'Регистрация недоступна' });
      return;
    }

    const registration = await prisma.eventsRegistration.create({
      data: {
        eventId: event.id,
        name,
        phone,
        email,
      },
    });

    const eventDateTime = new Date(event.startDate).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });

    const emailText =
      `Здравствуйте, ${name}! Вы успешно зарегистрировались на мероприятие "${event.title}".\n` +
      `Дата и время проведения: ${eventDateTime}.\n` +
      (event.eventLink
        ? `Ссылка на мероприятие: ${event.eventLink}`
        : 'Ссылку на мероприятие пришлём за день до его начала.');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Регистрация на мероприятие: ${event.title}`,
      text: emailText,
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEventRegistrations: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  console.log('Received slug:', slug);
  try {
    const event = await prisma.events.findUnique({
      where: { slug },
      include: { registrations: true },
    });
    console.log('Found event:', event);
    if (!event || !event.ours) {
      res.status(404).json({ message: 'Мероприятие не найдено или регистрация недоступна' });
      return;
    }
    res.json({
      eventTitle: event.title,
      eventId: event.id,
      eventLink: event.eventLink,
      registrations: event.registrations,
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendEventReminder: RequestHandler = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await prisma.events.findUnique({
      where: { id: Number(eventId) },
      include: { registrations: true },
    });

    if (!event) {
      res.status(404).json({ message: 'Мероприятие не найдено' });
      return;
    }

    const eventDateTime = event.startDate.toISOString().replace('T', ' ').replace(':00.000Z', '');
    console.log('Event date for reminder:', eventDateTime);

    for (const reg of event.registrations) {
      const emailText =
        `Здравствуйте, ${reg.name}! Напоминаем вам, что вы были зарегистрированы на мероприятие "${event.title}".\n` +
        `Дата и время проведения: ${eventDateTime}.\n` +
        `Ссылка на мероприятие: ${event.eventLink}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: reg.email,
        subject: `Напоминание о мероприятии: ${event.title}`,
        text: emailText,
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    res.json({ message: 'Напоминания отправлены' });
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ message: 'Ошибка при отправке напоминаний' });
  }
};

export const getNewsBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;

  try {
    const news = await prisma.news.findUnique({
      where: { slug },
    });

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
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
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

export const uploadImage: RequestHandler = async (req, res) => {
  if (!req.files || !req.files.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const file = req.files.file as UploadedFile;
  const slug = req.body.slug || 'temp';
  const entity = typeof req.query.entity === 'string' ? req.query.entity : req.body.entity || 'news';

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

export const moveImagesAfterCreate: RequestHandler = async (req, res) => {
  const { oldSlug = 'temp', newSlug } = req.body;
  const entity = req.body.entity;
  const oldDir = path.join(__dirname, '../../frontend/public/uploads', entity, oldSlug);
  const newDir = path.join(__dirname, '../../frontend/public/uploads', entity, newSlug);

  try {
    if (fs.existsSync(oldDir)) {
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }
      const files = fs.readdirSync(oldDir);
      for (const file of files) {
        const oldPath = path.join(oldDir, file);
        const newPath = path.join(newDir, file);
        fs.renameSync(oldPath, newPath);
      }
      fs.rmdirSync(oldDir);
    }
    res.json({ message: 'Images moved successfully' });
  } catch (error) {
    console.error('Error moving images:', error);
    res.status(500).json({ message: 'Error moving images' });
  }
};

export const getPromotionBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;

  try {
    const promotion = await prisma.promotions.findUnique({
      where: { slug },
    });

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
    const promotions = await prisma.promotions.findMany({
      orderBy: { createdAt: 'desc' },
    });
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

export const getEventBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;

  try {
    const event = await prisma.events.findUnique({
      where: { slug },
      include: { registrations: true },
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEvents: RequestHandler = async (req, res) => {
  try {
    const take = parseInt(req.query.take as string) || undefined;
    const events = await prisma.events.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      where: {
        isPublished: true,
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllEvents: RequestHandler = async (req, res) => {
  try {
    const events = await prisma.events.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEvent: RequestHandler = async (req, res) => {
  const {
    title,
    shortDescription,
    content,
    startDate,
    isPublished,
    status,
    ours,
    slug,
    metaTitle,
    metaDescription,
    eventLink,
  } = req.body;

  try {
    if (!title || !slug || !startDate) {
      res.status(400).json({ message: 'Title, slug, and startDate are required' });
      return;
    }

    console.log('Received startDate:', startDate);
    const existingEvent = await prisma.events.findUnique({ where: { slug } });
    if (existingEvent) {
      res.status(400).json({ message: 'Slug already exists' });
      return;
    }

    const parsedStartDate = new Date(`${startDate}:00.000Z`);
    if (isNaN(parsedStartDate.getTime())) {
      res.status(400).json({ message: 'Invalid startDate format' });
      return;
    }

    const newEvent = await prisma.events.create({
      data: {
        title,
        shortDescription,
        content,
        startDate: parsedStartDate,
        isPublished: isPublished === 'true' || isPublished === true,
        status: status === 'true' || status === true,
        ours: ours === 'true' || ours === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        eventLink: eventLink || null,
      },
    });

    console.log('Created event with startDate:', newEvent.startDate);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateEvent: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const {
    title,
    shortDescription,
    content,
    startDate,
    isPublished,
    status,
    ours,
    slug: newSlug,
    metaTitle,
    metaDescription,
    eventLink,
  } = req.body;

  try {
    const existingEvent = await prisma.events.findUnique({ where: { slug } });
    if (!existingEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (newSlug && newSlug !== slug) {
      const slugExists = await prisma.events.findUnique({ where: { slug: newSlug } });
      if (slugExists) {
        res.status(400).json({ message: 'New slug already exists' });
        return;
      }
    }

    let updatedStartDate = existingEvent.startDate;
    if (startDate) {
      updatedStartDate = new Date(`${startDate}:00.000Z`);
      if (isNaN(updatedStartDate.getTime())) {
        res.status(400).json({ message: 'Invalid startDate format' });
        return;
      }
      console.log('Received startDate:', startDate, 'Formatted:', updatedStartDate);
    }

    const updatedEvent = await prisma.events.update({
      where: { slug },
      data: {
        title,
        shortDescription,
        content,
        startDate: updatedStartDate,
        isPublished: isPublished === 'true' || isPublished === true,
        status: status === 'true' || status === true,
        ours: ours === 'true' || ours === true,
        slug: newSlug || slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        eventLink: eventLink || null,
      },
    });

    console.log('Updated event with startDate:', updatedEvent.startDate);
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getPrograms: RequestHandler = async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      select: {
        id: true,
        shortName: true,
      },
    });
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

    const existingProgram = await prisma.program.findFirst({
      where: { fullName },
    });
    if (existingProgram) {
      res.status(400).json({ message: 'Program with this full name already exists' });
      return;
    }

    const newProgram = await prisma.program.create({
      data: {
        fullName,
        shortName,
      },
    });

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

    if (search) {
      where.title = { contains: search as string, mode: 'insensitive' };
    }
    if (freshSupport !== undefined) {
      where.freshSupport = freshSupport === 'true';
    }
    if (type) {
      where.type = type as string;
    }
    if (programIds) {
      const programIdsArray = Array.isArray(programIds) ? programIds.map(Number) : (programIds as string).split(',').map(Number);
      where.programs = { some: { programId: { in: programIdsArray } } };
    }

    const solutions = await prisma.readySolution.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'desc' },
      include: {
        programs: {
          include: {
            program: true,
          },
        },
      },
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

export const uploadGalleryImage: RequestHandler = async (req, res) => {
  console.log('Request received:', req.files);
  if (!req.files || !req.files.image) {
    console.log('No image uploaded');
    res.status(400).json({ message: 'No image uploaded' });
    return;
  }

  const image = req.files.image as UploadedFile;
  const entity = 'ready-solutions';
  const slug = 'temp';
  const uploadDir = path.join(__dirname, '../../frontend/public/uploads', entity, slug);

  console.log('Upload dir:', uploadDir);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created upload dir:', uploadDir);
  }

  const fileName = `${Date.now()}-${image.name}`;
  const filePath = path.join(uploadDir, fileName);

  try {
    await image.mv(filePath);
    const imageUrl = `/uploads/${entity}/${slug}/${fileName}`;
    console.log('Image uploaded:', imageUrl);
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

export const moveGalleryImagesAfterCreate: RequestHandler = async (req, res) => {
  const { images, slug } = req.body;
  const entity = 'ready-solutions';

  const oldDir = path.join(__dirname, '../../frontend/public/uploads', entity, 'temp');
  const newDir = path.join(__dirname, '../../frontend/public/uploads', entity, slug);

  try {
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    const movedImages = images.map((imageUrl: string) => {
      const fileName = path.basename(imageUrl);
      const oldPath = path.join(oldDir, fileName);
      const newPath = path.join(newDir, fileName);

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
      return `/uploads/${entity}/${slug}/${fileName}`;
    });

    if (fs.existsSync(oldDir) && fs.readdirSync(oldDir).length === 0) {
      fs.rmdirSync(oldDir);
    }

    res.status(200).json({ images: movedImages });
  } catch (error) {
    console.error('Error moving gallery images:', error);
    res.status(500).json({ message: 'Error moving gallery images' });
  }
};