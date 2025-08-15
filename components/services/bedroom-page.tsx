"use client"

import { useState } from "react"
import { Search, Star, Users, Wifi, Car, Coffee, Tv, Bath, Wind, Heart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Room {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  capacity: number
  size: string
  amenities: string[]
  isAvailable: boolean
  isPopular?: boolean
  isNew?: boolean
}

const rooms: Room[] = [
  {
    id: "1",
    name: "Executive Suite",
    description: "Luxurious suite with separate living area, king bed, and panoramic city views",
    price: 2500,
    image: "/luxury-hotel-executive-suite.png",
    category: "Suite",
    rating: 4.9,
    capacity: 4,
    size: "65 m²",
    amenities: ["wifi", "tv", "coffee", "bath", "wind", "car"],
    isAvailable: true,
    isPopular: true,
  },
  {
    id: "2",
    name: "Deluxe Double Room",
    description: "Spacious room with modern amenities, comfortable double bed, and garden view",
    price: 1800,
    image: "/placeholder.svg?height=300&width=400",
    category: "Deluxe",
    rating: 4.8,
    capacity: 2,
    size: "35 m²",
    amenities: ["wifi", "tv", "coffee", "bath", "wind"],
    isAvailable: true,
  },
  {
    id: "3",
    name: "Standard Twin Room",
    description: "Comfortable twin beds with essential amenities for a pleasant stay",
    price: 1200,
    image: "/placeholder.svg?height=300&width=400",
    category: "Standard",
    rating: 4.6,
    capacity: 2,
    size: "25 m²",
    amenities: ["wifi", "tv", "bath"],
    isAvailable: true,
    isNew: true,
  },
  {
    id: "4",
    name: "Family Room",
    description: "Perfect for families with connecting rooms and extra space for children",
    price: 2200,
    image: "/placeholder.svg?height=300&width=400",
    category: "Family",
    rating: 4.7,
    capacity: 6,
    size: "50 m²",
    amenities: ["wifi", "tv", "coffee", "bath", "wind"],
    isAvailable: false,
  },
  {
    id: "5",
    name: "Presidential Suite",
    description: "Ultimate luxury with private balcony, jacuzzi, and personalized service",
    price: 4500,
    image: "/placeholder.svg?height=300&width=400",
    category: "Presidential",
    rating: 5.0,
    capacity: 4,
    size: "120 m²",
    amenities: ["wifi", "tv", "coffee", "bath", "wind", "car"],
    isAvailable: true,
    isPopular: true,
  },
  {
    id: "6",
    name: "Business Room",
    description: "Designed for business travelers with work desk and high-speed internet",
    price: 1600,
    image: "/placeholder.svg?height=300&width=400",
    category: "Business",
    rating: 4.5,
    capacity: 2,
    size: "30 m²",
    amenities: ["wifi", "tv", "coffee", "bath"],
    isAvailable: true,
  },
]

const categories = ["All", "Standard", "Deluxe", "Suite", "Family", "Business", "Presidential"]

const amenityIcons = {
  wifi: Wifi,
  tv: Tv,
  coffee: Coffee,
  bath: Bath,
  wind: Wind,
  car: Car,
}

const amenityNames = {
  wifi: "Free WiFi",
  tv: "Smart TV",
  coffee: "Coffee Maker",
  bath: "Private Bath",
  wind: "Air Conditioning",
  car: "Free Parking",
}

export function BedroomPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [favorites, setFavorites] = useState<string[]>([])
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || room.category === selectedCategory
    const matchesAvailability = !showAvailableOnly || room.isAvailable
    return matchesSearch && matchesCategory && matchesAvailability
  })

  const toggleFavorite = (roomId: string) => {
    setFavorites((prev) => (prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Soreti Rooms</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Comfortable accommodations in the heart of Bedelle</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>1-6 Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span>Free WiFi</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span>Free Parking</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
          <Button
            variant={showAvailableOnly ? "default" : "outline"}
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
          >
            Available Only
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">50+</div>
            <div className="text-sm text-muted-foreground">Rooms Available</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">4.8</div>
            <div className="text-sm text-muted-foreground">Guest Rating</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">24/7</div>
            <div className="text-sm text-muted-foreground">Room Service</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">100%</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="product-card bg-card rounded-lg overflow-hidden shadow-sm">
              <div className="relative">
                <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-48 object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {room.isPopular && <Badge className="bg-destructive text-destructive-foreground">Popular</Badge>}
                  {room.isNew && <Badge className="bg-accent text-accent-foreground">New</Badge>}
                  {!room.isAvailable && <Badge className="bg-gray-500 text-white">Booked</Badge>}
                </div>
                <button
                  onClick={() => toggleFavorite(room.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(room.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-card-foreground">{room.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{room.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{room.description}</p>

                <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{room.capacity} guests</span>
                  </div>
                  <span>{room.size}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {room.amenities.slice(0, 4).map((amenity) => {
                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                    return (
                      <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon className="h-3 w-3" />
                        <span>{amenityNames[amenity as keyof typeof amenityNames]}</span>
                      </div>
                    )
                  })}
                  {room.amenities.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{room.amenities.length - 4} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">{room.category}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-card-foreground">{room.price} ETB</div>
                    <div className="text-xs text-muted-foreground">per night</div>
                  </div>
                  <Button disabled={!room.isAvailable} size="sm" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {room.isAvailable ? "Book Now" : "Unavailable"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No rooms found matching your criteria.</div>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                setShowAvailableOnly(false)
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
