-- CreateTable
CREATE TABLE "EmailAddress" (
    "email" STRING NOT NULL,
    "verification_code" STRING NOT NULL,
    "isVerified" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "EmailAddress_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailAddress_email_key" ON "EmailAddress"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_email_fkey" FOREIGN KEY ("email") REFERENCES "EmailAddress"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
