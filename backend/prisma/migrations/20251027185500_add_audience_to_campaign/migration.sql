-- CreateEnum
CREATE TYPE "AudienceType" AS ENUM ('SUBSCRIBERS', 'EVENT_GUESTS');

-- AlterTable
ALTER TABLE "NewsletterCampaign" ADD COLUMN     "audienceEventId" INTEGER,
ADD COLUMN     "audienceType" "AudienceType" NOT NULL DEFAULT 'SUBSCRIBERS';
