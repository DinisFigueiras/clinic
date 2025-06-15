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
    if (!id || !name) {
      return NextResponse.json({ error: "Missing required fields: ID and Name are mandatory" }, { status: 400 });
    }

    const newPatient = await withPrisma(async (prisma) => {
      // Check for existing email (only if email is provided)
      if (email && email.trim() !== "") {
        const existingEmail = await prisma.patient.findFirst({
          where: { email }
        });
        if (existingEmail) {
          throw new Error("O email já existe!");
        }
      }

      // Mobile phone uniqueness check removed - multiple patients can have the same phone number

      // Check for existing NIF (only if NIF is provided)
      if (nif && nif.trim() !== "") {
        const existingNif = await prisma.patient.findFirst({
          where: { nif }
        });
        if (existingNif) {
          throw new Error("O NIF já existe!");
        }
      }

      return await prisma.patient.create({
        data: {
          id,
          email: email || null,
          name,
          gender: (gender && gender.trim() !== "") ? gender : "Masculino", // Default value
          date_of_birth: date_of_birth ? new Date(date_of_birth) : new Date(), // Default to current date if not provided
          mobile_phone: mobile_phone || "000000000", // Default value
          nif: nif || null,
          state_type: (state_type && state_type.trim() !== "") ? state_type : "Ativo", // Default value
          attendance_type: (attendance_type && attendance_type.trim() !== "") ? attendance_type : "Clinica", // Default value
          observations: observations || null,
          address_line1: address_line1 || "", // Default empty string
          address_line2: address_line2 || null,
          city: city || "", // Default empty string
          postal_code: postal_code || "" // Default empty string
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
