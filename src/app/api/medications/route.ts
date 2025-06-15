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

    // Search medications by name, type, dosage, supplier with optimized query
    const medications = await withPrisma(async (prisma) => {
      return await prisma.medication.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { type: { contains: search, mode: "insensitive" } },
            { dosage: { contains: search, mode: "insensitive" } },
            { supplier: { contains: search, mode: "insensitive" } }
          ]
        },
        take: 20, // Limit results for performance
        orderBy: {
          name: 'asc'
        }
      });
    });

    // Convert Decimal fields to number for JSON serialization
    const plainData = medications.map(item => ({
      ...item,
      price: item.price.toNumber()
    }));

    return NextResponse.json(plainData);
  } catch (error) {
    console.error("Error fetching medications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
