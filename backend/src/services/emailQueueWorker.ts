import { prisma } from '../utils/index.js';
import { getEmailProvider } from '../email/EmailProviderFactory.js';
import { FRONTEND_URL } from '../config.js';

const BATCH_SIZE = 5;
const POLL_INTERVAL_MS = 15_000;
const MAX_RETRIES = 3;

let isRunning = false;

export function startEmailQueueWorker(): void {
  if (isRunning) return;
  isRunning = true;
  console.info('EmailQueueWorker started');
  scheduleNext();
}

function scheduleNext(): void {
  setTimeout(processBatch, POLL_INTERVAL_MS);
}

async function processBatch(): Promise<void> {
  try {
    const jobs = await prisma.emailJob.findMany({
      where: {
        status: 'PENDING',
        scheduledAt: { lte: new Date() },
        retries: { lt: MAX_RETRIES },
      },
      orderBy: { createdAt: 'asc' },
      take: BATCH_SIZE,
    });

    if (jobs.length === 0) {
      scheduleNext();
      return;
    }

    // Mark as SENDING to prevent duplicate processing
    const ids = jobs.map((j) => j.id);
    await prisma.emailJob.updateMany({
      where: { id: { in: ids } },
      data: { status: 'SENDING' },
    });

    // Get provider once per batch (not per email)
    const provider = await getEmailProvider();

    await Promise.allSettled(
      jobs.map(async (job) => {
        const result = await provider.send({
          to: job.to,
          subject: job.subject,
          html: job.html,
          headers: {
            'List-Unsubscribe': `<${FRONTEND_URL}/unsubscribe?token=${job.trackingId}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        });

        if (result.success) {
          await prisma.emailJob.update({
            where: { id: job.id },
            data: { status: 'SENT', sentAt: new Date() },
          });

          await prisma.emailEvent.create({
            data: { jobId: job.id, type: 'SENT' },
          });

          if (job.campaignId) {
            await prisma.newsletterCampaign.update({
              where: { id: job.campaignId },
              data: { sentCount: { increment: 1 } },
            });
          }
        } else {
          const newRetries = job.retries + 1;
          const exhausted = newRetries >= MAX_RETRIES;

          await prisma.emailJob.update({
            where: { id: job.id },
            data: {
              status: exhausted ? 'FAILED' : 'PENDING',
              retries: newRetries,
              lastError: result.error,
            },
          });

          if (exhausted && job.campaignId) {
            await prisma.newsletterCampaign.update({
              where: { id: job.campaignId },
              data: { failedCount: { increment: 1 } },
            });
          }

          console.warn(
            `EmailJob ${job.id} failed (retry ${newRetries}/${MAX_RETRIES}): ${result.error}`
          );
        }
      })
    );

    await updateCampaignStatuses();
  } catch (err) {
    console.error('EmailQueueWorker batch error:', err);
  }

  scheduleNext();
}

async function updateCampaignStatuses(): Promise<void> {
  const campaigns = await prisma.newsletterCampaign.findMany({
    where: { status: 'SENDING' },
    include: {
      emailJobs: {
        where: { status: { in: ['PENDING', 'SENDING'] } },
        select: { id: true },
      },
    },
  });

  for (const campaign of campaigns) {
    if (campaign.emailJobs.length === 0) {
      await prisma.newsletterCampaign.update({
        where: { id: campaign.id },
        data: { status: campaign.sentCount > 0 ? 'COMPLETED' : 'FAILED' },
      });
      console.info(
        `Campaign ${campaign.id} finished: sent=${campaign.sentCount} failed=${campaign.failedCount}`
      );
    }
  }
}
