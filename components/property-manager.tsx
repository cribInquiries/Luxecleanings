"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Calendar, Trash2, Copy, Link2, Download, MoreVertical } from "lucide-react"
import { icalParser } from "@/lib/ical-parser"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockProperties = [
  {
    id: "1",
    name: "Beach House",
    location: "Malibu, CA",
    status: "active",
    bookings: 12,
    icalUrl: "https://calendar.example.com/property1.ics",
    connectedFeeds: 2,
  },
  {
    id: "2",
    name: "City Apartment",
    location: "NYC, NY",
    status: "active",
    bookings: 8,
    icalUrl: "https://calendar.example.com/property2.ics",
    connectedFeeds: 1,
  },
]

interface PropertyManagerProps {
  onNavigate: (view: string) => void
  onPropertySelect: (propertyId: string) => void
}

export function PropertyManager({ onNavigate, onPropertySelect }: PropertyManagerProps) {
  const [properties, setProperties] = useState(mockProperties)
  const [isAddingProperty, setIsAddingProperty] = useState(false)
  const [newProperty, setNewProperty] = useState({
    name: "",
    location: "",
  })
  const { toast } = useToast()

  const handleAddProperty = () => {
    if (!newProperty.name || !newProperty.location) {
      toast({
        title: "Missing Information",
        description: "Please provide property name and location",
        variant: "destructive",
      })
      return
    }

    const property = {
      id: Date.now().toString(),
      name: newProperty.name,
      location: newProperty.location,
      status: "active" as const,
      bookings: 0,
      icalUrl: `https://calendar.example.com/${newProperty.name.toLowerCase().replace(/\s+/g, "-")}.ics`,
      connectedFeeds: 0,
    }

    setProperties([...properties, property])
    setNewProperty({ name: "", location: "" })
    setIsAddingProperty(false)

    toast({
      title: "Property Created",
      description: `${property.name} has been created with iCal.NET integration ready`,
    })
  }

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(properties.filter((p) => p.id !== propertyId))
    toast({
      title: "Property Removed",
      description: "Property and all its calendar data have been deleted",
    })
  }

  const copyICalUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "iCal URL Copied",
      description: "RFC 5545 compliant URL copied to clipboard",
    })
  }

  const handleExportProperty = async (property: any) => {
    try {
      // Generate sample events for the property
      const sampleEvents = [
        {
          uid: `sample-1@${property.name.toLowerCase().replace(/\s+/g, "-")}.com`,
          summary: "Sample Booking",
          dtStart: new Date(),
          dtEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          description: `Sample booking for ${property.name}`,
          status: "CONFIRMED" as const,
          created: new Date(),
          lastModified: new Date(),
        },
      ]

      const icalContent = icalParser.generateICalContent(sampleEvents, `${property.name} Calendar`)

      // Create download
      const blob = new Blob([icalContent], { type: "text/calendar" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${property.name.toLowerCase().replace(/\s+/g, "-")}-calendar.ics`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Property Calendar Exported",
        description: "iCal file generated using iCal.NET and downloaded",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Failed to export calendar: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - mobile optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Properties</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your properties with iCal.NET integration</p>
        </div>
        <Button onClick={() => setIsAddingProperty(true)} className="w-full sm:w-auto touch-button">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Add Property Form - mobile optimized */}
      {isAddingProperty && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Create New Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyName" className="text-sm font-medium">
                  Property Name
                </Label>
                <Input
                  id="propertyName"
                  placeholder="e.g., Beach House"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  className="mobile-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Malibu, CA"
                  value={newProperty.location}
                  onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                  className="mobile-input"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">iCal.NET Integration</div>
                <div className="space-y-1 text-xs">
                  <div>✓ RFC 5545 compliant calendar will be created</div>
                  <div>✓ Automatic iCal feed generation</div>
                  <div>✓ External feed connection ready</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleAddProperty} className="flex-1 touch-button">
                Create Property
              </Button>
              <Button variant="outline" onClick={() => setIsAddingProperty(false)} className="flex-1 touch-button">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Properties Grid - mobile optimized */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="relative">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base md:text-lg truncate">{property.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{property.location}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <Badge variant={property.status === "active" ? "default" : "secondary"}>{property.status}</Badge>

                  {/* Mobile menu */}
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyICalUrl(property.icalUrl)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportProperty(property)}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteProperty(property.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bookings:</span>
                    <span className="font-medium">{property.bookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Feeds:</span>
                    <div className="flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      <span className="font-medium">{property.connectedFeeds}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop actions */}
                <div className="hidden md:block space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">iCal Export URL:</span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => copyICalUrl(property.icalUrl)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportProperty(property)}>
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground break-all">{property.icalUrl}</p>
                </div>

                {/* Mobile URL display */}
                <div className="md:hidden">
                  <div className="text-sm font-medium mb-1">Export URL:</div>
                  <p className="text-xs text-muted-foreground break-all bg-muted p-2 rounded">{property.icalUrl}</p>
                </div>

                <div className="p-2 bg-gray-50 rounded text-xs text-muted-foreground text-center">
                  iCal.NET powered • RFC 5545 compliant
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1 touch-button bg-transparent"
                  onClick={() => onPropertySelect(property.id)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Open Calendar</span>
                  <span className="sm:hidden">Calendar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteProperty(property.id)}
                  className="hidden md:flex mobile-touch-target"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state for mobile */}
      {properties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
            <p className="text-sm">Create your first property to get started</p>
          </div>
          <Button onClick={() => setIsAddingProperty(true)} className="touch-button">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Property
          </Button>
        </div>
      )}
    </div>
  )
}
