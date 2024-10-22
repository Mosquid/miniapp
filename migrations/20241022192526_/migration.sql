/*
  Warnings:

  - You are about to alter the column `tokensEarned` on the `game_results` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,6)` to `Decimal(20,2)`.

*/
-- AlterTable
ALTER TABLE "game_results" ALTER COLUMN "tokensEarned" SET DATA TYPE DECIMAL(20,2);
