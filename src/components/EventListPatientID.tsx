"use client";
import { useEffect, useState } from "react";

interface Booking {
    id: number;
    booking_StartdateTime: string;
    attendance_type: string;
    patient: {
        name: string;
    };
}

const EventListPatientID = ({
    dateParam,
    futureOnly = false,
    patientId,
}: {
    dateParam?: string;
    futureOnly?: boolean;
    patientId: number;
}) => {
    const [data, setData] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                let url = `/api/bookings?patientId=${patientId}`;

                if (futureOnly) {
                    url += '&futureOnly=true';
                } else if (dateParam) {
                    url += `&date=${dateParam}`;
                }

                const response = await fetch(url);
                if (response.ok) {
                    const bookings = await response.json();
                    setData(bookings);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [dateParam, futureOnly, patientId]);

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    return (
        <>
            {data.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                    Nenhuma marcação encontrada
                </div>
            ) : (
                data.map((event) => {
                    const eventDate = new Date(event.booking_StartdateTime);
                    return (
                        <div className="p-5 rounded-md border-2 border-neutral border-t-4" key={event.id}>
                            <div className="flex items-center justify-between">
                                <h1 className="font-semibold text-neutral">{event.patient.name}</h1>
                                <span className="text-neutral font-semibold text-sm">
                                    {eventDate.toLocaleDateString("pt-PT", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}{" "}
                                    {eventDate.toLocaleTimeString("pt-PT", {
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
                    );
                })
            )}
        </>
    );
};

export default EventListPatientID;