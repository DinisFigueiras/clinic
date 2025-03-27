import prisma from "@/lib/prisma";

const EventList = async ({dateParam}:{dateParam: string | undefined}) => {

    const date = dateParam ? new Date(dateParam) : new Date()

    const data = await prisma.bookings.findMany({
        where:{
            booking_StartdateTime:{
                gte: new Date(date.setHours(0,0,0,0)),
                lte: new Date(date.setHours(23,59,59,999)),
            }
        },
        include:{
            patient: true
        }
    });
    return data.map((event) =>(
            <div className="p-5 rounded-md border-2 border-gray-100 border-t-4" key={event.id}>
                <div className="flex items-center justify-between">
                    <h1 className="font-semibold text-gray-600">{event.patient.name}</h1>
                    <span className="text-gray-600 text-sm">{event.booking_StartdateTime.toLocaleTimeString("pt-PT",{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                    </span>
                </div>
                <p className="mt-2 text-gray-400 text-sm">{event.attendance_type}</p>
            </div>
    ));
}

export default EventList;