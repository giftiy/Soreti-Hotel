"use client"

import { useState } from "react"
import { Menu, X, Hotel, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onNavigate?: (section: string) => void
  currentSection?: string
}

export function Navbar({ onNavigate, currentSection = "home" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "home" },
    { name: "Restaurant", href: "restaurant" },
    { name: "Hall", href: "hall" },
    { name: "Café", href: "cafe" },
    { name: "Bedroom", href: "bedroom" },
    { name: "Snacks", href: "snacks" },
  ]

  const handleNavClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href)
    }
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="gradient-primary p-2 rounded-lg">
              <Hotel className="h-6 w-6 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Soreti Hotel
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 relative group ${
                  currentSection === item.href ? "text-purple-600" : ""
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 ${
                    currentSection === item.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </button>
            ))}
            <Button
              onClick={() => handleNavClick("dashboard")}
              className="gradient-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-lg rounded-lg mt-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors ${
                    currentSection === item.href ? "text-purple-600 bg-purple-50" : ""
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <Button
                onClick={() => handleNavClick("dashboard")}
                className="w-full gradient-primary text-white mt-2 flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
