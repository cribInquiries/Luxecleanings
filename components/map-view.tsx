"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Navigation,
  MapPin,
  Search,
  Layers,
  Route,
  Compass,
  Satellite,
  Building2,
  Calendar,
  Users,
  DollarSign,
  Filter,
  Download,
  Settings,
  Target,
  Zap,
} from "lucide-react"

interface Property {
  id: string
  name: string
  location: string
  coordinates: [number, number]
  status: "active" | "maintenance" | "offline"
  bookings: number
  revenue: number
  occupancy: number
  type: "villa" | "apartment" | "cabin" | "house"
  amenities: string[]
  rating: number
  image: string
}

const mockProperties: Property[] = [
  {
    id: "1",
    name: "Luxury Oceanview Villa",
    location: "Malibu, CA",
    coordinates: [-118.6919, 34.0259],
    status: "active",
    bookings: 24,
    revenue: 45000,
    occupancy: 85,
    type: "villa",
    amenities: ["Pool", "Beach Access", "WiFi", "Parking"],
    rating: 4.9,
    image: "/luxury-oceanview-villa.jpg",
  },
  {
    id: "2",
    name: "Modern Downtown Loft",
    location: "Austin, TX",
    coordinates: [-97.7431, 30.2672],
    status: "active",
    bookings: 18,
    revenue: 32000,
    occupancy: 92,
    type: "apartment",
    amenities: ["WiFi", "Gym", "Rooftop", "Parking"],
    rating: 4.7,
    image: "/modern-downtown-loft.png",
  },
  {
    id: "3",
    name: "Cozy Mountain Cabin",
    location: "Aspen, CO",
    coordinates: [-106.8175, 39.1911],
    status: "maintenance",
    bookings: 12,
    revenue: 28000,
    occupancy: 65,
    type: "cabin",
    amenities: ["Fireplace", "Ski Access", "WiFi", "Hot Tub"],
    rating: 4.8,
    image: "/cozy-mountain-cabin.png",
  },
]

interface MapViewProps {
  onPropertySelect: (propertyId: string) => void
  selectedProperty?: string | null
}

