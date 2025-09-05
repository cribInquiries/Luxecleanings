"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, RefreshCw, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react"

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
  },
  {
    id: "3",
    name: "Booking.com Feed",
    url: "https://admin.booking.com/calendar/ical/abc123.ics",
    platform: "Booking.com",
    status: "error",
    lastSync: "2024-01-09T14:20:00Z",
    eventCount: 0,
    errors: ["Invalid iCal format", "Authentication failed"],
  },
]

export function ICalIntegration() {
  const [feeds, setFeeds] = useState(mockFeeds)
  const [newFeedUrl, setNewFeedUrl] = useState("")
  const [newFeedName, setNewFeedName] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

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

    // Simulate validation
    setTimeout(() => {
      const newFeed = {
        id: Date.now().toString(),
        name: newFeedName,
        url: newFeedUrl,
        platform: "Custom",
        status: "active" as const,
        lastSync: new Date().toISOString(),
        eventCount: Math.floor(Math.random() * 20) + 1,
        errors: [],
      }

      setFeeds([...feeds, newFeed])
      setNewFeedUrl("")
      setNewFeedName("")
      setIsImporting(false)

      toast({
        title: "Feed Added",
        description: `${newFeed.name} has been added and synced`,
      })
    }, 2000)
  }

  const handleSyncFeed = async (feedId: string) => {
    setFeeds(
      feeds.map((feed) =>
        feed.id === feedId
          ? {
              ...feed,
              lastSync: new Date().toISOString(),
              status: "active" as const,
            }
          : feed,
      ),
    )

    toast({
      title: "Sync Complete",
      description: "Feed has been synchronized",
    })
  }

  const handleDeleteFeed = (feedId: string) => {
    setFeeds(feeds.filter((feed) => feed.id !== feedId))
    toast({
      title: "Feed Removed",
      description: "iCal feed has been removed",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">iCal Integration</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add iCal Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feedName">Feed Name</Label>
              <Input
                id="feedName"
                placeholder="e.g., Airbnb Calendar"
                value={newFeedName}
                onChange={(e) => setNewFeedName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedUrl">iCal URL</Label>
              <Input
                id="feedUrl"
                placeholder="https://calendar.example.com/feed.ics"
                value={newFeedUrl}
                onChange={(e) => setNewFeedUrl(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleAddFeed} disabled={isImporting || !newFeedUrl || !newFeedName}>
            {isImporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Adding Feed...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Feed
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Feeds ({feeds.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feeds.map((feed) => (
              <Card key={feed.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(feed.status)}
                        <h3 className="font-semibold">{feed.name}</h3>
                        <Badge variant="outline">{feed.platform}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 break-all">{feed.url}</p>
                      <div className="grid gap-2 sm:grid-cols-3 text-sm">
                        <div>
                          <span className="font-medium">Last Sync:</span>
                          <br />
                          <span className="text-muted-foreground">{new Date(feed.lastSync).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="font-medium">Events:</span>
                          <br />
                          <span className="text-muted-foreground">{feed.eventCount}</span>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <br />
                          <Badge variant={feed.status === "active" ? "default" : "destructive"}>{feed.status}</Badge>
                        </div>
                      </div>

                      {feed.errors.length > 0 && (
                        <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                          <div className="text-sm font-medium text-red-800">Errors:</div>
                          <ul className="text-sm text-red-700 list-disc list-inside">
                            {feed.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleSyncFeed(feed.id)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteFeed(feed.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
