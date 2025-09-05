"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Download,
  Upload,
  Trash2,
  MapPin,
  HardDrive,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Layers,
  Zap,
} from "lucide-react"

interface OfflineMap {
  id: string
  name: string
  region: string
  size: string
  downloadDate: string
  lastUpdated: string
  status: "downloaded" | "downloading" | "outdated" | "error"
  progress?: number
  coverage: string[]
}

const mockOfflineMaps: OfflineMap[] = [
  {
    id: "1",
    name: "California Coast",
    region: "California, USA",
    size: "2.4 GB",
    downloadDate: "2024-01-10",
    lastUpdated: "2024-01-08",
    status: "downloaded",
    coverage: ["Malibu", "Santa Monica", "Venice Beach", "Manhattan Beach"],
  },
  {
    id: "2",
    name: "Austin Metro",
    region: "Texas, USA",
    size: "1.8 GB",
    downloadDate: "2024-01-12",
    lastUpdated: "2024-01-10",
    status: "downloading",
    progress: 65,
    coverage: ["Downtown Austin", "South Austin", "East Austin"],
  },
  {
    id: "3",
    name: "Colorado Rockies",
    region: "Colorado, USA",
    size: "3.1 GB",
    downloadDate: "2024-01-05",
    lastUpdated: "2023-12-28",
    status: "outdated",
    coverage: ["Aspen", "Vail", "Breckenridge", "Keystone"],
  },
]

const availableRegions = [
  { id: "ca-coast", name: "California Coast", size: "2.4 GB", properties: 5 },
  { id: "tx-austin", name: "Austin Metro Area", size: "1.8 GB", properties: 3 },
  { id: "co-rockies", name: "Colorado Rockies", size: "3.1 GB", properties: 2 },
  { id: "fl-miami", name: "Miami-Dade County", size: "2.2 GB", properties: 4 },
  { id: "ny-manhattan", name: "Manhattan & Brooklyn", size: "1.9 GB", properties: 1 },
]

