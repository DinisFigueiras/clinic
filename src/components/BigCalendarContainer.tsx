import { withPrisma } from "@/lib/prisma";
import moment from 'moment-timezone';
import CalendarApp from "./BigCalendar2";

/**
 * Container component that fetches booking data and renders the main calendar
 */
const BigCalendarContainer = async () => {
  // Fetch bookings with optimized date range for performance
  const dataRes = await withPrisma(async (prisma) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    return await prisma.bookings.findMany({
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

export default BigCalendarContainer;