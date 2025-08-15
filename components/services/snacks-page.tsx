"use client"

import { useState } from "react"
import { Search, Star, Clock, Zap, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Snack {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  prepTime: string
  isPopular?: boolean
  isNew?: boolean
  isHealthy?: boolean
}

const snacks: Snack[] = [
  {
    id: "1",
    name: "Ethiopian Popcorn",
    description: "Traditional spiced popcorn with berbere seasoning",
    price: 15,
    image: "/ethiopian-popcorn.png",
    category: "Traditional",
    rating: 4.8,
    prepTime: "2 min",
    isPopular: true,
  },
  {
    id: "2",
    name: "Roasted Barley",
    description: "Healthy roasted barley snack, perfect with coffee",
    price: 12,
    image: "/roasted-barley.png",
    category: "Healthy",
    rating: 4.6,
    prepTime: "1 min",
    isHealthy: true,
  },
  {
    id: "3",
    name: "Samosa Trio",
    description: "Three crispy samosas filled with spiced vegetables",
    price: 25,
    image: "/samosa-trio.png",
    category: "Fried",
    rating: 4.7,
    prepTime: "5 min",
    isNew: true,
  },
  {
    id: "4",
    name: "Mixed Nuts",
    description: "Premium mix of roasted almonds, cashews, and peanuts",
    price: 35,
    image: "/mixed-nuts.png",
    category: "Healthy",
    rating: 4.5,
    prepTime: "1 min",
    isHealthy: true,
  },
  {
    id: "5",
    name: "Banana Chips",
    description: "Crispy banana chips lightly salted and perfectly crunchy",
    price: 18,
    image: "/banana-chips.png",
    category: "Chips",
    rating: 4.4,
    prepTime: "1 min",
  },
  {
    id: "6",
    name: "Spiced Chickpeas",
    description: "Roasted chickpeas with Ethiopian spice blend",
    price: 20,
    image: "/spiced-chickpeas.png",
    category: "Healthy",
    rating: 4.6,
    prepTime: "2 min",
    isHealthy: true,
    isPopular: true,
  },
  {
    id: "7",
    name: "Sweet Potato Fries",
    description: "Golden sweet potato fries with honey dip",
    price: 30,
    image: "/sweet-potato-fries.png",
    category: "Fried",
    rating: 4.8,
    prepTime: "8 min",
    isNew: true,
  },
  {
    id: "8",
    name: "Fruit Salad Cup",
    description: "Fresh seasonal fruits with honey lime dressing",
    price: 28,
    image: "/fruit-salad-cup.png",
    category: "Fresh",
    rating: 4.7,
    prepTime: "3 min",
    isHealthy: true,
  },
]

const categories = ["All", "Traditional", "Healthy", "Fried", "Chips", "Fresh"]

export function SnacksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [favorites, setFavorites] = useState<string[]>([])
  const [cart, setCart] = useState<string[]>([])

  const filteredSnacks = snacks.filter((snack) => {
    const matchesSearch =
      snack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snack.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || snack.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (snackId: string) => {
    setFavorites((prev) => (prev.includes(snackId) ? prev.filter((id) => id !== snackId) : [...prev, snackId]))
  }

  const addToCart = (snackId: string) => {
    setCart((prev) => [...prev, snackId])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Quick Snacks</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Delicious bites for any time of day</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Quick Service</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>1-8 min prep</span>
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
              placeholder="Search snacks..."
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
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">30+</div>
            <div className="text-sm text-muted-foreground">Snack Options</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">4.6</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">3min</div>
            <div className="text-sm text-muted-foreground">Avg Prep Time</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">24/7</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
        </div>

        {/* Snacks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSnacks.map((snack) => (
            <div key={snack.id} className="product-card bg-card rounded-lg overflow-hidden shadow-sm">
              <div className="relative">
                <img src={snack.image || "/placeholder.svg"} alt={snack.name} className="w-full h-40 object-cover" />
                <div className="absolute top-2 left-2 flex gap-1">
                  {snack.isPopular && (
                    <Badge className="bg-destructive text-destructive-foreground text-xs">Popular</Badge>
                  )}
                  {snack.isNew && <Badge className="bg-accent text-accent-foreground text-xs">New</Badge>}
                  {snack.isHealthy && <Badge className="bg-green-500 text-white text-xs">Healthy</Badge>}
                </div>
                <button
                  onClick={() => toggleFavorite(snack.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={`h-3 w-3 ${favorites.includes(snack.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
              </div>

              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-card-foreground">{snack.name}</h3>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{snack.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{snack.description}</p>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{snack.prepTime}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {snack.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-card-foreground">{snack.price} ETB</div>
                  <Button
                    onClick={() => addToCart(snack.id)}
                    size="sm"
                    className="flex items-center gap-1 text-xs px-2 py-1"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSnacks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No snacks found matching your search.</div>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
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
