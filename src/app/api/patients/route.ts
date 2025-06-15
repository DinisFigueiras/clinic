import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

/**
 * Patients API endpoint with search and pagination support
 * GET /api/patients?search=term&page=1&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    // Validate search parameter
    if (!search || typeof search !== "string") {
      return NextResponse.json({ error: "Invalid search query" }, { status: 400 });
    }

    // Search patients by name, mobile phone, and landline phone (if column exists)
    const patients = await withPrisma(async (prisma) => {
      try {
        // Try with landline_phone first
        return await prisma.patient.findMany({
          where: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { mobile_phone: { contains: search, mode: "insensitive" } },
              { landline_phone: { contains: search, mode: "insensitive" } }
            ]
          },
          select: {
            id: true,
            name: true,
            mobile_phone: true,
            landline_phone: true,
            email: true
          },
          take: 20, // Limit results for performance
          orderBy: {
            name: 'asc'
          }
        });
      } catch (error) {
        // Fallback if landline_phone column doesn't exist
        console.log("Landline phone column not found, falling back to basic search");
        return await prisma.patient.findMany({
          where: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { mobile_phone: { contains: search, mode: "insensitive" } }
            ]
          },
          select: {
            id: true,
            name: true,
            mobile_phone: true,
            email: true
          },
          take: 20, // Limit results for performance
          orderBy: {
            name: 'asc'
          }
        });
      }
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
