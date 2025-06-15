"use client";
import { useState } from "react";
import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventListPatientID from "./EventListPatientID";

export default function EventCalendarPatientClient({
    initialDate,
    patientId
}: {
    initialDate?: string;
    patientId: number;
}) {
    const [selectedDate, setSelectedDate] = useState<string | undefined>(initialDate);
    const [showPastBookings, setShowPastBookings] = useState(false);

    // Handler for selecting a day in the calendar
    const handleDaySelect = (date: string) => {
        setSelectedDate(date);
        setShowPastBookings(false); // Reset to future when selecting a date
    };

    // Handler for showing future bookings again
    const handleShowFutureBookings = () => {
        setSelectedDate(undefined);
        setShowPastBookings(false);
    };

    // Handler for toggling between future and past bookings
    const handleToggleBookings = () => {
        setShowPastBookings(!showPastBookings);
        setSelectedDate(undefined); // Clear selected date when toggling
    };

    // Determine the label based on selected date and booking type
    const label = selectedDate
        ? `Marcações para dia ${new Date(selectedDate).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" })}`
        : showPastBookings
            ? "Marcações Realizadas"
            : "Marcações Futuras";

    return (
        <div className="bg-white p-4 rounded-md">
            <EventCalendar onDaySelect={handleDaySelect} />
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold my-4 text-neutral">{label}</h1>
                <div className="flex items-center gap-2">
                    {selectedDate ? (
                        <button
                            className="text-sm bg-blueLight hover:bg-blue transition-colors duration-200 text-white py-2 px-4 rounded-md border-none w-max self-center"
                            onClick={handleShowFutureBookings}
                            title="Ver marcações futuras"
                        >
                            Marcações Futuras
                        </button>
                    ) : (
                        <>
                            <button
                                className={`text-sm py-2 px-4 rounded-md border-none transition-colors duration-200 ${
                                    showPastBookings
                                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        : "bg-blueLight text-white hover:bg-blue"
                                }`}
                                onClick={handleToggleBookings}
                                title={showPastBookings ? "Ver marcações futuras" : "Ver marcações realizadas"}
                            >
                                {showPastBookings ? "Marcações Futuras" : "Marcações Realizadas"}
                            </button>
                            <Image src="/moreDark.png" alt="" width={20} height={20} />
                        </>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {selectedDate ? (
                    <EventListPatientID dateParam={selectedDate} patientId={patientId} />
                ) : (
                    <EventListPatientID
                        futureOnly={!showPastBookings}
                        pastOnly={showPastBookings}
                        patientId={patientId}
                    />
                )}
            </div>
        </div>
    );
}
