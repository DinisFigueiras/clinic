import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";
import EventCalendarContainerClient from "./EventCalendarContainerClient";

const EventCalendarContainer = ({searchParams}:{searchParams: {[keys: string]: string | undefined}}) => {
    const params = searchParams;
    const { date } = params;
    return (
        <EventCalendarContainerClient initialDate={date} />
    );
}

export default EventCalendarContainer;