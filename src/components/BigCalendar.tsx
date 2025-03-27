"use client"

import React from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment-timezone';
import 'moment/locale/pt';
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState } from 'react'
import { calendarEvents } from '@/lib/data';

const localizer = momentLocalizer(moment)

const BigCalendar = ({data}:{data:{title:string;start:Date;end:Date}[]}) => {
    const [view, setView] = useState<View>(Views.WORK_WEEK)

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView);
    }

    const messages = {
        work_week: 'Semana de Trabalho',
        day: 'Dia',
        week: 'Semana',
        month: 'Mês',
        today: 'Hoje',
        previous: 'Anterior',
        next: 'Próximo',
        agenda: 'Agenda',
        date: 'Data',
        time: 'Hora',
        event: 'Evento',
        noEventsInRange: 'Não há eventos neste intervalo',
    };

    const eventPropGetter = () => {
        return {
            style: {
                borderRadius: "5px",
                padding: "2px 5px",
                margin: "2px",
                minWidth: "100px", // Ensure events have enough width
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }
        };
    };

        return(
            <div style={{ height: '90vh', width: '100%', margin: "auto" }}>
                <Calendar
                
                localizer={localizer}
                formats={{dayHeaderFormat: (date) => moment(date).format('dddd D/MM')}}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                views={["work_week","day"]}
                view={view}
                style={{ height: "98%" }}
                onView={handleOnChangeView}
                min={new Date(2025,0,1,8,0,0)}
                max={new Date(2025,0,1,20,0,0)}
                messages={messages}
                step={15} // Set the step to 15 minutes
                timeslots={4} // Display 4 timeslots per hour (15 minutes each)
                eventPropGetter={eventPropGetter} // Apply custom styles to events
                />
            </div>
        );
};

export default BigCalendar;