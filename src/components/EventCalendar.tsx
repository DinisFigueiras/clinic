"use client"

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import React from "react";
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
type EventCalendarProps = {
  onDaySelect: (date: string) => void;
};
const EventCalendar = ({onDaySelect}: EventCalendarProps) => {
    const [value, setValue] = useState<Value>(new Date());


    // Only call onDaySelect when the user selects a date
    const handleChange = (val: Value) => {
        setValue(val);
        if (val instanceof Date) {
            // Format as YYYY-MM-DD to avoid timezone issues
            const year = val.getFullYear();
            const month = String(val.getMonth() + 1).padStart(2, '0');
            const day = String(val.getDate()).padStart(2, '0');
            onDaySelect(`${year}-${month}-${day}`);
        }
    };

    return( <Calendar onChange={handleChange} value={value}/> )
}

export default EventCalendar