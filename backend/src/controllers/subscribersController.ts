import { RequestHandler } from "express";
import { prisma } from "../utils";

export const getSubscribers: RequestHandler = async (req, res) => {
  try {
    // Поддержка пагинации для React Admin
    const page = parseInt(req.query._start as string) || 0;
    const limit = parseInt(req.query._end as string) || 10;
    const skip = page;
    const take = limit - page;

    // Поддержка сортировки с маппингом полей
    const sortFieldRaw = (req.query._sort as string) || "createdAt";
    const sortOrder =
      (req.query._order as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    // Маппинг полей из React Admin в Prisma
    const fieldMapping: Record<string, string> = {
      subscribedAt: "createdAt", // subscribedAt -> createdAt
      id: "id",
      email: "email",
      createdAt: "createdAt",
      isActive: "isActive",
    };

    // Валидация поля сортировки
    const allowedSortFields = ["id", "email", "createdAt", "isActive"];
    const mappedField = fieldMapping[sortFieldRaw] || sortFieldRaw;
    const sortField = allowedSortFields.includes(mappedField)
      ? mappedField
      : "createdAt";

    // Поддержка поиска
    const searchQuery = req.query.q as string;
    const isActive = req.query.isActive;

    const where: any = {};

    if (searchQuery) {
      where.email = { contains: searchQuery, mode: "insensitive" };
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    // Устанавливаем заголовки для React Admin пагинации
    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const getSubscriberById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    // Преобразуем ID в число, так как в БД это INT
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      res.status(400).json({ message: "Invalid subscriber ID" });
      return;
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: numericId },
    });

    if (!subscriber) {
      res.status(404).json({ message: "Subscriber not found" });
      return;
    }
    res.status(200).json(subscriber);
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const subscribeEmail: RequestHandler = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  // Простая валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  try {
    // Нормализуем email к нижнему регистру
    const normalizedEmail = email.toLowerCase().trim();

    // Проверяем, есть ли уже такой email в базе
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        res.status(409).json({ message: "Email already subscribed" });
        return;
      } else {
        // Если email был отписан ранее, активируем подписку снова
        const reactivatedSubscriber = await prisma.newsletterSubscriber.update({
          where: { id: existingSubscriber.id },
          data: { isActive: true, createdAt: new Date() },
        });
        res.status(200).json({
          message: "Successfully resubscribed",
          subscriber: reactivatedSubscriber,
        });
        return;
      }
    }

    // Создаем нового подписчика
    const newSubscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        isActive: true,
      },
    });

    res.status(201).json({
      message: "Successfully subscribed",
      subscriber: newSubscriber,
    });
  } catch (error) {
    console.error("Error subscribing email:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const unsubscribeEmail: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    // Преобразуем ID в число
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      res.status(400).json({ message: "Invalid subscriber ID" });
      return;
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: numericId },
    });

    if (!subscriber) {
      res.status(404).json({ message: "Subscriber not found" });
      return;
    }

    if (!subscriber.isActive) {
      res.status(400).json({ message: "Already unsubscribed" });
      return;
    }

    // Деактивируем подписку (не удаляем запись)
    const unsubscribedUser = await prisma.newsletterSubscriber.update({
      where: { id: numericId },
      data: { isActive: false },
    });

    res.status(200).json({
      message: "Successfully unsubscribed",
      subscriber: unsubscribedUser,
    });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const updateSubscriber: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { email, isActive } = req.body;

  try {
    // Преобразуем ID в число
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      res.status(400).json({ message: "Invalid subscriber ID" });
      return;
    }

    // Если меняется email, проверяем на дубликаты
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return;
      }

      // Нормализуем email
      const normalizedEmail = email.toLowerCase().trim();

      const existingSubscriber = await prisma.newsletterSubscriber.findFirst({
        where: {
          email: normalizedEmail,
          id: { not: numericId },
        },
      });

      if (existingSubscriber) {
        res.status(409).json({ message: "Email already exists" });
        return;
      }
    }

    const updatedSubscriber = await prisma.newsletterSubscriber.update({
      where: { id: numericId },
      data: {
        ...(email && { email: email.toLowerCase().trim() }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.status(200).json(updatedSubscriber);
  } catch (error) {
    console.error("Error updating subscriber:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const deleteSubscriber: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    // Преобразуем ID в число
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      res.status(400).json({ message: "Invalid subscriber ID" });
      return;
    }

    await prisma.newsletterSubscriber.delete({
      where: { id: numericId },
    });

    res.status(200).json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error("Error deleting subscriber:", error);

    // Более детальная обработка ошибок
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      res.status(404).json({ message: "Subscriber not found" });
      return;
    }

    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};