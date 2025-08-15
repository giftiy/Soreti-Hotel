"use client"

import { useState } from "react"
import { Heart, Clock, Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockMenuItems, type OrderItem } from "@/lib/menu-data"

interface RestaurantMenuPageProps {
  onAddToCart?: (item: OrderItem) => void
}

export function RestaurantMenuPage({ onAddToCart }: RestaurantMenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [cartItems, setCartItems] = useState<Map<string, number>>(new Map())
  const [sortBy, setSortBy] = useState<"price" | "name">("name") // rating removed

  const categories = [
    { id: "all", name: "All Items", count: mockMenuItems.length },
    ...Array.from(new Set(mockMenuItems.map(i => i.category))).map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: mockMenuItems.filter(i => i.category === cat).length,
    })),
  ]

  const filteredItems = mockMenuItems
    .filter(item => selectedCategory === "all" || item.category === selectedCategory)
    .filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price": return a.price - b.price
        case "name": return a.name.localeCompare(b.name)
        default: return 0
      }
    })

  const toggleLike = (itemId: string) => {
    const newLiked = new Set(likedItems)
    likedItems.has(itemId) ? newLiked.delete(itemId) : newLiked.add(itemId)
    setLikedItems(newLiked)
  }

  const updateCartQuantity = (itemId: string, change: number) => {
    const newCart = new Map(cartItems)
    const currentQty = newCart.get(itemId) || 0
    const newQty = Math.max(0, currentQty + change)
    newQty === 0 ? newCart.delete(itemId) : newCart.set(itemId, newQty)
    setCartItems(newCart)
  }

  const handleOrder = (itemId: string) => {
    const item = mockMenuItems.find(i => i.id === itemId)
    if (!item) return
    updateCartQuantity(itemId, 1)
    if (onAddToCart) onAddToCart({ menuItem: item, quantity: 1 })
    alert(`${item.name} added to cart! Total: ${getTotalCartValue() + item.price} Birr`)
  }

  const getTotalCartItems = () => Array.from(cartItems.values()).reduce((sum, qty) => sum + qty, 0)
  const getTotalCartValue = () => Array.from(cartItems.entries()).reduce((sum, [id, qty]) => {
    const item = mockMenuItems.find(i => i.id === id)
    return sum + (item ? item.price * qty : 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-96 w-full overflow-hidden">
        <img src="/luxury-hotel-lobby.png" alt="Restaurant Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start px-8 lg:px-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Welcome to Our Restaurant</h1>
          <p className="text-lg lg:text-2xl text-white/90 mb-6">Taste the best dishes in town</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Sort */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-2 border-gray-200 focus:border-red-500 rounded-xl"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as "price" | "name")}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 bg-white"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          {getTotalCartItems() > 0 && (
            <Button className="relative bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({getTotalCartItems()})
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{getTotalCartValue().toFixed(2)}₨</Badge>
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === cat.id ? "bg-red-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-red-50 border-2 border-gray-200"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group flex flex-col">
              <div className="relative h-48">
                <img src={`/${item.image || "default-food.png"}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button
                  onClick={() => toggleLike(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <Heart className={`h-5 w-5 ${likedItems.has(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </button>
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-red-600 transition-colors">{item.name}</h3>
                    <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center gap-3 mb-3 text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {item.preparationTime} min
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 gap-2">
                  <span className="bg-red-100 text-red-700 px-3 py-2 rounded-xl flex-1 text-center font-semibold">{item.price} Birr</span>
                  {cartItems.has(item.id) ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Button onClick={() => updateCartQuantity(item.id, -1)} className="flex-1">-</Button>
                      <span className="w-8 text-center">{cartItems.get(item.id)}</span>
                      <Button onClick={() => updateCartQuantity(item.id, 1)} className="flex-1">+</Button>
                    </div>
                  ) : (
                    <Button onClick={() => handleOrder(item.id)} className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex-1 px-3 py-2">
                      Order
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
