/*
  Warnings:

  - A unique constraint covering the columns `[referenceId]` on the table `StorageTempFiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StorageTempFiles_referenceId_key" ON "StorageTempFiles"("referenceId");
