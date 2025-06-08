import Image from "next/image"
import AttendanceChart from "./AttendanceChart"
import prisma from "@/lib/prisma"

const AttendanceChartContainer = async () => {
    const today = new Date()
    let lastMonday: Date;
    if (today.getDay() === 0) {
    // If today is Sunday, show next week's Monday
    lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() + 1); // move to next Monday
    lastMonday.setHours(0, 0, 0, 0);
    } else {
    // Otherwise, show this week's Monday
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek - 1;
    lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysSinceMonday);
    lastMonday.setHours(0, 0, 0, 0);
    }

    // Calculate next Sunday (exclusive upper bound)
    const nextSaturday = new Date(lastMonday)
    nextSaturday.setDate(lastMonday.getDate() + 6)
    nextSaturday.setHours(23,59,59,999)


    const resData = await prisma.bookings.findMany({
        where:{
            booking_StartdateTime:{
                gte: lastMonday,
                lt: nextSaturday
            }
        },
        select:{
            booking_StartdateTime:true,
            attendance_type: true
        }
    })

    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado']
     // Prepare chart data with day and date
    const data = daysOfWeek.map((day, i) => {
        // Calculate the date for each day (starting from lastMonday)
        const date = new Date(lastMonday);
        date.setDate(lastMonday.getDate() + i);
        // Format as "09-06"
        const dateStr = date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" });

        // Count bookings for this day and type
        const bookingsForDay = resData.filter(b => {
            const bDate = new Date(b.booking_StartdateTime);
            return (
                bDate.getFullYear() === date.getFullYear() &&
                bDate.getMonth() === date.getMonth() &&
                bDate.getDate() === date.getDate()
            );
        });

        const clinicaCount = bookingsForDay.filter(b => b.attendance_type === "Clinica").length;
        const domicilioCount = bookingsForDay.filter(b => b.attendance_type === "Domicilio").length;

        return {
            name: `${day} ${dateStr}`,
            Clinica: clinicaCount,
            Domicilio: domicilioCount,
        };
    });

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