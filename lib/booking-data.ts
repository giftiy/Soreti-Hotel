// Extended booking and venue data for the hotel management system
export interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  idNumber?: string
  nationality?: string
  dateOfBirth?: Date
  preferences?: string[]
  loyaltyPoints?: number
  bookingHistory?: string[]
}

export interface EventHall {
  id: string
  name: string
  capacity: number
  area: number // in square meters
  hourlyRate: number
  dailyRate: number
  amenities: string[]
  description: string
  images?: string[]
  available: boolean
}

export interface RoomBooking {
  id: string
  bookingNumber: string
  guestId: string
  guest: Guest
  roomId: string
  roomNumber: string
  roomType: string
  checkInDate: Date
  checkOutDate: Date
  numberOfGuests: number
  numberOfNights: number
  roomRate: number
  totalAmount: number
  status: "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled" | "no-show"
  paymentStatus: "pending" | "partial" | "paid" | "refunded"
  bookingDate: Date
  specialRequests?: string
  earlyCheckIn?: boolean
  lateCheckOut?: boolean
  assignedReceptionist?: string
  notes?: string
}

export interface HallBooking {
  id: string
  bookingNumber: string
  clientName: string
  clientEmail: string
  clientPhone: string
  hallId: string
  hallName: string
  eventType: "conference" | "wedding" | "party" | "meeting" | "exhibition" | "other"
  eventDate: Date
  startTime: string
  endTime: string
  duration: number // in hours
  expectedGuests: number
  totalAmount: number
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
  paymentStatus: "pending" | "partial" | "paid" | "refunded"
  bookingDate: Date
  specialRequirements?: string
  cateringRequired?: boolean
  equipmentNeeded?: string[]
  setupRequirements?: string
  notes?: string
}

// Mock guest data
export const mockGuests: Guest[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@email.com",
    phone: "+1234567895",
    address: "123 Main St, New York, NY",
    nationality: "USA",
    loyaltyPoints: 1250,
    preferences: ["Non-smoking", "High floor", "City view"],
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@email.com",
    phone: "+1234567896",
    address: "456 Oak Ave, Los Angeles, CA",
    nationality: "USA",
    loyaltyPoints: 850,
    preferences: ["Quiet room", "Ground floor"],
  },
  {
    id: "3",
    firstName: "Carol",
    lastName: "Davis",
    email: "carol@email.com",
    phone: "+1234567897",
    nationality: "Canada",
    loyaltyPoints: 2100,
    preferences: ["Ocean view", "Late checkout"],
  },
]

// Mock event halls
export const mockEventHalls: EventHall[] = [
  {
    id: "1",
    name: "Grand Ballroom",
    capacity: 300,
    area: 500,
    hourlyRate: 200,
    dailyRate: 1500,
    amenities: ["Stage", "Sound System", "Lighting", "Dance Floor", "Bar Area"],
    description: "Elegant ballroom perfect for weddings and large events",
    available: true,
  },
  {
    id: "2",
    name: "Conference Room A",
    capacity: 50,
    area: 80,
    hourlyRate: 75,
    dailyRate: 500,
    amenities: ["Projector", "Whiteboard", "WiFi", "Conference Phone", "Catering Setup"],
    description: "Professional meeting space for corporate events",
    available: true,
  },
  {
    id: "3",
    name: "Garden Pavilion",
    capacity: 150,
    area: 200,
    hourlyRate: 120,
    dailyRate: 800,
    amenities: ["Outdoor Setting", "Garden View", "Weather Protection", "Sound System"],
    description: "Beautiful outdoor venue with garden views",
    available: true,
  },
  {
    id: "4",
    name: "Executive Boardroom",
    capacity: 20,
    area: 40,
    hourlyRate: 50,
    dailyRate: 300,
    amenities: ["Executive Seating", "Video Conferencing", "Catering Service", "Private Entrance"],
    description: "Intimate boardroom for executive meetings",
    available: true,
  },
]

// Mock room bookings
export const mockRoomBookings: RoomBooking[] = [
  {
    id: "1",
    bookingNumber: "RB-001",
    guestId: "1",
    guest: mockGuests[0],
    roomId: "1",
    roomNumber: "101",
    roomType: "Single",
    checkInDate: new Date("2024-01-14"),
    checkOutDate: new Date("2024-01-16"),
    numberOfGuests: 1,
    numberOfNights: 2,
    roomRate: 120,
    totalAmount: 268.8, // Including taxes and fees
    status: "checked-in",
    paymentStatus: "paid",
    bookingDate: new Date("2024-01-10"),
    specialRequests: "High floor room with city view",
    assignedReceptionist: "Sarah Reception",
  },
  {
    id: "2",
    bookingNumber: "RB-002",
    guestId: "2",
    guest: mockGuests[1],
    roomId: "2",
    roomNumber: "102",
    roomType: "Double",
    checkInDate: new Date("2024-01-15"),
    checkOutDate: new Date("2024-01-18"),
    numberOfGuests: 2,
    numberOfNights: 3,
    roomRate: 180,
    totalAmount: 604.8,
    status: "confirmed",
    paymentStatus: "pending",
    bookingDate: new Date("2024-01-12"),
    earlyCheckIn: true,
    assignedReceptionist: "Sarah Reception",
  },
]

// Mock hall bookings
export const mockHallBookings: HallBooking[] = [
  {
    id: "1",
    bookingNumber: "HB-001",
    clientName: "Smith Wedding",
    clientEmail: "wedding@smith.com",
    clientPhone: "+1234567898",
    hallId: "1",
    hallName: "Grand Ballroom",
    eventType: "wedding",
    eventDate: new Date("2024-02-14"),
    startTime: "18:00",
    endTime: "23:00",
    duration: 5,
    expectedGuests: 200,
    totalAmount: 1200,
    status: "confirmed",
    paymentStatus: "partial",
    bookingDate: new Date("2024-01-05"),
    cateringRequired: true,
    equipmentNeeded: ["Sound System", "Lighting", "Dance Floor"],
    specialRequirements: "Red carpet entrance, special lighting for ceremony",
  },
  {
    id: "2",
    bookingNumber: "HB-002",
    clientName: "Tech Corp Conference",
    clientEmail: "events@techcorp.com",
    clientPhone: "+1234567899",
    hallId: "2",
    hallName: "Conference Room A",
    eventType: "conference",
    eventDate: new Date("2024-01-20"),
    startTime: "09:00",
    endTime: "17:00",
    duration: 8,
    expectedGuests: 45,
    totalAmount: 600,
    status: "confirmed",
    paymentStatus: "paid",
    bookingDate: new Date("2024-01-08"),
    cateringRequired: true,
    equipmentNeeded: ["Projector", "Microphones", "Catering Setup"],
    setupRequirements: "Theater-style seating for presentations",
  },
]
