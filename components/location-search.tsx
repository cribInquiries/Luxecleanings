"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  MapPin,
  Star,
  Navigation,
  Utensils,
  ShoppingBag,
  Car,
  Fuel,
  Hospital,
  GraduationCap,
  Bus,
  Target,
  Bookmark,
  History,
} from "lucide-react"

interface SearchResult {
  id: string
  name: string
  address: string
  coordinates: [number, number]
  category: string
  rating?: number
  distance?: string
  description?: string
  amenities?: string[]
  isOpen?: boolean
  phone?: string
}

interface RecentSearch {
  id: string
  query: string
  timestamp: string
  results: number
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    name: "Whole Foods Market",
    address: "1425 Montana Ave, Santa Monica, CA 90403",
    coordinates: [-118.4912, 34.0522],
    category: "grocery",
    rating: 4.3,
    distance: "0.8 miles",
    description: "Organic grocery store with fresh produce and prepared foods",
    amenities: ["Parking", "Delivery", "Organic"],
    isOpen: true,
    phone: "(310) 315-0662",
  },
  {
    id: "2",
    name: "Santa Monica Pier",
    address: "200 Santa Monica Pier, Santa Monica, CA 90401",
    coordinates: [-118.4981, 34.0089],
    category: "attraction",
    rating: 4.5,
    distance: "1.2 miles",
    description: "Historic pier with amusement park, restaurants, and shops",
    amenities: ["Parking", "Restrooms", "Food Court"],
    isOpen: true,
  },
  {
    id: "3",
    name: "UCLA Medical Center",
    address: "757 Westwood Plaza, Los Angeles, CA 90095",
    coordinates: [-118.4452, 34.0669],
    category: "hospital",
    rating: 4.1,
    distance: "3.4 miles",
    description: "Full-service medical center with emergency care",
    amenities: ["Emergency", "Parking", "Pharmacy"],
    isOpen: true,
    phone: "(310) 825-9111",
  },
]

const mockRecentSearches: RecentSearch[] = [
  { id: "1", query: "grocery stores near me", timestamp: "2024-01-10T14:30:00Z", results: 12 },
  { id: "2", query: "restaurants malibu", timestamp: "2024-01-10T12:15:00Z", results: 8 },
  { id: "3", query: "gas stations", timestamp: "2024-01-09T18:45:00Z", results: 15 },
]

const categories = [
  { id: "restaurant", name: "Restaurants", icon: Utensils, color: "bg-red-100 text-red-600" },
  { id: "grocery", name: "Grocery", icon: ShoppingBag, color: "bg-green-100 text-green-600" },
  { id: "gas", name: "Gas Stations", icon: Fuel, color: "bg-blue-100 text-blue-600" },
  { id: "hospital", name: "Medical", icon: Hospital, color: "bg-purple-100 text-purple-600" },
  { id: "school", name: "Schools", icon: GraduationCap, color: "bg-orange-100 text-orange-600" },
  { id: "attraction", name: "Attractions", icon: Star, color: "bg-yellow-100 text-yellow-600" },
  { id: "transport", name: "Transport", icon: Bus, color: "bg-indigo-100 text-indigo-600" },
  { id: "parking", name: "Parking", icon: Car, color: "bg-slate-100 text-slate-600" },
]

interface LocationSearchProps {
  onLocationSelect?: (location: SearchResult) => void
  currentLocation?: [number, number]
}

