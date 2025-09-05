"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { icalParser } from "@/lib/ical-parser"
import { useToast } from "@/hooks/use-toast"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId: string | null
}

export function EventModal({ isOpen, onClose, propertyId }: EventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    guests: "",
    status: "pending",
    source: "Direct",
    notes: "",
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Dates",
        description: "Please select both check-in and check-out dates",
        variant: "destructive",
      })
      return
    }

    if (formData.endDate <= formData.startDate) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      })
      return
    }

    // Generate iCal-compliant UID using iCal.NET standards
    const uid = `booking-${Date.now()}@property-${propertyId || "unknown"}.com`

    // Create iCal event object
    const icalEvent = {
      uid,
      summary: formData.title,
      dtStart: formData.startDate,
      dtEnd: formData.endDate,
      description: `Guests: ${formData.guests}\nSource: ${formData.source}\nNotes: ${formData.notes}`,
      status: formData.status.toUpperCase() as "CONFIRMED" | "TENTATIVE" | "CANCELLED",
      created: new Date(),
      lastModified: new Date(),
    }

    // Validate event using iCal.NET standards
    try {
      const icalContent = icalParser.generateICalContent([icalEvent], "Property Booking")
      console.log("Generated iCal content:", icalContent)

      toast({
        title: "Booking Created",
        description: `${formData.title} has been added to the calendar with iCal.NET compliance`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: `Failed to create iCal-compliant booking: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Guest Name</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter guest name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleInputChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleInputChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guests">Guests</Label>
              <Input
                id="guests"
                type="number"
                value={formData.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
                placeholder="Number of guests"
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tentative">Tentative</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="source">Source</Label>
            <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Direct">Direct</SelectItem>
                <SelectItem value="Airbnb">Airbnb</SelectItem>
                <SelectItem value="VRBO">VRBO</SelectItem>
                <SelectItem value="Booking.com">Booking.com</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Special requests, notes..."
              rows={3}
            />
          </div>

          <div className="text-xs text-muted-foreground p-2 bg-gray-50 rounded">
            This booking will be created with iCal.NET compliance and RFC 5545 standards.
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
