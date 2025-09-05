"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventModal } from "@/components/event-modal"
import { EventDetailsModal } from "@/components/event-details-modal"
import { useToast } from "@/hooks/use-toast"
import { icalParser, type ICalValidationResult } from "@/lib/ical-parser"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowLeft,
  AlertTriangle,
  Link2,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  Settings,
  Download,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CalendarViewProps {
  selectedProperty: string | null
  onNavigate: (view: string) => void
}

const mockEvents = [
  {
    id: "1",
    title: "Vivian",
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 4),
    guests: 4,
    status: "confirmed",
    source: "Airbnb",
    avatar: "/placeholder.svg?height=32&width=32&text=V",
    color: "bg-teal-500",
    uid: "airbnb-booking-001@airbnb.com",
  },
  {
    id: "2",
    title: "Marissa",
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 3),
    guests: 2,
    status: "confirmed",
    source: "VRBO",
    avatar: "/placeholder.svg?height=32&width=32&text=M",
    color: "bg-teal-600",
    uid: "vrbo-booking-002@vrbo.com",
  },
  {
    id: "3",
    title: "Joe Olsen TA",
    start: new Date(2024, 0, 4),
    end: new Date(2024, 0, 7),
    guests: 6,
    status: "confirmed",
    source: "Direct",
    avatar: "/placeholder.svg?height=32&width=32&text=J",
    color: "bg-gray-400",
    uid: "direct-booking-003@property.com",
  },
]

const mockFeeds = [
  {
    id: "1",
    name: "Airbnb Calendar",
    url: "https://calendar.airbnb.com/calendar/ical/12345.ics",
    platform: "Airbnb",
    status: "active",
    lastSync: "2024-01-10T10:30:00Z",
    eventCount: 15,
    errors: [],
    icalVersion: "2.0",
    prodId: "-//Airbnb Inc//Airbnb Calendar//EN",
  },
  {
    id: "2",
    name: "VRBO Bookings",
    url: "https://www.vrbo.com/calendar/ical/67890.ics",
    platform: "VRBO",
    status: "active",
    lastSync: "2024-01-10T09:15:00Z",
    eventCount: 8,
    errors: [],
    icalVersion: "2.0",
    prodId: "-//VRBO//VRBO Calendar//EN",
  },
]

const properties = [
  { id: "1", name: "Beach House", location: "Malibu, CA" },
  { id: "2", name: "City Apartment", location: "NYC, NY" },
]

