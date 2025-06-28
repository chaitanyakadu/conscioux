-- CreateEnum
CREATE TYPE "ECountries" AS ENUM ('UnitedStates', 'India', 'China', 'Japan', 'Germany', 'UnitedKingdom', 'France', 'Brazil', 'Canada', 'Russia', 'SouthKorea', 'Australia');

-- CreateEnum
CREATE TYPE "ESubscription" AS ENUM ('Free', 'Premium', 'Infinity');

-- CreateEnum
CREATE TYPE "ECurrency" AS ENUM ('DOLLAR');

-- CreateEnum
CREATE TYPE "ELanguage" AS ENUM ('English');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "userName" TEXT,
    "image" TEXT,
    "email" TEXT NOT NULL,
    "verifiedEmail" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "userId" TEXT NOT NULL,
    "watchlist" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "device" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "country" "ECountries" NOT NULL DEFAULT 'India',
    "language" "ELanguage" NOT NULL DEFAULT 'English',
    "currency" "ECurrency" NOT NULL DEFAULT 'DOLLAR',
    "subscription" "ESubscription" NOT NULL DEFAULT 'Free',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoStats" (
    "cryptoId" TEXT NOT NULL,
    "viewsDaily" INTEGER NOT NULL DEFAULT 0,
    "bull" INTEGER NOT NULL DEFAULT 0,
    "bear" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "CryptoData" (
    "cryptoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CryptoInfo" (
    "cryptoId" TEXT NOT NULL,
    "website" TEXT,
    "twitter" TEXT,
    "reddit" TEXT,
    "technicalDoc" TEXT,
    "sourceCode" TEXT
);

-- CreateTable
CREATE TABLE "CryptoStudy" (
    "cryptoId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateLaunched" TEXT,
    "infiniteSupply" BOOLEAN
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoStats_cryptoId_key" ON "CryptoStats"("cryptoId");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoData_cryptoId_key" ON "CryptoData"("cryptoId");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoInfo_cryptoId_key" ON "CryptoInfo"("cryptoId");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoStudy_cryptoId_key" ON "CryptoStudy"("cryptoId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CryptoStats" ADD CONSTRAINT "CryptoStats_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "CryptoData"("cryptoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CryptoInfo" ADD CONSTRAINT "CryptoInfo_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "CryptoData"("cryptoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CryptoStudy" ADD CONSTRAINT "CryptoStudy_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "CryptoData"("cryptoId") ON DELETE CASCADE ON UPDATE CASCADE;
