/*
  Warnings:

  - You are about to drop the column `code` on the `Confirmations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `Confirmations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `Confirmations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Confirmations" DROP COLUMN "code",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Confirmations_token_key" ON "Confirmations"("token");
