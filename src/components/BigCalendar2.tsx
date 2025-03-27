'use client'

import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'

import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from "react";
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { TimeGrid } from 'react-big-calendar'

interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
  state: string;
}

const config = {
    locale: 'pt-PT',
    firstDayOfWeek: 1,
    dayBoundaries: {
    start: '07:00',
    end: '24:00',
    },
}


const CalendarApp = ({ data }: { data: Event[] }) => {
  const [events, setEvents] = useState<Event[]>(data);

  const plugins = [
    createEventsServicePlugin(),
    createEventModalPlugin(),
    createCurrentTimePlugin(
      {fullWeekWidth: true,
      timeZoneOffset: 0})
  ]

  const calendar: any = useNextCalendarApp({
    views: [
        createViewDay(),
        createViewWeek(), 
        createViewMonthGrid(), 
        createViewMonthAgenda()
      ], events: events,
    plugins: plugins,
    ...config
  })

  useEffect(() => {
    if (calendar && calendar.plugins && calendar.plugins.length > 0 && calendar.plugins[0].eventsService) {
      calendar.plugins[0].eventsService.getAll()
    }
  }, [calendar])

  return (
    <div style={{ height: '80vh', width: '100%', margin: "auto", paddingTop: "20px" }}>
      <ScheduleXCalendar calendarApp={calendar}  /> 
    </div>
  )
}

export default CalendarApp