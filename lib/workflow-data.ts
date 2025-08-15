// Workflow management for orders between waiters, cashiers, and chefs
export interface WorkflowOrder extends DetailedOrder {
  assignedChef?: string
  chefType?: "food" | "beverage" | "snack"
  cashierApproved?: boolean
  cashierApprovedBy?: string
  cashierApprovedAt?: Date
  chefStartedAt?: Date
  chefCompletedAt?: Date
  waiterNotified?: boolean
  workflowStatus:
    | "waiter-created"
    | "cashier-pending"
    | "cashier-approved"
    | "chef-assigned"
    | "chef-preparing"
    | "chef-completed"
    | "waiter-notified"
    | "delivered"
}

export interface ChefAssignment {
  orderId: string
  chefType: "food" | "beverage" | "snack"
  assignedChef: string
  assignedAt: Date
  estimatedCompletion: Date
}

export interface Notification {
  id: string
  type: "order-ready" | "payment-approved" | "chef-assigned" | "order-completed"
  title: string
  message: string
  orderId: string
  recipientRole: "waiter" | "cashier" | "chef"
  recipientId?: string
  createdAt: Date
  read: boolean
}

// Determine chef type based on menu items
export function determineChefType(items: OrderItem[]): "food" | "beverage" | "snack" {
  const hasFood = items.some((item) =>
    ["appetizer", "main", "breakfast", "lunch", "dinner"].includes(item.menuItem.category),
  )
  const hasBeverage = items.some((item) => item.menuItem.category === "beverage")
  const hasSnack = items.some((item) => item.menuItem.category === "dessert")

  // Priority: food > beverage > snack
  if (hasFood) return "food"
  if (hasBeverage) return "beverage"
  return "snack"
}

// Mock workflow orders
export const mockWorkflowOrders: WorkflowOrder[] = [
  {
    ...mockDetailedOrders[0],
    workflowStatus: "delivered",
    cashierApproved: true,
    cashierApprovedBy: "John Cashier",
    cashierApprovedAt: new Date("2024-01-14T08:35:00"),
    assignedChef: "Chef Maria",
    chefType: "food",
    chefStartedAt: new Date("2024-01-14T08:40:00"),
    chefCompletedAt: new Date("2024-01-14T08:50:00"),
    waiterNotified: true,
  },
  {
    ...mockDetailedOrders[1],
    workflowStatus: "chef-preparing",
    cashierApproved: true,
    cashierApprovedBy: "John Cashier",
    cashierApprovedAt: new Date("2024-01-14T18:20:00"),
    assignedChef: "Chef Roberto",
    chefType: "food",
    chefStartedAt: new Date("2024-01-14T18:25:00"),
  },
  {
    ...mockDetailedOrders[2],
    workflowStatus: "cashier-pending",
  },
]

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order-ready",
    title: "Order Ready for Pickup",
    message: "Order ORD-001 is ready for delivery to Room 101",
    orderId: "1",
    recipientRole: "waiter",
    createdAt: new Date("2024-01-14T08:50:00"),
    read: false,
  },
  {
    id: "2",
    type: "payment-approved",
    title: "Payment Approved",
    message: "Order ORD-002 payment approved, sent to kitchen",
    orderId: "2",
    recipientRole: "chef",
    recipientId: "chef-roberto",
    createdAt: new Date("2024-01-14T18:20:00"),
    read: false,
  },
]

import { mockDetailedOrders, type DetailedOrder, type OrderItem } from "./menu-data"
