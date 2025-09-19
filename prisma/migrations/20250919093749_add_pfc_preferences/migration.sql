-- AlterTable
ALTER TABLE "User" ADD COLUMN     "allergens" TEXT[],
ADD COLUMN     "dislikedFoods" TEXT[],
ADD COLUMN     "targetCarbs" DOUBLE PRECISION,
ADD COLUMN     "targetFat" DOUBLE PRECISION,
ADD COLUMN     "targetProtein" DOUBLE PRECISION;