export function MapView({ onPropertySelect, selectedProperty }: MapViewProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-98.5795, 39.8283]) // Center of USA
  const [zoomLevel, setZoomLevel] = useState(4)
  const [mapStyle, setMapStyle] = useState("standard")
  const [showTraffic, setShowTraffic] = useState(false)
  const [showSatellite, setShowSatellite] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPropertyData, setSelectedPropertyData] = useState<Property | null>(null)
  const [routeMode, setRouteMode] = useState(false)
  const [routeStart, setRouteStart] = useState<[number, number] | null>(null)
  const [routeEnd, setRouteEnd] = useState<[number, number] | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const mapRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedProperty) {
      const property = mockProperties.find((p) => p.id === selectedProperty)
      if (property) {
        setSelectedPropertyData(property)
        setMapCenter(property.coordinates)
        setZoomLevel(12)
      }
    }
  }, [selectedProperty])

  const filteredProperties = mockProperties.filter((property) => {
    const matchesType = filterType === "all" || property.type === filterType
    const matchesStatus = filterStatus === "all" || property.status === filterStatus
    const matchesSearch =
      searchQuery === "" ||
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const handlePropertyClick = (property: Property) => {
    setSelectedPropertyData(property)
    setMapCenter(property.coordinates)
    setZoomLevel(12)
    onPropertySelect(property.id)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "Searching Location",
        description: `Searching for "${searchQuery}"...`,
      })
      // Simulate geocoding search
      setTimeout(() => {
        toast({
          title: "Location Found",
          description: "Map updated to show search results",
        })
      }, 1000)
    }
  }

  const handleRouteCalculation = () => {
    if (routeStart && routeEnd) {
      toast({
        title: "Calculating Route",
        description: "Finding the best route between locations...",
      })
      setTimeout(() => {
        toast({
          title: "Route Calculated",
          description: "Optimal route displayed on map",
        })
      }, 1500)
    }
  }

  const handleDownloadOfflineMap = () => {
    toast({
      title: "Downloading Offline Map",
      description: "Map data is being downloaded for offline use...",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "maintenance":
        return "bg-orange-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "villa":
        return "🏖️"
      case "apartment":
        return "🏢"
      case "cabin":
        return "🏔️"
      case "house":
        return "🏠"
      default:
        return "🏠"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Property Map</h1>
          <p className="text-slate-600 mt-1">Interactive map view of all your properties</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={routeMode ? "default" : "outline"}
            size="sm"
            onClick={() => setRouteMode(!routeMode)}
            className="h-9"
          >
            <Route className="h-4 w-4 mr-2" />
            Route Mode
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadOfflineMap} className="h-9 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Offline Maps
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls & Filters */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Navigate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    navigator.geolocation?.getCurrentPosition((position) => {
                      setMapCenter([position.coords.longitude, position.coords.latitude])
                      setZoomLevel(12)
                      toast({
                        title: "Location Found",
                        description: "Map centered on your current location",
                      })
                    })
                  }}
                >
                  <Target className="h-4 w-4 mr-2" />
                  My Location
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="cabin">Cabin</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Map Layers */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Map Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Map Style</label>
                <Select value={mapStyle} onValueChange={setMapStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Traffic</span>
                <Button
                  variant={showTraffic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowTraffic(!showTraffic)}
                >
                  <Zap className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Satellite</span>
                <Button
                  variant={showSatellite ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSatellite(!showSatellite)}
                >
                  <Satellite className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Property List */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Properties ({filteredProperties.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-64 overflow-y-auto">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPropertyData?.id === property.id
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white hover:bg-slate-50 border-slate-200"
                  }`}
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getTypeIcon(property.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{property.name}</h4>
                      <p className="text-xs text-slate-600 truncate">{property.location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(property.status)}`}></div>
                        <span className="text-xs capitalize">{property.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Map */}
        <div className="lg:col-span-3">
          <Card className="glass-card h-[600px] lg:h-[700px]">
            <CardContent className="p-0 h-full">
              <div className="relative h-full rounded-xl overflow-hidden">
                {/* Map Container */}
                <div
                  ref={mapRef}
                  className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 relative"
                >
                  {/* Simulated Map Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-100 to-green-100"></div>
                    {/* Grid lines to simulate map */}
                    <div className="absolute inset-0">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={`h-${i}`}
                          className="absolute w-full h-px bg-slate-300 opacity-30"
                          style={{ top: `${i * 5}%` }}
                        />
                      ))}
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={`v-${i}`}
                          className="absolute h-full w-px bg-slate-300 opacity-30"
                          style={{ left: `${i * 5}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Property Markers */}
                  {filteredProperties.map((property, index) => (
                    <div
                      key={property.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{
                        left: `${30 + index * 20}%`,
                        top: `${40 + index * 15}%`,
                      }}
                      onClick={() => handlePropertyClick(property)}
                    >
                      {/* Marker */}
                      <div
                        className={`relative p-2 rounded-full shadow-lg transition-all group-hover:scale-110 ${
                          selectedPropertyData?.id === property.id
                            ? "bg-blue-600 ring-4 ring-blue-200"
                            : "bg-white ring-2 ring-slate-200"
                        }`}
                      >
                        <MapPin
                          className={`h-6 w-6 ${
                            selectedPropertyData?.id === property.id ? "text-white" : "text-slate-700"
                          }`}
                        />
                        <div
                          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(property.status)}`}
                        ></div>
                      </div>

                      {/* Property Info Popup */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-3 min-w-64">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl">{getTypeIcon(property.type)}</div>
                            <div>
                              <h4 className="font-semibold text-sm">{property.name}</h4>
                              <p className="text-xs text-slate-600">{property.location}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-semibold">{property.bookings}</div>
                              <div className="text-slate-500">Bookings</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold">${(property.revenue / 1000).toFixed(0)}k</div>
                              <div className="text-slate-500">Revenue</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold">{property.occupancy}%</div>
                              <div className="text-slate-500">Occupancy</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Route Line (if route mode is active) */}
                  {routeMode && routeStart && routeEnd && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line
                        x1="30%"
                        y1="40%"
                        x2="70%"
                        y2="70%"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                      />
                    </svg>
                  )}

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/90 backdrop-blur"
                      onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 18))}
                    >
                      +
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/90 backdrop-blur"
                      onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 1))}
                    >
                      -
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur">
                      <Compass className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Zoom Level Indicator */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg px-3 py-1 text-sm font-medium">
                    Zoom: {zoomLevel}
                  </div>

                  {/* Coordinates Display */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg px-3 py-1 text-xs font-mono">
                    {mapCenter[1].toFixed(4)}, {mapCenter[0].toFixed(4)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Property Details */}
      {selectedPropertyData && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="text-3xl">{getTypeIcon(selectedPropertyData.type)}</div>
              <div>
                <h3 className="text-xl">{selectedPropertyData.name}</h3>
                <p className="text-slate-600 font-normal">{selectedPropertyData.location}</p>
              </div>
              <Badge className={`ml-auto ${getStatusColor(selectedPropertyData.status)} text-white capitalize`}>
                {selectedPropertyData.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Bookings</p>
                  <p className="text-2xl font-bold">{selectedPropertyData.bookings}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Revenue</p>
                  <p className="text-2xl font-bold">${selectedPropertyData.revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Occupancy</p>
                  <p className="text-2xl font-bold">{selectedPropertyData.occupancy}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Rating</p>
                  <p className="text-2xl font-bold">{selectedPropertyData.rating}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {selectedPropertyData.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={() => onPropertySelect(selectedPropertyData.id)} className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
