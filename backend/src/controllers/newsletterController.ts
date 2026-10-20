import { RequestHandler } from "express";
import { prisma } from "../utils/index.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { UNSUBSCRIBE_SECRET, FRONTEND_URL } from "../config.js";
import { newsletterService } from "../services/newsletterService.js";

export const getNewsletterById: RequestHandler = async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      res.status(400).json({ message: "Invalid Newsletter ID" });
      return;
    }
    try {
      const newsletter = await prisma.newsletterTemplate.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!newsletter) {
        res.status(404).json({ message: "Newsletter template not found" });
        return;
      }
      res.status(200).json(newsletter);
    } catch (error) {
      console.error("Error fetching newsletter by id:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getNewsletters: RequestHandler = async (req, res) => {
    try {
      const {
        page = "1",
        limit = "10",
        take,
        search,
        dateFrom,
        dateTo,
      } = req.query;
  
      if (take) {
        const newsletters = await prisma.newsletterTemplate.findMany({
          orderBy: { createdAt: "desc" },
          take: parseInt(take as string),
        });
        res.status(200).json(newsletters);
        return;
      }
  
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const takeNum = parseInt(limit as string);
  
      const where: any = {};
  
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: "insensitive" } },
        ];
      }
  
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) {
          where.createdAt.gte = new Date(dateFrom as string);
        }
        if (dateTo) {
          const endDate = new Date(dateTo as string);
          endDate.setHours(23, 59, 59, 999);
          where.createdAt.lte = endDate;
        }
      }
  
            const [newsletters, total] = await Promise.all([
              prisma.newsletterTemplate.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: takeNum,
              }),
              prisma.newsletterTemplate.count({ where }),
            ]);
      
            res.set("X-Total-Count", total.toString());
            res.set("Access-Control-Expose-Headers", "X-Total-Count");
      
            res.status(200).json(newsletters);    } catch (error) {
      console.error("Error fetching newsletters:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getAllNewsletters: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query._start as string) || 0;
      const limit = parseInt(req.query._end as string) || 10;
      const skip = page;
      const take = limit - page;
  
      const sortField = (req.query._sort as string) || "createdAt";
      const sortOrder =
        (req.query._order as string)?.toLowerCase() === "asc" ? "asc" : "desc";
  
      const searchQuery = req.query.q as string;
  
      const where: any = {};
  
      if (searchQuery) {
        where.OR = [{ title: { contains: searchQuery, mode: "insensitive" } }];
      }
  
      const orderBy: any = {};
      orderBy[sortField] = sortOrder;
  
      const [newsletters, total] = await Promise.all([
        prisma.newsletterTemplate.findMany({
          where,
          orderBy,
          skip,
          take,
        }),
        prisma.newsletterTemplate.count({ where }),
      ]);
  
      res.set("X-Total-Count", total.toString());
      res.set("Access-Control-Expose-Headers", "X-Total-Count");
  
      res.status(200).json(newsletters);
    } catch (error) {
      console.error("Error fetching all newsletters:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
export const createNewsletter: RequestHandler = async (req, res) => {
  const { title, htmlContent } = req.body;
  console.log("Attempting to create newsletter with data:", { title, htmlContent });
    try {
      const newNewsletter = await prisma.newsletterTemplate.create({
        data: {
          title,
          htmlContent,
        },
      });
      res.status(201).json(newNewsletter);
    } catch (error) {
      console.error("Error creating newsletter:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const updateNewsletterById: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { title, htmlContent } = req.body;

    // Проверяем наличие хотя бы одного поля для обновления
    if (!title && !htmlContent) {
      res.status(400).json({ message: "No fields to update" });
      return;
    }

    try {
      // Формируем объект обновления только с переданными полями
      const updateData: { title?: string; htmlContent?: string } = {};
      if (title !== undefined) updateData.title = title;
      if (htmlContent !== undefined) updateData.htmlContent = htmlContent;

      const updatedNewsletter = await prisma.newsletterTemplate.update({
        where: { id: parseInt(id) },
        data: updateData,
      });
      res.status(200).json(updatedNewsletter);
    } catch (error) {
      console.error("Error updating newsletter:", error);

      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ message: "Newsletter not found" });
        return;
      }

      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };
  
  export const deleteNewsletterById: RequestHandler = async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.newsletterTemplate.delete({ where: { id: parseInt(id) } });
      res.status(200).json({ message: "Newsletter deleted successfully" });
    } catch (error) {
      console.error("Error deleting newsletter:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

const sendNewsletterSchema = z.object({
  templateId: z.number(),
  subject: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  audience: z.union([
    z.object({ type: z.literal('SUBSCRIBERS') }),
    z.object({ type: z.literal('EVENT_GUESTS'), eventId: z.number() })
  ])
});

export const sendNewsletter: RequestHandler = async (req, res) => {
  try {
    const validatedData = sendNewsletterSchema.parse(req.body);
    const result = await newsletterService.sendNewsletter(
      validatedData.templateId,
      validatedData.audience,
      validatedData.subject,
      validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error", errors: error.errors });
    } else {
      console.error("Error in sendNewsletter:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getQueueStatus: RequestHandler = async (req, res) => {
  try {
    const status = newsletterService.getQueueStatus();
    res.status(200).json(status);
  } catch (error) {
    console.error("Error getting queue status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCampaigns: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query._start as string) || 0;
    const limit = parseInt(req.query._end as string) || 10;
    const skip = page;
    const take = limit - page;

    const sortField = (req.query._sort as string) || "createdAt";
    const sortOrder = (req.query._order as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    console.log("getCampaigns - Query Params:", req.query);
    console.log("getCampaigns - Parsed:", { page, limit, skip, take, sortField, sortOrder });

    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    const [campaigns, total] = await Promise.all([
      prisma.newsletterCampaign.findMany({
        include: {
          template: { select: { title: true } },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.newsletterCampaign.count(),
    ]);

    res.set("X-Total-Count", total.toString());
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const unsubscribeByToken: RequestHandler = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    res.status(400).json({ message: "Token is required" });
    return;
  }

  try {
    const decoded = jwt.verify(token as string, UNSUBSCRIBE_SECRET) as { id: number; iat: number; exp: number };

    // Проверяем, существует ли подписчик
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: decoded.id },
    });

    if (!subscriber) {
      res.status(404).json({ message: "Subscriber not found" });
      return;
    }

    // Проверяем, не отписан ли уже
    if (!subscriber.isActive) {
      res.status(400).json({ message: "Already unsubscribed" });
      return;
    }

    // Отписываем
    await prisma.newsletterSubscriber.update({
      where: { id: decoded.id },
      data: { isActive: false },
    });

    // Add to suppression list to prevent future sends
    await prisma.suppressionList.upsert({
      where: { email: subscriber.email },
      update: {},
      create: { email: subscriber.email, reason: 'UNSUBSCRIBED' },
    });

    res.status(200).json({ message: "Successfully unsubscribed" });
  } catch (error) {
    console.error("Error unsubscribing:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: "Token expired" });
      return;
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Тестовый эндпоинт для предпросмотра рассылки с преобразованными картинками
export const previewNewsletter: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await prisma.newsletterTemplate.findUnique({
      where: { id: parseInt(id) },
    });

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    // Используем newsletterService для создания email
    const testUnsubscribeUrl = `${FRONTEND_URL}/unsubscribe?token=test-token`;

    // Используем публичный метод для предпросмотра
    const emailHtml = newsletterService.generatePreviewHtml(
      template.htmlContent,
      testUnsubscribeUrl,
      template.title
    );

    // Возвращаем HTML для просмотра в браузере
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(emailHtml);
  } catch (error) {
    console.error("Error previewing newsletter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const processScheduledNewsletters: RequestHandler = async (req, res) => {
  try {
    const now = new Date();
    const scheduledCampaigns = await prisma.newsletterCampaign.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: { lte: now },
      },
    });

    for (const campaign of scheduledCampaigns) {
        const audience: any = campaign.audienceType === 'EVENT_GUESTS' && campaign.audienceEventId
            ? { type: 'EVENT_GUESTS', eventId: campaign.audienceEventId }
            : { type: 'SUBSCRIBERS' };

        await newsletterService.sendNewsletter(
            campaign.templateId,
            audience,
            campaign.subject
        );
    }

    res.status(200).json({ message: `Processed ${scheduledCampaigns.length} scheduled campaigns` });
  } catch (error) {
    console.error("Error processing scheduled newsletters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const subscribeNewsletter: RequestHandler = async (req, res) => {
  const { email, name, source } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ message: 'Invalid email' });
    return;
  }

  try {
    // Check suppression list
    const suppressed = await prisma.suppressionList.findUnique({ where: { email } });
    if (suppressed) {
      // Return 200 to not reveal suppression status to potential spammers
      res.status(200).json({ message: 'Confirmation email sent' });
      return;
    }

    // Check if already confirmed
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.confirmedAt) {
      res.status(200).json({ message: 'Already subscribed' });
      return;
    }

    // Generate confirmation token
    const token = jwt.sign({ email }, UNSUBSCRIBE_SECRET, { expiresIn: '7d' });

    // Upsert subscriber (unconfirmed state)
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { token, doubleOptInSentAt: new Date(), name: name || undefined },
      create: {
        email,
        name: name || null,
        source: source || null,
        token,
        isActive: false,
        doubleOptInSentAt: new Date(),
      },
    });

    // Send confirmation email
    const confirmUrl = `${FRONTEND_URL}/confirm?token=${token}`;
    const html = `
      <!DOCTYPE html>
      <html lang="ru">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #1e40af;">Подтверждение подписки</h2>
        <p>Здравствуйте${name ? `, ${name}` : ''}!</p>
        <p>Вы оставили заявку на подписку на рассылку <strong>Инженер-центр</strong>.</p>
        <p>Для подтверждения нажмите кнопку:</p>
        <p>
          <a href="${confirmUrl}"
             style="background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;">
            Подтвердить подписку
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px;">Ссылка действительна 7 дней. Если вы не подписывались - просто проигнорируйте это письмо.</p>
      </body>
      </html>
    `;

    await newsletterService.sendTransactional(email, 'Подтвердите подписку на рассылку', html);

    res.status(200).json({ message: 'Confirmation email sent' });
  } catch (error) {
    console.error('Error in subscribeNewsletter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const confirmSubscription: RequestHandler = async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ message: 'Token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, UNSUBSCRIBE_SECRET) as { email: string };
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: decoded.email },
    });

    if (!subscriber) {
      res.status(404).json({ message: 'Subscriber not found' });
      return;
    }

    if (subscriber.confirmedAt) {
      res.status(200).json({ message: 'Already confirmed' });
      return;
    }

    await prisma.newsletterSubscriber.update({
      where: { email: decoded.email },
      data: { isActive: true, confirmedAt: new Date() },
    });

    res.status(200).json({ message: 'Subscription confirmed successfully' });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }
    console.error('Error in confirmSubscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCampaignStats: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid campaign id' });
    return;
  }

  try {
    const campaign = await prisma.newsletterCampaign.findUnique({ where: { id } });
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    const totalSent = campaign.sentCount;
    const openRate = totalSent > 0
      ? ((campaign.openCount / totalSent) * 100).toFixed(1)
      : '0.0';
    const clickRate = totalSent > 0
      ? ((campaign.clickCount / totalSent) * 100).toFixed(1)
      : '0.0';
    const unsubRate = totalSent > 0
      ? ((campaign.unsubscribeCount / totalSent) * 100).toFixed(1)
      : '0.0';

    res.status(200).json({
      ...campaign,
      openRate: `${openRate}%`,
      clickRate: `${clickRate}%`,
      unsubRate: `${unsubRate}%`,
    });
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const retryCampaign: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      res.status(400).json({ message: "Invalid campaign ID" });
      return;
    }

    const result = await newsletterService.retryCampaign(parseInt(id));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error retrying campaign:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
