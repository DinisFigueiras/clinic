"use client";
import { useEffect, useState } from "react";

interface Booking {
    id: number;
    booking_StartdateTime: string;
    attendance_type: string;
    patient: {
        name: string;
    };
    bookingMedications: {
        medication: {
            id: number;
            name: string;
        };
    }[];
}

const EventListPatientID = ({
    dateParam,
    futureOnly = false,
    pastOnly = false,
    patientId,
}: {
    dateParam?: string;
    futureOnly?: boolean;
    pastOnly?: boolean;
    patientId: number;
}) => {
    const [data, setData] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastPatientMedication, setLastPatientMedication] = useState<{name: string, date: string} | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                let url = `/api/bookings?patientId=${patientId}`;

                if (futureOnly) {
                    url += '&futureOnly=true';
                } else if (pastOnly) {
                    url += '&pastOnly=true';
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

        const fetchLastPatientMedication = async () => {
            try {
                // Get patient's past bookings with medications
                const response = await fetch(`/api/bookings?patientId=${patientId}&pastOnly=true`);
                if (response.ok) {
                    const pastBookings = await response.json();

                    // Find the most recent booking with medications
                    const bookingsWithMeds = pastBookings
                        .filter((booking: any) => booking.bookingMedications && booking.bookingMedications.length > 0)
                        .sort((a: any, b: any) => new Date(b.booking_StartdateTime).getTime() - new Date(a.booking_StartdateTime).getTime());

                    if (bookingsWithMeds.length > 0) {
                        const lastBooking = bookingsWithMeds[0];
                        const lastMed = lastBooking.bookingMedications[lastBooking.bookingMedications.length - 1];
                        const medicationDate = new Date(lastBooking.booking_StartdateTime).toLocaleDateString("pt-PT", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        });
                        setLastPatientMedication({
                            name: lastMed.medication.name,
                            date: medicationDate
                        });
                    } else {
                        setLastPatientMedication(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching patient medication history:', error);
                setLastPatientMedication(null);
            }
        };

        fetchBookings();
        fetchLastPatientMedication();
    }, [dateParam, futureOnly, pastOnly, patientId]);

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

                    // Check if this booking has medications (current booking)
                    const currentBookingMedication = event.bookingMedications && event.bookingMedications.length > 0
                        ? event.bookingMedications[event.bookingMedications.length - 1].medication
                        : null;

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

                            {/* Show medication info */}
                            {currentBookingMedication ? (
                                // This booking has medications - show "Produto Utilizado"
                                <p className="text-xs mt-1 text-gray-600">
                                    Produto Utilizado: <span className="underline">{currentBookingMedication.name}</span>
                                </p>
                            ) : lastPatientMedication ? (
                                // This booking has no medications - show last used medication with date
                                <p className="text-xs mt-1 text-gray-600">
                                    Último produto: <span className="underline">{lastPatientMedication.name}</span> ({lastPatientMedication.date})
                                </p>
                            ) : null}
                        </div>
                    );
                })
            )}
        </>
    );
};

export default EventListPatientID;