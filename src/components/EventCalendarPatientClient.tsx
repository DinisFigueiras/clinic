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

    // Handler for selecting a day in the calendar
    const handleDaySelect = (date: string) => {
        setSelectedDate(date);
    };

    return (
        <div className="bg-white p-4 rounded-md">
            <EventCalendar onDaySelect={handleDaySelect} />
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold my-4">
                    {selectedDate ? "Marcações do Dia" : "Marcações Futuras"}
                </h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className="flex flex-col gap-4">
                {selectedDate ? (
                    <EventListPatientID dateParam={selectedDate} patientId={patientId} />
                ) : (
                    <EventListPatientID futureOnly={true} patientId={patientId} />
                )}
            </div>
        </div>
    );
}
