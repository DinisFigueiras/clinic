import CountChart from "./CountChart"
import { withPrisma } from "@/lib/prisma"

/**
 * Container component for attendance type chart (Clinic vs Home)
 */
const CountChartContainer = async () => {
    // Fetch patient counts grouped by attendance type
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