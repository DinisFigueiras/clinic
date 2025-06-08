import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); // Expect the booking ID in the request body

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const deletedBooking = await withPrisma(async (prisma) => {
      return await prisma.bookings.delete({
        where: { id },
      });
    });

    return NextResponse.json(deletedBooking, { status: 200 });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}