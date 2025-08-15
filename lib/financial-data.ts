// Financial data types and mock data for the hotel management system

export interface Transaction {
  id: string
  type: "income" | "expense"
  category:
    | "room_booking"
    | "hall_booking"
    | "food_service"
    | "utilities"
    | "salaries"
    | "maintenance"
    | "supplies"
    | "marketing"
    | "other"
  amount: number
  description: string
  date: Date
  paymentMethod: "cash" | "card" | "bank_transfer" | "online"
  reference?: string
  bookingId?: string
  staffId?: string
  status: "pending" | "completed" | "cancelled"
}

export interface FinancialSummary {
  period: string
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  roomRevenue: number
  hallRevenue: number
  foodRevenue: number
  occupancyRate: number
  averageRoomRate: number
}

export interface ExpenseCategory {
  category: string
  budgeted: number
  actual: number
  variance: number
  percentage: number
}

// Mock transaction data
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "room_booking",
    amount: 268.8,
    description: "Room booking payment - RB-001",
    date: new Date("2024-01-14"),
    paymentMethod: "card",
    reference: "RB-001",
    bookingId: "1",
    status: "completed",
  },
  {
    id: "2",
    type: "income",
    category: "hall_booking",
    amount: 600,
    description: "Conference room booking - HB-002",
    date: new Date("2024-01-08"),
    paymentMethod: "bank_transfer",
    reference: "HB-002",
    bookingId: "2",
    status: "completed",
  },
  {
    id: "3",
    type: "income",
    category: "food_service",
    amount: 25,
    description: "Room service order - Order #1",
    date: new Date("2024-01-14"),
    paymentMethod: "cash",
    reference: "ORD-001",
    status: "completed",
  },
  {
    id: "4",
    type: "expense",
    category: "utilities",
    amount: 1200,
    description: "Monthly electricity bill",
    date: new Date("2024-01-01"),
    paymentMethod: "bank_transfer",
    status: "completed",
  },
  {
    id: "5",
    type: "expense",
    category: "salaries",
    amount: 15000,
    description: "Staff salaries - January",
    date: new Date("2024-01-01"),
    paymentMethod: "bank_transfer",
    status: "completed",
  },
  {
    id: "6",
    type: "expense",
    category: "maintenance",
    amount: 450,
    description: "Room 301 maintenance repair",
    date: new Date("2024-01-12"),
    paymentMethod: "cash",
    status: "completed",
  },
]

// Mock financial summary
export const mockFinancialSummary: FinancialSummary = {
  period: "January 2024",
  totalRevenue: 25680,
  totalExpenses: 18750,
  netProfit: 6930,
  roomRevenue: 18200,
  hallRevenue: 4800,
  foodRevenue: 2680,
  occupancyRate: 78.5,
  averageRoomRate: 185,
}

// Mock expense categories
export const mockExpenseCategories: ExpenseCategory[] = [
  { category: "Salaries", budgeted: 15000, actual: 15000, variance: 0, percentage: 80.0 },
  { category: "Utilities", budgeted: 1500, actual: 1200, variance: -300, percentage: 6.4 },
  { category: "Maintenance", budgeted: 800, actual: 450, variance: -350, percentage: 2.4 },
  { category: "Supplies", budgeted: 600, actual: 750, variance: 150, percentage: 4.0 },
  { category: "Marketing", budgeted: 500, actual: 350, variance: -150, percentage: 1.9 },
  { category: "Other", budgeted: 1000, actual: 1000, variance: 0, percentage: 5.3 },
]
