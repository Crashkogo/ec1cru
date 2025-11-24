-- AlterTable
ALTER TABLE "CompanyLife" ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pinnedUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pinnedUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pinnedUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Promotions" ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pinnedUntil" TIMESTAMP(3);
