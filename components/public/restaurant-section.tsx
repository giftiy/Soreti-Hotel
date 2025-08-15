"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Clock, Users } from "lucide-react"

export function RestaurantSection() {
  const menuCategories = [
    {
      title: "Gourmet Dishes",
      description: "Exquisite culinary creations by our master chefs",
      image: "/gourmet-plating.png",
      items: ["Wagyu Beef Tenderloin", "Lobster Thermidor", "Truffle Risotto", "Duck Confit"],
    },
    {
      title: "Premium Beverages",
      description: "Carefully curated selection of wines and cocktails",
      image: "/premium-drinks.png",
      items: ["Vintage Wine Collection", "Signature Cocktails", "Artisan Coffee", "Fresh Juices"],
    },
    {
      title: "Artisan Snacks",
      description: "Light bites and gourmet snacks for any time",
      image: "/gourmet-snacks-appetizers.png",
      items: ["Truffle Popcorn", "Artisan Cheese Board", "Caviar Selection", "Chocolate Delights"],
    },
  ]

  return (
    <section id="restaurant" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Culinary Excellence</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Indulge in a gastronomic journey at our award-winning restaurant, café, and bar. Every dish is crafted with
            passion and the finest ingredients.
          </p>
        </div>

        {/* Restaurant Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center glass border-0 animate-fade-in-up">
            <CardContent className="p-6">
              <div className="gradient-secondary p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Michelin Rated</h3>
              <p className="text-gray-600">Award-winning cuisine recognized by culinary experts</p>
            </CardContent>
          </Card>

          <Card className="text-center glass border-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6">
              <div className="gradient-success p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Service</h3>
              <p className="text-gray-600">Round-the-clock dining and room service available</p>
            </CardContent>
          </Card>

          <Card className="text-center glass border-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="gradient-warning p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Private Dining</h3>
              <p className="text-gray-600">Exclusive dining experiences for special occasions</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {menuCategories.map((category, index) => (
            <Card
              key={category.title}
              className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2 mb-6">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full gradient-primary text-white hover:opacity-90 transition-opacity">
                  View Full Menu
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
