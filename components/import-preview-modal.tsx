"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Calendar, CheckCircle, AlertTriangle, Users, DollarSign, Clock, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImportPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  previewData: any
  onConfirmImport: (selectedEvents: string[]) => void
}

export function ImportPreviewModal({ isOpen, onClose, previewData, onConfirmImport }: ImportPreviewModalProps) {
  const [selectedEvents, setSelectedEvents] = React.useState<string[]>([])
  const { toast } = useToast()

  React.useEffect(() => {
    if (previewData?.events) {
      // Select all events by default
      setSelectedEvents(previewData.events.map((_: any, index: number) => index.toString()))
    }
  }, [previewData])

  if (!previewData) return null

  const handleEventToggle = (eventIndex: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventIndex) ? prev.filter((id) => id !== eventIndex) : [...prev, eventIndex],
    )
  }

  const handleSelectAll = () => {
    if (selectedEvents.length === previewData.events.length) {
      setSelectedEvents([])
    } else {
      setSelectedEvents(previewData.events.map((_: any, index: number) => index.toString()))
    }
  }

  const handleImport = () => {
    if (selectedEvents.length === 0) {
      toast({
        title: "No Events Selected",
        description: "Please select at least one event to import.",
        variant: "destructive",
      })
      return
    }

    onConfirmImport(selectedEvents)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Import Preview - {previewData.platform}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Import Summary */}
          <div className="grid gap-4 sm:gap-6">
            {/* iCal Validation Results */}
            {previewData.validation && (
              <div
                className={`p-3 sm:p-4 rounded-lg border ${
                  previewData.validation.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {previewData.validation.isValid ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                  )}
                  <span
                    className={`font-medium text-sm sm:text-base ${
                      previewData.validation.isValid ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    iCal.NET Validation Results
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                  <div className={previewData.validation.isValid ? "text-green-700" : "text-red-700"}>
                    <div className="font-medium">Format</div>
                    <div>{previewData.validation.isValid ? "Valid" : "Invalid"}</div>
                  </div>
                  <div className={previewData.validation.isValid ? "text-green-700" : "text-red-700"}>
                    <div className="font-medium">Version</div>
                    <div>{previewData.validation.version}</div>
                  </div>
                  <div className={previewData.validation.isValid ? "text-green-700" : "text-red-700"}>
                    <div className="font-medium">Events</div>
                    <div>{previewData.validation.components?.vevent || 0}</div>
                  </div>
                  <div className={previewData.validation.isValid ? "text-green-700" : "text-red-700"}>
                    <div className="font-medium">Encoding</div>
                    <div>{previewData.validation.encoding}</div>
                  </div>
                </div>

                {previewData.validation.errors?.length > 0 && (
                  <div className="mt-3 p-2 bg-red-100 rounded border border-red-200">
                    <div className="text-xs sm:text-sm font-medium text-red-800 mb-1">Validation Errors:</div>
                    <ul className="text-xs text-red-700 space-y-1">
                      {previewData.validation.errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {previewData.validation.warnings?.length > 0 && (
                  <div className="mt-3 p-2 bg-yellow-100 rounded border border-yellow-200">
                    <div className="text-xs sm:text-sm font-medium text-yellow-800 mb-1">Warnings:</div>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {previewData.validation.warnings.map((warning: string, index: number) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-blue-700">Total Events</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-blue-900">{previewData.totalEvents}</div>
              </div>

              <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="text-xs sm:text-sm font-medium text-green-700">Selected</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-green-900">{selectedEvents.length}</div>
              </div>

              <div className="p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  <span className="text-xs sm:text-sm font-medium text-purple-700">Date Range</span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-purple-900">
                  {formatDate(previewData.dateRange.start)} - {formatDate(previewData.dateRange.end)}
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  <span className="text-xs sm:text-sm font-medium text-red-700">Conflicts</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-red-900">{previewData.conflicts?.length || 0}</div>
              </div>
            </div>
          </div>

          {/* Conflicts Warning */}
          {previewData.conflicts && previewData.conflicts.length > 0 && (
            <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-amber-900 text-sm sm:text-base">Booking Conflicts Detected</h4>
                  <p className="text-xs sm:text-sm text-amber-800 mt-1">
                    The following dates have conflicting bookings that will need to be resolved:
                  </p>
                  <div className="mt-2 space-y-1">
                    {previewData.conflicts.map((conflict: any, index: number) => (
                      <div key={index} className="text-xs sm:text-sm text-amber-700">
                        • {conflict.date}: "{conflict.existing}" conflicts with "{conflict.new}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Event Selection */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base sm:text-lg font-semibold">Select Events to Import</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="bg-white/70 self-start sm:self-auto text-xs sm:text-sm"
              >
                {selectedEvents.length === previewData.events.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            <ScrollArea className="h-64 sm:h-80 w-full border rounded-lg">
              <div className="p-3 sm:p-4 space-y-3">
                {previewData.events.map((event: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedEvents.includes(index.toString())
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedEvents.includes(index.toString())}
                        onCheckedChange={() => handleEventToggle(index.toString())}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="font-medium text-sm sm:text-base truncate">{event.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {formatDate(event.start)} - {formatDate(event.end)}
                            </Badge>
                          </div>
                        </div>
                        {event.summary && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{event.summary}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                          {event.guests && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{event.guests} guests</span>
                            </div>
                          )}
                          {event.revenue && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>${event.revenue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* iCal.NET Processing Info */}
          <div className="p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-4 w-4 text-indigo-600" />
              <span className="font-medium text-indigo-900 text-sm sm:text-base">Processing Information</span>
            </div>
            <div className="text-xs sm:text-sm text-indigo-800 space-y-1">
              <div>• Events will be parsed and validated using iCal.NET library</div>
              <div>• Timezone information will be automatically converted</div>
              <div>• Recurring events will be expanded according to RFC 5545 rules</div>
              <div>• Duplicate events will be automatically detected and merged</div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose} className="bg-white/70 text-sm sm:text-base">
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={selectedEvents.length === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm sm:text-base"
          >
            Import {selectedEvents.length} Event{selectedEvents.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
