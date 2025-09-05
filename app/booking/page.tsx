'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { format } from 'date-fns'
import BookingForm from '@/components/booking-form'

interface Booking {
  id: string
  title: string
  start: string
  end: string
  type: 'residential' | 'commercial' | 'deep'
  status: 'pending' | 'confirmed' | 'completed'
  customer: string
  address: string
}

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  // Load bookings from API
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await fetch('/api/bookings')
        if (response.ok) {
          const data = await response.json()
          setBookings(data)
        }
      } catch (error) {
        console.error('Error loading bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start)
    setShowBookingForm(true)
  }

  const handleEventClick = (clickInfo: any) => {
    const booking = bookings.find(b => b.id === clickInfo.event.id)
    if (booking) {
      alert(`Booking Details:\nCustomer: ${booking.customer}\nAddress: ${booking.address}\nType: ${booking.type}\nStatus: ${booking.status}`)
    }
  }

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings(prev => [...prev, newBooking])
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'residential': return '#3b82f6'
      case 'commercial': return '#10b981'
      case 'deep': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const calendarEvents = bookings.map(booking => ({
    id: booking.id,
    title: booking.title,
    start: booking.start,
    end: booking.end,
    backgroundColor: getEventColor(booking.type),
    borderColor: getEventColor(booking.type),
    textColor: '#ffffff'
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Booking Calendar
          </h1>
          <p className="text-xl text-gray-600">
            Schedule and manage your cleaning appointments
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>
                  Click on a date to create a new booking, or click on an existing event to view details
                </CardDescription>
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
                  events={calendarEvents}
                  select={handleDateSelect}
                  eventClick={handleEventClick}
                  height="600px"
                />
              </CardContent>
            </Card>
          </div>

          {/* Booking Form & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings:</span>
                  <span className="font-semibold">{bookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmed:</span>
                  <span className="font-semibold text-green-600">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-semibold text-yellow-600">
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-blue-600">
                    {bookings.filter(b => b.status === 'completed').length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Service Types */}
            <Card>
              <CardHeader>
                <CardTitle>Service Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Residential Cleaning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Commercial Cleaning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">Deep Cleaning</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => setShowBookingForm(true)}
                >
                  New Booking
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Export calendar data
                    const dataStr = JSON.stringify(bookings, null, 2)
                    const dataBlob = new Blob([dataStr], {type: 'application/json'})
                    const url = URL.createObjectURL(dataBlob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = 'bookings.json'
                    link.click()
                  }}
                >
                  Export Bookings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <BookingForm
            selectedDate={selectedDate}
            onClose={() => {
              setShowBookingForm(false)
              setSelectedDate(null)
            }}
            onBookingCreated={handleBookingCreated}
          />
        )}
      </div>
    </div>
  )
}
