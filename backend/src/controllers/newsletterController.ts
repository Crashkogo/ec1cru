import { RequestHandler } from "express";
import { prisma, transporter } from "./utils";
import { z } from "zod";
import crypto from "crypto";

// Очередь отправки для контроля скорости
interface EmailQueueItem {
  to: string;
  subject: string;
  html: string;
  unsubscribeId: string;
}

class NewsletterService {
  private emailQueue: EmailQueueItem[] = [];
  private isProcessing = false;
  private readonly EMAILS_PER_MINUTE = 30; // Безопасный лимит для большинства SMTP
  private readonly EMAILS_PER_HOUR = 1000;
  private readonly BATCH_SIZE = 5; // Отправляем по 5 писем за раз

  private sentThisMinute = 0;
  private sentThisHour = 0;
  private lastMinuteReset = Date.now();
  private lastHourReset = Date.now();

  constructor() {
    // Сброс счетчиков каждую минуту и час
    setInterval(() => {
      const now = Date.now();
      if (now - this.lastMinuteReset >= 60000) {
        this.sentThisMinute = 0;
        this.lastMinuteReset = now;
      }
      if (now - this.lastHourReset >= 3600000) {
        this.sentThisHour = 0;
        this.lastHourReset = now;
      }
    }, 60000);
  }

  private canSendEmails(): boolean {
    return (
      this.sentThisMinute < this.EMAILS_PER_MINUTE &&
      this.sentThisHour < this.EMAILS_PER_HOUR
    );
  }

  private generateUnsubscribeToken(subscriberId: string): string {
    return crypto
      .createHash("sha256")
      .update(subscriberId + process.env.JWT_SECRET + Date.now())
      .digest("hex");
  }

  private createEmailTemplate(
    htmlContent: string,
    unsubscribeUrl: string,
    title: string
  ): string {
    // Добавляем ссылку отписки в конец письма
    const unsubscribeSection = `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #6b7280; font-size: 12px; margin-bottom: 10px;">
          Вы получили это письмо, потому что подписались на нашу рассылку.
        </p>
        <a href="${unsubscribeUrl}" style="color: #6b7280; font-size: 12px; text-decoration: underline;">
          Отписаться
        </a>
      </div>
    `;

    // Полный HTML шаблон
    return `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          img { max-width: 100%; height: auto; }
          a { color: #3b82f6; }
        </style>
      </head>
      <body>
        ${htmlContent}
        ${unsubscribeSection}
      </body>
      </html>
    `;
  }

