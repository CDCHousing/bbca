-- CreateEnum
CREATE TYPE "ImageFit" AS ENUM ('COVER', 'CONTAIN');

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "category" TEXT,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "imageFit" "ImageFit" NOT NULL DEFAULT 'COVER',
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "HomeVideo" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeVideo_pkey" PRIMARY KEY ("id")
);
