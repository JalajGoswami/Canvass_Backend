-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "aspect_ratio" FLOAT8;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "appearance" SET DEFAULT 1;
