import CountChart2 from "./CountChart2"
import { withPrisma } from "@/lib/prisma"

/**
 * Container component for state type chart (Retired vs Active)
 */
const CountChartContainer2 = async () => {
    // Fetch patient counts grouped by state type
    const data = await withPrisma(async (prisma) => {
        return await prisma.patient.groupBy({
            by:["state_type"],
            _count: true
        });
    });

    const reformado = data.find(d => d.state_type === "Reformado")?._count || 0
    const ativo = data.find(d => d.state_type === "Ativo")?._count || 0

    return(
        <div className='bg-white rounded-xl w-full h-full p-4'>
            <CountChart2 reformado={reformado} ativo={ativo}></CountChart2>
            {/* BOTTOM*/}
            <div className='flex justify-center gap-16 '>
                <div className='flex flex-col gap-1 items-center'>
                    <div className='w-5 h-5 bg-blueLight rounded-full'></div>
                    <h1 className='font-bold text-center'>{reformado}</h1>
                    <h2 className='text-xs text-neutral'>Reformado ({Math.round((reformado/(ativo+reformado)) * 100)}%)</h2>
                </div>    
                <div className='flex flex-col gap-1 items-center'>
                    <div className='w-5 h-5 bg-peachLight rounded-full'></div>
                    <h1 className='font-bold text-center'>{ativo}</h1>
                    <h2 className='text-xs text-neutral'>Ativo ({Math.round((ativo/(ativo+reformado)) * 100)}%)</h2>
                </div>    
            </div>
        </div>
    )
}

export default CountChartContainer2