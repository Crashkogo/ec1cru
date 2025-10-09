#!/usr/bin/env node

/**
 * Скрипт для обработки запланированных рассылок
 * Запускается по cron каждые 5 минут для проверки и отправки запланированных рассылок
 * 
 * Пример cron задачи (каждые 5 минут):
 * */5 * * * * /usr/bin/node /path/to/your/backend/dist/scripts/processScheduledNewsletters.js
 */

import { PrismaClient } from '@prisma/client';
import { transporter } from '../utils/index.js';
import crypto from 'crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

// Очередь отправки для контроля скорости
interface EmailQueueItem {
  to: string;
  subject: string;
  html: string;
  unsubscribeId: string;
}

class ScheduledNewsletterProcessor {
  private readonly EMAILS_PER_MINUTE = 30; // Безопасный лимит
  private readonly BATCH_SIZE = 5; // Отправляем по 5 писем за раз
  
  private sentThisMinute = 0;
  private lastMinuteReset = Date.now();

  private canSendEmails(): boolean {
    const now = Date.now();
    if (now - this.lastMinuteReset >= 60000) {
      this.sentThisMinute = 0;
      this.lastMinuteReset = now;
    }
    return this.sentThisMinute < this.EMAILS_PER_MINUTE;
  }

  private generateUnsubscribeToken(subscriberId: string): string {
    return crypto.createHash('sha256')
      .update(subscriberId + process.env.JWT_SECRET + Date.now())
      .digest('hex');
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

  private async sendEmailBatch(emails: EmailQueueItem[]): Promise<void> {
    await Promise.all(emails.map(async (email) => {
      try {
        await transporter.sendMail({
          from: `"1С Поддержка" <no-reply@ec-1c.ru>`,
          to: email.to,
          subject: email.subject,
          html: email.html,
          // Заголовки для лучшей доставляемости
          headers: {
            'List-Unsubscribe': `<${process.env.FRONTEND_URL}/unsubscribe?token=${email.unsubscribeId}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            'X-Mailer': '1C Support Newsletter System',
          }
        });

        this.sentThisMinute++;
        console.log(`✓ Email sent to ${email.to}`);
      } catch (error) {
        console.error(`✗ Failed to send email to ${email.to}:`, error);
        throw error;
      }
    }));
  }

  async processScheduledCampaigns(): Promise<void> {
    try {
      console.log('🔍 Checking for scheduled newsletters...');
      
      const now = new Date();
      const scheduledCampaigns = await prisma.newsletterCampaign.findMany({
        where: {
          status: 'SCHEDULED',
          scheduledDate: {
            lte: now
          }
        },
        include: {
          template: true
        }
      });

      if (scheduledCampaigns.length === 0) {
        console.log('ℹ️  No scheduled campaigns found');
        return;
      }

      console.log(`📧 Found ${scheduledCampaigns.length} scheduled campaign(s)`);

      for (const campaign of scheduledCampaigns) {
        console.log(`\n📤 Processing campaign: "${campaign.subject}"`);
        
        try {
          // Получаем активных подписчиков
          const activeSubscribers = await prisma.newsletterSubscriber.findMany({
            where: { isActive: true }
          });

          if (activeSubscribers.length === 0) {
            console.log('⚠️  No active subscribers found');
            await prisma.newsletterCampaign.update({
              where: { id: campaign.id },
              data: { status: 'FAILED' }
            });
            continue;
          }

          // Обновляем статус на "отправляется"
          await prisma.newsletterCampaign.update({
            where: { id: campaign.id },
            data: { 
              status: 'SENDING',
              totalRecipients: activeSubscribers.length
            }
          });

          // Подготавливаем письма для отправки
          const emails: EmailQueueItem[] = activeSubscribers.map(subscriber => {
            const unsubscribeToken = this.generateUnsubscribeToken(subscriber.id);
            const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}&subscriber=${subscriber.id}`;
            
            return {
              to: subscriber.email,
              subject: campaign.subject,
              html: this.createEmailTemplate(campaign.template.htmlContent, unsubscribeUrl, campaign.template.title),
              unsubscribeId: unsubscribeToken
            };
          });

          // Отправляем по батчам с соблюдением лимитов
          let sent = 0;
          while (sent < emails.length && this.canSendEmails()) {
            const batch = emails.slice(sent, sent + this.BATCH_SIZE);
            
            await this.sendEmailBatch(batch);
            sent += batch.length;

            // Обновляем прогресс
            await prisma.newsletterCampaign.update({
              where: { id: campaign.id },
              data: { sentEmails: sent }
            });

            // Пауза между батчами
            if (sent < emails.length) {
              console.log(`⏳ Sent ${sent}/${emails.length} emails, pausing...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }

          // Обновляем финальный статус
          const finalStatus = sent === emails.length ? 'COMPLETED' : 'SENDING';
          await prisma.newsletterCampaign.update({
            where: { id: campaign.id },
            data: { 
              status: finalStatus,
              sentEmails: sent
            }
          });

          console.log(`✅ Campaign "${campaign.subject}" processed: ${sent}/${emails.length} emails sent`);

        } catch (error) {
          console.error(`❌ Error processing campaign "${campaign.subject}":`, error);
          
          // Обновляем статус на "ошибка"
          await prisma.newsletterCampaign.update({
            where: { id: campaign.id },
            data: { status: 'FAILED' }
          });
        }
      }

    } catch (error) {
      console.error('💥 Fatal error in newsletter processor:', error);
    }
  }
}

// Запуск скрипта
async function main() {
  console.log('🚀 Starting scheduled newsletter processor...');
  console.log(`📅 Current time: ${new Date().toISOString()}`);
  
  const processor = new ScheduledNewsletterProcessor();
  await processor.processScheduledCampaigns();
  
  console.log('✨ Newsletter processor finished');
  await prisma.$disconnect();
}

// Обработка ошибок
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Запуск
main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 