import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    console.log("Received search query:", search); // Debug

    if (!search || typeof search !== "string") {
      return NextResponse.json({ error: "Invalid search query" }, { status: 400 });
    }

    const patients = await withPrisma(async (prisma) => {
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
        take: 20, // Limit results for better performance
        orderBy: {
          name: 'asc'
        }
      });
    });

    console.log("Patients Found:", patients);
    return NextResponse.json(patients);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
