import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

/**
 * Medications API endpoint with search functionality
 * GET /api/medications?search=term
 */
export async function GET(request: NextRequest) {
  try {
    // Extract search parameter
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Search medications by name with optimized query
    const medications = await withPrisma(async (prisma) => {
      return await prisma.medication.findMany({
        where: { name: { contains: search, mode: "insensitive" } },
        select: { id: true, name: true },
        take: 10, // Limit results for performance
      });
    });

    return NextResponse.json(medications);
  } catch (error) {
    console.error("Error fetching medications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
