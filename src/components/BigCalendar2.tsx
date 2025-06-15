'use client'

import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from "react";

/**
 * Event interface for calendar bookings
 */
interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
  state: string;
}

/**
 * Calendar configuration for Portuguese locale
 */
const config = {
    locale: 'pt-PT',
    firstDayOfWeek: 1, // Monday
    dayBoundaries: {
        start: '07:00',
        end: '24:00',
    },
}

/**
 * Main calendar component using ScheduleX
 */
const CalendarApp = ({ data }: { data: Event[] }) => {
  const [events, setEvents] = useState<Event[]>(data);

  // Calendar plugins for enhanced functionality
  const plugins = [
    createEventsServicePlugin(),
    createEventModalPlugin(),
    createCurrentTimePlugin({
      fullWeekWidth: true,
      timeZoneOffset: 0
    })
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