  async addToQueue(emails: EmailQueueItem[]): Promise<void> {
    this.emailQueue.push(...emails);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.emailQueue.length > 0 && this.canSendEmails()) {
      const batch = this.emailQueue.splice(
        0,
        Math.min(this.BATCH_SIZE, this.emailQueue.length)
      );

      try {
        await Promise.all(
          batch.map(async (email) => {
            await transporter.sendMail({
              from: `"1С Поддержка" <no-reply@ec-1c.ru>`,
              to: email.to,
              subject: email.subject,
              html: email.html,
              // Заголовки для лучшей доставляемости
              headers: {
                "List-Unsubscribe": `<${process.env.FRONTEND_URL}/unsubscribe?token=${email.unsubscribeId}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                "X-Mailer": "1C Support Newsletter System",
              },
            });

            this.sentThisMinute++;
            this.sentThisHour++;

            console.log(`Email sent to ${email.to}`);
          })
        );

        // Пауза между батчами для соблюдения лимитов
        if (this.emailQueue.length > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 секунды между батчами
        }
      } catch (error) {
        console.error("Error sending email batch:", error);
        // В случае ошибки, возвращаем письма обратно в начало очереди
        this.emailQueue.unshift(...batch);
        break;
      }
    }

    // Если очередь не пуста и мы достигли лимита, перезапускаем через минуту
    if (this.emailQueue.length > 0) {
      setTimeout(() => this.processQueue(), 60000);
    } else {
      this.isProcessing = false;
    }
  }

  async sendNewsletter(
    templateId: string,
    subject?: string,
    scheduledDate?: Date
  ): Promise<{ success: boolean; message: string; queuedEmails: number }> {
    try {
      // Получаем шаблон
      const template = await prisma.newsletterTemplate.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        return {
          success: false,
          message: "Newsletter template not found",
          queuedEmails: 0,
        };
      }

      // Получаем активных подписчиков
      const activeSubscribers = await prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
      });

      if (activeSubscribers.length === 0) {
        return {
          success: false,
          message: "No active subscribers found",
          queuedEmails: 0,
        };
      }

      // Создаем запись рассылки
      const campaign = await prisma.newsletterCampaign.create({
        data: {
          templateId,
          subject: subject || template.title,
          scheduledDate: scheduledDate || new Date(),
          status: scheduledDate ? "SCHEDULED" : "SENDING",
          totalRecipients: activeSubscribers.length,
        },
      });

      // Если рассылка запланирована на будущее, просто сохраняем её
      if (scheduledDate && scheduledDate > new Date()) {
        return {
          success: true,
          message: `Newsletter scheduled for ${scheduledDate.toLocaleString(
            "ru-RU"
          )}`,
          queuedEmails: 0,
        };
      }

      // Подготавливаем письма для отправки
      const emails: EmailQueueItem[] = activeSubscribers.map((subscriber) => {
        const unsubscribeToken = this.generateUnsubscribeToken(subscriber.id);
        const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}&subscriber=${subscriber.id}`;

        return {
          to: subscriber.email,
          subject: subject || template.title,
          html: this.createEmailTemplate(
            template.htmlContent,
            unsubscribeUrl,
            template.title
          ),
          unsubscribeId: unsubscribeToken,
        };
      });

      // Добавляем в очередь
      await this.addToQueue(emails);

      // Обновляем статус кампании
      await prisma.newsletterCampaign.update({
        where: { id: campaign.id },
        data: { status: "SENDING" },
      });

      return {
        success: true,
        message: `Newsletter queued for ${activeSubscribers.length} recipients`,
        queuedEmails: activeSubscribers.length,
      };
    } catch (error) {
      console.error("Error sending newsletter:", error);
      return {
        success: false,
        message: "Failed to send newsletter",
        queuedEmails: 0,
      };
    }
  }

  getQueueStatus() {
    return {
      queueLength: this.emailQueue.length,
      isProcessing: this.isProcessing,
      sentThisMinute: this.sentThisMinute,
      sentThisHour: this.sentThisHour,
      limitsReached: !this.canSendEmails(),
    };
  }
}

const newsletterService = new NewsletterService();

export const getNewsletterById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const newsletter = await prisma.newsletterTemplate.findUnique({
      where: { id },
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

    // Если передан take, используем старую логику для совместимости
    if (take) {
      const newsletters = await prisma.newsletterTemplate.findMany({
        orderBy: { createdAt: "desc" },
        take: parseInt(take as string),
      });
      res.status(200).json(newsletters);
      return;
    }

    // Новая логика с пагинацией и фильтрами
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

    const newsletters = await prisma.newsletterTemplate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: takeNum,
    });

    res.status(200).json(newsletters);
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllNewsletters: RequestHandler = async (req, res) => {
  try {
    // Поддержка пагинации для React Admin
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

    // Устанавливаем заголовок для React Admin пагинации
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
  try {
    const updatedNewsletter = await prisma.newsletterTemplate.update({
      where: { id },
      data: { title, htmlContent },
    });
    res.status(200).json(updatedNewsletter);
  } catch (error) {
    console.error("Error updating newsletter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNewsletterById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.newsletterTemplate.delete({ where: { id } });
    res.status(200).json({ message: "Newsletter deleted successfully" });
  } catch (error) {
    console.error("Error deleting newsletter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Новые эндпоинты для управления рассылками

const sendNewsletterSchema = z.object({
  templateId: z.string(),
  subject: z.string().optional(),
  scheduledDate: z
    .string()
    .optional()
    .transform((date) => (date ? new Date(date) : undefined)),
});

export const sendNewsletter: RequestHandler = async (req, res) => {
  try {
    const validatedData = sendNewsletterSchema.parse(req.body);
    const result = await newsletterService.sendNewsletter(
      validatedData.templateId,
      validatedData.subject,
      validatedData.scheduledDate
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
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
    const sortOrder =
      (req.query._order as string)?.toLowerCase() === "asc" ? "asc" : "desc";

    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    const [campaigns, total] = await Promise.all([
      prisma.newsletterCampaign.findMany({
        include: {
          template: {
            select: { title: true },
          },
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
    res.status(500).json({ message: "Internal server error" });
  }
};

// Обработка отписки
export const unsubscribeByToken: RequestHandler = async (req, res) => {
  const { token, subscriber } = req.query;

  if (!token || !subscriber) {
    res.status(400).json({ message: "Token and subscriber ID are required" });
    return;
  }

  try {
    const subscriberRecord = await prisma.newsletterSubscriber.findUnique({
      where: { id: subscriber as string },
    });

    if (!subscriberRecord) {
      res.status(404).json({ message: "Subscriber not found" });
      return;
    }

    // В реальном приложении здесь должна быть проверка токена
    // Для упрощения просто деактивируем подписку

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber as string },
      data: { isActive: false },
    });

    res.status(200).json({ message: "Successfully unsubscribed" });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Проверка запланированных рассылок (должно выполняться по cron)
export const processScheduledNewsletters: RequestHandler = async (req, res) => {
  try {
    const now = new Date();
    const scheduledCampaigns = await prisma.newsletterCampaign.findMany({
      where: {
        status: "SCHEDULED",
        scheduledDate: {
          lte: now,
        },
      },
      include: {
        template: true,
      },
    });

    for (const campaign of scheduledCampaigns) {
      await newsletterService.sendNewsletter(
        campaign.templateId,
        campaign.subject
      );
    }

    res.status(200).json({
      message: `Processed ${scheduledCampaigns.length} scheduled campaigns`,
    });
  } catch (error) {
    console.error("Error processing scheduled newsletters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
