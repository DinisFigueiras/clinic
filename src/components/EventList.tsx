import prisma from "@/lib/prisma";
import { $Enums } from "@prisma/client";

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
                    <h1 className="font-semibold text-neutral">{event.patient.name}</h1>
                    <span className="text-neutral  font-semiboldtext-sm">
                    {event.booking_StartdateTime.toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    })}{" "}
                    {event.booking_StartdateTime.toLocaleTimeString("pt-PT", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })}
                    </span>
                </div>
                <p
                    className={`text-sm mt-2 font-semibold ${
                        event.attendance_type === "Domicilio" ? "text-peach" : "text-blue"
                    }`}
                >
                  {event.attendance_type}  
                </p>
            </div>
    ));
}

export default EventList;