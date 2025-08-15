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
import { Plus, Search, CalendarIcon, Users, Building, CheckCircle, Clock, AlertCircle, Eye } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { mockHallBookings, mockEventHalls, type HallBooking } from "@/lib/booking-data"
import { useAuth } from "@/contexts/auth-context"

export function HallBookingManagement() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<HallBooking[]>(mockHallBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isNewBookingDialogOpen, setIsNewBookingDialogOpen] = useState(false)

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hallName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      "in-progress": "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getEventTypeBadgeColor = (type: string) => {
    const colors = {
      conference: "bg-blue-100 text-blue-800",
      wedding: "bg-pink-100 text-pink-800",
      party: "bg-purple-100 text-purple-800",
      meeting: "bg-green-100 text-green-800",
      exhibition: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const updateBookingStatus = (bookingId: string, newStatus: HallBooking["status"]) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)),
    )
  }

  const updatePaymentStatus = (bookingId: string, newStatus: HallBooking["paymentStatus"]) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, paymentStatus: newStatus } : booking)),
    )
  }

  const addNewBooking = (newBooking: Omit<HallBooking, "id" | "bookingNumber">) => {
    const booking: HallBooking = {
      ...newBooking,
      id: Date.now().toString(),
      bookingNumber: `HB-${String(bookings.length + 1).padStart(3, "0")}`,
    }
    setBookings((prev) => [booking, ...prev])
    setIsNewBookingDialogOpen(false)
  }

  const bookingStats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    inProgress: bookings.filter((b) => b.status === "in-progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  }

  const canManageBookings = user?.role === "admin" || user?.role === "manager" || user?.role === "receptionist"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Hall Bookings</h2>
          <p className="text-gray-600">Manage conference rooms and event space reservations</p>
        </div>
        {canManageBookings && (
          <Dialog open={isNewBookingDialogOpen} onOpenChange={setIsNewBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Hall Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Hall Booking</DialogTitle>
                <DialogDescription>Reserve an event space or conference room</DialogDescription>
              </DialogHeader>
              <NewHallBookingForm onSubmit={addNewBooking} />
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
              <Building className="h-8 w-8 text-gray-600" />
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
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-green-600">{bookingStats.inProgress}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{bookingStats.completed}</p>
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
                placeholder="Search bookings by number, client name, or hall..."
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
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hall Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Hall</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.clientName}</p>
                      <p className="text-sm text-gray-600">{booking.clientEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEventTypeBadgeColor(booking.eventType)}>
                      {booking.eventType.charAt(0).toUpperCase() + booking.eventType.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.hallName}</p>
                      <p className="text-sm text-gray-600">{booking.duration}h duration</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{format(booking.eventDate, "MMM dd, yyyy")}</p>
                      <p className="text-gray-600">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{booking.expectedGuests}</TableCell>
                  <TableCell>${booking.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(booking.status)}>
                      {booking.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                            <DialogTitle>Hall Booking Details - {booking.bookingNumber}</DialogTitle>
                          </DialogHeader>
                          <HallBookingDetailsView
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

interface NewHallBookingFormProps {
  onSubmit: (booking: Omit<HallBooking, "id" | "bookingNumber">) => void
}

function NewHallBookingForm({ onSubmit }: NewHallBookingFormProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    hallId: "",
    eventType: "conference" as HallBooking["eventType"],
    eventDate: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    expectedGuests: 1,
    specialRequirements: "",
    cateringRequired: false,
    equipmentNeeded: [] as string[],
    setupRequirements: "",
  })

  const calculateTotal = () => {
    if (!formData.hallId || !formData.startTime || !formData.endTime) return 0

    const hall = mockEventHalls.find((h) => h.id === formData.hallId)
    if (!hall) return 0

    const startHour = Number.parseInt(formData.startTime.split(":")[0])
    const endHour = Number.parseInt(formData.endTime.split(":")[0])
    const duration = endHour - startHour

    return duration * hall.hourlyRate
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.eventDate || !formData.startTime || !formData.endTime) return

    const hall = mockEventHalls.find((h) => h.id === formData.hallId)
    if (!hall) return

    const startHour = Number.parseInt(formData.startTime.split(":")[0])
    const endHour = Number.parseInt(formData.endTime.split(":")[0])
    const duration = endHour - startHour

    onSubmit({
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      hallId: formData.hallId,
      hallName: hall.name,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration,
      expectedGuests: formData.expectedGuests,
      totalAmount: calculateTotal(),
      status: "pending",
      paymentStatus: "pending",
      bookingDate: new Date(),
      specialRequirements: formData.specialRequirements || undefined,
      cateringRequired: formData.cateringRequired,
      equipmentNeeded: formData.equipmentNeeded.length > 0 ? formData.equipmentNeeded : undefined,
      setupRequirements: formData.setupRequirements || undefined,
    })
  }

  const availableEquipment = [
    "Projector",
    "Sound System",
    "Microphones",
    "Lighting",
    "Stage",
    "Dance Floor",
    "Bar Setup",
    "Catering Setup",
  ]

  const toggleEquipment = (equipment: string) => {
    setFormData((prev) => ({
      ...prev,
      equipmentNeeded: prev.equipmentNeeded.includes(equipment)
        ? prev.equipmentNeeded.filter((e) => e !== equipment)
        : [...prev.equipmentNeeded, equipment],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientEmail">Email *</Label>
          <Input
            id="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientPhone">Phone *</Label>
          <Input
            id="clientPhone"
            value={formData.clientPhone}
            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventType">Event Type</Label>
          <Select
            value={formData.eventType}
            onValueChange={(value) => setFormData({ ...formData, eventType: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="wedding">Wedding</SelectItem>
              <SelectItem value="party">Party</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="exhibition">Exhibition</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hall Selection */}
      <div>
        <Label htmlFor="hallId">Event Hall *</Label>
        <Select value={formData.hallId} onValueChange={(value) => setFormData({ ...formData, hallId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select hall" />
          </SelectTrigger>
          <SelectContent>
            {mockEventHalls
              .filter((hall) => hall.available)
              .map((hall) => (
                <SelectItem key={hall.id} value={hall.id}>
                  {hall.name} - Capacity: {hall.capacity} (${hall.hourlyRate}/hour)
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Event Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.eventDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.eventDate ? format(formData.eventDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.eventDate}
                onSelect={(date) => setFormData({ ...formData, eventDate: date })}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Expected Guests */}
      <div>
        <Label htmlFor="expectedGuests">Expected Number of Guests *</Label>
        <Input
          id="expectedGuests"
          type="number"
          min="1"
          value={formData.expectedGuests}
          onChange={(e) => setFormData({ ...formData, expectedGuests: Number(e.target.value) })}
          required
        />
      </div>

      {/* Equipment Needed */}
      <div>
        <Label>Equipment Needed</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {availableEquipment.map((equipment) => (
            <label key={equipment} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.equipmentNeeded.includes(equipment)}
                onChange={() => toggleEquipment(equipment)}
                className="rounded"
              />
              <span className="text-sm">{equipment}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      <div>
        <Label>Additional Services</Label>
        <div className="mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.cateringRequired}
              onChange={(e) => setFormData({ ...formData, cateringRequired: e.target.checked })}
            />
            <span className="text-sm">Catering Required</span>
          </label>
        </div>
      </div>

      {/* Special Requirements */}
      <div>
        <Label htmlFor="specialRequirements">Special Requirements</Label>
        <Textarea
          id="specialRequirements"
          value={formData.specialRequirements}
          onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
          placeholder="Any special setup or requirements for the event..."
        />
      </div>

      {/* Setup Requirements */}
      <div>
        <Label htmlFor="setupRequirements">Setup Requirements</Label>
        <Textarea
          id="setupRequirements"
          value={formData.setupRequirements}
          onChange={(e) => setFormData({ ...formData, setupRequirements: e.target.value })}
          placeholder="Describe the room setup needed (theater style, banquet, etc.)..."
        />
      </div>

      {/* Total */}
      {formData.hallId && formData.startTime && formData.endTime && (
        <div className="border-t pt-4">
          <div className="text-right">
            <p className="text-lg font-bold">Total: ${calculateTotal().toFixed(2)}</p>
            <p className="text-sm text-gray-600">Base hall rental fee</p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!formData.eventDate || !formData.startTime || !formData.endTime || !formData.hallId}
      >
        Create Hall Booking
      </Button>
    </form>
  )
}

interface HallBookingDetailsViewProps {
  booking: HallBooking
  onStatusUpdate: (bookingId: string, status: HallBooking["status"]) => void
  onPaymentUpdate: (bookingId: string, status: HallBooking["paymentStatus"]) => void
}

function HallBookingDetailsView({ booking, onStatusUpdate, onPaymentUpdate }: HallBookingDetailsViewProps) {
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
              <span className="font-medium">Client:</span> {booking.clientName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {booking.clientEmail}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {booking.clientPhone}
            </p>
            <p>
              <span className="font-medium">Event Type:</span>{" "}
              {booking.eventType.charAt(0).toUpperCase() + booking.eventType.slice(1)}
            </p>
            <p>
              <span className="font-medium">Booking Date:</span> {format(booking.bookingDate, "PPP")}
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Event Details</h3>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <span className="font-medium">Hall:</span> {booking.hallName}
            </p>
            <p>
              <span className="font-medium">Date:</span> {format(booking.eventDate, "PPP")}
            </p>
            <p>
              <span className="font-medium">Time:</span> {booking.startTime} - {booking.endTime}
            </p>
            <p>
              <span className="font-medium">Duration:</span> {booking.duration} hours
            </p>
            <p>
              <span className="font-medium">Expected Guests:</span> {booking.expectedGuests}
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
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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

      {/* Equipment and Services */}
      {(booking.equipmentNeeded || booking.cateringRequired) && (
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Equipment & Services</h3>
          <div className="space-y-2">
            {booking.equipmentNeeded && (
              <div>
                <p className="text-sm font-medium">Equipment:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {booking.equipmentNeeded.map((equipment, index) => (
                    <Badge key={index} variant="secondary">
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {booking.cateringRequired && <p className="text-sm">• Catering service required</p>}
          </div>
        </div>
      )}

      {/* Special Requirements */}
      {booking.specialRequirements && (
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Special Requirements</h3>
          <p className="text-sm text-gray-600 p-3 bg-yellow-50 rounded-lg">{booking.specialRequirements}</p>
        </div>
      )}

      {/* Setup Requirements */}
      {booking.setupRequirements && (
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Setup Requirements</h3>
          <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">{booking.setupRequirements}</p>
        </div>
      )}
    </div>
  )
}
