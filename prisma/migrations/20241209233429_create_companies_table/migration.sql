-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "corporate_name" VARCHAR(100) NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "companies"("cnpj");
