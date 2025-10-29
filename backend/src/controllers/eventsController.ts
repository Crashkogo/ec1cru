import { RequestHandler } from "express";
import { prisma, transporter, axios } from "../utils";

export const registerForEvent: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const { name, phone, email, organization, privacyConsent, recaptchaToken } =
    req.body;

  try {
    const recaptchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
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
      res
        .status(400)
        .json({ message: "Ошибка проверки reCAPTCHA: подозрение на бота" });
      return;
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    res.status(500).json({ message: "Ошибка проверки reCAPTCHA" });
    return;
  }

  try {
    const event = await prisma.events.findUnique({ where: { slug } });
    if (
      !event ||
      !event.registrationEnabled ||
      new Date() >= new Date(event.startDate)
    ) {
      res.status(400).json({ message: "Регистрация недоступна" });
      return;
    }

    const registration = await prisma.eventsRegistration.create({
      data: {
        eventId: event.id,
        name,
        phone,
        email,
        organization,
        privacyConsent,
      },
    });

    const eventDateTime = new Date(event.startDate).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

    const siteUrl = process.env.SITE_URL || "http://localhost:5173";
    const eventUrl = `${siteUrl}/events/${event.slug}`;

    const emailText =
      `Здравствуйте, ${name}!\n\n` +
      `Ваша регистрация на мероприятие "${event.title}" принята!\n\n` +
      `Дата и время проведения: ${eventDateTime}.\n` +
      `Ссылка на мероприятие: ${eventUrl}\n\n` +
      (event.eventLink
        ? `Ссылка на трансляцию: ${event.eventLink}\n\n`
        : "Ссылку на трансляцию пришлём за день до начала мероприятия.\n\n") +
      `С уважением,\nКоманда ООО «Инженер-центр»`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Регистрация на мероприятие: ${event.title}`,
      text: emailText,
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEventRegistrations: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  try {
    const event = await prisma.events.findUnique({
      where: { slug },
      include: { registrations: true },
    });
    if (!event || !event.registrationEnabled) {
      res
        .status(404)
        .json({ message: "Мероприятие не найдено или регистрация недоступна" });
      return;
    }
    res.json({
      eventTitle: event.title,
      eventId: event.id,
      eventLink: event.eventLink,
      registrations: event.registrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEventRegistrationsByEventId: RequestHandler = async (
  req,
  res
) => {
  try {
    const { eventId } = req.query;

    console.log("getEventRegistrationsByEventId called");
    console.log("Query params:", req.query);
    console.log("eventId:", eventId);
    console.log("eventId type:", typeof eventId);

    if (!eventId) {
      console.log("No eventId provided");
      res.status(400).json({ message: "EventId is required" });
      return;
    }

    const parsedEventId = parseInt(eventId as string, 10);
    console.log("Parsed eventId:", parsedEventId);

    if (isNaN(parsedEventId)) {
      console.log("Invalid eventId - not a number");
      res.status(400).json({ message: "EventId must be a valid number" });
      return;
    }

    const registrations = await prisma.eventsRegistration.findMany({
      where: { eventId: parsedEventId },
      orderBy: { createdAt: "desc" },
    });

    console.log(
      `Found ${registrations.length} registrations for event ${parsedEventId}`
    );

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations by eventId:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
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
      res.status(404).json({ message: "Мероприятие не найдено" });
      return;
    }

    const eventDateTime = event.startDate
      .toISOString()
      .replace("T", " ")
      .replace(":00.000Z", "");
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
    res.json({ message: "Напоминания отправлены" });
  } catch (error) {
    console.error("Error sending reminder:", error);
    res.status(500).json({ message: "Ошибка при отправке напоминаний" });
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
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEvents: RequestHandler = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      take,
      search,
      ours,
      status,
      dateFrom,
      dateTo,
    } = req.query;

    // Если передан take, используем старую логику для совместимости
    if (take) {
      const events = await prisma.events.findMany({
        orderBy: { createdAt: "desc" },
        take: parseInt(take as string),
        where: { isPublished: true },
      });
      res.status(200).json(events);
      return;
    }

    // Новая логика с пагинацией и фильтрами
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const takeNum = parseInt(limit as string);

    const where: any = { isPublished: true };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        {
          shortDescription: { contains: search as string, mode: "insensitive" },
        },
      ];
    }

    if (ours !== undefined) {
      where.ours = ours === "true";
    }

    if (status !== undefined) {
      const now = new Date();
      if (status === "future") {
        where.startDate = { gte: now };
      } else if (status === "past") {
        where.startDate = { lt: now };
      }
    }

    if (dateFrom || dateTo) {
      where.startDate = where.startDate || {};
      if (dateFrom) {
        where.startDate.gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        const endDate = new Date(dateTo as string);
        endDate.setHours(23, 59, 59, 999); // Включаем весь день
        where.startDate.lte = endDate;
      }
    }

    const events = await prisma.events.findMany({
      where,
      orderBy: { startDate: "desc" },
      skip,
      take: takeNum,
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllEvents: RequestHandler = async (req, res) => {
  try {
    // Поддержка пагинации
    const page = parseInt(req.query._start as string) || 0;
    const limit = parseInt(req.query._end as string) || 10;
    const skip = page;
    const take = limit - page;

    // Поддержка сортировки
    const sortField = (req.query._sort as string) || "createdAt";
    const sortOrder =
      (req.query._order as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    // Поддержка поиска
    const searchQuery = req.query.q as string;
    const isPublished = req.query.isPublished;
    const ours = req.query.ours;
    const status = req.query.status;

    const where: any = {};

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { shortDescription: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished === "true";
    }

    if (ours !== undefined) {
      where.ours = ours === "true";
    }

    if (status !== undefined) {
      where.status = status === "true";
    }

    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    const [events, total] = await Promise.all([
      prisma.events.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.events.count({ where }),
    ]);

    // Устанавливаем заголовок для React Admin пагинации
    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEventById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    // Сначала пробуем найти по ID
    let event = await prisma.events.findUnique({
      where: { id: parseInt(id) },
      include: { registrations: true },
    });

    // Если не найдено по ID, пробуем по slug
    if (!event) {
      event = await prisma.events.findUnique({
        where: { slug: id },
        include: { registrations: true },
      });
    }

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEventById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    shortDescription,
    content,
    startDate,
    isPublished,
    status,
    ours,
    registrationEnabled,
    slug,
    metaTitle,
    metaDescription,
    eventLink,
  } = req.body;
  try {
    // Ищем мероприятие по ID
    const existingEvent = await prisma.events.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Проверяем, не занят ли новый slug другим мероприятием
    if (slug && slug !== existingEvent.slug) {
      const slugExists = await prisma.events.findUnique({ where: { slug } });
      if (slugExists) {
        res.status(400).json({ message: "Slug already exists" });
        return;
      }
    }

    let updatedStartDate = existingEvent.startDate;
    if (startDate) {
      updatedStartDate = new Date(startDate);
      if (isNaN(updatedStartDate.getTime())) {
        res.status(400).json({ message: "Invalid startDate format" });
        return;
      }
    }

    const updatedEvent = await prisma.events.update({
      where: { id: parseInt(id) },
      data: {
        title,
        shortDescription,
        content,
        startDate: updatedStartDate,
        isPublished: isPublished === "true" || isPublished === true,
        status: status === "true" || status === true,
        ours: ours === "true" || ours === true,
        registrationEnabled:
          registrationEnabled === "true" || registrationEnabled === true,
        slug: slug || existingEvent.slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        eventLink: eventLink || null,
      },
    });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEventById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const existingEvent = await prisma.events.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    await prisma.events.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event by id:", error);
    res.status(500).json({ message: "Internal server error" });
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
    registrationEnabled,
    slug,
    metaTitle,
    metaDescription,
    eventLink,
  } = req.body;
  try {
    if (!title || !slug || !startDate) {
      res
        .status(400)
        .json({ message: "Title, slug, and startDate are required" });
      return;
    }
    const existingEvent = await prisma.events.findUnique({ where: { slug } });
    if (existingEvent) {
      res.status(400).json({ message: "Slug already exists" });
      return;
    }

    const parsedStartDate = new Date(`${startDate}:00.000Z`);
    if (isNaN(parsedStartDate.getTime())) {
      res.status(400).json({ message: "Invalid startDate format" });
      return;
    }

    const newEvent = await prisma.events.create({
      data: {
        title,
        shortDescription,
        content,
        startDate: parsedStartDate,
        isPublished: isPublished === "true" || isPublished === true,
        status: status === "true" || status === true,
        ours: ours === "true" || ours === true,
        registrationEnabled:
          registrationEnabled === "true" || registrationEnabled === true,
        slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        eventLink: eventLink || null,
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
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
    registrationEnabled,
    slug: newSlug,
    metaTitle,
    metaDescription,
    eventLink,
  } = req.body;
  try {
    const existingEvent = await prisma.events.findUnique({ where: { slug } });
    if (!existingEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (newSlug && newSlug !== slug) {
      const slugExists = await prisma.events.findUnique({
        where: { slug: newSlug },
      });
      if (slugExists) {
        res.status(400).json({ message: "New slug already exists" });
        return;
      }
    }

    let updatedStartDate = existingEvent.startDate;
    if (startDate) {
      updatedStartDate = new Date(`${startDate}:00.000Z`);
      if (isNaN(updatedStartDate.getTime())) {
        res.status(400).json({ message: "Invalid startDate format" });
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
        isPublished: isPublished === "true" || isPublished === true,
        status: status === "true" || status === true,
        ours: ours === "true" || ours === true,
        registrationEnabled:
          registrationEnabled === "true" || registrationEnabled === true,
        slug: newSlug || slug,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        eventLink: eventLink || null,
      },
    });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getRecentEvents: RequestHandler = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const events = await prisma.events.findMany({
      where: {
        registrationEnabled: true,
        startDate: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        startDate: "desc",
      },
      select: {
        id: true,
        title: true,
        startDate: true,
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching recent events:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
