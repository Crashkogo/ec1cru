import { RequestHandler } from 'express';
import { prisma, transporter, axios } from './utils';

export const registerForEvent: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const { name, phone, email, recaptchaToken } = req.body;

  try {
    const recaptchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: { secret: process.env.CAPTCHA_SECRET, response: recaptchaToken },
    });
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
    const event = await prisma.events.findUnique({ where: { slug } });
    if (!event || !event.ours || new Date() >= new Date(event.startDate)) {
      res.status(400).json({ message: 'Регистрация недоступна' });
      return;
    }

    const registration = await prisma.eventsRegistration.create({
      data: { eventId: event.id, name, phone, email },
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
      (event.eventLink ? `Ссылка на мероприятие: ${event.eventLink}` : 'Ссылку на мероприятие пришлём за день до его начала.');

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
  try {
    const event = await prisma.events.findUnique({
      where: { slug },
      include: { registrations: true },
    });
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
      where: { isPublished: true },
    });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllEvents: RequestHandler = async (req, res) => {
  try {
    const events = await prisma.events.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEvent: RequestHandler = async (req, res) => {
  const { title, shortDescription, content, startDate, isPublished, status, ours, slug, metaTitle, metaDescription, eventLink } = req.body;
  try {
    if (!title || !slug || !startDate) {
      res.status(400).json({ message: 'Title, slug, and startDate are required' });
      return;
    }
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
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateEvent: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const { title, shortDescription, content, startDate, isPublished, status, ours, slug: newSlug, metaTitle, metaDescription, eventLink } = req.body;
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
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};