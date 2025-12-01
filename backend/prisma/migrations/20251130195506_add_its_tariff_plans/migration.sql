-- CreateTable
CREATE TABLE "its_tariff_plans" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "rows" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "its_tariff_plans_pkey" PRIMARY KEY ("id")
);
