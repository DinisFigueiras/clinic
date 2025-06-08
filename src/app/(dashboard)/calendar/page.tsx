import BigCalendarContainer from "@/components/BigCalendarContainer"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import FormModalBookings from "@/components/FormModalBookings";
import prisma from "@/lib/prisma";

const CalendarPage = async ({ searchParams }: { searchParams: Promise<{ [keys: string]: string | undefined }> }) => {
  // Await the searchParams Promise
  const params = await searchParams;
  // Fetch patients and products directly in the Server Component
  const patients = await prisma.patient.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const products = await prisma.medication.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold text-neutral text-center">Calendário</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <h2 className="text-sm text-neutralLight"> Clique aqui para criar uma nova marcação</h2>
            {/* Create and Update Booking Modals */}
            {/* Create Booking Modal */}
            <FormModalBookings
              table="bookings"
              patients={patients}
              products={products}
            />
          </div>
          <div className="h-[80vh]">
            <BigCalendarContainer />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl text-neutral font-semibold">Marcações</h1>
        </div>
        <EventCalendarContainer searchParams={params} />
      </div>
    </div>
  );
};

export default CalendarPage;