export function LocationSearch({ onLocationSelect, currentLocation }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState(mockRecentSearches)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [savedLocations, setSavedLocations] = useState<SearchResult[]>([])
  const { toast } = useToast()

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return

    setIsSearching(true)

    toast({
      title: "Searching...",
      description: `Looking for "${query}" in your area`,
    })

    // Simulate search API call
    setTimeout(() => {
      let results = mockSearchResults

      if (selectedCategory) {
        results = results.filter((result) => result.category === selectedCategory)
      }

      if (query.trim()) {
        results = results.filter(
          (result) =>
            result.name.toLowerCase().includes(query.toLowerCase()) ||
            result.address.toLowerCase().includes(query.toLowerCase()) ||
            result.category.toLowerCase().includes(query.toLowerCase()),
        )
      }

      setSearchResults(results)
      setIsSearching(false)

      // Add to recent searches
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query,
        timestamp: new Date().toISOString(),
        results: results.length,
      }
      setRecentSearches([newSearch, ...recentSearches.slice(0, 4)])

      toast({
        title: "Search Complete",
        description: `Found ${results.length} results for "${query}"`,
      })
    }, 1000)
  }

  const handleCategorySearch = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
    const category = categories.find((c) => c.id === categoryId)
    if (category) {
      handleSearch(category.name.toLowerCase())
    }
  }

  const handleLocationSelect = (location: SearchResult) => {
    onLocationSelect?.(location)
    toast({
      title: "Location Selected",
      description: `Selected ${location.name}`,
    })
  }

  const handleSaveLocation = (location: SearchResult) => {
    if (!savedLocations.find((l) => l.id === location.id)) {
      setSavedLocations([...savedLocations, location])
      toast({
        title: "Location Saved",
        description: `${location.name} added to saved locations`,
      })
    }
  }

  const getCurrentLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        toast({
          title: "Location Found",
          description: "Using your current location for search",
        })
        handleSearch("nearby places")
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

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((c) => c.id === category)
    return categoryData?.icon || MapPin
  }

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find((c) => c.id === category)
    return categoryData?.color || "bg-slate-100 text-slate-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Location Search</h1>
          <p className="text-slate-600 mt-1">Find places of interest near your properties</p>
        </div>
        <Button onClick={getCurrentLocation} variant="outline">
          <Target className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search for places, addresses, or points of interest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={() => handleSearch()} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700">
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories & Filters */}
        <div className="lg:col-span-1 space-y-4">
          {/* Categories */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategorySearch(category.id)}
                    className="w-full justify-start"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Recent Searches */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentSearches.map((search) => (
                <div
                  key={search.id}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => {
                    setSearchQuery(search.query)
                    handleSearch(search.query)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{search.query}</span>
                    <Badge variant="outline" className="text-xs">
                      {search.results}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{new Date(search.timestamp).toLocaleDateString()}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Saved Locations */}
          {savedLocations.length > 0 && (
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Saved Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {savedLocations.slice(0, 3).map((location) => (
                  <div
                    key={location.id}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="font-medium text-sm truncate">{location.name}</div>
                    <div className="text-xs text-slate-500 truncate">{location.address}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Search Results ({searchResults.length})</span>
                {selectedCategory && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null)
                      setSearchResults([])
                    }}
                  >
                    Clear Filter
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {searchResults.map((result) => {
                    const CategoryIcon = getCategoryIcon(result.category)
                    return (
                      <div
                        key={result.id}
                        className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleLocationSelect(result)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getCategoryColor(result.category)}`}>
                              <CategoryIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">{result.name}</h4>
                              <p className="text-sm text-slate-600">{result.address}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {result.isOpen && <Badge className="bg-green-100 text-green-800">Open</Badge>}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSaveLocation(result)
                              }}
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {result.description && <p className="text-sm text-slate-600 mb-3">{result.description}</p>}

                        <div className="flex items-center gap-4 mb-3 text-sm">
                          {result.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{result.rating}</span>
                            </div>
                          )}
                          {result.distance && (
                            <div className="flex items-center gap-1">
                              <Navigation className="h-4 w-4 text-slate-500" />
                              <span>{result.distance}</span>
                            </div>
                          )}
                          {result.phone && (
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500">📞</span>
                              <span>{result.phone}</span>
                            </div>
                          )}
                        </div>

                        {result.amenities && result.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {result.amenities.map((amenity) => (
                              <Badge key={amenity} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Navigation className="h-4 w-4 mr-2" />
                            Get Directions
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <MapPin className="h-4 w-4 mr-2" />
                            View on Map
                          </Button>
                        </div>
                      </div>
                    )
                  })}

                  {searchResults.length === 0 && !isSearching && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No Results Found</h3>
                      <p className="text-slate-600 mb-4">Try searching for a different location or category</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {categories.slice(0, 4).map((category) => (
                          <Button
                            key={category.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategorySearch(category.id)}
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isSearching && (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Searching...</h3>
                      <p className="text-slate-600">Finding the best results for you</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
