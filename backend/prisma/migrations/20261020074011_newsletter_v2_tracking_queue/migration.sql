-- AlterTable
ALTER TABLE "NewsletterCampaign" ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "openCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRecipients" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "uniqueOpenCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unsubscribeCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "doubleOptInSentAt" TIMESTAMP(3),
ADD COLUMN     "name" TEXT,
ADD COLUMN     "source" TEXT,
ALTER COLUMN "isActive" SET DEFAULT false;

-- CreateTable
CREATE TABLE "email_jobs" (
    "id" SERIAL NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "campaignId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "retries" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "provider" TEXT NOT NULL DEFAULT 'smtp',
    "trackingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_events" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppression_list" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suppression_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "newsletter_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriber_tags" (
    "subscriberId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "subscriber_tags_pkey" PRIMARY KEY ("subscriberId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_jobs_trackingId_key" ON "email_jobs"("trackingId");

-- CreateIndex
CREATE UNIQUE INDEX "suppression_list_email_key" ON "suppression_list"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_tags_name_key" ON "newsletter_tags"("name");

-- AddForeignKey
ALTER TABLE "email_jobs" ADD CONSTRAINT "email_jobs_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "NewsletterCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "email_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriber_tags" ADD CONSTRAINT "subscriber_tags_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriber_tags" ADD CONSTRAINT "subscriber_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "newsletter_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
