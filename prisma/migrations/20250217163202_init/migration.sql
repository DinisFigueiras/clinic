-- CreateEnum
CREATE TYPE "PatientStat" AS ENUM ('Reformado', 'Ativo');

-- CreateEnum
CREATE TYPE "PatientAttendance" AS ENUM ('Clinica', 'Domicilio');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Masculino', 'Feminino');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "mobile_phone" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "state_type" "PatientStat" NOT NULL,
    "attendance_type" "PatientAttendance" NOT NULL,
    "observations" TEXT,
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "supplier" TEXT NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookings" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "medication_id" INTEGER,
    "attendance_type" "PatientAttendance" NOT NULL,
    "booking_StartdateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "booking_EnddateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mobile_phone_key" ON "Patient"("mobile_phone");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_nif_key" ON "Patient"("nif");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_name_key" ON "Medication"("name");

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "Medication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
