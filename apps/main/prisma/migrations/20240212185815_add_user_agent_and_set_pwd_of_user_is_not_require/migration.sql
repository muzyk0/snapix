-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "deviceName" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
