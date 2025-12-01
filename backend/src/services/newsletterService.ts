import { prisma, transporter, fs, path, __dirname } from "../utils";
import jwt from "jsonwebtoken";
import { UNSUBSCRIBE_SECRET, FRONTEND_URL, EMAIL_USER } from "../config";

// Типизация для аудитории
export type Audience =
  | { type: 'SUBSCRIBERS' }
  | { type: 'EVENT_GUESTS'; eventId: number };

// Очередь отправки для контроля скорости
interface EmailQueueItem {
  to: string;
  subject: string;
  html: string;
  unsubscribeToken: string;
  campaignId: number;
  retries: number;
}

class NewsletterService {
  private emailQueue: EmailQueueItem[] = [];
  private isProcessing = false;
  private readonly EMAILS_PER_MINUTE = 30;
  private readonly EMAILS_PER_HOUR = 1000;
  private readonly BATCH_SIZE = 5;

  private sentThisMinute = 0;
  private sentThisHour = 0;
  private lastMinuteReset = Date.now();
  private lastHourReset = Date.now();

  constructor() {
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

  private generateUnsubscribeToken(subscriberId: number): string {
    return jwt.sign({ id: subscriberId }, UNSUBSCRIBE_SECRET, { expiresIn: '30d' });
  }

  /**
   * БЕЗОПАСНОСТЬ: Преобразует картинки в Data URI (Base64) для встраивания в email
   * Это работает везде, включая localhost, так как картинки встроены в HTML
   */
  private convertImagesToDataUri(htmlContent: string): string {
    const imgRegex = /(<img[^>]+src=)(["'])\/uploads\/([^"']+)\2/gi;

    const updatedHtml = htmlContent.replace(imgRegex, (match, prefix, quote, relativePath) => {
      try {
        // Путь к файлу на сервере
        const filePath = path.join(__dirname, "../../frontend/public/uploads", relativePath);

        // БЕЗОПАСНОСТЬ: Удалено логирование путей файловой системы
        // Проверяем существование файла
        if (!fs.existsSync(filePath)) {
          // Возвращаем абсолютный URL как fallback
          return `${prefix}${quote}${FRONTEND_URL}/uploads/${relativePath}${quote}`;
        }

        // Читаем файл и конвертируем в Base64
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = imageBuffer.toString('base64');

        // Определяем MIME тип по расширению
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes: { [key: string]: string } = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml'
        };
        const mimeType = mimeTypes[ext] || 'image/jpeg';

        // Создаем Data URI
        const dataUri = `data:${mimeType};base64,${base64Image}`;

        return `${prefix}${quote}${dataUri}${quote}`;
      } catch (error) {
        // БЕЗОПАСНОСТЬ: Не логируем детали ошибок в production
        // В случае ошибки возвращаем абсолютный URL
        return `${prefix}${quote}${FRONTEND_URL}/uploads/${relativePath}${quote}`;
      }
    });

    return updatedHtml;
  }

  /**
   * БЕЗОПАСНОСТЬ: Преобразует относительные пути картинок в абсолютные URL
   * Используется как fallback или для предпросмотра
   */
  private convertImagesToAbsoluteUrls(htmlContent: string): string {
    const imgRegex = /(<img[^>]+src=)(["'])\/uploads\/([^"']+)\2/gi;

    const updatedHtml = htmlContent.replace(imgRegex, (match, prefix, quote, path) => {
      const absoluteUrl = `${FRONTEND_URL}/uploads/${path}`;
      // БЕЗОПАСНОСТЬ: Удалено логирование путей
      return `${prefix}${quote}${absoluteUrl}${quote}`;
    });

    return updatedHtml;
  }

  /**
   * Публичный метод для предпросмотра email шаблона
   */
  public generatePreviewHtml(htmlContent: string, unsubscribeUrl: string, title: string): string {
    return this.createEmailTemplate(htmlContent, unsubscribeUrl, title);
  }

  private createEmailTemplate(
    htmlContent: string,
    unsubscribeUrl: string,
    title: string
  ): string {
    // Встраиваем картинки как Data URI (Base64) - работает везде, включая localhost
    const contentWithEmbeddedImages = this.convertImagesToDataUri(htmlContent);

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
        ${contentWithEmbeddedImages}
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

      const results = await Promise.allSettled(
        batch.map(async (email) => {
          try {
            await transporter.sendMail({
              from: `"1С Поддержка" <${EMAIL_USER}>`,
              to: email.to,
              subject: email.subject,
              html: email.html,
              headers: {
                "List-Unsubscribe": `<${FRONTEND_URL}/unsubscribe?token=${email.unsubscribeToken}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                "X-Mailer": "1C Support Newsletter System",
              },
            });

            this.sentThisMinute++;
            this.sentThisHour++;

            // Обновляем счетчик успешных отправок в кампании
            await prisma.newsletterCampaign.update({
              where: { id: email.campaignId },
              data: {
                sentCount: { increment: 1 }
              }
            });

            console.log(`Email sent to ${email.to}`);
            return { success: true, email };
          } catch (error) {
            console.error(`Error sending email to ${email.to}:`, error);

            // Обновляем счетчик неудачных отправок
            await prisma.newsletterCampaign.update({
              where: { id: email.campaignId },
              data: {
                failedCount: { increment: 1 }
              }
            });

            return { success: false, email, error };
          }
        })
      );

      // Обрабатываем неудачные отправки
      const failedEmails = results
        .filter((result, index) =>
          result.status === 'rejected' ||
          (result.status === 'fulfilled' && !result.value.success)
        )
        .map((_, index) => batch[index])
        .filter(email => email.retries < 3); // Максимум 3 попытки

      // Возвращаем неудачные письма в очередь с увеличенным счетчиком попыток
      failedEmails.forEach(email => {
        this.emailQueue.push({ ...email, retries: email.retries + 1 });
      });

      if (this.emailQueue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    // Обновляем статусы кампаний
    await this.updateCampaignStatuses();

    if (this.emailQueue.length > 0) {
      setTimeout(() => this.processQueue(), 60000);
    } else {
      this.isProcessing = false;
    }
  }

  private async updateCampaignStatuses(): Promise<void> {
    try {
      const sendingCampaigns = await prisma.newsletterCampaign.findMany({
        where: { status: 'SENDING' }
      });

      for (const campaign of sendingCampaigns) {
        const hasQueuedEmails = this.emailQueue.some(email => email.campaignId === campaign.id);

        if (!hasQueuedEmails) {
          // Все письма обработаны
          const totalEmails = campaign.sentCount + campaign.failedCount;

          if (campaign.sentCount > 0 && campaign.failedCount === 0) {
            // Все успешно
            await prisma.newsletterCampaign.update({
              where: { id: campaign.id },
              data: { status: 'COMPLETED' }
            });
          } else if (campaign.sentCount === 0) {
            // Все провалились
            await prisma.newsletterCampaign.update({
              where: { id: campaign.id },
              data: { status: 'FAILED' }
            });
          } else {
            // Частично успешно - считаем завершенной
            await prisma.newsletterCampaign.update({
              where: { id: campaign.id },
              data: { status: 'COMPLETED' }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating campaign statuses:', error);
    }
  }

  async sendNewsletter(
    templateId: number,
    audience: Audience,
    subject?: string,
    scheduledAt?: Date
  ): Promise<{ success: boolean; message: string; queuedEmails: number }> {
    try {
      const template = await prisma.newsletterTemplate.findUnique({ where: { id: templateId } });
      if (!template) {
        return { success: false, message: "Newsletter template not found", queuedEmails: 0 };
      }

      let recipients: { id: number; email: string }[] = [];
      if (audience.type === 'SUBSCRIBERS') {
        recipients = await prisma.newsletterSubscriber.findMany({ where: { isActive: true } });
      } else if (audience.type === 'EVENT_GUESTS') {
        const registrations = await prisma.eventsRegistration.findMany({
          where: { eventId: audience.eventId },
          select: { email: true },
          distinct: ['email']
        });
        recipients = registrations.map((reg, index) => ({ id: index, email: reg.email }));
      }

      if (recipients.length === 0) {
        return { success: false, message: "No active recipients found for the selected audience", queuedEmails: 0 };
      }

      const campaign = await prisma.newsletterCampaign.create({
        data: {
          templateId,
          subject: subject || template.title,
          scheduledAt: scheduledAt || new Date(),
          status: scheduledAt ? "SCHEDULED" : "SENDING",
          audienceType: audience.type,
          audienceEventId: audience.type === 'EVENT_GUESTS' ? audience.eventId : null,
        },
      });

      if (scheduledAt && scheduledAt > new Date()) {
        return { success: true, message: `Newsletter scheduled for ${scheduledAt.toLocaleString("ru-RU")}`, queuedEmails: 0 };
      }

      const emails: EmailQueueItem[] = recipients.map((recipient) => {
        const unsubscribeToken = this.generateUnsubscribeToken(recipient.id);
        const unsubscribeUrl = `${FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}`;

        return {
          to: recipient.email,
          subject: subject || template.title,
          html: this.createEmailTemplate(template.htmlContent, unsubscribeUrl, template.title),
          unsubscribeToken,
          campaignId: campaign.id,
          retries: 0,
        };
      });

      await this.addToQueue(emails);

      await prisma.newsletterCampaign.update({
        where: { id: campaign.id },
        data: { status: "SENDING" },
      });

      return { success: true, message: `Newsletter queued for ${recipients.length} recipients`, queuedEmails: recipients.length };
    } catch (error) {
      console.error("Error sending newsletter:", error);
      return { success: false, message: "Failed to send newsletter", queuedEmails: 0 };
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

  async retryCampaign(campaignId: number): Promise<{ success: boolean; message: string }> {
    try {
      const campaign = await prisma.newsletterCampaign.findUnique({
        where: { id: campaignId },
        include: { template: true }
      });

      if (!campaign) {
        return { success: false, message: "Campaign not found" };
      }

      if (campaign.status !== 'FAILED' && campaign.status !== 'SENDING') {
        return { success: false, message: "Only FAILED or stuck SENDING campaigns can be retried" };
      }

      // Получаем аудиторию заново
      let recipients: { id: number; email: string }[] = [];
      if (campaign.audienceType === 'SUBSCRIBERS') {
        recipients = await prisma.newsletterSubscriber.findMany({ where: { isActive: true } });
      } else if (campaign.audienceType === 'EVENT_GUESTS' && campaign.audienceEventId) {
        const registrations = await prisma.eventsRegistration.findMany({
          where: { eventId: campaign.audienceEventId },
          select: { email: true },
          distinct: ['email']
        });
        recipients = registrations.map((reg, index) => ({ id: index, email: reg.email }));
      }

      if (recipients.length === 0) {
        return { success: false, message: "No recipients found" };
      }

      // Сбрасываем счетчики
      await prisma.newsletterCampaign.update({
        where: { id: campaignId },
        data: {
          status: 'SENDING',
          sentCount: 0,
          failedCount: 0
        }
      });

      // Создаем новую очередь писем
      const emails: EmailQueueItem[] = recipients.map((recipient) => {
        const unsubscribeToken = this.generateUnsubscribeToken(recipient.id);
        const unsubscribeUrl = `${FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}`;

        return {
          to: recipient.email,
          subject: campaign.subject,
          html: this.createEmailTemplate(campaign.template.htmlContent, unsubscribeUrl, campaign.template.title),
          unsubscribeToken,
          campaignId: campaign.id,
          retries: 0,
        };
      });

      await this.addToQueue(emails);

      return { success: true, message: `Campaign retry queued for ${recipients.length} recipients` };
    } catch (error) {
      console.error("Error retrying campaign:", error);
      return { success: false, message: "Failed to retry campaign" };
    }
  }
}

export const newsletterService = new NewsletterService();
