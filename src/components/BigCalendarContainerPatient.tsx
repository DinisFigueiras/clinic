import { withPrisma } from "@/lib/prisma";
import moment from 'moment-timezone';
import CalendarApp from "./BigCalendar2";

/**
 * Calendar container for displaying a specific patient's bookings
 */
const BigCalendarContainerPatient = async ({ patientId }: { patientId: number }) => {
  // Fetch all bookings for the specific patient
  const dataRes = await withPrisma(async (prisma) => {
    return await prisma.bookings.findMany({
      where: {
        patient_id: patientId
      },
      include: {
        patient: true,
        bookingMedications: {
          include: {
            medication: true
          }
        }
      }
    });
  });

  // Find the first booking (oldest by ID)
  const firstBooking = dataRes.length > 0 ? dataRes.reduce((first, current) => {
    return current.id < first.id ? current : first;
  }) : null;

  // Transform booking data for calendar display
  const calendarEvents = dataRes.map(booking => {
    const isFirstBooking = firstBooking && booking.id === firstBooking.id;
    const attendanceLabel = booking.attendance_type === "Clinica" ? "Clínica" : "Domicílio";
    const stateDisplay = isFirstBooking ? `${attendanceLabel} - Novo Paciente` : attendanceLabel;

    return {
      id: booking.id,
      title: booking.patient.name,
      start: moment(booking.booking_StartdateTime).tz('Europe/Lisbon').format('YYYY-MM-DD HH:mm'),
      end: moment(booking.booking_EnddateTime).tz('Europe/Lisbon').format('YYYY-MM-DD HH:mm'),
      state: stateDisplay
    };
  });

  return (
    <div className="">
      <CalendarApp data={calendarEvents} />
    </div>
  );
};

export default BigCalendarContainerPatient;
