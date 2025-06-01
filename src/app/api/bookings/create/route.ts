import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Request Body:", body);

    const { patient_id, medication_id, attendance_type, booking_StartdateTime, booking_EnddateTime } = body;

    if (!patient_id || !attendance_type || !booking_StartdateTime || !booking_EnddateTime) {
      console.error("Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newBooking = await prisma.bookings.create({
      data: {
        patient_id,
        medication_id,
        attendance_type,
        booking_StartdateTime: new Date(booking_StartdateTime),
        booking_EnddateTime: new Date(booking_EnddateTime),
      },
    });

    console.log("New Booking Created:", newBooking);
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}