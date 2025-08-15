"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Hotel, ShoppingCart, Star, Clock, CreditCard, Gift, Phone, Wifi, Car } from "lucide-react"
import { format } from "date-fns"
import { mockRoomBookings, mockGuests } from "@/lib/booking-data"
import { mockOrders } from "@/lib/mock-data"

export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Assuming current user is the first guest for demo
  const currentGuest = mockGuests[0]
  const guestBookings = mockRoomBookings.filter((booking) => booking.guestId === currentGuest.id)
  const guestOrders = mockOrders.filter(
    (order) => order.guestName === `${currentGuest.firstName} ${currentGuest.lastName}`,
  )

  const stats = {
    totalStays: guestBookings.length + 6, // Adding some history
    loyaltyPoints: currentGuest.loyaltyPoints || 0,
    activeBookings: guestBookings.filter((b) => b.status === "confirmed" || b.status === "checked-in").length,
    totalSpent: guestBookings.reduce((sum, b) => sum + b.totalAmount, 0) + 2450, // Adding some history
  }

  const upcomingBookings = guestBookings.filter((booking) => booking.checkInDate > new Date())
  const currentBookings = guestBookings.filter((booking) => booking.status === "checked-in")
  const recentOrders = guestOrders.slice(0, 3)

  const hotelServices = [
    { name: "Room Service", icon: ShoppingCart, description: "Order food and beverages to your room" },
    { name: "Concierge", icon: Phone, description: "Get assistance with local attractions and reservations" },
    { name: "Spa & Wellness", icon: Star, description: "Book spa treatments and wellness services" },
    { name: "Transportation", icon: Car, description: "Arrange airport transfers and local transport" },
    { name: "Business Center", icon: Wifi, description: "Access printing, internet, and meeting facilities" },
    { name: "Laundry Service", icon: Clock, description: "Professional cleaning and pressing services" },
  ]

  const loyaltyBenefits = [
    { level: "Silver", points: 1000, benefits: ["Late checkout", "Welcome drink", "WiFi upgrade"] },
    { level: "Gold", points: 2500, benefits: ["Room upgrade", "Breakfast included", "Priority check-in"] },
    { level: "Platinum", points: 5000, benefits: ["Suite upgrade", "Airport transfer", "Personal concierge"] },
  ]

  const getCurrentLoyaltyLevel = () => {
    const points = stats.loyaltyPoints
    if (points >= 5000) return "Platinum"
    if (points >= 2500) return "Gold"
    if (points >= 1000) return "Silver"
    return "Member"
  }

  const getNextLevelPoints = () => {
    const points = stats.loyaltyPoints
    if (points < 1000) return 1000 - points
    if (points < 2500) return 2500 - points
    if (points < 5000) return 5000 - points
    return 0
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {currentGuest.firstName}!</h2>
        <p className="text-gray-600">Manage your bookings, orders, and enjoy exclusive member benefits</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="services">Hotel Services</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Guest Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.activeBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Stays</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalStays}</p>
                  </div>
                  <Hotel className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.loyaltyPoints.toLocaleString()}</p>
                  </div>
                  <Gift className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-orange-600">${stats.totalSpent.toLocaleString()}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Stay & Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hotel className="h-5 w-5 mr-2 text-blue-600" />
                  Current Stay
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {currentBookings.map((booking) => (
                      <div key={booking.id} className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Room {booking.roomNumber}</p>
                            <p className="text-sm text-gray-600">{booking.roomType}</p>
                            <p className="text-sm text-gray-600">
                              {format(booking.checkInDate, "MMM dd")} - {format(booking.checkOutDate, "MMM dd")}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Checked In</Badge>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm" variant="outline">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Room Service
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Concierge
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-gray-600">No current bookings.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Upcoming Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Room {booking.roomNumber}</p>
                            <p className="text-sm text-gray-600">{booking.roomType}</p>
                            <p className="text-sm text-gray-600">
                              {format(booking.checkInDate, "MMM dd")} - {format(booking.checkOutDate, "MMM dd")}
                            </p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">Upcoming</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-gray-600">No upcoming bookings.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          {/* My Bookings Content */}
          {guestBookings.map((booking) => (
            <div key={booking.id} className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Room {booking.roomNumber}</p>
                  <p className="text-sm text-gray-600">{booking.roomType}</p>
                  <p className="text-sm text-gray-600">
                    {format(booking.checkInDate, "MMM dd")} - {format(booking.checkOutDate, "MMM dd")}
                  </p>
                </div>
                <Badge
                  className={`bg-${booking.status === "confirmed" ? "green" : "yellow"}-100 text-${booking.status === "confirmed" ? "green" : "yellow"}-800`}
                >
                  {booking.status}
                </Badge>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          {/* Hotel Services Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotelServices.map((service) => (
              <Card key={service.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{service.name}</p>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                    {service.icon && <service.icon className="h-8 w-8 text-blue-600" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          {/* Loyalty Program Content */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Current Level</p>
                  <p className="text-sm text-gray-600">{getCurrentLoyaltyLevel()}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Next Level Points Needed</p>
                  <p className="text-sm text-gray-600">{getNextLevelPoints()} points</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Benefits</p>
                  <ul className="list-disc pl-6">
                    {loyaltyBenefits
                      .find((benefit) => benefit.level === getCurrentLoyaltyLevel())
                      ?.benefits.map((benefit) => (
                        <li key={benefit} className="text-gray-600">
                          {benefit}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
