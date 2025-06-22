/*
  Warnings:

  - You are about to drop the column `message_board` on the `CryptoUrls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CryptoUrls" DROP COLUMN "message_board",
ADD COLUMN     "messageBoard" TEXT;
