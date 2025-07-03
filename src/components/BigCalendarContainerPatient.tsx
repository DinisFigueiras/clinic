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

  // Transform booking data for calendar display
  const calendarEvents = dataRes.map(booking => ({
    id: booking.id,
    title: booking.patient.name,
    start: moment(booking.booking_StartdateTime).tz('Europe/Lisbon').format('YYYY-MM-DD HH:mm'),
    end: moment(booking.booking_EnddateTime).tz('Europe/Lisbon').format('YYYY-MM-DD HH:mm'),
    state: booking.attendance_type
  }));

  return (
    <div className="">
      <CalendarApp data={calendarEvents} />
    </div>
  );
};

export default BigCalendarContainerPatient;
