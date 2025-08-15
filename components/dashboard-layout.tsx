"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Hotel, Users, Calendar, ShoppingCart, DollarSign, Settings, BarChart3 } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()

  if (!user) return null

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      receptionist: "bg-green-100 text-green-800",
      waiter: "bg-yellow-100 text-yellow-800",
      customer: "bg-purple-100 text-purple-800",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getNavItems = () => {
    const baseItems = [{ icon: Hotel, label: "Dashboard", href: "/dashboard" }]

    switch (user.role) {
      case "admin":
        return [
          ...baseItems,
          { icon: Users, label: "Staff Management", href: "/staff" },
          { icon: Hotel, label: "Room Management", href: "/rooms" },
          { icon: Calendar, label: "Bookings", href: "/bookings" },
          { icon: ShoppingCart, label: "Orders", href: "/orders" },
          { icon: DollarSign, label: "Finances", href: "/finances" },
          { icon: BarChart3, label: "Reports", href: "/reports" },
          { icon: Settings, label: "Settings", href: "/settings" },
        ]
      case "manager":
        return [
          ...baseItems,
          { icon: Users, label: "Staff", href: "/staff" },
          { icon: Hotel, label: "Rooms", href: "/rooms" },
          { icon: Calendar, label: "Bookings", href: "/bookings" },
          { icon: ShoppingCart, label: "Orders", href: "/orders" },
          { icon: BarChart3, label: "Reports", href: "/reports" },
        ]
      case "receptionist":
        return [
          ...baseItems,
          { icon: Calendar, label: "Bookings", href: "/bookings" },
          { icon: Hotel, label: "Rooms", href: "/rooms" },
          { icon: Users, label: "Customers", href: "/customers" },
        ]
      case "waiter":
        return [
          ...baseItems,
          { icon: ShoppingCart, label: "Orders", href: "/orders" },
          { icon: DollarSign, label: "Payments", href: "/payments" },
        ]
      case "customer":
        return [
          ...baseItems,
          { icon: Calendar, label: "My Bookings", href: "/my-bookings" },
          { icon: ShoppingCart, label: "My Orders", href: "/my-orders" },
        ]
      default:
        return baseItems
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Hotel className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Hotel Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge className={getRoleColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {getNavItems().map((item) => (
                    <button
                      key={item.href}
                      className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <item.icon className="h-5 w-5 mr-3 text-gray-400" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  )
}
