import EventCalendarPatientClient from "./EventCalendarPatientClient";

const EventCalendarContainerPatientID = async ({searchParams, patientId}:{searchParams: {[keys: string]: string | undefined}; patientId: number}) => {
    const { date } = searchParams;

    return (
        <EventCalendarPatientClient
            initialDate={date}
            patientId={patientId}
        />
    );
}

export default EventCalendarContainerPatientID;