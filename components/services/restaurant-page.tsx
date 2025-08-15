"use client"

import { useState } from "react"
import { Search, Star, Clock, MapPin, Heart, ShoppingCart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface RestaurantItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  prepTime: string
  servings: number
  isPopular?: boolean
  isNew?: boolean
  isSpicy?: boolean
}

const restaurantItems: RestaurantItem[] = [
  {
    id: "1",
    name: "Traditional Injera with Doro Wat",
    description: "Authentic Ethiopian injera served with spicy chicken stew and hard-boiled eggs",
    price: 180,
    image: "/ethiopian-injera-doro-wat.png",
    category: "Traditional",
    rating: 4.9,
    prepTime: "25 min",
    servings: 2,
    isPopular: true,
    isSpicy: true,
  },
  {
    id: "2",
    name: "Kitfo Special",
    description: "Ethiopian steak tartare seasoned with mitmita and served with ayib cheese",
    price: 220,
    image: "/ethiopian-kitfo.png",
    category: "Traditional",
    rating: 4.8,
    prepTime: "15 min",
    servings: 1,
    isNew: true,
  },
  {
    id: "3",
    name: "Vegetarian Combination",
    description: "Assorted vegetarian dishes including shiro, gomen, and misir wot",
    price: 150,
    image: "/placeholder-u1s1d.png",
    category: "Vegetarian",
    rating: 4.7,
    prepTime: "20 min",
    servings: 2,
  },
  {
    id: "4",
    name: "Grilled Tilapia",
    description: "Fresh tilapia grilled with Ethiopian spices, served with rice and vegetables",
    price: 200,
    image: "/grilled-tilapia.png",
    category: "Seafood",
    rating: 4.6,
    prepTime: "30 min",
    servings: 1,
  },
  {
    id: "5",
    name: "Beef Tibs",
    description: "Tender beef cubes sautéed with onions, peppers, and aromatic spices",
    price: 190,
    image: "/ethiopian-beef-tibs.png",
    category: "Meat",
    rating: 4.8,
    prepTime: "20 min",
    servings: 1,
    isSpicy: true,
  },
  {
    id: "6",
    name: "Pasta Bolognese",
    description: "Italian-style pasta with rich meat sauce and parmesan cheese",
    price: 120,
    image: "/pasta-bolognese.png",
    category: "International",
    rating: 4.5,
    prepTime: "18 min",
    servings: 1,
  },
]

const categories = ["All", "Traditional", "Vegetarian", "Meat", "Seafood", "International"]

export function RestaurantPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [favorites, setFavorites] = useState<string[]>([])
  const [cart, setCart] = useState<string[]>([])

  const filteredItems = restaurantItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const addToCart = (itemId: string) => {
    setCart((prev) => [...prev, itemId])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Soreti Restaurant</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Authentic Ethiopian cuisine & international favorites</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Bedelle, Ethiopia</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Open 11:00 AM - 11:00 PM</span>
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
              placeholder="Search dishes, cuisine..."
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
            <div className="text-2xl font-bold text-card-foreground">100+</div>
            <div className="text-sm text-muted-foreground">Menu Items</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">4.8</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">25min</div>
            <div className="text-sm text-muted-foreground">Avg Prep Time</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-card-foreground">5000+</div>
            <div className="text-sm text-muted-foreground">Happy Diners</div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="product-card bg-card rounded-lg overflow-hidden shadow-sm">
              <div className="relative">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.isPopular && <Badge className="bg-destructive text-destructive-foreground">Popular</Badge>}
                  {item.isNew && <Badge className="bg-accent text-accent-foreground">New</Badge>}
                  {item.isSpicy && <Badge className="bg-orange-500 text-white">🌶️ Spicy</Badge>}
                </div>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-card-foreground">{item.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {item.servings} serving{item.servings > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">{item.category}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-card-foreground">{item.price} ETB</div>
                  <Button onClick={() => addToCart(item.id)} size="sm" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Order Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No dishes found matching your search.</div>
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
