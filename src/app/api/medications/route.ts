import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma-serverless";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const medications = await withPrisma(async (prisma) => {
      return await prisma.medication.findMany({
        where: { name: { contains: search, mode: "insensitive" } },
        select: { id: true, name: true },
        take: 10, // Limit results
      });
    });

    return NextResponse.json(medications);
  } catch (error) {
    console.error("Error fetching medications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