export function OfflineMaps() {
  const [offlineMaps, setOfflineMaps] = useState(mockOfflineMaps)
  const [selectedRegion, setSelectedRegion] = useState("")
  const [isOnline, setIsOnline] = useState(true)
  const [storageUsed, setStorageUsed] = useState(7.3)
  const [storageLimit] = useState(50)
  const { toast } = useToast()

  const handleDownloadMap = (regionId: string) => {
    const region = availableRegions.find((r) => r.id === regionId)
    if (!region) return

    const newMap: OfflineMap = {
      id: Date.now().toString(),
      name: region.name,
      region: region.name,
      size: region.size,
      downloadDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      status: "downloading",
      progress: 0,
      coverage: [],
    }

    setOfflineMaps([...offlineMaps, newMap])

    toast({
      title: "Download Started",
      description: `Downloading ${region.name} map data...`,
    })

    // Simulate download progress
    const interval = setInterval(() => {
      setOfflineMaps((maps) =>
        maps.map((map) => {
          if (map.id === newMap.id && map.status === "downloading") {
            const newProgress = (map.progress || 0) + Math.random() * 15
            if (newProgress >= 100) {
              clearInterval(interval)
              toast({
                title: "Download Complete",
                description: `${region.name} is now available offline`,
              })
              return { ...map, status: "downloaded" as const, progress: 100 }
            }
            return { ...map, progress: newProgress }
          }
          return map
        }),
      )
    }, 1000)
  }

  const handleDeleteMap = (mapId: string) => {
    const map = offlineMaps.find((m) => m.id === mapId)
    if (!map) return

    setOfflineMaps(offlineMaps.filter((m) => m.id !== mapId))
    toast({
      title: "Map Deleted",
      description: `${map.name} has been removed from offline storage`,
    })
  }

  const handleUpdateMap = (mapId: string) => {
    setOfflineMaps(
      offlineMaps.map((map) =>
        map.id === mapId
          ? {
              ...map,
              status: "downloading" as const,
              progress: 0,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : map,
      ),
    )

    toast({
      title: "Update Started",
      description: "Downloading latest map data...",
    })

    // Simulate update progress
    const interval = setInterval(() => {
      setOfflineMaps((maps) =>
        maps.map((map) => {
          if (map.id === mapId && map.status === "downloading") {
            const newProgress = (map.progress || 0) + Math.random() * 20
            if (newProgress >= 100) {
              clearInterval(interval)
              toast({
                title: "Update Complete",
                description: "Map has been updated with latest data",
              })
              return { ...map, status: "downloaded" as const, progress: 100 }
            }
            return { ...map, progress: newProgress }
          }
          return map
        }),
      )
    }, 800)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "downloaded":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "downloading":
        return <Download className="h-4 w-4 text-blue-600 animate-pulse" />
      case "outdated":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <MapPin className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "downloaded":
        return "bg-green-100 text-green-800 border-green-200"
      case "downloading":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "outdated":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Offline Maps</h1>
          <p className="text-slate-600 mt-1">Download maps for offline navigation and property management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
            <span className="text-sm font-medium">{isOnline ? "Online" : "Offline"}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOnline(!isOnline)}
            className={isOnline ? "bg-green-50" : "bg-red-50"}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>
      </div>

      {/* Storage Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Used Storage</span>
              <span className="text-sm text-slate-600">
                {storageUsed} GB / {storageLimit} GB
              </span>
            </div>
            <Progress value={(storageUsed / storageLimit) * 100} className="h-2" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Maps: {storageUsed} GB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Available: {(storageLimit - storageUsed).toFixed(1)} GB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                <span>{offlineMaps.length} Maps Downloaded</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Download New Maps */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Maps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a region to download" />
                </SelectTrigger>
                <SelectContent>
                  {availableRegions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{region.name}</span>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant="outline" className="text-xs">
                            {region.size}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {region.properties} properties
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => selectedRegion && handleDownloadMap(selectedRegion)}
              disabled={!selectedRegion || !isOnline}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Selected Region
            </Button>

            {!isOnline && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-800">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-sm font-medium">Offline Mode</span>
                </div>
                <p className="text-xs text-orange-700 mt-1">Connect to internet to download new maps</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent" disabled={!isOnline}>
              <Globe className="h-4 w-4 mr-2" />
              Update All Maps
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Layers className="h-4 w-4 mr-2" />
              Manage Map Layers
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Import Custom Maps
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Maps
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Downloaded Maps */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Downloaded Maps ({offlineMaps.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offlineMaps.map((map) => (
              <div key={map.id} className="p-4 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(map.status)}
                    <div>
                      <h4 className="font-semibold text-slate-900">{map.name}</h4>
                      <p className="text-sm text-slate-600">{map.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(map.status)}>{map.status}</Badge>
                    <span className="text-sm text-slate-600">{map.size}</span>
                  </div>
                </div>

                {map.status === "downloading" && map.progress !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Downloading...</span>
                      <span>{Math.round(map.progress)}%</span>
                    </div>
                    <Progress value={map.progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>Downloaded: {map.downloadDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Updated: {map.lastUpdated}</span>
                  </div>
                </div>

                {map.coverage.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Coverage Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {map.coverage.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {map.status === "outdated" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateMap(map.id)}
                      disabled={!isOnline}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                  )}
                  {map.status === "downloaded" && (
                    <Button variant="outline" size="sm" onClick={() => handleUpdateMap(map.id)} disabled={!isOnline}>
                      <Download className="h-4 w-4 mr-2" />
                      Check Updates
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMap(map.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {offlineMaps.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Offline Maps</h3>
                <p className="text-slate-600 mb-4">Download maps to use PropertySync without an internet connection</p>
                <Button onClick={() => setSelectedRegion(availableRegions[0].id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Your First Map
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
