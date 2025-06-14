import { withPrisma } from "@/lib/prisma";
import moment from 'moment-timezone';
import CalendarApp from "./BigCalendar2";

const BigCalendarContainer = async () => {
  const dataRes = await withPrisma(async (prisma) => {
    // Only load bookings from 30 days ago to 90 days in the future for better performance
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

  const data1 = dataRes.map(booking => ({
    id: booking.id,
    title: booking.patient.name,
    start: moment(booking.booking_StartdateTime).format('YYYY-MM-DD HH:mm'),
    end: moment(booking.booking_EnddateTime).format('YYYY-MM-DD HH:mm'),
    state:booking.attendance_type
  }));

  const data2 = dataRes.map(booking => ({
    id: booking.id,
    title: booking.patient.name,
    start: new Date(booking.booking_StartdateTime),
    end: new Date(booking.booking_EnddateTime),
  }));

  return (
    <div className="">
      {/* <BigCalendar data={data2}/> */}
      <CalendarApp data={data1} />
    </div>
  );
};

export default BigCalendarContainer;