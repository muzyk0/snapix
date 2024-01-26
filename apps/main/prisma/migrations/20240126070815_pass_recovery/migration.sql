/*
  Warnings:

  - A unique constraint covering the columns `[passRecoveryId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,name,emailConfirmationId,passRecoveryId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_name_emailConfirmationId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passRecoveryId" TEXT;

-- CreateTable
CREATE TABLE "PassRecovery" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "codeExpirationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PassRecovery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PassRecovery_code_key" ON "PassRecovery"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PassRecovery_userId_key" ON "PassRecovery"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_passRecoveryId_key" ON "User"("passRecoveryId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_name_emailConfirmationId_passRecoveryId_key" ON "User"("email", "name", "emailConfirmationId", "passRecoveryId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_passRecoveryId_fkey" FOREIGN KEY ("passRecoveryId") REFERENCES "PassRecovery"("id") ON DELETE SET NULL ON UPDATE CASCADE;
