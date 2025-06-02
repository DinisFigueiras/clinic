import Image from "next/image"
import AttendanceChart from "./AttendanceChart"
import prisma from "@/lib/prisma"
import { string } from "zod"

const AttendanceChartContainer = async () => {

    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const lastMonday = new Date(today)
    lastMonday.setHours(0,0,0,0)
    lastMonday.setDate(today.getDate() - daysSinceMonday)


    // Calculate next Sunday (exclusive upper bound)
    const nextSunday = new Date(lastMonday)
    nextSunday.setDate(lastMonday.getDate() + 7)
    nextSunday.setHours(0,0,0,0)


    const resData = await prisma.bookings.findMany({
        where:{
            booking_StartdateTime:{
                gte: lastMonday,
                lt: nextSunday
            }
        },
        select:{
            booking_StartdateTime:true,
            attendance_type: true
        }
    })

    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado']
    const attendanceMap: {[key: string]: {clinica: number; domicilio: number}} =
    {
        Segunda:{clinica: 0, domicilio: 0},
        Terça:{clinica: 0, domicilio: 0},
        Quarta:{clinica: 0, domicilio: 0},
        Quinta:{clinica: 0, domicilio: 0},
        Sexta:{clinica: 0, domicilio: 0},
        Sabado:{clinica: 0, domicilio: 0},
    }


    resData.forEach(item =>{
        const itemDate = new Date(item.booking_StartdateTime)
        const dayOfWeek = itemDate.getDay()

        if (dayOfWeek >=1 && dayOfWeek <=6) {
            const dayName = daysOfWeek[dayOfWeek - 1]
            if (item.attendance_type === "Clinica") {
                attendanceMap[dayName].clinica += 1
            } else if (item.attendance_type === "Domicilio") {
                attendanceMap[dayName].domicilio += 1
            }    
        }
    })
    const data = daysOfWeek.map((day) =>({
        name: day,
        Clinica: attendanceMap[day].clinica,
        Domicilio: attendanceMap[day].domicilio
    }));

    return(
        <div className='bg-white rounded-lg p-4 h-full'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold text-neutral'>Consultas</h1>
                <Image src="/moreDark.png" alt='' width={20} height={20}/>
            </div>
            <AttendanceChart data={data}></AttendanceChart>
        </div>
    )
}

export default AttendanceChartContainer