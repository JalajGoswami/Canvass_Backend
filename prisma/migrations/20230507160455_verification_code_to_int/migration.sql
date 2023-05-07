/*
  Warnings:

  - Changed the type of `verification_code` on the `EmailAddress` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "EmailAddress" DROP COLUMN "verification_code";
ALTER TABLE "EmailAddress" ADD COLUMN     "verification_code" INT4 NOT NULL;
