import Image from "next/image"
import CountChart from "./CountChart"
import { withPrisma } from "@/lib/prisma"

const CountChartContainer = async () => {

    const data = await withPrisma(async (prisma) => {
        return await prisma.patient.groupBy({
            by:["attendance_type"],
            _count: true
        });
    });

    const clinica = data.find(d => d.attendance_type === "Clinica")?._count || 0
    const domicilio = data.find(d => d.attendance_type === "Domicilio")?._count || 0
    return(
        <div className='bg-white rounded-xl w-full h-full p-4'>
            {/* TITLE */}
            {/* <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold text-neutral'>Utentes</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20}/>
            </div> */}
            {/* CHART */}
            <CountChart domicilio={domicilio} clinica={clinica}></CountChart>
            {/* BOTTOM*/}
            <div className='flex justify-center gap-16'>
                <div className='flex flex-col gap-1 items-center'>
                    <div className='w-5 h-5 bg-blueLight rounded-full'></div>
                    <h1 className='font-bold text-center'>{clinica}</h1>
                    <h2 className='text-xs text-neutral'>Clinica ({Math.round((clinica/(domicilio+clinica)) * 100)}%)</h2>
                </div>    
                <div className='flex flex-col gap-1 items-center'>
                    <div className='w-5 h-5 bg-peachLight rounded-full'></div>
                    <h1 className='font-bold text-center'>{domicilio}</h1>
                    <h2 className='text-xs text-neutral'>Domicilio ({Math.round((domicilio/(domicilio+clinica)) * 100)}%)</h2>
                </div>    
            </div>
        </div>
    )
}

export default CountChartContainer