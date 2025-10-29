import { RequestHandler } from "express";
import { prisma } from "../utils";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { UNSUBSCRIBE_SECRET, FRONTEND_URL } from "../config";
import { newsletterService } from "../services/newsletterService";

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
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token as string, UNSUBSCRIBE_SECRET) as { id: number; iat: number; exp: number };

    // Проверяем, существует ли подписчик
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: decoded.id },
    });

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    // Проверяем, не отписан ли уже
    if (!subscriber.isActive) {
      return res.status(400).json({ message: "Already unsubscribed" });
    }

    // Отписываем
    await prisma.newsletterSubscriber.update({
      where: { id: decoded.id },
      data: { isActive: false },
    });

    res.status(200).json({ message: "Successfully unsubscribed" });
  } catch (error) {
    console.error("Error unsubscribing:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: "Token expired" });
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
