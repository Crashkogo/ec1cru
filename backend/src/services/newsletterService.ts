import { prisma, fs, path, __dirname } from "../utils/index.js";
import jwt from "jsonwebtoken";
import { UNSUBSCRIBE_SECRET, FRONTEND_URL } from "../config.js";
import { injectTracking } from "./trackingService.js";

// Типизация для аудитории
export type Audience =
  | { type: 'SUBSCRIBERS' }
  | { type: 'EVENT_GUESTS'; eventId: number };

class NewsletterService {
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

    const updatedHtml = htmlContent.replace(imgRegex, (match, prefix, quote, imgPath) => {
      const absoluteUrl = `${FRONTEND_URL}/uploads/${imgPath}`;
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
    // Используем абсолютные URL - работает в production, картинки раздаются с сервера
    const contentWithEmbeddedImages = this.convertImagesToAbsoluteUrls(htmlContent);

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

      // Check suppression list
      const suppressed = await prisma.suppressionList.findMany({
        where: { email: { in: recipients.map((r) => r.email) } },
        select: { email: true },
      });
      const suppressedEmails = new Set(suppressed.map((s) => s.email));
      const validRecipients = recipients.filter((r) => !suppressedEmails.has(r.email));

      if (validRecipients.length === 0) {
        return { success: false, message: "All recipients are suppressed", queuedEmails: 0 };
      }

      // Create campaign
      const campaign = await prisma.newsletterCampaign.create({
        data: {
          templateId,
          subject: subject || template.title,
          scheduledAt: scheduledAt || new Date(),
          status: scheduledAt && scheduledAt > new Date() ? 'SCHEDULED' : 'SENDING',
          audienceType: audience.type,
          audienceEventId: audience.type === 'EVENT_GUESTS' ? (audience as { type: 'EVENT_GUESTS'; eventId: number }).eventId : null,
          totalRecipients: validRecipients.length,
        },
      });

      // Create EmailJob records (one per recipient)
      for (const recipient of validRecipients) {
        const unsubToken = this.generateUnsubscribeToken(recipient.id);
        const unsubUrl = `${FRONTEND_URL}/unsubscribe?token=${unsubToken}`;
        const baseHtml = this.createEmailTemplate(template.htmlContent, unsubUrl, template.title);

        // Create job first to get auto-generated trackingId
        const job = await prisma.emailJob.create({
          data: {
            to: recipient.email,
            subject: subject || template.title,
            html: baseHtml,
            campaignId: campaign.id,
            scheduledAt: scheduledAt || new Date(),
          },
        });

        // Inject tracking pixel and link wrapping using the job's trackingId
        const trackedHtml = injectTracking(baseHtml, job.trackingId, FRONTEND_URL);
        await prisma.emailJob.update({
          where: { id: job.id },
          data: { html: trackedHtml },
        });
      }

      return {
        success: true,
        message: scheduledAt && scheduledAt > new Date()
          ? `Newsletter scheduled for ${scheduledAt.toLocaleString('ru-RU')}`
          : `Newsletter queued for ${validRecipients.length} recipients`,
        queuedEmails: validRecipients.length,
      };
    } catch (error) {
      console.error("Error sending newsletter:", error);
      return { success: false, message: "Failed to send newsletter", queuedEmails: 0 };
    }
  }

