-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_managerId_fkey";

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "managerTechId" INTEGER,
ALTER COLUMN "managerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "department" TEXT,
ADD COLUMN     "photoUrl" TEXT;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_managerTechId_fkey" FOREIGN KEY ("managerTechId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
