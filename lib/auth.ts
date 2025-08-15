// Mock user data and authentication logic
export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "manager" | "receptionist" | "waiter" | "customer" | "cashier" | "chef"
  name: string
  phone?: string
  createdAt: Date
}

// Mock users for demonstration
export const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@hotel.com",
    role: "admin",
    name: "System Administrator",
    phone: "+1234567890",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    username: "manager",
    email: "manager@hotel.com",
    role: "manager",
    name: "Hotel Manager",
    phone: "+1234567891",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    username: "receptionist",
    email: "reception@hotel.com",
    role: "receptionist",
    name: "Front Desk Staff",
    phone: "+1234567892",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    username: "waiter",
    email: "waiter@hotel.com",
    role: "waiter",
    name: "Mike Waiter",
    phone: "+1234567893",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    username: "customer",
    email: "customer@hotel.com",
    role: "customer",
    name: "John Customer",
    phone: "+1234567894",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "6",
    username: "cashier",
    email: "cashier@hotel.com",
    role: "cashier",
    name: "John Cashier",
    phone: "+1234567895",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "7",
    username: "chef",
    email: "chef@hotel.com",
    role: "chef",
    name: "Chef Maria",
    phone: "+1234567896",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "8",
    username: "chef-food",
    email: "chef-food@hotel.com",
    role: "chef",
    name: "Chef Roberto",
    phone: "+1234567897",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "9",
    username: "chef-beverage",
    email: "chef-beverage@hotel.com",
    role: "chef",
    name: "Chef Isabella",
    phone: "+1234567898",
    createdAt: new Date("2024-01-01"),
  },
]

export const authenticate = async (username: string, password: string): Promise<User | null> => {
  // Mock authentication - in real app, this would validate against database
  const user = mockUsers.find((u) => u.username === username)
  if (user && password === "password123") {
    return user
  }
  return null
}

export const getRolePermissions = (role: string) => {
  const permissions = {
    admin: ["all"],
    manager: ["view_reports", "manage_staff", "manage_rooms", "manage_orders", "view_finances"],
    receptionist: ["manage_bookings", "check_in_out", "view_rooms", "manage_customers"],
    waiter: ["manage_orders", "view_menu", "process_payments", "receive_notifications"],
    customer: ["view_bookings", "make_bookings", "view_orders"],
    cashier: [
      "process_payments",
      "view_transactions",
      "manage_billing",
      "generate_receipts",
      "handle_refunds",
      "approve_orders",
    ],
    chef: ["view_orders", "manage_kitchen", "update_order_status", "view_menu", "manage_preparation"],
  }
  return permissions[role as keyof typeof permissions] || []
}
