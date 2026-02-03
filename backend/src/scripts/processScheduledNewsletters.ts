#!/usr/bin/env node

/**
 * Скрипт для обработки запланированных рассылок
 * Запускается по cron каждые 5 минут для проверки и отправки запланированных рассылок
 *
 * Пример cron задачи (каждые 5 минут):
 * 0,5,10,15,20,25,30,35,40,45,50,55 * * * * /usr/bin/node /path/to/your/backend/dist/scripts/processScheduledNewsletters.js
 */

import { PrismaClient } from '@prisma/client';
import { newsletterService } from '../services/newsletterService.js';
import 'dotenv/config';

const prisma = new PrismaClient();

async function processCampaigns() {
  try {
    console.log('🔍 Checking for scheduled newsletters...');
    
    const now = new Date();
    const scheduledCampaigns = await prisma.newsletterCampaign.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: now
        }
      },
    });

    if (scheduledCampaigns.length === 0) {
      console.log('ℹ️  No scheduled campaigns found');
      return;
    }

    console.log(`📧 Found ${scheduledCampaigns.length} scheduled campaign(s)`);

    for (const campaign of scheduledCampaigns) {
      console.log(`
📤 Processing campaign: "${campaign.subject}"`);
      
      try {
        const audience = campaign.audienceType === 'EVENT_GUESTS' && campaign.audienceEventId
            ? { type: 'EVENT_GUESTS' as const, eventId: campaign.audienceEventId }
            : { type: 'SUBSCRIBERS' as const };

        await newsletterService.sendNewsletter(
            campaign.templateId,
            audience,
            campaign.subject
        );

        console.log(`✅ Campaign "${campaign.subject}" processed successfully.`);

      } catch (error) {
        console.error(`❌ Error processing campaign "${campaign.subject}":`, error);
        
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

async function main() {
  console.log('🚀 Starting scheduled newsletter processor...');
  console.log(`📅 Current time: ${new Date().toISOString()}`);
  
  await processCampaigns();
  
  console.log('✨ Newsletter processor finished');
  await prisma.$disconnect();
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});