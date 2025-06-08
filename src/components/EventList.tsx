"use client";
import { useEffect, useState } from "react";

export default function EventList({ dateParam, week = false }: { dateParam?: string; week?: boolean }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = "/api/bookings?";
    if (week) url += "week=true";
    else if (dateParam) url += `date=${dateParam}`;
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [dateParam, week]);

  if (loading) return <div>Carregando...</div>;
  if (!data.length) return <div>Sem marcações.</div>;

  return (
    <>
      {data.map((event) => (
        <div className="p-5 rounded-md border-2 border-neutral border-t-4" key={event.id}>
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-neutral">{event.patient?.name}</h1>
            <span className="text-neutral font-semibold text-sm">
              {new Date(event.booking_StartdateTime).toLocaleDateString("pt-PT")}{" "}
              {new Date(event.booking_StartdateTime).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", hour12: false })}
            </span>
          </div>
          <p className={`text-sm mt-2 font-semibold ${event.attendance_type === "Domicilio" ? "text-peach" : "text-blue"}`}>
            {event.attendance_type}
          </p>
        </div>
      ))}
    </>
  );
}