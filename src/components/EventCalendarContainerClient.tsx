"use client";
import { useState } from "react";
import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";

export default function EventCalendarContainerClient({ initialDate }: { initialDate?: string }) {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(initialDate);

  // Handler for selecting a day in the calendar
  const handleDaySelect = (date: string) => {
    setSelectedDate(date);
  };

  // Handler for showing the week view again
  const handleShowWeek = () => {
    setSelectedDate(undefined);
  };

  // Label logic
  let label = "Marcações da semana";
  if (selectedDate) {
    const dateObj = new Date(selectedDate);
    label = `Marcações para dia ${dateObj.toLocaleDateString("pt-PT")}`;
  } else {
    // Calculate first and last day of the week (today and today+6)
    const today = new Date();
    const firstDay = new Date(today.setHours(0, 0, 0, 0));
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    const format = (d: Date) =>
      d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" });
    label = `Marcações para a semana de ${format(firstDay)} a ${format(lastDay)}`;
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <EventCalendar onDaySelect={handleDaySelect} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4 text-neutral">{label}</h1>
        {selectedDate ? (
          <button
            className="text-sm bg-blueLight hover:bg-blue transition-colors duration-200 text-white py-2 px-4 rounded-md border-none w-max self-center"
            onClick={handleShowWeek}
            title="Ver semana"
          >
            Ver semana
          </button>
        ) : (
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <EventList dateParam={selectedDate} week={!selectedDate} />
      </div>
    </div>
  );
}