/*
  Warnings:

  - Added the required column `category` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "participants" INTEGER NOT NULL DEFAULT 1;
