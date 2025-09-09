'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BookingPage() {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Cleaning Service',
      start: new Date().toISOString().split('T')[0] + 'T10:00:00',
      end: new Date().toISOString().split('T')[0] + 'T12:00:00',
    },
  ])

  const handleDateSelect = (selectInfo: any) => {
    const title = prompt('Please enter a title for the event')
    if (title) {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
        },
      ])
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            height="auto"
          />
        </CardContent>
      </Card>
    </div>
  )
}
