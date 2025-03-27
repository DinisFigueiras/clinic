import BigCalendar from "@/components/BigCalendar"
import BigCalendarContainer from "@/components/BigCalendarContainer"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import FormModal from "@/components/FormModal"
import BookingsForm3 from "@/components/Forms/BookingForm3";
import BookingForm2 from "@/components/Forms/BookingsForm2";
import prisma from "@/lib/prisma";

const CalendarPage = async ({searchParams}:{searchParams: {[keys: string]: string | undefined}}) => {
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
    
    
    return(
        <div className='flex-1 p-4 flex gap-4 flex-col xl:flex-row'> 
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                <div className="h-full bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold"> Calendário</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">

                    <FormModal
                    table="bookings"
                    type="create"
                    patients={patients}
                    products={products}
                    />
                    <FormModal
                    table="bookings"
                    type="update"
                    patients={patients}
                    products={products}
                    />
                    <FormModal
                    table="bookings"
                    type="delete"
                    patients={patients}
                    products={products}
                    />

                    {/* <BookingsForm3 patients={patients} products={products} /> */}
                    </div>
                    <div className="h-[80vh]"><BigCalendarContainer/></div>
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
            <div className="bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Marcações</h1>
            </div>
            <EventCalendarContainer searchParams={searchParams}/>
            </div>
        </div>
    )
}

export default CalendarPage