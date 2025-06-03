import prisma from "@/lib/prisma";

const EventListPatientID = async ({
    dateParam,
    futureOnly = false,
    patientId,
}: {
    dateParam?: string;
    futureOnly?: boolean;
    patientId: number;
}) => {
    let where: any = {
        patient_id: patientId,
    };

    if (futureOnly) {
        where.booking_StartdateTime = {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
        };
    } else if (dateParam) {
        const date = new Date(dateParam);
        where.booking_StartdateTime = {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lte: new Date(date.setHours(23, 59, 59, 999)),
        };
    }

    const data = await prisma.bookings.findMany({
        where,
        include: {
            patient: true,
        },
        orderBy: {
            booking_StartdateTime: "asc",
        },
    });

    return data.map((event) => (
        <div className="p-5 rounded-md border-2 border-neutral border-t-4" key={event.id}>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-neutral">{event.patient.name}</h1>
                <span className="text-neutral font-semibold text-sm">
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
};

export default EventListPatientID;