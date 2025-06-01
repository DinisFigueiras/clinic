import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";
import EventListPatientID from "./EventListPatientID";

const EventCalendarContainerPatientID = async ({searchParams, patientId}:{searchParams: {[keys: string]: string | undefined}; patientId: number}) => {
    
    return (
        <div className='bg-white p-4 rounded-md'> 
            <EventCalendar/>
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold my-4">Marcações Futuras</h1>
                    <Image src="/moreDark.png" alt="" width={20} height={20}/>
                </div>
            <div className="flex flex-col gap-4">
                <EventListPatientID futureOnly={true} patientId={patientId}/>
            </div>
        </div>
    );
}

export default EventCalendarContainerPatientID;