"use client"
import { ICalIntegration } from "./ical-integration"

// Mock data for properties
const properties = [
  { id: "1", name: "Sunset Villa", location: "Malibu, CA", feedCount: 2 },
  { id: "2", name: "Downtown Loft", location: "NYC, NY", feedCount: 1 },
  { id: "3", name: "Beach House", location: "Miami, FL", feedCount: 3 },
  { id: "4", name: "Mountain Cabin", location: "Aspen, CO", feedCount: 0 },
]

// Mock data for connected feeds (property-specific)
const mockFeeds = {
  "1": [
    {
      id: "feed-1",
      name: "Airbnb Calendar",
      platform: "Airbnb",
      url: "https://calendar.airbnb.com/calendar/ical/123456.ics",
      status: "active",
      lastSync: "2 minutes ago",
      events: 15,
    },
    {
      id: "feed-2",
      name: "VRBO Bookings",
      platform: "VRBO",
      url: "https://www.vrbo.com/calendar/ical/789012.ics",
      status: "syncing",
      lastSync: "Syncing...",
      events: 8,
    },
  ],
  "2": [
    {
      id: "feed-3",
      name: "Booking.com Calendar",
      platform: "Booking.com",
      url: "https://admin.booking.com/calendar/ical/345678.ics",
      status: "active",
      lastSync: "5 minutes ago",
      events: 12,
    },
  ],
  "3": [
    {
      id: "feed-4",
      name: "Airbnb Main",
      platform: "Airbnb",
      url: "https://calendar.airbnb.com/calendar/ical/456789.ics",
      status: "active",
      lastSync: "1 minute ago",
      events: 22,
    },
    {
      id: "feed-5",
      name: "Google Calendar",
      platform: "Google Calendar",
      url: "https://calendar.google.com/calendar/ical/user%40gmail.com/private-abc123/basic.ics",
      status: "error",
      lastSync: "Failed",
      events: 0,
    },
    {
      id: "feed-6",
      name: "VRBO Secondary",
      platform: "VRBO",
      url: "https://www.vrbo.com/calendar/ical/567890.ics",
      status: "active",
      lastSync: "3 minutes ago",
      events: 6,
    },
  ],
  "4": [],
}

const platforms = [
  {
    id: "airbnb",
    name: "Airbnb",
    example: "https://calendar.airbnb.com/calendar/ical/[LISTING_ID].ics",
    instructions: "Go to your Airbnb listing → Calendar → Availability settings → Export calendar",
  },
  {
    id: "vrbo",
    name: "VRBO",
    example: "https://www.vrbo.com/calendar/ical/[PROPERTY_ID].ics",
    instructions: "In your VRBO dashboard → Calendar → Sync calendars → Export",
  },
  {
    id: "booking",
    name: "Booking.com",
    example: "https://admin.booking.com/calendar/ical/[PROPERTY_ID].ics",
    instructions: "Extranet → Calendar → Calendar sync → Export calendar URL",
  },
  {
    id: "google",
    name: "Google Calendar",
    example: "https://calendar.google.com/calendar/ical/[EMAIL]/private-[KEY]/basic.ics",
    instructions: "Google Calendar → Settings → Calendar settings → Integrate calendar → Secret address in iCal format",
  },
  {
    id: "other",
    name: "Other",
    example: "https://example.com/calendar.ics",
    instructions: "Any valid iCal (.ics) URL from your calendar provider",
  },
]

interface ICalFeedManagerProps {
  selectedProperty: string | null
  onNavigate: (view: string) => void
  onPropertySelect: (propertyId: string) => void
}

export function ICalFeedManager({ selectedProperty, onNavigate, onPropertySelect }: ICalFeedManagerProps) {
  return <ICalIntegration />
}
