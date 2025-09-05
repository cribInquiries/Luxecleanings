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
  Wifi,
  Car,
  Coffee,
  Waves,
} from "lucide-react"

interface PropertyDashboardProps {
  onPropertySelect: (propertyId: string) => void
}

const properties = [
  {
    id: "1",
    name: "Luxury Oceanview Villa",
    location: "Malibu, CA",
    image: "/luxury-oceanview-villa.jpg",
    rating: 4.9,
    reviews: 127,
    price: "$450/night",
    occupancy: "85%",
    nextBooking: "Today",
    revenue: "$12,450",
    amenities: [Wifi, Car, Waves],
    status: "occupied",
  },
  {
    id: "2",
    name: "Modern Downtown Loft",
    location: "Austin, TX",
    image: "/modern-downtown-loft.png",
    rating: 4.7,
    reviews: 89,
    price: "$280/night",
    occupancy: "92%",
    nextBooking: "Tomorrow",
    revenue: "$8,920",
    amenities: [Wifi, Coffee, Car],
    status: "available",
  },
  {
    id: "3",
    name: "Cozy Mountain Cabin",
    location: "Aspen, CO",
    image: "/cozy-mountain-cabin.png",
    rating: 4.8,
    reviews: 156,
    price: "$320/night",
    occupancy: "78%",
    nextBooking: "Dec 15",
    revenue: "$9,760",
    amenities: [Wifi, Car, Coffee],
    status: "maintenance",
  },
]

const stats = [
  {
    title: "Total Revenue",
    value: "$31,130",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Occupancy Rate",
    value: "85%",
    change: "+3.2%",
    icon: TrendingUp,
    color: "text-blue-600",
  },
  {
    title: "Active Bookings",
    value: "24",
    change: "+8",
    icon: Calendar,
    color: "text-purple-600",
  },
  {
    title: "Total Guests",
    value: "156",
    change: "+23",
    icon: Users,
    color: "text-orange-600",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "booking",
    message: "New booking for Luxury Oceanview Villa",
    time: "2 minutes ago",
    avatar: "JD",
  },
  {
    id: 2,
    type: "review",
    message: "5-star review received for Downtown Loft",
    time: "1 hour ago",
    avatar: "SM",
  },
  {
    id: 3,
    type: "maintenance",
    message: "Maintenance completed at Mountain Cabin",
    time: "3 hours ago",
    avatar: "MT",
  },
]

export function PropertyDashboard({ onPropertySelect }: PropertyDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-green-100 text-green-800 border-green-200"
      case "available":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Property Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your rental properties and track performance</p>
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
            Add Property
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
        {/* Properties Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Your Properties</h2>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="glass-card hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => onPropertySelect(property.id)}
              >
                <div className="relative">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.name}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                  <Badge className={`absolute top-3 right-3 ${getStatusColor(property.status)} capitalize`}>
                    {property.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {property.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{property.rating}</span>
                        <span className="text-sm text-slate-500">({property.reviews})</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{property.price}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {property.amenities.map((Amenity, index) => (
                        <div key={index} className="p-1.5 bg-slate-100 rounded-lg">
                          <Amenity className="h-3 w-3 text-slate-600" />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500">Occupancy</p>
                        <p className="text-sm font-semibold text-slate-900">{property.occupancy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Next Booking</p>
                        <p className="text-sm font-semibold text-slate-900">{property.nextBooking}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                <Building2 className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 bg-transparent" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 bg-transparent" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Manage Guests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
