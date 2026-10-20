-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN     "consentAt" TIMESTAMP(3),
ADD COLUMN     "consentIp" TEXT,
ADD COLUMN     "consentText" TEXT;
