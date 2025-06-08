import { withPrisma } from "@/lib/prisma"
import { Record } from "@prisma/client/runtime/library"
import Image from "next/image"
import { unknown } from "zod"

const UserCard = async ({type}:{type: "Utentes" | "Marcações" | "Produtos" }) => {

    const data = await withPrisma(async (prisma) => {
        switch (type) {
            case "Utentes":
                return await prisma.patient.count();
            case "Produtos":
                return await prisma.medication.count();
            case "Marcações":
                return await prisma.bookings.count();
            default:
                return 0;
        }
    });

    const currentYear = new Date().getFullYear()
    console.log(data)
    return(
        <div className='rounded-2xl odd:bg-blue even:bg-peach p-4 flex-1 min-w-[130px]'> 
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-700">
                    {currentYear}
                </span>
                <Image src="/more.png" alt="" width={20} height={20}/>
            </div>
            {/* OPÇAO 1 AO CENTRO */}
            <div className="flex flex-col items-center justify-center">
            {/* OPÇAO 2 À ESQUERDA */}
            {/* <div className="flex flex-col"> */}
                <h1 className="text-2xl font-semibold my-4 text-neutral">{data}</h1>
                <h2 className="capitalize text-sm font-medium text-neutral">{type}</h2>
            </div>
        </div>
    )
}

export default UserCard