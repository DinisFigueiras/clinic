import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

/**
 * Check if a patient ID already exists
 * GET /api/patients/check-id?id=123
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }

    const patientId = parseInt(id);
    if (isNaN(patientId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const exists = await withPrisma(async (prisma) => {
      const existingPatient = await prisma.patient.findFirst({
        where: { id: patientId }
      });
      return !!existingPatient;
    });

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error checking patient ID:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
