"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Users, Award } from "lucide-react"

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/luxury-hotel-lobby.png" alt="Soreti Hotel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            Welcome to
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Soreti Hotel
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Experience luxury and comfort in the heart of the city. Where every moment becomes a cherished memory.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center space-x-2 text-white">
              <Star className="h-6 w-6 text-yellow-400" />
              <span className="text-lg font-semibold">5-Star Rating</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Users className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold">10K+ Happy Guests</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Award className="h-6 w-6 text-green-400" />
              <span className="text-lg font-semibold">Award Winning</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gradient-primary text-white hover:opacity-90 transition-opacity animate-pulse-glow"
            >
              Book Your Stay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 transition-colors bg-transparent"
            >
              Explore Amenities
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce"></div>
      <div
        className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>
    </section>
  )
}
