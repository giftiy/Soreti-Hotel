"use client"

import { useState } from "react"
import { Heart, Star, Search, Calendar, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Hall {
  id: string
  name: string
  description: string
  capacity: number
  price: number
  features: string[]
  category: string
  image?: string
}

interface HallBookingPageProps {
  onBookHall?: (hallId: string) => void
}

const mockHalls: Hall[] = [
  {
    id: "grand-ballroom",
    name: "Grand Ballroom",
    description: "Elegant ballroom perfect for weddings, galas, and large corporate events",
    capacity: 300,
    price: 1500,
    features: ["Stage", "Sound System", "Lighting", "Dance Floor", "Catering Kitchen"],
    category: "wedding",
    image: "/grand-ballroom.png",
  },
  {
    id: "conference-hall",
    name: "Executive Conference Hall",
    description: "Modern conference facility with state-of-the-art AV equipment",
    capacity: 100,
    price: 800,
    features: ["Projector", "Microphones", "WiFi", "Whiteboard", "Coffee Station"],
    category: "business",
    image: "/conference-hall.png",
  },
  {
    id: "garden-pavilion",
    name: "Garden Pavilion",
    description: "Beautiful outdoor pavilion surrounded by lush gardens",
    capacity: 150,
    price: 1000,
    features: ["Garden View", "Natural Lighting", "Outdoor Bar", "Gazebo"],
    category: "outdoor",
    image: "/garden-pavilion.png",
  },
  {
    id: "intimate-lounge",
    name: "Intimate Lounge",
    description: "Cozy space perfect for small gatherings and private parties",
    capacity: 50,
    price: 400,
    features: ["Fireplace", "Bar Area", "Comfortable Seating", "Ambient Lighting"],
    category: "private",
    image: "/intimate-lounge.png",
  },
]

export function HallBookingPage({ onBookHall }: HallBookingPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [likedHalls, setLikedHalls] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<"price" | "name" | "capacity">("name")

  const categories = [
    { id: "all", name: "All Halls", count: mockHalls.length },
    ...Array.from(new Set(mockHalls.map((h) => h.category))).map((cat) => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: mockHalls.filter((h) => h.category === cat).length,
    })),
  ]

  const filteredHalls = mockHalls
    .filter((hall) => selectedCategory === "all" || hall.category === selectedCategory)
    .filter(
      (hall) =>
        hall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hall.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "name":
          return a.name.localeCompare(b.name)
        case "capacity":
          return b.capacity - a.capacity
        default:
          return 0
      }
    })

  const toggleLike = (hallId: string) => {
    const newLiked = new Set(likedHalls)
    if (newLiked.has(hallId)) {
      newLiked.delete(hallId)
    } else {
      newLiked.add(hallId)
    }
    setLikedHalls(newLiked)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-12 w-12" />
              <h1 className="text-4xl md:text-6xl font-bold">Event Halls</h1>
            </div>
            <p className="text-xl opacity-90">Perfect venues for your special occasions</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Sort */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search event halls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "price" | "name" | "capacity")}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 bg-white"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="capacity">Sort by Capacity</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-emerald-50 border-2 border-gray-200"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Halls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHalls.map((hall) => (
            <div
              key={hall.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
                <img
                  src={hall.image || "/blueberry-muffin.png"}
                  alt={hall.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleLike(hall.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${likedHalls.has(hall.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {hall.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {hall.category}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{hall.description}</p>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center text-emerald-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{hall.capacity} guests</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                    <Star className="h-4 w-4" />
                    <span className="text-gray-600 text-sm ml-1">4.5</span>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {hall.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {hall.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hall.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-emerald-600">${hall.price}</span>
                    <span className="text-gray-500 text-sm">/day</span>
                  </div>

                  <Button
                    onClick={() => onBookHall?.(hall.id)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90 transition-opacity rounded-xl"
                    size="sm"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHalls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No halls found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
