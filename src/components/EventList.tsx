"use client";
import { useEffect, useState } from "react";

export default function EventList({ dateParam, week = false }: { dateParam?: string; week?: boolean }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientMedications, setPatientMedications] = useState<{[patientId: number]: {name: string, date: string}}>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch bookings
        let url = "/api/bookings?";
        if (week) url += "week=true";
        else if (dateParam) url += `date=${dateParam}`;

        const bookingsResponse = await fetch(url);
        const bookings = await bookingsResponse.json();
        setData(bookings);

        // Get unique patient IDs
        const patientIds = [...new Set(bookings.map((booking: any) => booking.patient_id))] as number[];

        // Fetch last medication for each patient
        const medicationPromises = patientIds.map(async (patientId: number) => {
          try {
            const response = await fetch(`/api/bookings?patientId=${patientId}&pastOnly=true`);
            const pastBookings = await response.json();

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
              return {
                patientId,
                medication: {
                  name: lastMed.medication.name,
                  date: medicationDate
                }
              };
            }
            return { patientId, medication: null };
          } catch (error) {
            console.error(`Error fetching medication for patient ${patientId}:`, error);
            return { patientId, medication: null };
          }
        });

        const medicationResults = await Promise.all(medicationPromises);
        const medicationMap = medicationResults.reduce((acc, result) => {
          if (result.medication) {
            acc[result.patientId] = result.medication;
          }
          return acc;
        }, {} as {[patientId: number]: {name: string, date: string}});

        setPatientMedications(medicationMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateParam, week]);

  if (loading) return <div>Carregando...</div>;
  if (!data.length) return <div>Sem marcações.</div>;

  return (
    <>
      {data.map((event) => {
        // Get the last medication used by this specific patient (from their history)
        const lastPatientMedication = patientMedications[event.patient_id];

        // Check if this booking has medications (current booking)
        const currentBookingMedication = event.bookingMedications && event.bookingMedications.length > 0
          ? event.bookingMedications[event.bookingMedications.length - 1].medication
          : null;

        return (
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
      })}
    </>
  );
}