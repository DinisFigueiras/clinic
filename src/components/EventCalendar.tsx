"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

// //TEMPORARIO
// const events = [
//     {
//         id: 1,
//         title: "Lorem Ipsun dolor",
//         time: "12:00 PM - 2:00 PM",
//         description:"Lorem Ipsun dolor Lorem Ipsun dolor Lorem Ipsun dolor",
//     },
//     {
//         id: 2,
//         title: "Lorem Ipsun dolor",
//         time: "12:00 PM - 2:00 PM",
//         description:"Lorem Ipsun dolor Lorem Ipsun dolor Lorem Ipsun dolor",
//     },
//     {
//         id: 3,
//         title: "Lorem Ipsun dolor",
//         time: "12:00 PM - 2:00 PM",
//         description:"Lorem Ipsun dolor Lorem Ipsun dolor Lorem Ipsun dolor",
        
//     },
//     {
//         id: 4,
//         title: "Lorem Ipsun dolor",
//         time: "12:00 PM - 2:00 PM",
//         description:"Lorem Ipsun dolor Lorem Ipsun dolor Lorem Ipsun dolor",
        
//     },
//     {
//         id: 5,
//         title: "Lorem Ipsun dolor",
//         time: "12:00 PM - 2:00 PM",
//         description:"Lorem Ipsun dolor Lorem Ipsun dolor Lorem Ipsun dolor",
        
//     },
//     {
//         id: 6,
//         title: "Lorem Ipsun dolor",
//         time: "12:00 PM - 2:00 PM",
//         description:"Lorem Ipsun dolor Lorem Ipsun dolor Lorem Ipsun dolor",
        
//     },
//     {
//         id: 7,
//         title: "Lorem Ipsun dolor",
//         time: "12:00 PM - 2:00 PM",
//         description:"Lorem Ipsun dolor Lorem Ipsun dolor Lorem Ipsun dolor",
        
//     },
// ]
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());

    const router = useRouter();

    useEffect(() => {
        if (value instanceof Date) {
            router.push(`?date=${value}`);
        }
    }, [value,router])

    return( <Calendar onChange={onChange} value={value}/> )
}

export default EventCalendar