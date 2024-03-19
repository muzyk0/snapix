-- AlterTable
ALTER TABLE "Post"
    RENAME COLUMN "photoId" TO "imageId";

-- AlterTable
ALTER TABLE "Profile"
    ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "StorageTempFiles"
(
    "id"          SERIAL       NOT NULL,
    "referenceId" TEXT         NOT NULL,
    "expiresAt"   TIMESTAMP(3) NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageTempFiles_pkey" PRIMARY KEY ("id")
);
