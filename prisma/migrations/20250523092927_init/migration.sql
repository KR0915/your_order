-- CreateTable
CREATE TABLE "test1" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test2" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test2_pkey" PRIMARY KEY ("id")
);
