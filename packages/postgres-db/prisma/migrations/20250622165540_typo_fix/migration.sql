/*
  Warnings:

  - You are about to drop the column `date_added` on the `CryptoAssets` table. All the data in the column will be lost.
  - You are about to drop the column `date_launched` on the `CryptoAssets` table. All the data in the column will be lost.
  - Added the required column `dateAdded` to the `CryptoAssets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateLaunched` to the `CryptoAssets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CryptoAssets" DROP COLUMN "date_added",
DROP COLUMN "date_launched",
ADD COLUMN     "dateAdded" TEXT NOT NULL,
ADD COLUMN     "dateLaunched" TEXT NOT NULL;
