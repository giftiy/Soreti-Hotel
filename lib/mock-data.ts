// Mock data for the hotel management system
export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: "manager" | "receptionist" | "waiter" | "housekeeping" | "maintenance"
  department: string
  salary: number
  hireDate: Date
  status: "active" | "inactive"
}

export interface Room {
  id: string
  number: string
  type: "single" | "double" | "suite" | "deluxe"
  floor: number
  price: number
  status: "available" | "occupied" | "maintenance" | "cleaning"
  amenities: string[]
  lastCleaned: Date
}

export interface Booking {
  id: string
  guestName: string
  guestEmail: string
  guestPhone: string
  roomId: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalAmount: number
  status: "confirmed" | "checked-in" | "checked-out" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded"
}

export interface Order {
  id: string
  guestName: string
  roomNumber: string
  items: { name: string; quantity: number; price: number }[]
  totalAmount: number
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  orderTime: Date
  deliveryTime?: Date
}

// Mock staff data
export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "John Manager",
    email: "manager@hotel.com",
    phone: "+1234567891",
    role: "manager",
    department: "Management",
    salary: 75000,
    hireDate: new Date("2023-01-15"),
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Reception",
    email: "reception@hotel.com",
    phone: "+1234567892",
    role: "receptionist",
    department: "Front Desk",
    salary: 35000,
    hireDate: new Date("2023-03-20"),
    status: "active",
  },
  {
    id: "3",
    name: "Mike Waiter",
    email: "waiter@hotel.com",
    phone: "+1234567893",
    role: "waiter",
    department: "Restaurant",
    salary: 28000,
    hireDate: new Date("2023-05-10"),
    status: "active",
  },
  {
    id: "4",
    name: "Lisa Housekeeping",
    email: "lisa@hotel.com",
    phone: "+1234567894",
    role: "housekeeping",
    department: "Housekeeping",
    salary: 32000,
    hireDate: new Date("2023-02-28"),
    status: "active",
  },
]

// Mock room data
export const mockRooms: Room[] = [
  {
    id: "1",
    number: "101",
    type: "single",
    floor: 1,
    price: 120,
    status: "occupied",
    amenities: ["WiFi", "TV", "AC"],
    lastCleaned: new Date("2024-01-13"),
  },
  {
    id: "2",
    number: "102",
    type: "double",
    floor: 1,
    price: 180,
    status: "available",
    amenities: ["WiFi", "TV", "AC", "Mini Bar"],
    lastCleaned: new Date("2024-01-14"),
  },
  {
    id: "3",
    number: "201",
    type: "suite",
    floor: 2,
    price: 350,
    status: "maintenance",
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Jacuzzi"],
    lastCleaned: new Date("2024-01-12"),
  },
  {
    id: "4",
    number: "301",
    type: "deluxe",
    floor: 3,
    price: 280,
    status: "cleaning",
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "City View"],
    lastCleaned: new Date("2024-01-14"),
  },
]

// Mock booking data
export const mockBookings: Booking[] = [
  {
    id: "1",
    guestName: "Alice Johnson",
    guestEmail: "alice@email.com",
    guestPhone: "+1234567895",
    roomId: "1",
    checkIn: new Date("2024-01-14"),
    checkOut: new Date("2024-01-16"),
    guests: 1,
    totalAmount: 240,
    status: "checked-in",
    paymentStatus: "paid",
  },
  {
    id: "2",
    guestName: "Bob Smith",
    guestEmail: "bob@email.com",
    guestPhone: "+1234567896",
    roomId: "2",
    checkIn: new Date("2024-01-15"),
    checkOut: new Date("2024-01-18"),
    guests: 2,
    totalAmount: 540,
    status: "confirmed",
    paymentStatus: "pending",
  },
]

// Mock order data
export const mockOrders: Order[] = [
  {
    id: "1",
    guestName: "Alice Johnson",
    roomNumber: "101",
    items: [
      { name: "Club Sandwich", quantity: 1, price: 15 },
      { name: "Coffee", quantity: 2, price: 5 },
    ],
    totalAmount: 25,
    status: "delivered",
    orderTime: new Date("2024-01-14T12:30:00"),
    deliveryTime: new Date("2024-01-14T13:00:00"),
  },
  {
    id: "2",
    guestName: "Bob Smith",
    roomNumber: "102",
    items: [
      { name: "Caesar Salad", quantity: 1, price: 12 },
      { name: "Grilled Chicken", quantity: 1, price: 22 },
    ],
    totalAmount: 34,
    status: "preparing",
    orderTime: new Date("2024-01-14T18:15:00"),
  },
]
