import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

/**
 * Creates a new booking with optional medication associations
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patient_id, medication_ids, attendance_type, booking_StartdateTime, booking_EnddateTime } = body;

    // Validate required fields
    if (!patient_id || !attendance_type || !booking_StartdateTime || !booking_EnddateTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newBooking = await withPrisma(async (prisma) => {
      // Create the booking
      const booking = await prisma.bookings.create({
        data: {
          patient_id,
          attendance_type,
          booking_StartdateTime: new Date(booking_StartdateTime),
          booking_EnddateTime: new Date(booking_EnddateTime),
        },
      });

      // Associate medications if provided
      if (medication_ids && medication_ids.length > 0) {
        await prisma.bookingMedications.createMany({
          data: medication_ids.map((medication_id: number) => ({
            booking_id: booking.id,
            medication_id,
          })),
        });
      }

      return booking;
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}