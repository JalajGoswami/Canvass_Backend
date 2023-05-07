/*
  Warnings:

  - You are about to alter the column `id` on the `UserPrefrence` table. The data in that column will be cast from `BigInt` to `Int`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `userId` on the `UserPrefrence` table. The data in that column will be cast from `BigInt` to `Int`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `authorId` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `categoryId` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Post` table. The data in that column will be cast from `BigInt` to `Int`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `appearance` on the `Tag` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Tag` table. The data in that column will be cast from `BigInt` to `Int`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `id` on the `Category` table. The data in that column will be cast from `BigInt` to `Int`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `id` on the `User` table. The data in that column will be cast from `BigInt` to `Int`. This cast may fail. Please make sure the data in the column can be cast.
  - Changed the type of `A` on the `_CategoryToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_CategoryToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_CategoryToUserPrefrence` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_CategoryToUserPrefrence` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_PostToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_PostToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_PostToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_PostToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToTag" DROP CONSTRAINT "_CategoryToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToTag" DROP CONSTRAINT "_CategoryToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToUserPrefrence" DROP CONSTRAINT "_CategoryToUserPrefrence_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToUserPrefrence" DROP CONSTRAINT "_CategoryToUserPrefrence_B_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "_PostToUser" DROP CONSTRAINT "_PostToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToUser" DROP CONSTRAINT "_PostToUser_B_fkey";

-- AlterTable
ALTER TABLE "_CategoryToTag" DROP COLUMN "A";
ALTER TABLE "_CategoryToTag" ADD COLUMN     "A" INT4 NOT NULL;
ALTER TABLE "_CategoryToTag" DROP COLUMN "B";
ALTER TABLE "_CategoryToTag" ADD COLUMN     "B" INT4 NOT NULL;

-- AlterTable
ALTER TABLE "_CategoryToUserPrefrence" DROP COLUMN "A";
ALTER TABLE "_CategoryToUserPrefrence" ADD COLUMN     "A" INT4 NOT NULL;
ALTER TABLE "_CategoryToUserPrefrence" DROP COLUMN "B";
ALTER TABLE "_CategoryToUserPrefrence" ADD COLUMN     "B" INT4 NOT NULL;

-- AlterTable
ALTER TABLE "_PostToTag" DROP COLUMN "A";
ALTER TABLE "_PostToTag" ADD COLUMN     "A" INT4 NOT NULL;
ALTER TABLE "_PostToTag" DROP COLUMN "B";
ALTER TABLE "_PostToTag" ADD COLUMN     "B" INT4 NOT NULL;

-- AlterTable
ALTER TABLE "_PostToUser" DROP COLUMN "A";
ALTER TABLE "_PostToUser" ADD COLUMN     "A" INT4 NOT NULL;
ALTER TABLE "_PostToUser" DROP COLUMN "B";
ALTER TABLE "_PostToUser" ADD COLUMN     "B" INT4 NOT NULL;

-- RedefineTables
CREATE TABLE "_prisma_new_UserPrefrence" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "userId" INT4 NOT NULL,

    CONSTRAINT "UserPrefrence_pkey" PRIMARY KEY ("id")
);
DROP INDEX "UserPrefrence_userId_key";
INSERT INTO "_prisma_new_UserPrefrence" ("id","userId") SELECT "id","userId" FROM "UserPrefrence";
DROP TABLE "UserPrefrence" CASCADE;
ALTER TABLE "_prisma_new_UserPrefrence" RENAME TO "UserPrefrence";
CREATE UNIQUE INDEX "UserPrefrence_userId_key" ON "UserPrefrence"("userId");
ALTER TABLE "UserPrefrence" ADD CONSTRAINT "UserPrefrence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE TABLE "_prisma_new_Post" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "authorId" INT4 NOT NULL,
    "body" STRING NOT NULL,
    "image" STRING,
    "categoryId" INT4 NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Post" ("authorId","body","categoryId","id","image") SELECT "authorId","body","categoryId","id","image" FROM "Post";
DROP TABLE "Post" CASCADE;
ALTER TABLE "_prisma_new_Post" RENAME TO "Post";
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE TABLE "_prisma_new_Tag" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "name" STRING NOT NULL,
    "appearance" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Tag" ("appearance","id","name") SELECT "appearance","id","name" FROM "Tag";
DROP TABLE "Tag" CASCADE;
ALTER TABLE "_prisma_new_Tag" RENAME TO "Tag";
CREATE TABLE "_prisma_new_Category" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "name" STRING NOT NULL,
    "image" STRING NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Category" ("id","image","name") SELECT "id","image","name" FROM "Category";
DROP TABLE "Category" CASCADE;
ALTER TABLE "_prisma_new_Category" RENAME TO "Category";
CREATE TABLE "_prisma_new_User" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "email" STRING NOT NULL,
    "user_name" STRING NOT NULL,
    "full_name" STRING NOT NULL,
    "password" STRING NOT NULL,
    "pofile_pic" STRING,
    "about" STRING,
    "website" STRING,
    "private" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
DROP INDEX "User_email_key";
DROP INDEX "User_user_name_key";
INSERT INTO "_prisma_new_User" ("about","created_at","email","full_name","id","password","pofile_pic","private","user_name","website") SELECT "about","created_at","email","full_name","id","password","pofile_pic","private","user_name","website" FROM "User";
DROP TABLE "User" CASCADE;
ALTER TABLE "_prisma_new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToTag_AB_unique" ON "_CategoryToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToTag_B_index" ON "_CategoryToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToUserPrefrence_AB_unique" ON "_CategoryToUserPrefrence"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToUserPrefrence_B_index" ON "_CategoryToUserPrefrence"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToUser_AB_unique" ON "_PostToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToUser_B_index" ON "_PostToUser"("B");

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTag" ADD CONSTRAINT "_CategoryToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTag" ADD CONSTRAINT "_CategoryToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToUserPrefrence" ADD CONSTRAINT "_CategoryToUserPrefrence_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToUserPrefrence" ADD CONSTRAINT "_CategoryToUserPrefrence_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPrefrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
