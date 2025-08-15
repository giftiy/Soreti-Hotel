"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Hotel, Clock, CheckCircle, Search, Phone, Mail, MapPin, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { mockRoomBookings, mockGuests } from "@/lib/booking-data"
import { mockRooms } from "@/lib/mock-data"

export function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState("today")
  const [searchTerm, setSearchTerm] = useState("")

  // Today's activities
  const today = new Date()
  const todayBookings = mockRoomBookings.filter(
    (booking) =>
      format(booking.checkInDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") ||
      format(booking.checkOutDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
  )

  const checkInsToday = mockRoomBookings.filter(
    (booking) => format(booking.checkInDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
  )

  const checkOutsToday = mockRoomBookings.filter(
    (booking) => format(booking.checkOutDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
  )

  const stats = {
    checkInsToday: checkInsToday.length,
    checkOutsToday: checkOutsToday.length,
    availableRooms: mockRooms.filter((r) => r.status === "available").length,
    occupiedRooms: mockRooms.filter((r) => r.status === "occupied").length,
    pendingBookings: mockRoomBookings.filter((b) => b.status === "pending").length,
    vipGuests: mockGuests.filter((g) => (g.loyaltyPoints || 0) > 2000).length,
  }

  const upcomingArrivals = checkInsToday.slice(0, 5)
  const upcomingDepartures = checkOutsToday.slice(0, 5)

  const filteredGuests = mockGuests.filter(
    (guest) =>
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      "checked-in": "bg-green-100 text-green-800",
      "checked-out": "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reception Dashboard</h2>
        <p className="text-gray-600">Manage guest services, check-ins, and front desk operations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today's Activity</TabsTrigger>
          <TabsTrigger value="guests">Guest Management</TabsTrigger>
          <TabsTrigger value="rooms">Room Status</TabsTrigger>
          <TabsTrigger value="services">Guest Services</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {/* Today's Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Check-ins Today</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.checkInsToday}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Check-outs Today</p>
                    <p className="text-2xl font-bold text-green-600">{stats.checkOutsToday}</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Rooms</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.availableRooms}</p>
                  </div>
                  <Hotel className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">VIP Guests</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.vipGuests}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Upcoming Check-ins
                </CardTitle>
                <CardDescription>Guests arriving today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingArrivals.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No check-ins scheduled for today</p>
                  ) : (
                    upcomingArrivals.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">
                            {booking.guest.firstName} {booking.guest.lastName}
                          </p>
                          <p className="text-sm text-gray-600">Room {booking.roomNumber}</p>
                          <p className="text-sm text-gray-600">{booking.numberOfGuests} guests</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusBadgeColor(booking.status)}>{booking.status}</Badge>
                          <p className="text-sm text-gray-600 mt-1">{format(booking.checkInDate, "h:mm a")}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  Upcoming Check-outs
                </CardTitle>
                <CardDescription>Guests departing today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDepartures.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No check-outs scheduled for today</p>
                  ) : (
                    upcomingDepartures.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">
                            {booking.guest.firstName} {booking.guest.lastName}
                          </p>
                          <p className="text-sm text-gray-600">Room {booking.roomNumber}</p>
                          <p className="text-sm text-gray-600">{booking.numberOfNights} nights</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusBadgeColor(booking.status)}>{booking.status}</Badge>
                          <p className="text-sm text-gray-600 mt-1">{format(booking.checkOutDate, "h:mm a")}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common front desk tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-sm">Check-in Guest</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Clock className="h-6 w-6" />
                  <span className="text-sm">Check-out Guest</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">New Booking</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Hotel className="h-6 w-6" />
                  <span className="text-sm">Room Assignment</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guests" className="space-y-6">
          {/* Guest Search */}
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search guests by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Guest List */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Directory</CardTitle>
              <CardDescription>Registered guests and their information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGuests.slice(0, 10).map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {guest.firstName} {guest.lastName}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {guest.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {guest.phone}
                          </span>
                        </div>
                        {guest.nationality && (
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {guest.nationality}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-600">{guest.loyaltyPoints || 0} points</p>
                      <p className="text-sm text-gray-600">Loyalty Member</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          {/* Room Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{stats.availableRooms}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Occupied</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.occupiedRooms}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockRooms.filter((r) => r.status === "maintenance").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Cleaning</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {mockRooms.filter((r) => r.status === "cleaning").length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Room Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Room Status Grid</CardTitle>
              <CardDescription>Real-time room availability and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-4 rounded-lg border-2 text-center ${
                      room.status === "available"
                        ? "border-green-200 bg-green-50"
                        : room.status === "occupied"
                          ? "border-blue-200 bg-blue-50"
                          : room.status === "maintenance"
                            ? "border-red-200 bg-red-50"
                            : "border-yellow-200 bg-yellow-50"
                    }`}
                  >
                    <p className="font-medium">{room.number}</p>
                    <p className="text-sm text-gray-600">{room.type}</p>
                    <Badge
                      className={`mt-2 ${
                        room.status === "available"
                          ? "bg-green-100 text-green-800"
                          : room.status === "occupied"
                            ? "bg-blue-100 text-blue-800"
                            : room.status === "maintenance"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {room.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          {/* Guest Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Guest Requests</CardTitle>
                <CardDescription>Pending guest service requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">Extra Towels - Room 101</p>
                      <p className="text-sm text-gray-600">Requested 30 minutes ago</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Late Checkout - Room 205</p>
                      <p className="text-sm text-gray-600">Until 2:00 PM</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Approved</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Room Service - Room 302</p>
                      <p className="text-sm text-gray-600">Breakfast delivery</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Concierge Services</CardTitle>
                <CardDescription>Guest assistance and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    Local Attractions
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Restaurant Reservations
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Event Tickets
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Transportation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Service Performance</CardTitle>
              <CardDescription>Guest service metrics and satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">24</p>
                  <p className="text-sm text-gray-600">Requests Today</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">18</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">6</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">4.9/5</p>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
