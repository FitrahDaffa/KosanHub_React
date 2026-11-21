-- CreateEnum
CREATE TYPE "ResidentStatus" AS ENUM ('ACTIVE', 'LEAVING');

-- AlterTable
ALTER TABLE "Resident" ADD COLUMN     "moveInDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "ResidentStatus" NOT NULL DEFAULT 'ACTIVE';
