/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,name,emailConfirmationId,profileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_name_emailConfirmationId_key";

-- Делаем колонку nullable
-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "profileId" INTEGER;

-- CreateTable
CREATE TABLE "Profile"
(
    "id"        SERIAL       NOT NULL,
    "userId"    INTEGER,
    "firstName" TEXT,
    "lastName"  TEXT,
    "birthDate" DATE,
    "city"      TEXT,
    "aboutMe"   TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- Обновляем профиль и привязываем к пользователю
INSERT INTO "Profile" ("userId", "updatedAt")
SELECT "id", CURRENT_TIMESTAMP
FROM "User";

-- Обновляем пользователя и привязываем к профилю
UPDATE "User"
SET "profileId" = (SELECT "id" FROM "Profile" WHERE "Profile"."userId" = "User"."id");

-- Делаем колонку nut nullable
ALTER TABLE "User"
    alter COLUMN "profileId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_key" ON "User" ("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_name_emailConfirmationId_profileId_key" ON "User" ("email", "name", "emailConfirmationId", "profileId");

-- AddForeignKey
ALTER TABLE "User"
    ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
