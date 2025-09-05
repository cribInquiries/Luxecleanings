"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Calendar, Search, Plus, MapPin, Users, Clock, Building2 } from "lucide-react"

interface GlobalCalendarViewProps {
  onNavigate: (view: string) => void
  onPropertySelect: (propertyId: string) => void
}

const mockEvents = [
  {
    id: "1",
    title: "Johnson Family",
    property: "Luxury Oceanview Villa",
    propertyId: "1",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    guests: 4,
    status: "confirmed",
    revenue: "$2,250",
  },
  {
    id: "2",
    title: "Smith Couple",
    property: "Modern Downtown Loft",
    propertyId: "2",
    startDate: "2024-01-18",
    endDate: "2024-01-22",
    guests: 2,
    status: "pending",
    revenue: "$1,120",
  },
  {
    id: "3",
    title: "Wilson Group",
    property: "Cozy Mountain Cabin",
    propertyId: "3",
    startDate: "2024-01-25",
    endDate: "2024-01-30",
    guests: 6,
    status: "confirmed",
    revenue: "$1,600",
  },
]

const properties = [
  { id: "1", name: "Luxury Oceanview Villa", location: "Malibu, CA" },
  { id: "2", name: "Modern Downtown Loft", location: "Austin, TX" },
  { id: "3", name: "Cozy Mountain Cabin", location: "Aspen, CO" },
]

export function GlobalCalendarView({ onNavigate, onPropertySelect }: GlobalCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1))
  const [selectedProperty, setSelectedProperty] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("month")

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredEvents = mockEvents.filter((event) => {
    const matchesProperty = selectedProperty === "all" || event.propertyId === selectedProperty
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.property.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesProperty && matchesSearch
  })

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-slate-100"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayEvents = filteredEvents.filter((event) => dateStr >= event.startDate && dateStr <= event.endDate)

      days.push(
        <div key={day} className="h-24 border border-slate-100 p-1 bg-white hover:bg-slate-50 transition-colors">
          <div className="text-sm font-medium text-slate-900 mb-1">{day}</div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="text-xs p-1 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => onPropertySelect(event.propertyId)}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && <div className="text-xs text-slate-500">+{dayEvents.length - 2} more</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Global Calendar</h1>
          <p className="text-slate-600 mt-1">View all bookings across your properties</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate("dashboard")} className="h-9">
            <Building2 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-9">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search bookings or properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-full lg:w-64 h-9">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-full lg:w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="h-8 px-3">
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth(1)} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 border-b border-slate-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-slate-600 bg-slate-50">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">{renderCalendarGrid()}</div>
        </CardContent>
      </Card>

      {/* Upcoming Bookings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Bookings</CardTitle>
          <CardDescription>Next 7 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onPropertySelect(event.propertyId)}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{event.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.property}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.guests} guests
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.startDate} - {event.endDate}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">{event.revenue}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
