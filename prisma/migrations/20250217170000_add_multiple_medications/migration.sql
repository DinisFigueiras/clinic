-- CreateTable
CREATE TABLE "BookingMedications" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "medication_id" INTEGER NOT NULL,

    CONSTRAINT "BookingMedications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingMedications_booking_id_medication_id_key" ON "BookingMedications"("booking_id", "medication_id");

-- AddForeignKey
ALTER TABLE "BookingMedications" ADD CONSTRAINT "BookingMedications_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingMedications" ADD CONSTRAINT "BookingMedications_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "Medication"("id") ON UPDATE CASCADE;

-- Migrate existing data: Copy all existing booking-medication relationships to the new table
-- This preserves ALL existing data
INSERT INTO "BookingMedications" (booking_id, medication_id)
SELECT id, medication_id 
FROM "Bookings" 
WHERE medication_id IS NOT NULL;
