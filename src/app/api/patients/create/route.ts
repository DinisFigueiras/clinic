import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

/**
 * Creates a new patient in the database
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { 
      id, 
      email, 
      name, 
      gender, 
      date_of_birth, 
      mobile_phone, 
      nif, 
      state_type, 
      attendance_type, 
      observations, 
      address_line1, 
      address_line2, 
      city, 
      postal_code 
    } = body;

    // Validate required fields
    if (!id || !name || !gender || !date_of_birth || !mobile_phone || !state_type || !attendance_type || !address_line1 || !city || !postal_code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPatient = await withPrisma(async (prisma) => {
      // Check for existing email
      const existingEmail = await prisma.patient.findFirst({
        where: { email }
      });
      if (existingEmail) {
        throw new Error("O email já existe!");
      }

      // Check for existing mobile phone
      const existingMobile = await prisma.patient.findFirst({
        where: { mobile_phone }
      });
      if (existingMobile) {
        throw new Error("O número de telemóvel já existe!");
      }

      // Check for existing NIF
      const existingNif = await prisma.patient.findFirst({
        where: { nif }
      });
      if (existingNif) {
        throw new Error("O NIF já existe!");
      }

      return await prisma.patient.create({
        data: {
          id,
          email,
          name,
          gender,
          date_of_birth: new Date(date_of_birth),
          mobile_phone,
          nif,
          state_type,
          attendance_type,
          observations,
          address_line1,
          address_line2,
          city,
          postal_code
        }
      });
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
