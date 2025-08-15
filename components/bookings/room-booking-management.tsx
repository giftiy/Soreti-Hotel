"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Search, CalendarIcon, Users, Bed, CheckCircle, Clock, AlertCircle, Eye } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { mockRoomBookings, mockGuests, type RoomBooking, type Guest } from "@/lib/booking-data"
import { mockRooms } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"

export function RoomBookingManagement() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<RoomBooking[]>(mockRoomBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isNewBookingDialogOpen, setIsNewBookingDialogOpen] = useState(false)

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      "checked-in": "bg-green-100 text-green-800",
      "checked-out": "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      "no-show": "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getPaymentBadgeColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      partial: "bg-orange-100 text-orange-800",
      paid: "bg-green-100 text-green-800",
      refunded: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const updateBookingStatus = (bookingId: string, newStatus: RoomBooking["status"]) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)),
    )
  }

  const updatePaymentStatus = (bookingId: string, newStatus: RoomBooking["paymentStatus"]) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, paymentStatus: newStatus } : booking)),
    )
  }

  const addNewBooking = (newBooking: Omit<RoomBooking, "id" | "bookingNumber">) => {
    const booking: RoomBooking = {
      ...newBooking,
      id: Date.now().toString(),
      bookingNumber: `RB-${String(bookings.length + 1).padStart(3, "0")}`,
    }
    setBookings((prev) => [booking, ...prev])
    setIsNewBookingDialogOpen(false)
  }

  const bookingStats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    checkedIn: bookings.filter((b) => b.status === "checked-in").length,
    checkedOut: bookings.filter((b) => b.status === "checked-out").length,
  }

  const canManageBookings = user?.role === "admin" || user?.role === "manager" || user?.role === "receptionist"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room Bookings</h2>
          <p className="text-gray-600">Manage hotel room reservations and guest check-ins</p>
        </div>
        {canManageBookings && (
          <Dialog open={isNewBookingDialogOpen} onOpenChange={setIsNewBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Room Booking</DialogTitle>
                <DialogDescription>Make a new reservation for a guest</DialogDescription>
              </DialogHeader>
              <NewRoomBookingForm onSubmit={addNewBooking} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
              </div>
              <Bed className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{bookingStats.confirmed}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked In</p>
                <p className="text-2xl font-bold text-green-600">{bookingStats.checkedIn}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked Out</p>
                <p className="text-2xl font-bold text-gray-600">{bookingStats.checkedOut}</p>
              </div>
              <Users className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings by number, guest name, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Room Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking #</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {booking.guest.firstName} {booking.guest.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{booking.guest.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">Room {booking.roomNumber}</p>
                      <p className="text-sm text-gray-600">{booking.roomType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>Check-in: {format(booking.checkInDate, "MMM dd")}</p>
                      <p>Check-out: {format(booking.checkOutDate, "MMM dd")}</p>
                      <p className="text-gray-600">{booking.numberOfNights} nights</p>
                    </div>
                  </TableCell>
                  <TableCell>{booking.numberOfGuests}</TableCell>
                  <TableCell>${booking.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(booking.status)}>
                      {booking.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentBadgeColor(booking.paymentStatus)}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Booking Details - {booking.bookingNumber}</DialogTitle>
                          </DialogHeader>
                          <BookingDetailsView
                            booking={booking}
                            onStatusUpdate={updateBookingStatus}
                            onPaymentUpdate={updatePaymentStatus}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

interface NewRoomBookingFormProps {
  onSubmit: (booking: Omit<RoomBooking, "id" | "bookingNumber">) => void
}

function NewRoomBookingForm({ onSubmit }: NewRoomBookingFormProps) {
  const [formData, setFormData] = useState({
    guestId: "",
    roomId: "",
    checkInDate: undefined as Date | undefined,
    checkOutDate: undefined as Date | undefined,
    numberOfGuests: 1,
    specialRequests: "",
    earlyCheckIn: false,
    lateCheckOut: false,
  })

  const [newGuest, setNewGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    nationality: "",
  })

  const [isNewGuest, setIsNewGuest] = useState(false)

  const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !formData.roomId) return 0

    const nights = Math.ceil((formData.checkOutDate.getTime() - formData.checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    const room = mockRooms.find((r) => r.id === formData.roomId)
    if (!room) return 0

    const subtotal = nights * room.price
    const tax = subtotal * 0.1
    const fees = subtotal * 0.02
    return subtotal + tax + fees
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.checkInDate || !formData.checkOutDate) return

    let guest: Guest
    if (isNewGuest) {
      guest = {
        id: Date.now().toString(),
        ...newGuest,
        loyaltyPoints: 0,
        preferences: [],
      }
    } else {
      const existingGuest = mockGuests.find((g) => g.id === formData.guestId)
      if (!existingGuest) return
      guest = existingGuest
    }

    const room = mockRooms.find((r) => r.id === formData.roomId)
    if (!room) return

    const nights = Math.ceil((formData.checkOutDate.getTime() - formData.checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    const totalAmount = calculateTotal()

    onSubmit({
      guestId: guest.id,
      guest,
      roomId: formData.roomId,
      roomNumber: room.number,
      roomType: room.type,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      numberOfGuests: formData.numberOfGuests,
      numberOfNights: nights,
      roomRate: room.price,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
      bookingDate: new Date(),
      specialRequests: formData.specialRequests || undefined,
      earlyCheckIn: formData.earlyCheckIn,
      lateCheckOut: formData.lateCheckOut,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest Selection */}
      <div>
        <Label>Guest Information</Label>
        <div className="mt-2 space-y-4">
          <div className="flex items-center space-x-4">
            <Button type="button" variant={!isNewGuest ? "default" : "outline"} onClick={() => setIsNewGuest(false)}>
              Existing Guest
            </Button>
            <Button type="button" variant={isNewGuest ? "default" : "outline"} onClick={() => setIsNewGuest(true)}>
              New Guest
            </Button>
          </div>

          {!isNewGuest ? (
            <div>
              <Label htmlFor="guestId">Select Guest</Label>
              <Select value={formData.guestId} onValueChange={(value) => setFormData({ ...formData, guestId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose existing guest" />
                </SelectTrigger>
                <SelectContent>
                  {mockGuests.map((guest) => (
                    <SelectItem key={guest.id} value={guest.id}>
                      {guest.firstName} {guest.lastName} - {guest.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={newGuest.firstName}
                  onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={newGuest.lastName}
                  onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  required
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Room Selection */}
      <div>
        <Label htmlFor="roomId">Room</Label>
        <Select value={formData.roomId} onValueChange={(value) => setFormData({ ...formData, roomId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select room" />
          </SelectTrigger>
          <SelectContent>
            {mockRooms
              .filter((room) => room.status === "available")
              .map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  Room {room.number} - {room.type} (${room.price}/night)
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.checkInDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.checkInDate ? format(formData.checkInDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.checkInDate}
                onSelect={(date) => setFormData({ ...formData, checkInDate: date })}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.checkOutDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.checkOutDate}
                onSelect={(date) => setFormData({ ...formData, checkOutDate: date })}
                disabled={(date) => date <= (formData.checkInDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="numberOfGuests">Number of Guests</Label>
          <Input
            id="numberOfGuests"
            type="number"
            min="1"
            max="4"
            value={formData.numberOfGuests}
            onChange={(e) => setFormData({ ...formData, numberOfGuests: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Additional Services</Label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.earlyCheckIn}
                onChange={(e) => setFormData({ ...formData, earlyCheckIn: e.target.checked })}
              />
              <span className="text-sm">Early Check-in (+$25)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.lateCheckOut}
                onChange={(e) => setFormData({ ...formData, lateCheckOut: e.target.checked })}
              />
              <span className="text-sm">Late Check-out (+$25)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Textarea
          id="specialRequests"
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          placeholder="Any special requirements or preferences..."
        />
      </div>

      {/* Total */}
      {formData.checkInDate && formData.checkOutDate && formData.roomId && (
        <div className="border-t pt-4">
          <div className="text-right">
            <p className="text-lg font-bold">Total: ${calculateTotal().toFixed(2)}</p>
            <p className="text-sm text-gray-600">Includes taxes and fees</p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={
          !formData.checkInDate || !formData.checkOutDate || (!formData.guestId && !isNewGuest) || !formData.roomId
        }
      >
        Create Booking
      </Button>
    </form>
  )
}

interface BookingDetailsViewProps {
  booking: RoomBooking
  onStatusUpdate: (bookingId: string, status: RoomBooking["status"]) => void
  onPaymentUpdate: (bookingId: string, status: RoomBooking["paymentStatus"]) => void
}

function BookingDetailsView({ booking, onStatusUpdate, onPaymentUpdate }: BookingDetailsViewProps) {
  const { user } = useAuth()
  const canUpdateStatus = user?.role === "admin" || user?.role === "manager" || user?.role === "receptionist"

  return (
    <div className="space-y-6">
      {/* Booking Header */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-gray-900">Booking Information</h3>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <span className="font-medium">Booking #:</span> {booking.bookingNumber}
            </p>
            <p>
              <span className="font-medium">Guest:</span> {booking.guest.firstName} {booking.guest.lastName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {booking.guest.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {booking.guest.phone}
            </p>
            <p>
              <span className="font-medium">Room:</span> {booking.roomNumber} ({booking.roomType})
            </p>
            <p>
              <span className="font-medium">Booking Date:</span> {format(booking.bookingDate, "PPP")}
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Stay Details</h3>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <span className="font-medium">Check-in:</span> {format(booking.checkInDate, "PPP")}
            </p>
            <p>
              <span className="font-medium">Check-out:</span> {format(booking.checkOutDate, "PPP")}
            </p>
            <p>
              <span className="font-medium">Nights:</span> {booking.numberOfNights}
            </p>
            <p>
              <span className="font-medium">Guests:</span> {booking.numberOfGuests}
            </p>
            <p>
              <span className="font-medium">Room Rate:</span> ${booking.roomRate}/night
            </p>
            <p>
              <span className="font-medium">Total Amount:</span> ${booking.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Status Management */}
      {canUpdateStatus && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Booking Status</Label>
            <Select value={booking.status} onValueChange={(value) => onStatusUpdate(booking.id, value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Payment Status</Label>
            <Select value={booking.paymentStatus} onValueChange={(value) => onPaymentUpdate(booking.id, value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Special Requests */}
      {booking.specialRequests && (
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Special Requests</h3>
          <p className="text-sm text-gray-600 p-3 bg-yellow-50 rounded-lg">{booking.specialRequests}</p>
        </div>
      )}

      {/* Additional Services */}
      {(booking.earlyCheckIn || booking.lateCheckOut) && (
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Additional Services</h3>
          <div className="space-y-1 text-sm">
            {booking.earlyCheckIn && <p>• Early Check-in</p>}
            {booking.lateCheckOut && <p>• Late Check-out</p>}
          </div>
        </div>
      )}

      {/* Guest Preferences */}
      {booking.guest.preferences && booking.guest.preferences.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Guest Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {booking.guest.preferences.map((pref, index) => (
              <Badge key={index} variant="secondary">
                {pref}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
