import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { id, patient_id, medication_id, attendance_type, booking_StartdateTime, booking_EnddateTime } =
      await request.json();

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const updatedBooking = await prisma.bookings.update({
      where: { id },
      data: {
        patient_id,
        medication_id,
        attendance_type,
        booking_StartdateTime,
        booking_EnddateTime,
      },
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}