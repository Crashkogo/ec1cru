import express, { RequestHandler } from 'express';
import { prisma } from '../utils/index.js';

const router = express.Router();

// 1x1 transparent GIF
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export const trackOpen: RequestHandler = async (req, res) => {
  const { trackingId } = req.params;

  // Return pixel immediately - don't block on DB
  res.set({
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
  });
  res.send(PIXEL);

  // Record asynchronously (fire and forget)
  setImmediate(async () => {
    try {
      const job = await prisma.emailJob.findUnique({ where: { trackingId } });
      if (!job) return;

      // Check if this job was already opened (for uniqueOpenCount)
      const alreadyOpened = await prisma.emailEvent.findFirst({
        where: { jobId: job.id, type: 'OPENED' },
        select: { id: true },
      });

      await prisma.emailEvent.create({
        data: {
          jobId: job.id,
          type: 'OPENED',
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        },
      });

      if (job.campaignId) {
        await prisma.newsletterCampaign.update({
          where: { id: job.campaignId },
          data: {
            openCount: { increment: 1 },
            ...(alreadyOpened ? {} : { uniqueOpenCount: { increment: 1 } }),
          },
        });
      }
    } catch {
      // Silent - tracking must never break delivery
    }
  });
};

export const trackClick: RequestHandler = async (req, res) => {
  const { trackingId } = req.params;
  const url = req.query.u as string;

  // Validate and redirect immediately
  const safeUrl = url && (url.startsWith('http://') || url.startsWith('https://')) ? url : '/';
  res.redirect(302, safeUrl);

  // Record asynchronously
  setImmediate(async () => {
    try {
      const job = await prisma.emailJob.findUnique({ where: { trackingId } });
      if (!job) return;

      await prisma.emailEvent.create({
        data: {
          jobId: job.id,
          type: 'CLICKED',
          url,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        },
      });

      if (job.campaignId) {
        await prisma.newsletterCampaign.update({
          where: { id: job.campaignId },
          data: { clickCount: { increment: 1 } },
        });
      }
    } catch {
      // Silent
    }
  });
};

router.get('/track/o/:trackingId', trackOpen);
router.get('/track/c/:trackingId', trackClick);

export default router;
