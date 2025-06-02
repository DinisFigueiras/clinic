import Image from "next/image"
import CountChart from "./CountChart"
import prisma from "@/lib/prisma"
import CountChart2 from "./CountChart2"

const CountChartContainer2 = async () => {

    const data = await prisma.patient.groupBy({
        by:["state_type"],
        _count: true
    })

    const reformado = data.find(d => d.state_type === "Reformado")?._count || 0
    const ativo = data.find(d => d.state_type === "Ativo")?._count || 0
    return(
        <div className='bg-white rounded-xl w-full h-full p-4'>
            {/* TITLE */}
            {/* <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Utentes</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20}/>
            </div> */}
            {/* CHART */}
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