import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

/**
 * Creates a new medication in the database
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, stock, type, dosage, price, supplier } = body;

    // Validate required fields
    if (!id || !name || !stock || !type || !dosage || !price || !supplier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMedication = await withPrisma(async (prisma) => {
      // Check for existing medication name
      const existingMedication = await prisma.medication.findFirst({
        where: { name }
      });
      if (existingMedication) {
        throw new Error("Medicamento já existe!");
      }

      return await prisma.medication.create({
        data: {
          id,
          name,
          stock: parseInt(stock),
          type,
          dosage,
          price: parseFloat(price),
          supplier
        }
      });
    });

    return NextResponse.json(newMedication, { status: 201 });
  } catch (error) {
    console.error("Error creating medication:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
