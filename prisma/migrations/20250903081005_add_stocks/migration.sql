/*
  Warnings:

  - Added the required column `stocksBought` to the `item_bought_log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."item_bought_log" ADD COLUMN     "stocksBought" INTEGER NOT NULL;
