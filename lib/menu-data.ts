// Menu items and categories for the hotel restaurant
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: "appetizer" | "main" | "dessert" | "beverage" | "breakfast" | "lunch" | "dinner"
  available: boolean
  preparationTime: number // in minutes
  image?: string
}

export interface OrderItem {
  menuItem: MenuItem
  quantity: number
  specialInstructions?: string
}

export interface DetailedOrder {
  id: string
  orderNumber: string
  guestName: string
  guestEmail?: string
  guestPhone?: string
  roomNumber?: string
  tableNumber?: string
  orderType: "room-service" | "restaurant" | "takeaway"
  items: OrderItem[]
  subtotal: number
  tax: number
  serviceCharge: number
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded"
  orderTime: Date
  estimatedDelivery?: Date
  actualDelivery?: Date
  assignedWaiter?: string
  specialRequests?: string
  notes?: string
}

// Mock menu data
export const mockMenuItems: MenuItem[] = [
  // Breakfast
  {
    id: "1",
    name: "Continental Breakfast",
    description: "Fresh pastries, fruits, coffee, and juice",
    price: 18,
    category: "breakfast",
    available: true,
    preparationTime: 15,
  },
  {
    id: "2",
    name: "Full English Breakfast",
    description: "Eggs, bacon, sausages, beans, toast, and grilled tomatoes",
    price: 24,
    category: "breakfast",
    available: true,
    preparationTime: 20,
  },

  // Appetizers
  {
    id: "3",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan and croutons",
    price: 14,
    category: "appetizer",
    available: true,
    preparationTime: 10,
  },
  {
    id: "4",
    name: "Soup of the Day",
    description: "Chef's special soup served with fresh bread",
    price: 12,
    category: "appetizer",
    available: true,
    preparationTime: 5,
  },

  // Main Courses
  {
    id: "5",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with seasonal vegetables",
    price: 32,
    category: "main",
    available: true,
    preparationTime: 25,
  },
  {
    id: "6",
    name: "Beef Tenderloin",
    description: "Premium beef with mashed potatoes and red wine sauce",
    price: 45,
    category: "main",
    available: true,
    preparationTime: 30,
  },
  {
    id: "7",
    name: "Chicken Parmesan",
    description: "Breaded chicken breast with marinara and mozzarella",
    price: 28,
    category: "main",
    available: true,
    preparationTime: 20,
  },

  // Desserts
  {
    id: "8",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with vanilla ice cream",
    price: 12,
    category: "dessert",
    available: true,
    preparationTime: 15,
  },
  {
    id: "9",
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee and mascarpone",
    price: 10,
    category: "dessert",
    available: true,
    preparationTime: 5,
  },

  // Beverages
  {
    id: "10",
    name: "House Wine",
    description: "Red or white wine by the glass",
    price: 8,
    category: "beverage",
    available: true,
    preparationTime: 2,
  },
  {
    id: "11",
    name: "Fresh Coffee",
    description: "Freshly brewed coffee or espresso",
    price: 5,
    category: "beverage",
    available: true,
    preparationTime: 3,
  },
]

// Mock detailed orders
export const mockDetailedOrders: DetailedOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    guestName: "Alice Johnson",
    guestEmail: "alice@email.com",
    guestPhone: "+1234567895",
    roomNumber: "101",
    orderType: "room-service",
    items: [
      {
        menuItem: mockMenuItems[0], // Continental Breakfast
        quantity: 1,
      },
      {
        menuItem: mockMenuItems[10], // Fresh Coffee
        quantity: 2,
      },
    ],
    subtotal: 28,
    tax: 2.8,
    serviceCharge: 3.5,
    totalAmount: 34.3,
    status: "delivered",
    paymentStatus: "paid",
    orderTime: new Date("2024-01-14T08:30:00"),
    estimatedDelivery: new Date("2024-01-14T09:00:00"),
    actualDelivery: new Date("2024-01-14T08:55:00"),
    assignedWaiter: "Mike Waiter",
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    guestName: "Bob Smith",
    guestEmail: "bob@email.com",
    roomNumber: "102",
    orderType: "room-service",
    items: [
      {
        menuItem: mockMenuItems[4], // Grilled Salmon
        quantity: 1,
      },
      {
        menuItem: mockMenuItems[9], // House Wine
        quantity: 1,
      },
    ],
    subtotal: 40,
    tax: 4.0,
    serviceCharge: 5.0,
    totalAmount: 49.0,
    status: "preparing",
    paymentStatus: "pending",
    orderTime: new Date("2024-01-14T18:15:00"),
    estimatedDelivery: new Date("2024-01-14T19:00:00"),
    assignedWaiter: "Mike Waiter",
    specialRequests: "Medium rare, no vegetables",
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    guestName: "Carol Davis",
    tableNumber: "Table 5",
    orderType: "restaurant",
    items: [
      {
        menuItem: mockMenuItems[2], // Caesar Salad
        quantity: 2,
      },
      {
        menuItem: mockMenuItems[6], // Chicken Parmesan
        quantity: 1,
      },
    ],
    subtotal: 56,
    tax: 5.6,
    serviceCharge: 7.0,
    totalAmount: 68.6,
    status: "ready",
    paymentStatus: "pending",
    orderTime: new Date("2024-01-14T19:30:00"),
    estimatedDelivery: new Date("2024-01-14T20:15:00"),
    assignedWaiter: "Mike Waiter",
  },
]
