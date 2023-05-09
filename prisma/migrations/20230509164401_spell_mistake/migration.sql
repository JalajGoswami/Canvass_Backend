/*
  Warnings:

  - You are about to drop the column `pofile_pic` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pofile_pic";
ALTER TABLE "User" ADD COLUMN     "profile_pic" STRING;
