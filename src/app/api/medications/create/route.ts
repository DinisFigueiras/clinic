import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

/**
 * Creates a new medication in the database
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, stock, type, dosage, price, supplier } = body;

    // Validate required fields (only name is mandatory)
    if (!name) {
      return NextResponse.json({ error: "Nome do produto é obrigatório" }, { status: 400 });
    }

    const newMedication = await withPrisma(async (prisma) => {
      // Check for existing medication name
      const existingMedication = await prisma.medication.findFirst({
        where: { name }
      });
      if (existingMedication) {
        throw new Error("Medicamento já existe!");
      }

      // Get the next available ID
      const lastMedication = await prisma.medication.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true }
      });
      const nextId = lastMedication ? lastMedication.id + 1 : 1;

      return await prisma.medication.create({
        data: {
          id: nextId, // Use calculated next ID until migration is applied
          name,
          stock: stock ? parseInt(stock) : 0, // Default to 0 if not provided
          type: type || "", // Default to empty string if not provided
          dosage: dosage || "", // Default to empty string if not provided
          price: price ? parseFloat(price) : 0, // Default to 0 if not provided
          supplier: supplier || "" // Default to empty string if not provided
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