  async getQueueStatus() {
    const pending = await prisma.emailJob.count({ where: { status: 'PENDING' } });
    const sending = await prisma.emailJob.count({ where: { status: 'SENDING' } });
    return { pendingJobs: pending, sendingJobs: sending };
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

      // Check suppression list
      const suppressed = await prisma.suppressionList.findMany({
        where: { email: { in: recipients.map((r) => r.email) } },
        select: { email: true },
      });
      const suppressedEmails = new Set(suppressed.map((s) => s.email));
      const validRecipients = recipients.filter((r) => !suppressedEmails.has(r.email));

      // Сбрасываем счетчики и удаляем старые незавершенные задания
      await prisma.emailJob.deleteMany({
        where: { campaignId, status: { in: ['PENDING', 'FAILED'] } },
      });

      await prisma.newsletterCampaign.update({
        where: { id: campaignId },
        data: {
          status: 'SENDING',
          sentCount: 0,
          failedCount: 0,
          totalRecipients: validRecipients.length,
        }
      });

      // Создаем новые EmailJob записи
      for (const recipient of validRecipients) {
        const unsubscribeToken = this.generateUnsubscribeToken(recipient.id);
        const unsubscribeUrl = `${FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}`;
        const baseHtml = this.createEmailTemplate(campaign.template.htmlContent, unsubscribeUrl, campaign.template.title);

        // Create job first to get auto-generated trackingId
        const job = await prisma.emailJob.create({
          data: {
            to: recipient.email,
            subject: campaign.subject,
            html: baseHtml,
            campaignId: campaign.id,
            scheduledAt: new Date(),
          },
        });

        // Inject tracking pixel and link wrapping using the job's trackingId
        const trackedHtml = injectTracking(baseHtml, job.trackingId, FRONTEND_URL);
        await prisma.emailJob.update({
          where: { id: job.id },
          data: { html: trackedHtml },
        });
      }

      return { success: true, message: `Campaign retry queued for ${validRecipients.length} recipients` };
    } catch (error) {
      console.error("Error retrying campaign:", error);
      return { success: false, message: "Failed to retry campaign" };
    }
  }

  /**
   * Активирует уже существующую SCHEDULED кампанию: создаёт EmailJob записи и
   * переводит кампанию в статус SENDING. Вызывается из processScheduledNewsletters.
   */
  async activateScheduledCampaign(campaignId: number): Promise<{ success: boolean; message: string }> {
    try {
      const campaign = await prisma.newsletterCampaign.findUnique({
        where: { id: campaignId },
        include: { template: true },
      });
      if (!campaign) return { success: false, message: 'Campaign not found' };
      if (campaign.status !== 'SCHEDULED') return { success: false, message: 'Campaign is not SCHEDULED' };

      let recipients: { id: number; email: string }[] = [];
      if (campaign.audienceType === 'SUBSCRIBERS') {
        recipients = await prisma.newsletterSubscriber.findMany({ where: { isActive: true } });
      } else if (campaign.audienceType === 'EVENT_GUESTS' && campaign.audienceEventId) {
        const registrations = await prisma.eventsRegistration.findMany({
          where: { eventId: campaign.audienceEventId },
          select: { email: true },
          distinct: ['email'],
        });
        recipients = registrations.map((reg, index) => ({ id: index, email: reg.email }));
      }

      const suppressed = await prisma.suppressionList.findMany({
        where: { email: { in: recipients.map((r) => r.email) } },
        select: { email: true },
      });
      const suppressedEmails = new Set(suppressed.map((s) => s.email));
      const validRecipients = recipients.filter((r) => !suppressedEmails.has(r.email));

      await prisma.newsletterCampaign.update({
        where: { id: campaignId },
        data: { status: 'SENDING', totalRecipients: validRecipients.length },
      });

      for (const recipient of validRecipients) {
        const unsubToken = this.generateUnsubscribeToken(recipient.id);
        const unsubUrl = `${FRONTEND_URL}/unsubscribe?token=${unsubToken}`;
        const baseHtml = this.createEmailTemplate(campaign.template.htmlContent, unsubUrl, campaign.template.title);

        const job = await prisma.emailJob.create({
          data: {
            to: recipient.email,
            subject: campaign.subject,
            html: baseHtml,
            campaignId: campaign.id,
            scheduledAt: new Date(),
          },
        });

        const trackedHtml = injectTracking(baseHtml, job.trackingId, FRONTEND_URL);
        await prisma.emailJob.update({ where: { id: job.id }, data: { html: trackedHtml } });
      }

      return { success: true, message: `Campaign activated for ${validRecipients.length} recipients` };
    } catch (error) {
      console.error('Error activating scheduled campaign:', error);
      return { success: false, message: 'Failed to activate campaign' };
    }
  }

  /**
   * Отправка транзакционного письма (без рассылочного контекста, напрямую через провайдер)
   */
  async sendTransactional(to: string, subject: string, html: string): Promise<void> {
    const { getEmailProvider } = await import('../email/EmailProviderFactory.js');
    const provider = await getEmailProvider();
    await provider.send({ to, subject, html });
  }
}

export const newsletterService = new NewsletterService();
