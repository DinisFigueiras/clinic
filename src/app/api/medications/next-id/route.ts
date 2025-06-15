import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

/**
 * Gets the next available medication ID
 */
export async function GET() {
  try {
    const nextId = await withPrisma(async (prisma) => {
      // Get the highest current ID
      const lastMedication = await prisma.medication.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true }
      });
      
      // Return next ID (highest + 1, or 1 if no medications exist)
      return lastMedication ? lastMedication.id + 1 : 1;
    });

    return NextResponse.json({ nextId });
  } catch (error) {
    console.error("Error getting next medication ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
