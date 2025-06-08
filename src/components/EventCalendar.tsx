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
        onDaySelect(val.toISOString());
        }
    };

    return( <Calendar onChange={handleChange} value={value}/> )
}

export default EventCalendar