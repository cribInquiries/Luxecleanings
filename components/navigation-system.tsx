"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Navigation,
  MapPin,
  Clock,
  Car,
  Bike,
  Footprints,
  Fuel,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  Target,
} from "lucide-react"
import { Route } from "lucide-react" // Declare the Route variable

interface NavigationStep {
  id: string
  instruction: string
  distance: string
  duration: string
  type: "straight" | "left" | "right" | "roundabout" | "destination"
  icon: any
}

const mockRoutes: {
  id: string
  name: string
  distance: string
  duration: string
  traffic: "light" | "moderate" | "heavy"
  fuelCost: string
  steps: NavigationStep[]
}[] = [
  {
    id: "1",
    name: "Fastest Route",
    distance: "12.4 miles",
    duration: "18 min",
    traffic: "light",
    fuelCost: "$3.20",
    steps: [
      {
        id: "1",
        instruction: "Head north on Main St",
        distance: "0.5 mi",
        duration: "2 min",
        type: "straight",
        icon: ArrowRight,
      },
      {
        id: "2",
        instruction: "Turn right onto Highway 101",
        distance: "8.2 mi",
        duration: "12 min",
        type: "right",
        icon: ArrowRight,
      },
      {
        id: "3",
        instruction: "Take exit 42 toward Malibu",
        distance: "2.1 mi",
        duration: "3 min",
        type: "right",
        icon: ArrowRight,
      },
      {
        id: "4",
        instruction: "Arrive at Luxury Oceanview Villa",
        distance: "1.6 mi",
        duration: "1 min",
        type: "destination",
        icon: MapPin,
      },
    ],
  },
  {
    id: "2",
    name: "Scenic Route",
    distance: "15.8 miles",
    duration: "25 min",
    traffic: "moderate",
    fuelCost: "$4.10",
    steps: [
      {
        id: "1",
        instruction: "Head west on Ocean Blvd",
        distance: "3.2 mi",
        duration: "8 min",
        type: "straight",
        icon: ArrowRight,
      },
      {
        id: "2",
        instruction: "Continue on Pacific Coast Highway",
        distance: "10.1 mi",
        duration: "15 min",
        type: "straight",
        icon: ArrowRight,
      },
      {
        id: "3",
        instruction: "Turn left onto Malibu Canyon Rd",
        distance: "1.8 mi",
        duration: "1 min",
        type: "left",
        icon: ArrowRight,
      },
      {
        id: "4",
        instruction: "Arrive at destination",
        distance: "0.7 mi",
        duration: "1 min",
        type: "destination",
        icon: MapPin,
      },
    ],
  },
]

interface NavigationSystemProps {
  destination?: string
  onNavigationStart?: () => void
  onNavigationEnd?: () => void
}

