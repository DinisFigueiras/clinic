import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testCreateBooking() {
  try {
    const newBooking = await prisma.bookings.create({
      data: {
        patient_id: 1, // Replace with a valid patient ID
        medication_id: 1, // Replace with a valid medication ID or null
        attendance_type: "Clinica", // Replace with a valid enum value
        booking_StartdateTime: new Date("2025-05-06T10:00:00Z"),
        booking_EnddateTime: new Date("2025-05-06T11:00:00Z"),
      },
    });
    console.log("New Booking Created:", newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testCreateBooking();