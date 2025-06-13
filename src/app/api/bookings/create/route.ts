import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Request Body:", body);

    const { patient_id, medication_ids, attendance_type, booking_StartdateTime, booking_EnddateTime } = body;

    if (!patient_id || !attendance_type || !booking_StartdateTime || !booking_EnddateTime) {
      console.error("Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the booking first
    const newBooking = await prisma.bookings.create({
      data: {
        patient_id,
        attendance_type,
        booking_StartdateTime: new Date(booking_StartdateTime),
        booking_EnddateTime: new Date(booking_EnddateTime),
      },
    });

    // Create medication relationships if medications are provided
    if (medication_ids && medication_ids.length > 0) {
      await prisma.bookingMedications.createMany({
        data: medication_ids.map((medication_id: number) => ({
          booking_id: newBooking.id,
          medication_id,
        })),
      });
    }

    console.log("New Booking Created:", newBooking);
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}