export function NavigationSystem({ destination, onNavigationStart, onNavigationEnd }: NavigationSystemProps) {
  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState(destination || "")
  const [selectedRoute, setSelectedRoute] = useState<{
    id: string
    name: string
    distance: string
    duration: string
    traffic: "light" | "moderate" | "heavy"
    fuelCost: string
    steps: NavigationStep[]
  } | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [travelMode, setTravelMode] = useState("car")
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [avoidTolls, setAvoidTolls] = useState(false)
  const [avoidHighways, setAvoidHighways] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (destination) {
      setEndLocation(destination)
    }
  }, [destination])

  const handleCalculateRoute = () => {
    if (!startLocation || !endLocation) {
      toast({
        title: "Missing Information",
        description: "Please enter both start and destination locations",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Calculating Route",
      description: "Finding the best routes to your destination...",
    })

    // Simulate route calculation
    setTimeout(() => {
      setSelectedRoute(mockRoutes[0])
      toast({
        title: "Routes Found",
        description: `Found ${mockRoutes.length} routes to your destination`,
      })
    }, 1500)
  }

  const handleStartNavigation = () => {
    if (!selectedRoute) return

    setIsNavigating(true)
    setCurrentStep(0)
    onNavigationStart?.()

    toast({
      title: "Navigation Started",
      description: "Turn-by-turn navigation is now active",
    })

    // Simulate navigation progress
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= selectedRoute.steps.length - 1) {
          clearInterval(interval)
          setIsNavigating(false)
          onNavigationEnd?.()
          toast({
            title: "Destination Reached",
            description: "You have arrived at your destination",
          })
          return prev
        }
        return prev + 1
      })
    }, 3000)
  }

  const handleStopNavigation = () => {
    setIsNavigating(false)
    setCurrentStep(0)
    onNavigationEnd?.()
    toast({
      title: "Navigation Stopped",
      description: "Navigation has been cancelled",
    })
  }

  const getCurrentLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setStartLocation("Current Location")
        toast({
          title: "Location Found",
          description: "Using your current location as starting point",
        })
      },
      () => {
        toast({
          title: "Location Error",
          description: "Unable to get your current location",
          variant: "destructive",
        })
      },
    )
  }

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case "light":
        return "text-green-600 bg-green-100"
      case "moderate":
        return "text-yellow-600 bg-yellow-100"
      case "heavy":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTravelModeIcon = (mode: string) => {
    switch (mode) {
      case "car":
        return Car
      case "bike":
        return Bike
      case "walk":
        return Footprints
      default:
        return Car
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Navigation System</h1>
          <p className="text-slate-600 mt-1">Get turn-by-turn directions to your properties</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={voiceEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <Compass className="h-4 w-4 mr-2" />
            Compass
          </Button>
        </div>
      </div>

      {!isNavigating ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Planning */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Plan Route
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter starting location"
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={getCurrentLocation}>
                      <Target className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <Input
                    placeholder="Enter destination"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Travel Mode</label>
                  <Select value={travelMode} onValueChange={setTravelMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Driving
                        </div>
                      </SelectItem>
                      <SelectItem value="bike">
                        <div className="flex items-center gap-2">
                          <Bike className="h-4 w-4" />
                          Cycling
                        </div>
                      </SelectItem>
                      <SelectItem value="walk">
                        <div className="flex items-center gap-2">
                          <Footprints className="h-4 w-4" />
                          Walking
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Route Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={avoidTolls}
                        onChange={(e) => setAvoidTolls(e.target.checked)}
                        className="rounded"
                      />
                      Avoid tolls
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={avoidHighways}
                        onChange={(e) => setAvoidHighways(e.target.checked)}
                        className="rounded"
                      />
                      Avoid highways
                    </label>
                  </div>
                </div>

                <Button onClick={handleCalculateRoute} className="w-full">
                  <Route className="h-4 w-4 mr-2" />
                  Calculate Route
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Route Options */}
          <div className="lg:col-span-2 space-y-4">
            {selectedRoute && (
              <>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Route Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockRoutes.map((route) => (
                      <div
                        key={route.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedRoute.id === route.id
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white hover:bg-slate-50 border-slate-200"
                        }`}
                        onClick={() => setSelectedRoute(route)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{route.name}</h4>
                          <Badge className={getTrafficColor(route.traffic)}>{route.traffic} traffic</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-500" />
                            <span>{route.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-500" />
                            <span>{route.distance}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-slate-500" />
                            <span>{route.fuelCost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Turn-by-Turn Directions
                      <Button onClick={handleStartNavigation}>
                        <Navigation className="h-4 w-4 mr-2" />
                        Start Navigation
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedRoute.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{step.instruction}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                              <span>{step.distance}</span>
                              <span>{step.duration}</span>
                            </div>
                          </div>
                          <step.icon className="h-5 w-5 text-slate-500" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Active Navigation */
        <div className="space-y-6">
          {/* Current Instruction */}
          <Card className="glass-card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
                  <ArrowRight className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {selectedRoute?.steps[currentStep]?.instruction}
                  </h2>
                  <div className="flex items-center gap-6 text-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-slate-500" />
                      <span>{selectedRoute?.steps[currentStep]?.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-slate-500" />
                      <span>{selectedRoute?.steps[currentStep]?.duration}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={handleStopNavigation} className="bg-white/70">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Navigation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>
                      Step {currentStep + 1} of {selectedRoute?.steps.length}
                    </span>
                    <span>{Math.round(((currentStep + 1) / (selectedRoute?.steps.length || 1)) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${((currentStep + 1) / (selectedRoute?.steps.length || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Trip Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{selectedRoute?.duration}</div>
                    <div className="text-sm text-slate-600">Estimated Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{selectedRoute?.distance}</div>
                    <div className="text-sm text-slate-600">Total Distance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Steps */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upcoming Directions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedRoute?.steps.slice(currentStep + 1, currentStep + 4).map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center justify-center w-6 h-6 bg-slate-200 rounded-full">
                      <span className="text-xs font-semibold text-slate-600">{currentStep + index + 2}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{step.instruction}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{step.distance}</span>
                        <span>{step.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
