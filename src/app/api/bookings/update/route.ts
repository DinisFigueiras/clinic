import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { id, patient_id, medication_ids, attendance_type, booking_StartdateTime, booking_EnddateTime } =
      await request.json();

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Update the booking
    const updatedBooking = await prisma.bookings.update({
      where: { id },
      data: {
        patient_id,
        attendance_type,
        booking_StartdateTime,
        booking_EnddateTime,
      },
    });

    // Delete existing medication relationships
    await prisma.bookingMedications.deleteMany({
      where: { booking_id: id },
    });

    // Create new medication relationships if medications are provided
    if (medication_ids && medication_ids.length > 0) {
      await prisma.bookingMedications.createMany({
        data: medication_ids.map((medication_id: number) => ({
          booking_id: id,
          medication_id,
        })),
      });
    }

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}