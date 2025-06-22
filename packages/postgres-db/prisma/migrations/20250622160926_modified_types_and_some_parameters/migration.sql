/*
  Warnings:

  - You are about to drop the `CryptoInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CryptoStudy` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `cryptoId` on the `CryptoData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cryptoId` on the `CryptoStats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CryptoInfo" DROP CONSTRAINT "CryptoInfo_cryptoId_fkey";

-- DropForeignKey
ALTER TABLE "CryptoStats" DROP CONSTRAINT "CryptoStats_cryptoId_fkey";

-- DropForeignKey
ALTER TABLE "CryptoStudy" DROP CONSTRAINT "CryptoStudy_cryptoId_fkey";

-- AlterTable
ALTER TABLE "CryptoData" DROP COLUMN "cryptoId",
ADD COLUMN     "cryptoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CryptoStats" DROP COLUMN "cryptoId",
ADD COLUMN     "cryptoId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CryptoInfo";

-- DropTable
DROP TABLE "CryptoStudy";

-- CreateTable
CREATE TABLE "CryptoUrls" (
    "cryptoId" INTEGER NOT NULL,
    "website" TEXT,
    "twitter" TEXT,
    "reddit" TEXT,
    "technicalDoc" TEXT,
    "sourceCode" TEXT
);

-- CreateTable
CREATE TABLE "CryptoAssets" (
    "cryptoId" INTEGER NOT NULL,
    "logo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date_added" TEXT NOT NULL,
    "date_launched" TEXT NOT NULL,
    "category" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoUrls_cryptoId_key" ON "CryptoUrls"("cryptoId");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAssets_cryptoId_key" ON "CryptoAssets"("cryptoId");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoData_cryptoId_key" ON "CryptoData"("cryptoId");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoStats_cryptoId_key" ON "CryptoStats"("cryptoId");

-- AddForeignKey
ALTER TABLE "CryptoStats" ADD CONSTRAINT "CryptoStats_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "CryptoData"("cryptoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CryptoUrls" ADD CONSTRAINT "CryptoUrls_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "CryptoData"("cryptoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CryptoAssets" ADD CONSTRAINT "CryptoAssets_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "CryptoData"("cryptoId") ON DELETE CASCADE ON UPDATE CASCADE;