export function CalendarView({ selectedProperty, onNavigate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1))
  const [showEventModal, setShowEventModal] = useState(false)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [feeds, setFeeds] = useState(mockFeeds)
  const [newFeedUrl, setNewFeedUrl] = useState("")
  const [newFeedName, setNewFeedName] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [validationResult, setValidationResult] = useState<ICalValidationResult | null>(null)
  const { toast } = useToast()

  const property = properties.find((p) => p.id === selectedProperty)

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

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const dayNamesShort = ["M", "T", "W", "T", "F", "S", "S"]

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday=0 to Monday=0
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const handleAddFeed = async () => {
    if (!newFeedUrl || !newFeedName) {
      toast({
        title: "Missing Information",
        description: "Please provide both feed name and URL",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)

    try {
      // Use iCal.NET parser to validate the feed
      const result = await icalParser.parseICalFromUrl(newFeedUrl)
      setValidationResult(result)

      if (!result.isValid) {
        toast({
          title: "iCal Validation Failed",
          description: `Errors: ${result.errors.join(", ")}`,
          variant: "destructive",
        })
        setIsImporting(false)
        return
      }

      const newFeed = {
        id: Date.now().toString(),
        name: newFeedName,
        url: newFeedUrl,
        platform: "Custom",
        status: "active" as const,
        lastSync: new Date().toISOString(),
        eventCount: result.events.length,
        errors: result.errors,
        icalVersion: result.version || "2.0",
        prodId: result.prodId || "Unknown",
      }

      setFeeds([...feeds, newFeed])
      setNewFeedUrl("")
      setNewFeedName("")
      setIsImporting(false)

      toast({
        title: "Feed Connected Successfully",
        description: `${newFeed.name} connected with ${result.events.length} events. iCal.NET validation passed.`,
      })
    } catch (error) {
      setIsImporting(false)
      toast({
        title: "Connection Failed",
        description: `Failed to connect feed: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleSyncFeed = async (feedId: string) => {
    const feed = feeds.find((f) => f.id === feedId)
    if (!feed) return

    try {
      const result = await icalParser.parseICalFromUrl(feed.url)

      if (result.isValid) {
        setFeeds(
          feeds.map((f) =>
            f.id === feedId
              ? {
                  ...f,
                  lastSync: new Date().toISOString(),
                  status: "active" as const,
                  eventCount: result.events.length,
                  errors: result.errors,
                }
              : f,
          ),
        )

        toast({
          title: "Sync Complete",
          description: `Synchronized ${result.events.length} events using iCal.NET`,
        })
      } else {
        setFeeds(
          feeds.map((f) =>
            f.id === feedId
              ? {
                  ...f,
                  status: "error" as const,
                  errors: result.errors,
                }
              : f,
          ),
        )

        toast({
          title: "Sync Failed",
          description: `iCal.NET validation errors: ${result.errors.join(", ")}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Sync Error",
        description: `Failed to sync feed: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteFeed = (feedId: string) => {
    setFeeds(feeds.filter((feed) => feed.id !== feedId))
    toast({
      title: "Feed Disconnected",
      description: "iCal feed has been removed from this property",
    })
  }

  const handleExportCalendar = () => {
    try {
      // Convert mock events to iCal format using iCal.NET
      const icalEvents = mockEvents.map((event) => ({
        uid: event.uid,
        summary: event.title,
        dtStart: event.start,
        dtEnd: event.end,
        description: `Guests: ${event.guests}`,
        status: event.status.toUpperCase() as "CONFIRMED" | "TENTATIVE" | "CANCELLED",
        created: new Date(),
        lastModified: new Date(),
      }))

      const icalContent = icalParser.generateICalContent(icalEvents, property?.name || "Property Calendar")

      // Create download
      const blob = new Blob([icalContent], { type: "text/calendar" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${property?.name || "property"}-calendar.ics`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Calendar Exported",
        description: "iCal file generated using iCal.NET and downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Failed to export calendar: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const renderMobileCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="mobile-calendar-cell bg-gray-50"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayEvents = mockEvents.filter(
        (event) =>
          dateStr >= event.start.toISOString().split("T")[0] && dateStr <= event.end.toISOString().split("T")[0],
      )

      days.push(
        <div key={day} className="mobile-calendar-cell border border-gray-200 bg-white relative">
          <div className="text-xs font-medium text-gray-900 mb-1">{day}</div>
          <div className="space-y-1">
            {dayEvents.slice(0, 1).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded ${event.color} text-white cursor-pointer`}
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-center gap-1">
                  <Avatar className="h-3 w-3">
                    <AvatarImage src={event.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{event.title.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs">{event.title}</span>
                </div>
              </div>
            ))}
            {dayEvents.length > 1 && <div className="text-xs text-gray-500">+{dayEvents.length - 1}</div>}
          </div>
        </div>,
      )
    }

    return <div className="grid grid-cols-7 gap-0">{days}</div>
  }

  const renderDesktopCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7
    const days = []

    // Create grid of dates
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth
      const date = isValidDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber) : null

      days.push({
        dayNumber: isValidDay ? dayNumber : null,
        date,
        isValidDay,
        gridPosition: i,
      })
    }

    // Calculate booking positions
    const bookingRows: any[][] = []

    mockEvents.forEach((event) => {
      const eventStartDay = days.findIndex((day) => day.date && isSameDay(day.date, event.start))
      const eventEndDay = days.findIndex((day) => day.date && isSameDay(day.date, event.end))

      if (eventStartDay !== -1 && eventEndDay !== -1) {
        // Find available row
        let rowIndex = 0
        while (bookingRows[rowIndex]) {
          const hasConflict = bookingRows[rowIndex].some(
            (booking) =>
              booking &&
              ((eventStartDay >= booking.startPos && eventStartDay <= booking.endPos) ||
                (eventEndDay >= booking.startPos && eventEndDay <= booking.endPos) ||
                (eventStartDay <= booking.startPos && eventEndDay >= booking.endPos)),
          )
          if (!hasConflict) break
          rowIndex++
        }

        if (!bookingRows[rowIndex]) {
          bookingRows[rowIndex] = new Array(totalCells).fill(null)
        }

        // Calculate span across weeks
        const startWeek = Math.floor(eventStartDay / 7)
        const endWeek = Math.floor(eventEndDay / 7)

        if (startWeek === endWeek) {
          // Single week booking
          bookingRows[rowIndex][eventStartDay] = {
            ...event,
            startPos: eventStartDay,
            endPos: eventEndDay,
            span: eventEndDay - eventStartDay + 1,
            isStart: true,
            isEnd: true,
          }
        } else {
          // Multi-week booking - split into segments
          for (let week = startWeek; week <= endWeek; week++) {
            const weekStart = week * 7
            const weekEnd = weekStart + 6
            const segmentStart = week === startWeek ? eventStartDay : weekStart
            const segmentEnd = week === endWeek ? eventEndDay : Math.min(weekEnd, eventEndDay)

            if (segmentStart <= segmentEnd && days[segmentStart]?.isValidDay) {
              bookingRows[rowIndex][segmentStart] = {
                ...event,
                startPos: segmentStart,
                endPos: segmentEnd,
                span: segmentEnd - segmentStart + 1,
                isStart: week === startWeek,
                isEnd: week === endWeek,
              }
            }
          }
        }
      }
    })

    const weeks = []
    for (let week = 0; week < Math.ceil(totalCells / 7); week++) {
      const weekDays = days.slice(week * 7, (week + 1) * 7)
      weeks.push(weekDays)
    }

    return (
      <div className="space-y-0">
        {weeks.map((weekDays, weekIndex) => (
          <div key={weekIndex} className="relative">
            {/* Date row */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="h-16 border-r border-gray-200 p-2 bg-white relative">
                  {day.isValidDay && <div className="text-sm font-medium text-gray-900">{day.dayNumber}</div>}
                </div>
              ))}
            </div>

            {/* Booking rows */}
            {bookingRows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 h-8 relative">
                {weekDays.map((day, dayIndex) => {
                  const globalDayIndex = weekIndex * 7 + dayIndex
                  const booking = row[globalDayIndex]

                  if (booking && booking.startPos === globalDayIndex) {
                    return (
                      <div
                        key={dayIndex}
                        className={`
                          ${booking.color} text-white text-xs font-medium
                          flex items-center px-2 mx-1 rounded-md cursor-pointer
                          hover:opacity-90 transition-opacity
                        `}
                        style={{
                          gridColumn: `span ${booking.span}`,
                        }}
                        onClick={() => handleEventClick(booking)}
                      >
                        <Avatar className="h-4 w-4 mr-1">
                          <AvatarImage src={booking.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{booking.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{booking.title}</span>
                      </div>
                    )
                  }

                  return <div key={dayIndex} className="border-r border-gray-100" />
                })}
              </div>
            ))}

            {/* Clean periods */}
            <div className="grid grid-cols-7 h-6">
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-gray-100 flex items-center justify-center">
                  {day.isValidDay && Math.random() > 0.7 && (
                    <span className="text-xs text-gray-400 font-medium">CLEAN</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const conflicts = mockEvents.filter((event1, index) =>
    mockEvents.some((event2, index2) => index !== index2 && event1.start <= event2.end && event1.end >= event2.start),
  )

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - mobile optimized */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="outline" size="sm" onClick={() => onNavigate("properties")} className="touch-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{property?.name || "Property Calendar"}</h1>
            {property && <p className="text-sm text-muted-foreground hidden sm:block">{property.location}</p>}
          </div>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="calendar" className="text-xs sm:text-sm">
            Calendar
          </TabsTrigger>
          <TabsTrigger value="feeds" className="text-xs sm:text-sm">
            Feeds ({feeds.length})
          </TabsTrigger>
          <TabsTrigger value="export" className="text-xs sm:text-sm">
            Export
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4 md:space-y-6">
          {conflicts.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-800 flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5" />
                  Booking Conflicts Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conflicts.map((event) => (
                    <div key={event.id} className="text-sm text-red-700">
                      {event.title} ({event.start.toLocaleDateString()} - {event.end.toLocaleDateString()})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg md:text-xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-1 md:gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)} className="h-8 w-8 p-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                    className="h-8 px-2 text-xs"
                  >
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth(1)} className="h-8 w-8 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setShowEventModal(true)} size="sm" className="ml-2 touch-button">
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Calendar header */}
              <div className="grid grid-cols-7 border-b border-gray-300 bg-gray-50">
                {(window.innerWidth < 640 ? dayNamesShort : dayNames).map((day, index) => (
                  <div
                    key={day}
                    className="p-2 md:p-3 text-center text-xs md:text-sm font-medium text-gray-600 border-r border-gray-200"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid - responsive */}
              <div className="md:hidden">{renderMobileCalendarGrid()}</div>
              <div className="hidden md:block">{renderDesktopCalendarGrid()}</div>
            </CardContent>
          </Card>

          {/* Stats - mobile optimized */}
          <div className="grid gap-4 grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <div className="text-xl md:text-2xl font-bold">{mockEvents.length}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Total Bookings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xl md:text-2xl font-bold text-red-600">{conflicts.length}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Conflicts</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feeds" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Connect iCal Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feedName" className="text-sm font-medium">
                    Feed Name
                  </Label>
                  <Input
                    id="feedName"
                    placeholder="e.g., Airbnb Calendar"
                    value={newFeedName}
                    onChange={(e) => setNewFeedName(e.target.value)}
                    className="mobile-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedUrl" className="text-sm font-medium">
                    iCal URL
                  </Label>
                  <Input
                    id="feedUrl"
                    placeholder="https://calendar.example.com/feed.ics"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    className="mobile-input"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddFeed}
                disabled={isImporting || !newFeedUrl || !newFeedName}
                className="w-full touch-button"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Validating with iCal.NET...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-2" />
                    Connect & Validate Feed
                  </>
                )}
              </Button>

              {validationResult && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm">iCal.NET Validation Result</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>Status: {validationResult.isValid ? "✓ Valid" : "✗ Invalid"}</div>
                    <div>Version: {validationResult.version}</div>
                    <div>Events Found: {validationResult.events.length}</div>
                    {validationResult.prodId && <div>Producer: {validationResult.prodId}</div>}
                    {validationResult.warnings.length > 0 && (
                      <div>
                        <div className="font-medium">Warnings:</div>
                        <ul className="list-disc list-inside ml-2 text-xs">
                          {validationResult.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Connected Feeds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feeds.map((feed) => (
                  <Card key={feed.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(feed.status)}
                            <h3 className="font-semibold text-sm md:text-base truncate">{feed.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {feed.platform}
                            </Badge>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground mb-2 break-all">{feed.url}</p>

                          <div className="grid gap-2 grid-cols-2 md:grid-cols-4 text-xs md:text-sm">
                            <div>
                              <span className="font-medium">Last Sync:</span>
                              <br />
                              <span className="text-muted-foreground">
                                {new Date(feed.lastSync).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Events:</span>
                              <br />
                              <span className="text-muted-foreground">{feed.eventCount}</span>
                            </div>
                            <div className="hidden md:block">
                              <span className="font-medium">iCal Version:</span>
                              <br />
                              <span className="text-muted-foreground">{feed.icalVersion}</span>
                            </div>
                            <div>
                              <span className="font-medium">Status:</span>
                              <br />
                              <Badge variant={feed.status === "active" ? "default" : "destructive"} className="text-xs">
                                {feed.status}
                              </Badge>
                            </div>
                          </div>

                          {feed.prodId && (
                            <div className="mt-2 text-xs text-muted-foreground hidden md:block">
                              Producer: {feed.prodId}
                            </div>
                          )}

                          {feed.errors.length > 0 && (
                            <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                              <div className="text-sm font-medium text-red-800">iCal.NET Validation Errors:</div>
                              <ul className="text-sm text-red-700 list-disc list-inside">
                                {feed.errors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          {/* Desktop actions */}
                          <div className="hidden md:flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleSyncFeed(feed.id)}>
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteFeed(feed.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Mobile menu */}
                          <div className="md:hidden">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSyncFeed(feed.id)}>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Sync
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteFeed(feed.id)} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Export Calendar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Export your property calendar as an iCal file using iCal.NET library for RFC 5545 compliance.
              </div>
              <Button onClick={handleExportCalendar} className="w-full touch-button">
                <Download className="h-4 w-4 mr-2" />
                Export as iCal (.ics)
              </Button>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Export Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• RFC 5545 compliant iCal format</div>
                  <div>• Generated using iCal.NET library</div>
                  <div>• Includes all bookings and metadata</div>
                  <div>• Compatible with all major calendar applications</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">iCal.NET Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm">iCal.NET Library Status</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>✓ RFC 5545 Compliance: Enabled</div>
                    <div>✓ Timezone Support: Full Support</div>
                    <div>✓ Recurrence Rules: Supported</div>
                    <div>✓ Event Validation: Active</div>
                    <div>✓ Multi-format Parsing: Enabled</div>
                  </div>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Advanced iCal.NET settings coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EventModal isOpen={showEventModal} onClose={() => setShowEventModal(false)} propertyId={selectedProperty} />
      <EventDetailsModal isOpen={showEventDetails} onClose={() => setShowEventDetails(false)} event={selectedEvent} />
    </div>
  )
}
