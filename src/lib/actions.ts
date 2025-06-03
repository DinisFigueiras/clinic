"use server"
import { Bookingschema, Medicationschema, Patientschema } from "./formValidationSchemas"
import prisma from "./prisma"

type CurrentState = {success:boolean;error:boolean | string}
{/* -----------------------------PATIENTS------------------------------------------------*/}
{/*PATIENTS CREATE*/}
export const createPatients = async (currentState:CurrentState,data:Patientschema) => {
    try {
        await prisma.patient.create({
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
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:true}
    }
};
{/*PATIENTS UPDATE*/}
export const updatePatients = async (currentState:CurrentState,data:Patientschema) => {
    try {

        // Check if another patient already has this mobile_phone
        const existingMobile = await prisma.patient.findFirst({
            where: {
                mobile_phone: data.mobile_phone,
                id: { not: data.id } 
            }
        });
        if (existingMobile) {
            return { success: false, error: "O número de telemóvel já existe!" };
        }

        // (Repeat for other unique fields if needed, e.g. email, nif)
        const existingEmail = await prisma.patient.findFirst({
            where: {
                email: data.email,
                id: { not: data.id }
            }
        });
        if (existingEmail) {
            return { success: false, error: "O email já existe!" };
        }

        const existingNif = await prisma.patient.findFirst({
            where: {
                nif: data.nif,
                id: { not: data.id }
            }
        });
        if (existingNif) {
            return { success: false, error: "O NIF já existe!" };
        }


        await prisma.patient.update({
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
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:true}
    }
};
{/*PATIENTS DELETE*/}
export const deletePatients = async (currentState:CurrentState,data:FormData) => {
    const id = data.get("id") as string;
    try {
        await prisma.patient.delete({
            where:{
                id:parseInt(id)
            }
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
        await prisma.medication.create({
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
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:true}
    }
};
{/*PRODUCTS UPDATE*/}
export const updateMedication = async (currentState:CurrentState,data:Medicationschema) => {
    try {
        await prisma.medication.update({
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
        await prisma.medication.delete({
            where:{
                id:parseInt(id)
            }
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
        await prisma.bookings.create({
            data: {
                patient_id: data.patient_id,
                medication_id: data.medication_id,
                attendance_type: data.attendance_type,
                booking_StartdateTime: data.booking_StartdateTime,
                booking_EnddateTime: data.booking_EnddateTime
            },
        });
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:true}
    }
};
{/*PRODUCTS UPDATE*/}
export const updateBookings = async (currentState:CurrentState,data:Bookingschema) => {
    try {
        await prisma.bookings.update({
            where:{
                id: data.id,
                patient_id: data.patient_id,
                medication_id: data.medication_id,
                attendance_type: data.attendance_type,
                booking_StartdateTime: data.booking_StartdateTime,
                booking_EnddateTime: data.booking_EnddateTime
            },
            data: {
                patient_id: data.patient_id,
                medication_id: data.medication_id,
                attendance_type: data.attendance_type,
                booking_StartdateTime: data.booking_StartdateTime,
                booking_EnddateTime: data.booking_EnddateTime
            },
        });
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:true}
    }
};
{/*PRODUCTS DELETE*/}
export const deleteBookings = async (currentState:CurrentState,data:FormData) => {

    const id = data.get("id") as string;
    try {
        await prisma.medication.delete({
            where:{
                id:parseInt(id)
            }
        });
        return {success:true, error:false}
    } catch (err) {
        console.log(err)
        return{success:false, error:true}
    }
};