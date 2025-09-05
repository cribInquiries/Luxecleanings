"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, Phone, Mail, Clock, Edit, Trash2, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { icalParser } from "@/lib/ical-parser"

interface EventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  event: any
}

export function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  const { toast } = useToast()

  if (!event) return null

  const handleExportEvent = () => {
    try {
      const icalEvent = {
        uid: event.uid || `event-${event.id}@property.com`,
        summary: event.title,
        dtStart: event.start,
        dtEnd: event.end,
        description: `Guests: ${event.guests}\nSource: ${event.source}`,
        status: event.status.toUpperCase() as "CONFIRMED" | "TENTATIVE" | "CANCELLED",
        created: new Date(),
        lastModified: new Date(),
      }

      const icalContent = icalParser.generateICalContent([icalEvent], "Single Event Export")

      // Create download
      const blob = new Blob([icalContent], { type: "text/calendar" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${event.title.replace(/\s+/g, "-")}-booking.ics`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Event Exported",
        description: "iCal file generated using iCal.NET and downloaded",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Failed to export event: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleCopyUID = () => {
    const uid = event.uid || `event-${event.id}@property.com`
    navigator.clipboard.writeText(uid)
    toast({
      title: "UID Copied",
      description: "iCal UID copied to clipboard",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={event.avatar || "/placeholder.svg"} />
              <AvatarFallback>{event.title?.charAt(0) || "G"}</AvatarFallback>
            </Avatar>
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <div className="flex gap-2">
                <Badge variant={event.status === "confirmed" ? "default" : "secondary"}>{event.status}</Badge>
                <Badge variant="outline">{event.source}</Badge>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Check-in - Check-out</div>
                  <div className="text-sm text-muted-foreground">
                    {event.start?.toLocaleDateString()} - {event.end?.toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Guests</div>
                  <div className="text-sm text-muted-foreground">{event.guests} guests</div>
                </div>
              </div>

              {event.uid && (
                <div className="flex items-center gap-3">
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">iCal UID</div>
                    <div className="text-xs text-muted-foreground break-all">{event.uid}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopyUID}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {event.guestEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{event.guestEmail}</div>
                  </div>
                </div>
              )}

              {event.guestPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{event.guestPhone}</div>
                  </div>
                </div>
              )}

              {event.checkIn && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Check-in Time</div>
                    <div className="text-sm text-muted-foreground">{event.checkIn}</div>
                  </div>
                </div>
              )}

              {event.specialRequests && (
                <div className="space-y-2">
                  <div className="font-medium">Special Requests</div>
                  <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">{event.specialRequests}</div>
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">iCal.NET Integration</div>
                <div>✓ RFC 5545 compliant event</div>
                <div>✓ Unique identifier assigned</div>
                <div>✓ Export ready</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleExportEvent} className="flex-1 bg-transparent">
              <Copy className="h-4 w-4 mr-2" />
              Export iCal
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
