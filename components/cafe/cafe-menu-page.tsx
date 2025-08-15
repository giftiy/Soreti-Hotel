"use client"

import { useState } from "react"
import { Heart, Star, Clock, Search, ShoppingCart, Plus, Minus, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockMenuItems, type OrderItem } from "@/lib/menu-data"

interface CafeMenuPageProps {
  onAddToCart?: (item: OrderItem) => void
}

export function CafeMenuPage({ onAddToCart }: CafeMenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [cartItems, setCartItems] = useState<Map<string, number>>(new Map())
  const [sortBy, setSortBy] = useState<"price" | "name" | "rating">("name")

  // Filter for cafe items (beverages, desserts, breakfast)
  const cafeItems = mockMenuItems.filter(
    (item) => item.category === "beverage" || item.category === "dessert" || item.category === "breakfast",
  )

  const categories = [
    { id: "all", name: "All Items", count: cafeItems.length },
    { id: "beverage", name: "Beverages", count: cafeItems.filter((item) => item.category === "beverage").length },
    { id: "breakfast", name: "Breakfast", count: cafeItems.filter((item) => item.category === "breakfast").length },
    { id: "dessert", name: "Desserts", count: cafeItems.filter((item) => item.category === "dessert").length },
  ]

  const filteredItems = cafeItems
    .filter((item) => selectedCategory === "all" || item.category === selectedCategory)
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return 0
        default:
          return 0
      }
    })

  const toggleLike = (itemId: string) => {
    const newLiked = new Set(likedItems)
    if (newLiked.has(itemId)) {
      newLiked.delete(itemId)
    } else {
      newLiked.add(itemId)
    }
    setLikedItems(newLiked)
  }

  const updateCartQuantity = (itemId: string, change: number) => {
    const newCart = new Map(cartItems)
    const currentQty = newCart.get(itemId) || 0
    const newQty = Math.max(0, currentQty + change)

    if (newQty === 0) {
      newCart.delete(itemId)
    } else {
      newCart.set(itemId, newQty)
    }
    setCartItems(newCart)
  }

  const getTotalCartItems = () => {
    return Array.from(cartItems.values()).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalCartValue = () => {
    return Array.from(cartItems.entries()).reduce((sum, [itemId, qty]) => {
      const item = cafeItems.find((i) => i.id === itemId)
      return sum + (item ? item.price * qty : 0)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-amber-600 via-orange-600 to-red-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <Coffee className="h-12 w-12" />
              <h1 className="text-4xl md:text-6xl font-bold">Café Menu</h1>
            </div>
            <p className="text-xl opacity-90">Artisan coffee, fresh pastries & delightful treats</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search coffee, pastries, desserts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-2 border-gray-200 focus:border-amber-500 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "price" | "name" | "rating")}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
            {getTotalCartItems() > 0 && (
              <Button className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 h-12 rounded-xl">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({getTotalCartItems()})
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                  ${getTotalCartValue().toFixed(2)}
                </Badge>
              </Button>
            )}
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
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-amber-50 border-2 border-gray-200"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                <img
                  src={`/placeholder_image.png?height=200&width=300&text=${encodeURIComponent(item.name)}`}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleLike(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${likedItems.has(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
             

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-amber-600 transition-colors">
                    {item.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4" />
                    <span className="text-gray-600 text-sm ml-1">4.2</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {item.preparationTime}min
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-600">${item.price}</span>

                  {cartItems.has(item.id) ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-semibold min-w-[2rem] text-center">{cartItems.get(item.id)}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      disabled={!item.available}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90 transition-opacity rounded-xl"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
