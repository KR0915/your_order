/*
  Warnings:

  - A unique constraint covering the columns `[combo]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `combo` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "combo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_combo_key" ON "Recipe"("combo");
