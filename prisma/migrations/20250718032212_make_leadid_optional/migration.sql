/*
  Warnings:

  - The `time` column on the `CallHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `notes` on table `CallHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nextAction` on table `CallHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nextFollowUp` on table `CallHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `CallLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CallLog" DROP CONSTRAINT "CallLog_leadId_fkey";

-- DropIndex
DROP INDEX "Lead_email_key";

-- AlterTable
ALTER TABLE "CallHistory" ALTER COLUMN "leadId" DROP NOT NULL,
ALTER COLUMN "leadName" DROP NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3),
DROP COLUMN "time",
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "notes" SET NOT NULL,
ALTER COLUMN "nextAction" SET NOT NULL,
ALTER COLUMN "nextFollowUp" SET NOT NULL,
ALTER COLUMN "nextFollowUp" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CallLog" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "notes" SET DATA TYPE TEXT,
ALTER COLUMN "nextFollowUpDate" SET DATA TYPE TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
