import { withPrisma } from "@/lib/prisma";
import moment from 'moment-timezone';
import CalendarApp from "./BigCalendar2";

/**
 * Container component that fetches booking data and renders the main calendar
 */
const BigCalendarContainer = async () => {
  // Fetch bookings with optimized date range and first booking info
  const { dataRes, firstBookingsByPatient } = await withPrisma(async (prisma) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    // Fetch bookings in date range
    const bookings = await prisma.bookings.findMany({
      where: {
        booking_StartdateTime: {
          gte: thirtyDaysAgo,
          lte: ninetyDaysFromNow
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true
          }
        },
        bookingMedications: {
          include: {
            medication: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        booking_StartdateTime: 'asc'
      }
    });

    // Get ALL bookings for each patient to find the first one
    const uniquePatientIds = [...new Set(bookings.map(b => b.patient_id))];
    const allPatientBookings = await prisma.bookings.findMany({
      where: {
        patient_id: {
          in: uniquePatientIds
        }
      },
      select: {
        id: true,
        patient_id: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    // Create map of patient_id -> first_booking_id (by lowest id)
    const firstBookingsMap = new Map<number, number>();
    const processedPatients = new Set<number>();
    
    allPatientBookings.forEach(booking => {
      if (!processedPatients.has(booking.patient_id)) {
        firstBookingsMap.set(booking.patient_id, booking.id);
        processedPatients.add(booking.patient_id);
      }
    });

    return {
      dataRes: bookings,
      firstBookingsByPatient: firstBookingsMap
    };
  });

  // Transform booking data for calendar display
  const calendarEvents = dataRes.map(booking => {
    const isFirstBooking = firstBookingsByPatient.get(booking.patient_id) === booking.id;
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

export default BigCalendarContainer;