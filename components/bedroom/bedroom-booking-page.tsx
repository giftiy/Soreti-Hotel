"use client"

import { useState } from "react"
import { Heart, Star, Wifi, Car, Coffee, Tv, Bath, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface BedroomBookingPageProps {
  onBookRoom?: (roomId: string) => void
}

const mockRooms = [
  {
    id: "deluxe-suite",
    name: "Deluxe Suite",
    description: "Spacious suite with separate living area, king bed, and city view",
    price: 250,
    features: ["King Bed", "City View", "Living Area", "Mini Bar", "Balcony"],
    amenities: ["WiFi", "TV", "AC", "Room Service", "Parking"],
    category: "suite",
    available: true,
  },
  {
    id: "standard-double",
    name: "Standard Double Room",
    description: "Comfortable room with double bed and modern amenities",
    price: 120,
    features: ["Double Bed", "Garden View", "Work Desk", "Safe"],
    amenities: ["WiFi", "TV", "AC", "Room Service"],
    category: "standard",
    available: true,
  },
  {
    id: "family-room",
    name: "Family Room",
    description: "Perfect for families with connecting rooms and extra space",
    price: 180,
    features: ["Twin Beds", "Connecting Room", "Family Bathroom", "Play Area"],
    amenities: ["WiFi", "TV", "AC", "Room Service", "Parking"],
    category: "family",
    available: true,
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    description: "Ultimate luxury with panoramic views and premium amenities",
    price: 500,
    features: ["Master Bedroom", "Panoramic View", "Jacuzzi", "Butler Service", "Private Terrace"],
    amenities: ["WiFi", "TV", "AC", "Room Service", "Parking", "Spa Access"],
    category: "luxury",
    available: false,
  },
]

export function BedroomBookingPage({ onBookRoom }: BedroomBookingPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [likedRooms, setLikedRooms] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<"price" | "name">("name")

  const categories = [
    { id: "all", name: "All Rooms", count: mockRooms.length },
    { id: "standard", name: "Standard", count: mockRooms.filter((room) => room.category === "standard").length },
    { id: "suite", name: "Suites", count: mockRooms.filter((room) => room.category === "suite").length },
    { id: "family", name: "Family", count: mockRooms.filter((room) => room.category === "family").length },
    { id: "luxury", name: "Luxury", count: mockRooms.filter((room) => room.category === "luxury").length },
  ]

  const filteredRooms = mockRooms
    .filter((room) => selectedCategory === "all" || room.category === selectedCategory)
    .filter(
      (room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const toggleLike = (roomId: string) => {
    const newLiked = new Set(likedRooms)
    if (newLiked.has(roomId)) {
      newLiked.delete(roomId)
    } else {
      newLiked.add(roomId)
    }
    setLikedRooms(newLiked)
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "tv":
        return <Tv className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "room service":
        return <Coffee className="h-4 w-4" />
      case "spa access":
        return <Bath className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Hotel Rooms</h1>
            <p className="text-xl opacity-90">Comfort and luxury for your perfect stay</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Input
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 border-2 border-gray-200 focus:border-rose-500 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "price" | "name")}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-rose-50 border-2 border-gray-200"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-rose-100 to-pink-100 overflow-hidden">
                <img
                  src={`/placeholder_image.png?height=200&width=400&text=${encodeURIComponent(room.name)}`}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleLike(room.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${likedRooms.has(room.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
                {!room.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Booked</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-rose-600 transition-colors">
                    {room.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {room.category}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {room.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {room.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map((amenity) => (
                      <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-rose-600">${room.price}</span>
                    <span className="text-gray-500 text-sm">/night</span>
                  </div>

                  <Button
                    onClick={() => onBookRoom?.(room.id)}
                    disabled={!room.available}
                    className="bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:opacity-90 transition-opacity rounded-xl"
                    size="sm"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    {room.available ? "Book Now" : "Unavailable"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
