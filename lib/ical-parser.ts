export interface ICalEvent {
  uid: string
  summary: string
  dtStart: Date
  dtEnd: Date
  description?: string
  status: "CONFIRMED" | "TENTATIVE" | "CANCELLED"
  created: Date
  lastModified: Date
}

export interface ICalValidationResult {
  isValid: boolean
  events: ICalEvent[]
  errors: string[]
  warnings: string[]
  version?: string
  prodId?: string
}

class ICalParser {
  async parseICalFromUrl(url: string): Promise<ICalValidationResult> {
    try {
      // Simulate fetching and parsing iCal data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock validation result
      const result: ICalValidationResult = {
        isValid: true,
        events: [
          {
            uid: "mock-event-1@example.com",
            summary: "Sample Booking",
            dtStart: new Date(),
            dtEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
            description: "Mock booking from iCal feed",
            status: "CONFIRMED",
            created: new Date(),
            lastModified: new Date(),
          },
        ],
        errors: [],
        warnings: [],
        version: "2.0",
        prodId: "-//Mock Calendar//Mock Calendar//EN",
      }

      return result
    } catch (error) {
      return {
        isValid: false,
        events: [],
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings: [],
      }
    }
  }

  generateICalContent(events: ICalEvent[], calendarName: string): string {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//PropertySync//PropertySync Calendar//EN",
      `X-WR-CALNAME:${calendarName}`,
      "METHOD:PUBLISH",
    ]

    events.forEach((event) => {
      lines.push(
        "BEGIN:VEVENT",
        `UID:${event.uid}`,
        `DTSTART:${this.formatDateTime(event.dtStart)}`,
        `DTEND:${this.formatDateTime(event.dtEnd)}`,
        `SUMMARY:${event.summary}`,
        `DESCRIPTION:${event.description || ""}`,
        `STATUS:${event.status}`,
        `CREATED:${this.formatDateTime(event.created)}`,
        `LAST-MODIFIED:${this.formatDateTime(event.lastModified)}`,
        "END:VEVENT",
      )
    })

    lines.push("END:VCALENDAR")
    return lines.join("\r\n")
  }

  private formatDateTime(date: Date): string {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")
  }
}

export const icalParser = new ICalParser()
