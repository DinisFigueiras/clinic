import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { patientName } = await request.json();

    if (!patientName) {
      return NextResponse.json({ error: "Patient name is required" }, { status: 400 });
    }

    const patient = await prisma.patient.findFirst({
      where: { name: patientName },
      include: {
        Bookings: true, // Include all bookings for the patient
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient.Bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings by patient:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}