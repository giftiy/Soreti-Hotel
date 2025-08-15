"use client"

import { useState } from "react"
import { Search, Star, Users, Calendar, MapPin, Heart, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Hall {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  capacity: number
  size: string
  features: string[]
  isAvailable: boolean
  isPopular?: boolean
  isNew?: boolean
}

const halls: Hall[] = [
  {
    id: "1",
    name: "Grand Ballroom",
    description: "Elegant ballroom perfect for weddings, galas, and large corporate events",
    price: 15000,
    image: "/grand-ballroom.png",
    category: "Wedding",
    rating: 4.9,
    capacity: 500,
    size: "800 m²",
    features: ["Stage", "Sound System", "Lighting", "Catering", "Parking", "AC"],
    isAvailable: true,
    isPopular: true,
  },
  {
    id: "2",
    name: "Conference Center",
    description: "Modern conference facility with state-of-the-art AV equipment",
    price: 8000,
    image: "/conference-center.png",
    category: "Corporate",
    rating: 4.8,
    capacity: 200,
    size: "300 m²",
    features: ["Projector", "WiFi", "Microphones", "Catering", "Parking", "AC"],
    isAvailable: true,
  },
  {
    id: "3",
    name: "Garden Pavilion",
    description: "Beautiful outdoor pavilion surrounded by lush gardens",
    price: 6000,
    image: "/garden-pavilion.png",
    category: "Outdoor",
    rating: 4.7,
    capacity: 150,
    size: "200 m²",
    features: ["Garden View", "Natural Lighting", "Catering", "Parking"],
    isAvailable: true,
    isNew: true,
  },
  {
    id: "4",
    name: "Executive Boardroom",
    description: "Intimate boardroom for high-level meetings and presentations",
    price: 3000,
    image: "/executive-boardroom.png",
    category: "Corporate",
    rating: 4.6,
    capacity: 25,
    size: "50 m²",
    features: ["Smart Board", "WiFi", "Coffee Service", "AC"],
    isAvailable: false,
  },
  {
    id: "5",
    name: "Banquet Hall",
    description: "Traditional banquet hall ideal for celebrations and receptions",
    price: 12000,
    image: "/banquet-hall.png",
    category: "Celebration",
    rating: 4.8,
    capacity: 300,
    size: "500 m²",
    features: ["Dance Floor", "Sound System", "Lighting", "Catering", "Parking", "AC"],
    isAvailable: true,
    isPopular: true,
  },
  {
    id: "6",
    name: "Rooftop Terrace",
    description: "Stunning rooftop venue with panoramic city views",
    price: 10000,
    image: "/rooftop-terrace.png",
    category: "Outdoor",
    rating: 4.9,
    capacity: 100,
    size: "250 m²",
    features: ["City View", "Bar Setup", "Lighting", "Catering"],
    isAvailable: true,
    isNew: true,
  },
]

const categories = ["All", "Wedding", "Corporate", "Celebration", "Outdoor"]

export function HallPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [favorites, setFavorites] = useState<string[]>([])
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const filteredHalls = halls.filter((hall) => {
    const matchesSearch =
      hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hall.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || hall.category === selectedCategory
    const matchesAvailability = !showAvailableOnly || hall.isAvailable
    return matchesSearch && matchesCategory && matchesAvailability
  })

  const toggleFavorite = (hallId: string) => {
    setFavorites((prev) => (prev.includes(hallId) ? prev.filter((id) => id !== hallId) : [...prev, hallId]))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Event Halls</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Perfect venues for your special occasions</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Bedelle, Ethiopia</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>25-500 Capacity</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>24/7 Event Support</span>
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
              placeholder="Search event halls..."
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
            <div className="text-2xl font-bold text-card-foreground">15+</div>
            <div className="text-sm text-muted-foreground">Event Halls</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">4.8</div>
            <div className="text-sm text-muted-foreground">Client Rating</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">500+</div>
            <div className="text-sm text-muted-foreground">Events Hosted</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">24/7</div>
            <div className="text-sm text-muted-foreground">Event Support</div>
          </div>
        </div>

        {/* Halls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHalls.map((hall) => (
            <div key={hall.id} className="product-card bg-card rounded-lg overflow-hidden shadow-sm">
              <div className="relative">
                <img src={hall.image || "/placeholder.svg"} alt={hall.name} className="w-full h-48 object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {hall.isPopular && <Badge className="bg-destructive text-destructive-foreground">Popular</Badge>}
                  {hall.isNew && <Badge className="bg-accent text-accent-foreground">New</Badge>}
                  {!hall.isAvailable && <Badge className="bg-gray-500 text-white">Booked</Badge>}
                </div>
                <button
                  onClick={() => toggleFavorite(hall.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(hall.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-card-foreground">{hall.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{hall.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{hall.description}</p>

                <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{hall.capacity} guests</span>
                  </div>
                  <span>{hall.size}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {hall.features.slice(0, 4).map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {hall.features.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{hall.features.length - 4} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">{hall.category}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-card-foreground">{hall.price} ETB</div>
                    <div className="text-xs text-muted-foreground">per event</div>
                  </div>
                  <Button disabled={!hall.isAvailable} size="sm" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {hall.isAvailable ? "Book Hall" : "Unavailable"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHalls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No halls found matching your criteria.</div>
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
