"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoomBookingManagement } from "./room-booking-management"
import { HallBookingManagement } from "./hall-booking-management"
import { useAuth } from "@/contexts/auth-context"

export function BookingManagement() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("rooms")

  const canManageBookings = user?.role === "admin" || user?.role === "manager" || user?.role === "receptionist"

  if (!canManageBookings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">You don't have permission to access booking management.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        <p className="text-gray-600">Manage room reservations and event hall bookings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rooms">Room Bookings</TabsTrigger>
          <TabsTrigger value="halls">Hall Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms">
          <RoomBookingManagement />
        </TabsContent>

        <TabsContent value="halls">
          <HallBookingManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
