-- CreateIndex
CREATE INDEX "email_jobs_status_scheduledAt_retries_idx" ON "email_jobs"("status", "scheduledAt", "retries");
