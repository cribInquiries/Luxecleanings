"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Star,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Home,
  Building,
  Scissors,
} from "lucide-react"

interface CleaningDashboardProps {
  onServiceSelect: (serviceId: string) => void
}

const services = [
  {
    id: "1",
    name: "Luxury Residential Cleaning",
    location: "Beverly Hills, CA",
    image: "/luxury-oceanview-villa.jpg",
    rating: 4.9,
    reviews: 127,
    price: "$150/visit",
    occupancy: "95%",
    nextBooking: "Today",
    revenue: "$4,500",
    amenities: [Sparkles, Home, Scissors],
    status: "scheduled",
    type: "residential",
  },
  {
    id: "2",
    name: "Commercial Office Cleaning",
    location: "Downtown LA, CA",
    image: "/modern-downtown-loft.png",
    rating: 4.7,
    reviews: 89,
    price: "$300/visit",
    occupancy: "88%",
    nextBooking: "Tomorrow",
    revenue: "$6,000",
    amenities: [Building, Sparkles, Scissors],
    status: "available",
    type: "commercial",
  },
  {
    id: "3",
    name: "Deep Cleaning Service",
    location: "Malibu, CA",
    image: "/cozy-mountain-cabin.png",
    rating: 4.8,
    reviews: 156,
    price: "$250/visit",
    occupancy: "82%",
    nextBooking: "Dec 15",
    revenue: "$3,750",
    amenities: [Sparkles, Home, Scissors],
    status: "in-progress",
    type: "deep",
  },
]

const stats = [
  {
    title: "Total Revenue",
    value: "$14,250",
    change: "+18.5%",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Service Completion",
    value: "88%",
    change: "+5.2%",
    icon: TrendingUp,
    color: "text-blue-600",
  },
  {
    title: "Active Bookings",
    value: "32",
    change: "+12",
    icon: Calendar,
    color: "text-purple-600",
  },
  {
    title: "Happy Clients",
    value: "248",
    change: "+35",
    icon: Users,
    color: "text-orange-600",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "booking",
    message: "New booking for Luxury Residential Cleaning",
    time: "2 minutes ago",
    avatar: "JD",
  },
  {
    id: 2,
    type: "review",
    message: "5-star review received for Commercial Office",
    time: "1 hour ago",
    avatar: "SM",
  },
  {
    id: 3,
    type: "completion",
    message: "Deep cleaning completed at Malibu property",
    time: "3 hours ago",
    avatar: "MT",
  },
]

export function CleaningDashboard({ onServiceSelect }: CleaningDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "residential":
        return Home
      case "commercial":
        return Building
      case "deep":
        return Sparkles
      default:
        return Home
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Luxe Cleanings Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your cleaning services and track performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex rounded-lg bg-white border border-slate-200 p-1">
            {["7d", "30d", "90d"].map((period) => (
              <Button
                key={period}
                variant={selectedTimeframe === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeframe(period)}
                className="h-7 px-3 text-xs"
              >
                {period}
              </Button>
            ))}
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Service
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <p className={`text-sm font-medium mt-1 ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Your Services</h2>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => {
              const ServiceIcon = getServiceTypeIcon(service.type)
              return (
                <Card
                  key={service.id}
                  className="glass-card hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => onServiceSelect(service.id)}
                >
                  <div className="relative">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <Badge className={`absolute top-3 right-3 ${getStatusColor(service.status)} capitalize`}>
                      {service.status}
                    </Badge>
                    <div className="absolute top-3 left-3 p-2 bg-white/90 rounded-lg">
                      <ServiceIcon className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                          <MapPin className="h-3 w-3" />
                          {service.location}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{service.rating}</span>
                          <span className="text-sm text-slate-500">({service.reviews})</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{service.price}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        {service.amenities.map((Amenity, index) => (
                          <div key={index} className="p-1.5 bg-slate-100 rounded-lg">
                            <Amenity className="h-3 w-3 text-slate-600" />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-500">Completion Rate</p>
                          <p className="text-sm font-semibold text-slate-900">{service.occupancy}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Next Service</p>
                          <p className="text-sm font-semibold text-slate-900">{service.nextBooking}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-600">{activity.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">{activity.message}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start h-9 bg-transparent" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Schedule Residential
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 bg-transparent" size="sm">
                <Building className="h-4 w-4 mr-2" />
                Schedule Commercial
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 bg-transparent" size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Deep Cleaning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
