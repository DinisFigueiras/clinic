import { withPrisma } from "@/lib/prisma";
import moment from 'moment-timezone';
import CalendarApp from "./BigCalendar2";

const BigCalendarContainer = async () => {
  const dataRes = await withPrisma(async (prisma) => {
    return await prisma.bookings.findMany({
      include: {
        patient: true
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