import { Dispatch, SetStateAction } from "react";
import FormModal from "./FormModal";
import prisma from "@/lib/prisma";

export type FormContainerProps = {
        table:
        | "patients"
        | "medication"
        | "bookings";
        type: "create" | "update" | "delete";
        data?:any;
        id?: number;
}

const FormContainer = async ({table, type,data,id}:FormContainerProps) =>{


    let relatedData = {}

    if (type !== "delete") {
       switch (table) {
        case "bookings":
            const bookingsMedication = await prisma.bookings.findMany({
                select:{
                    
                }
            })
            break;
       
        default:
            break;
       }
        
    }


    return (
        <div><FormModal table={table} type ={type} data={data} id={id}/></div>
    )
}

export default FormContainer;