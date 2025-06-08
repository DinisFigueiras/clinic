"use server"
import { Bookingschema, Medicationschema, Patientschema } from "./formValidationSchemas"
import { withPrisma } from "./prisma"

type CurrentState = {success:boolean;error:boolean | string}
{/* -----------------------------PATIENTS------------------------------------------------*/}
{/*PATIENTS CREATE*/}
export const createPatients = async (currentState:CurrentState,data:Patientschema) => {
    try {
        await withPrisma(async (prisma) => {
            // Check if mobile_phone already exists
            const existingMobile = await prisma.patient.findFirst({
                where: {
                    mobile_phone: data.mobile_phone
                }
            });
            if (existingMobile) {
                throw new Error("O número de telemóvel já existe!");
            }

            // Check if email already exists
            const existingEmail = await prisma.patient.findFirst({
                where: {
                    email: data.email
                }
            });
            if (existingEmail) {
                throw new Error("O email já existe!");
            }

            // Check if NIF already exists
            const existingNif = await prisma.patient.findFirst({
                where: {
                    nif: data.nif
                }
            });
            if (existingNif) {
                throw new Error("O NIF já existe!");
            }

            return await prisma.patient.create({
                data: {
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    gender: data.gender,
                    date_of_birth: data.date_of_birth,
                    mobile_phone: data.mobile_phone,
                    nif: data.nif,
                    state_type: data.state_type,
                    attendance_type: data.attendance_type,
                    observations: data.observations,
                    address_line1: data.address_line1,
                    address_line2: data.address_line2,
                    city: data.city,
                    postal_code: data.postal_code
                },
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:err instanceof Error ? err.message : true}
    }
};
{/*PATIENTS UPDATE*/}
export const updatePatients = async (currentState:CurrentState,data:Patientschema) => {
    try {
        await withPrisma(async (prisma) => {
            // Check if another patient already has this mobile_phone
            const existingMobile = await prisma.patient.findFirst({
                where: {
                    mobile_phone: data.mobile_phone,
                    id: { not: data.id }
                }
            });
            if (existingMobile) {
                throw new Error("O número de telemóvel já existe!");
            }

            // (Repeat for other unique fields if needed, e.g. email, nif)
            const existingEmail = await prisma.patient.findFirst({
                where: {
                    email: data.email,
                    id: { not: data.id }
                }
            });
            if (existingEmail) {
                throw new Error("O email já existe!");
            }

            const existingNif = await prisma.patient.findFirst({
                where: {
                    nif: data.nif,
                    id: { not: data.id }
                }
            });
            if (existingNif) {
                throw new Error("O NIF já existe!");
            }

            return await prisma.patient.update({
                where:{
                    id: data.id
                },
                data: {
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    gender: data.gender,
                    date_of_birth: data.date_of_birth,
                    mobile_phone: data.mobile_phone,
                    nif: data.nif,
                    state_type: data.state_type,
                    attendance_type: data.attendance_type,
                    observations: data.observations,
                    address_line1: data.address_line1,
                    address_line2: data.address_line2,
                    city: data.city,
                    postal_code: data.postal_code
                },
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:err instanceof Error ? err.message : true}
    }
};
{/*PATIENTS DELETE*/}
export const deletePatients = async (currentState:CurrentState,data:FormData) => {
    const id = data.get("id") as string;
    try {
        await withPrisma(async (prisma) => {
            return await prisma.patient.delete({
                where:{
                    id:parseInt(id)
                }
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:true}
    }
};

{/* -----------------------------PRODUCTS------------------------------------------------*/}
{/*PRODUCTS CREATE*/}
export const createMedication = async (currentState:CurrentState,data:Medicationschema) => {
    try {
        await withPrisma(async (prisma) => {
            return await prisma.medication.create({
                data: {
                    id: data.id,
                    name: data.name,
                    stock: data.stock,
                    type: data.type,
                    dosage: data.dosage,
                    price: data.price,
                    supplier: data.supplier
                },
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:err instanceof Error ? err.message : true}
    }
};
{/*PRODUCTS UPDATE*/}
export const updateMedication = async (currentState:CurrentState,data:Medicationschema) => {
    try {
        await withPrisma(async (prisma) => {
            return await prisma.medication.update({
                where:{
                    id:data.id
                },
                data: {
                    id: data.id,
                    name: data.name,
                    stock: data.stock,
                    type: data.type,
                    dosage: data.dosage,
                    price: data.price,
                    supplier: data.supplier
                },
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:true}
    }
};
{/*PRODUCTS DELETE*/}
export const deleteMedication = async (currentState:CurrentState,data:FormData) => {

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
        console.log(err)
        return{success:false, error:true}
    }
};

{/* -----------------------------BOOKINGS------------------------------------------------*/}
export const createBookings = async (currentState:CurrentState,data:Bookingschema) => {
    try {
        await withPrisma(async (prisma) => {
            return await prisma.bookings.create({
                data: {
                    patient_id: data.patient_id,
                    medication_id: data.medication_id,
                    attendance_type: data.attendance_type,
                    booking_StartdateTime: data.booking_StartdateTime,
                    booking_EnddateTime: data.booking_EnddateTime
                },
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:err instanceof Error ? err.message : true}
    }
};
{/*BOOKINGS UPDATE*/}
export const updateBookings = async (currentState:CurrentState,data:Bookingschema) => {
    try {
        await withPrisma(async (prisma) => {
            return await prisma.bookings.update({
                where:{
                    id: data.id
                },
                data: {
                    patient_id: data.patient_id,
                    medication_id: data.medication_id,
                    attendance_type: data.attendance_type,
                    booking_StartdateTime: data.booking_StartdateTime,
                    booking_EnddateTime: data.booking_EnddateTime
                },
            });
        });
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:true}
    }
};
{/*BOOKINGS DELETE*/}
export const deleteBookings = async (currentState:CurrentState,data:FormData) => {

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
        console.log(err)
        return{success:false, error:true}
    }
};