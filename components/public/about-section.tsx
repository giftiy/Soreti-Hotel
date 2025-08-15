"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wifi, Car, Utensils, Dumbbell, Waves, Shield } from "lucide-react"

export function AboutSection() {
  const amenities = [
    { icon: Wifi, title: "Free WiFi", description: "High-speed internet throughout the hotel" },
    { icon: Car, title: "Parking", description: "Complimentary valet parking service" },
    { icon: Utensils, title: "Fine Dining", description: "Award-winning restaurant and café" },
    { icon: Dumbbell, title: "Fitness Center", description: "24/7 state-of-the-art gym facilities" },
    { icon: Waves, title: "Swimming Pool", description: "Rooftop infinity pool with city views" },
    { icon: Shield, title: "24/7 Security", description: "Round-the-clock security and concierge" },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">About Hotel Soreti</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nestled in the heart of the city, Hotel Soreti offers an unparalleled blend of luxury, comfort, and
            exceptional service. Our commitment to excellence ensures every guest experiences the finest hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fade-in-up">
            <img src="/luxury-hotel-room.png" alt="Hotel Room" className="rounded-2xl shadow-2xl" />
          </div>
          <div className="animate-slide-in-right">
            <h3 className="text-3xl font-serif font-bold text-gray-900 mb-6">Luxury Redefined</h3>
            <p className="text-lg text-gray-600 mb-6">
              Each of our meticulously designed rooms and suites offers breathtaking views, premium amenities, and
              personalized service that exceeds expectations. From business travelers to leisure guests, we cater to
              every need with sophistication and style.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                <span className="text-gray-700">Premium bedding and linens</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                <span className="text-gray-700">Marble bathrooms with luxury amenities</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                <span className="text-gray-700">24/7 room service and concierge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <Card
              key={amenity.title}
              className="group hover:shadow-xl transition-all duration-300 animate-fade-in-up border-0 shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <amenity.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{amenity.title}</h4>
                <p className="text-gray-600">{amenity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
