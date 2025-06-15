"use server"
import { Bookingschema, Medicationschema, Patientschema } from "./formValidationSchemas"
import { withPrisma } from "./prisma"

type CurrentState = {success:boolean;error:boolean | string}

// ============================= PATIENTS =====================================

/**
 * Creates a new patient with validation for unique fields
 */
export const createPatients = async (_currentState:CurrentState,data:Patientschema) => {
    try {
        await withPrisma(async (prisma) => {
            // Check if ID already exists
            const existingId = await prisma.patient.findFirst({
                where: {
                    id: data.id
                }
            });
            if (existingId) {
                throw new Error("O ID já existe!");
            }

            // Mobile phone uniqueness check removed - multiple patients can have the same phone number

            // Check if email already exists (only if email is provided)
            if (data.email && data.email.trim() !== "") {
                const existingEmail = await prisma.patient.findFirst({
                    where: {
                        email: data.email
                    }
                });
                if (existingEmail) {
                    throw new Error("O email já existe!");
                }
            }

            // Check if NIF already exists (only if NIF is provided)
            if (data.nif && data.nif.trim() !== "") {
                const existingNif = await prisma.patient.findFirst({
                    where: {
                        nif: data.nif
                    }
                });
                if (existingNif) {
                    throw new Error("O NIF já existe!");
                }
            }

            return await prisma.patient.create({
                data: {
                    id: data.id,
                    email: data.email && data.email.trim() !== "" ? data.email : null,
                    name: data.name,
                    gender: (data.gender && data.gender.trim() !== "") ? data.gender as "Masculino" | "Feminino" : "Masculino", // Default value
                    date_of_birth: data.date_of_birth || new Date(), // Default to current date if not provided
                    mobile_phone: data.mobile_phone || "000000000", // Default value
                    landline_phone: data.landline_phone && data.landline_phone.trim() !== "" ? data.landline_phone : null,
                    nif: data.nif && data.nif.trim() !== "" ? data.nif : null,
                    state_type: (data.state_type && data.state_type.trim() !== "") ? data.state_type as "Ativo" | "Reformado" | "Estudante" : "Ativo", // Default value
                    attendance_type: (data.attendance_type && data.attendance_type.trim() !== "") ? data.attendance_type as "Clinica" | "Domicilio" : "Clinica", // Default value
                    observations: data.observations || null,
                    address_line1: data.address_line1 || "", // Default empty string
                    address_line2: data.address_line2 || null,
                    city: data.city || "", // Default empty string
                    postal_code: data.postal_code || "" // Default empty string
                },
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.error("Error creating patient:", err);
        return{success:false, error:err instanceof Error ? err.message : true}
    }
};
/**
 * Updates an existing patient with validation for unique fields
 */
export const updatePatients = async (_currentState:CurrentState,data:Patientschema) => {
    try {
        await withPrisma(async (prisma) => {
            // Mobile phone uniqueness check removed - multiple patients can have the same phone number

            // Check for unique email (only if email is provided)
            if (data.email && data.email.trim() !== "") {
                const existingEmail = await prisma.patient.findFirst({
                    where: {
                        email: data.email,
                        id: { not: data.id }
                    }
                });
                if (existingEmail) {
                    throw new Error("O email já existe!");
                }
            }

            // Check for unique NIF (only if NIF is provided)
            if (data.nif && data.nif.trim() !== "") {
                const existingNif = await prisma.patient.findFirst({
                    where: {
                        nif: data.nif,
                        id: { not: data.id }
                    }
                });
                if (existingNif) {
                    throw new Error("O NIF já existe!");
                }
            }

            return await prisma.patient.update({
                where:{
                    id: data.id
                },
                data: {
                    id: data.id,
                    email: data.email && data.email.trim() !== "" ? data.email : null,
                    name: data.name,
                    gender: (data.gender && data.gender.trim() !== "") ? data.gender as "Masculino" | "Feminino" : "Masculino", // Default value
                    date_of_birth: data.date_of_birth || new Date(), // Default to current date if not provided
                    mobile_phone: data.mobile_phone || "000000000", // Default value
                    landline_phone: data.landline_phone && data.landline_phone.trim() !== "" ? data.landline_phone : null,
                    nif: data.nif && data.nif.trim() !== "" ? data.nif : null,
                    state_type: (data.state_type && data.state_type.trim() !== "") ? data.state_type as "Ativo" | "Reformado" | "Estudante" : "Ativo", // Default value
                    attendance_type: (data.attendance_type && data.attendance_type.trim() !== "") ? data.attendance_type as "Clinica" | "Domicilio" : "Clinica", // Default value
                    observations: data.observations || null,
                    address_line1: data.address_line1 || "", // Default empty string
                    address_line2: data.address_line2 || null,
                    city: data.city || "", // Default empty string
                    postal_code: data.postal_code || "" // Default empty string
                },
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.error("Error updating patient:", err);
        return{success:false, error:err instanceof Error ? err.message : true}
    }
};

/**
 * Deletes a patient and all related bookings and medications
 */
export const deletePatients = async (_currentState:CurrentState,data:FormData) => {
    const id = data.get("id") as string;
    try {
        await withPrisma(async (prisma) => {
            // Use transaction to safely delete patient and all related data
            return await prisma.$transaction(async (tx) => {
                const patientId = parseInt(id);

                // First, get all bookings for this patient
                const patientBookings = await tx.bookings.findMany({
                    where: { patient_id: patientId },
                    select: { id: true }
                });

                // Delete all booking medications for these bookings
                if (patientBookings.length > 0) {
                    await tx.bookingMedications.deleteMany({
                        where: {
                            booking_id: {
                                in: patientBookings.map(booking => booking.id)
                            }
                        }
                    });

                    // Delete all bookings for this patient
                    await tx.bookings.deleteMany({
                        where: { patient_id: patientId }
                    });
                }

                // Finally, delete the patient
                return await tx.patient.delete({
                    where: { id: patientId }
                });
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.error("Error deleting patient:", err);
        return{success:false, error:err instanceof Error ? err.message : "Failed to delete patient"}
    }
};

// ============================= MEDICATIONS =====================================

/**
 * Creates a new medication
 */
export const createMedication = async (_currentState:CurrentState,data:Medicationschema) => {
    try {
        await withPrisma(async (prisma) => {
            // Get the next available ID
            const lastMedication = await prisma.medication.findFirst({
                orderBy: { id: 'desc' },
                select: { id: true }
            });
            const nextId = lastMedication ? lastMedication.id + 1 : 1;

            return await prisma.medication.create({
                data: {
                    id: nextId, // Use calculated next ID until migration is applied
                    name: data.name,
                    stock: data.stock || 0, // Default to 0 if not provided
                    type: data.type || "", // Default to empty string if not provided
                    dosage: data.dosage || "", // Default to empty string if not provided
                    price: data.price || 0, // Default to 0 if not provided
                    supplier: data.supplier || "" // Default to empty string if not provided
                },
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.error("Error creating medication:", err);
        return{success:false, error:err instanceof Error ? err.message : true}
    }
};

/**
 * Updates an existing medication
 */
export const updateMedication = async (_currentState:CurrentState,data:Medicationschema) => {
    try {
        await withPrisma(async (prisma) => {
            return await prisma.medication.update({
                where:{
                    id:data.id
                },
                data: {
                    id: data.id,
                    name: data.name,
                    stock: data.stock || 0, // Default to 0 if not provided
                    type: data.type || "", // Default to empty string if not provided
                    dosage: data.dosage || "", // Default to empty string if not provided
                    price: data.price || 0, // Default to 0 if not provided
                    supplier: data.supplier || "" // Default to empty string if not provided
                },
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.error("Error updating medication:", err);
        return{success:false, error:true}
    }
};

/**
 * Deletes a medication
 */
export const deleteMedication = async (_currentState:CurrentState,data:FormData) => {
    const id = data.get("id") as string;
    try {
        await withPrisma(async (prisma) => {
            return await prisma.medication.delete({
                where:{
                    id:parseInt(id)
                }
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.error("Error deleting medication:", err);
        return{success:false, error:true}
    }
};

// ============================= BOOKINGS =====================================

/**
 * Creates a new booking with optional medication associations
 */
export const createBookings = async (_currentState:CurrentState,data:Bookingschema) => {
    try {
        await withPrisma(async (prisma) => {
            // Create the booking first
            const newBooking = await prisma.bookings.create({
                data: {
                    patient_id: data.patient_id,
                    attendance_type: data.attendance_type,
                    booking_StartdateTime: data.booking_StartdateTime,
                    booking_EnddateTime: data.booking_EnddateTime
                },
            });

            // Create medication relationships if medications are provided
            if (data.medication_ids && data.medication_ids.length > 0) {
                await prisma.bookingMedications.createMany({
                    data: data.medication_ids.map((medication_id: number) => ({
                        booking_id: newBooking.id,
                        medication_id,
                    })),
                });
            }

            return newBooking;
        });
        return {success:true, error:false}
    } catch (err) {
        console.error("Error creating booking:", err);
        return{success:false, error:err instanceof Error ? err.message : true}
    }
};

/**
 * Updates an existing booking and its medication associations
 */
export const updateBookings = async (_currentState:CurrentState,data:Bookingschema) => {
    try {
        await withPrisma(async (prisma) => {
            // Update the booking
            const updatedBooking = await prisma.bookings.update({
                where:{
                    id: data.id
                },
                data: {
                    patient_id: data.patient_id,
                    attendance_type: data.attendance_type,
                    booking_StartdateTime: data.booking_StartdateTime,
                    booking_EnddateTime: data.booking_EnddateTime
                },
            });

            // Delete existing medication relationships
            await prisma.bookingMedications.deleteMany({
                where: { booking_id: data.id },
            });

            // Create new medication relationships if medications are provided
            if (data.medication_ids && data.medication_ids.length > 0) {
                await prisma.bookingMedications.createMany({
                    data: data.medication_ids.map((medication_id: number) => ({
                        booking_id: data.id,
                        medication_id,
                    })),
                });
            }

            return updatedBooking;
        });
        return {success:true, error:false}
    } catch (err) {
        console.error("Error updating booking:", err);
        return{success:false, error:true}
    }
};

/**
 * Deletes a booking
 */
export const deleteBookings = async (_currentState:CurrentState,data:FormData) => {
    const id = data.get("id") as string;
    try {
        await withPrisma(async (prisma) => {
            return await prisma.bookings.delete({
                where:{
                    id:parseInt(id)
                }
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.error("Error deleting booking:", err);
        return{success:false, error:true}
    }
};