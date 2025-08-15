"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  DollarSign,
  Receipt,
  RefreshCw,
  Search,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ChefHat,
  Coffee,
  Cookie,
  Send,
  Eye,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { mockWorkflowOrders, determineChefType } from "@/lib/workflow-data"
import { useAuth } from "@/contexts/auth-context"
import { getChefTypeName } from "@/lib/chef-type-utils" // Import getChefTypeName

interface Transaction {
  id: string
  type: "room_payment" | "restaurant_bill" | "service_charge" | "refund"
  amount: number
  customerName: string
  roomNumber?: string
  paymentMethod: "cash" | "card" | "digital"
  status: "completed" | "pending" | "failed"
  timestamp: Date
  description: string
}

interface PaymentRequest {
  id: string
  customerName: string
  roomNumber?: string
  amount: number
  description: string
  type: "room_bill" | "restaurant" | "services"
  status: "pending" | "processing" | "completed"
}

export function CashierDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("orders")
  const [searchTerm, setSearchTerm] = useState("")
  const [workflowOrders, setWorkflowOrders] = useState(mockWorkflowOrders)

  const handleProcessPayment = (requestId: string) => {
    // Mock payment processing
    console.log(`Processing payment for request: ${requestId}`)
  }

  const handleRefund = (transactionId: string) => {
    // Mock refund processing
    console.log(`Processing refund for transaction: ${transactionId}`)
  }

  const approveOrder = (orderId: string) => {
    setWorkflowOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              workflowStatus: "cashier-approved" as const,
              cashierApproved: true,
              cashierApprovedBy: user?.name || "Current Cashier",
              cashierApprovedAt: new Date(),
              paymentStatus: "paid" as const,
              chefType: determineChefType(order.items),
            }
          : order,
      ),
    )
  }

  const rejectOrder = (orderId: string) => {
    setWorkflowOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              workflowStatus: "waiter-created" as const,
              status: "cancelled" as const,
            }
          : order,
      ),
    )
  }

  const pendingOrders = workflowOrders.filter((order) => order.workflowStatus === "cashier-pending")
  const approvedOrders = workflowOrders.filter((order) => order.workflowStatus === "cashier-approved")

  const stats = {
    todayRevenue: workflowOrders
      .filter((order) => order.workflowStatus === "cashier-approved")
      .reduce((sum, order) => sum + order.totalAmount, 0),
    transactionsCount: workflowOrders.length,
    pendingPayments: workflowOrders.filter((order) => order.status === "pending").length,
    avgTransactionValue:
      workflowOrders.length > 0
        ? workflowOrders.reduce((sum, order) => sum + order.totalAmount, 0) / workflowOrders.length
        : 0,
  }

  const orderStats = {
    pendingApproval: pendingOrders.length,
    approvedToday: approvedOrders.length,
    totalRevenue: approvedOrders.reduce((sum, order) => sum + order.totalAmount, 0),
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "cash":
        return <DollarSign className="h-4 w-4" />
      case "digital":
        return <Receipt className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getChefTypeIcon = (chefType: string) => {
    switch (chefType) {
      case "food":
        return <ChefHat className="h-4 w-4" />
      case "beverage":
        return <Coffee className="h-4 w-4" />
      case "snack":
        return <Cookie className="h-4 w-4" />
      default:
        return <ChefHat className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cashier Dashboard</h2>
        <p className="text-gray-600">Manage payments, order approvals, and billing</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-orange-600">{orderStats.pendingApproval}</p>
                <p className="text-xs text-orange-600">Awaiting approval</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.approvedToday}</p>
                <p className="text-xs text-green-600">Orders processed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Order Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${orderStats.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-blue-600">From approved orders</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Transaction</p>
                <p className="text-2xl font-bold text-gray-900">${stats.avgTransactionValue.toFixed(2)}</p>
                <p className="text-xs text-purple-600">Per transaction</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Order Approval</TabsTrigger>
          <TabsTrigger value="payments">Payment Requests</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="reports">Daily Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                Pending Order Approvals ({pendingOrders.length})
              </CardTitle>
              <CardDescription>Review and approve customer orders for kitchen preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <OrderApprovalCard
                    key={order.id}
                    order={order}
                    onApprove={() => approveOrder(order.id)}
                    onReject={() => rejectOrder(order.id)}
                  />
                ))}
                {pendingOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <p>No pending orders for approval</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recently Approved Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Approved Orders</CardTitle>
              <CardDescription>Orders sent to kitchen for preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium text-gray-900">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.guestName}</p>
                          <p className="text-xs text-blue-600">
                            {order.roomNumber
                              ? `Room ${order.roomNumber}`
                              : order.tableNumber
                                ? `Table ${order.tableNumber}`
                                : "Takeaway"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">${order.totalAmount.toFixed(2)}</p>
                        <div className="flex items-center space-x-1">
                          {getChefTypeIcon(order.chefType || "food")}
                          <span className="text-xs text-gray-600">{getChefTypeName(order.chefType || "food")}</span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                  </div>
                ))}
                {approvedOrders.length === 0 && (
                  <p className="text-center py-4 text-gray-500">No approved orders today</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                Pending Payment Requests
              </CardTitle>
              <CardDescription>Process customer payments and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowOrders
                  .filter((order) => order.status === "pending")
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium text-gray-900">{request.guestName}</p>
                            <p className="text-sm text-gray-600">{request.specialRequests || "No special requests"}</p>
                            {request.roomNumber && <p className="text-xs text-blue-600">Room {request.roomNumber}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">${request.totalAmount.toFixed(2)}</p>
                          <Badge variant="outline" className="text-xs">
                            {request.orderType.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => handleProcessPayment(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Process Payment
                        </Button>
                      </div>
                    </div>
                  ))}
                {workflowOrders.filter((order) => order.status === "pending").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <p>No pending payment requests</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowOrders.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getPaymentMethodIcon(
                          transaction.orderType === "room-service"
                            ? "card"
                            : transaction.orderType === "dine-in"
                              ? "cash"
                              : "digital",
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.guestName}</p>
                        <p className="text-sm text-gray-600">{transaction.specialRequests || "No special requests"}</p>
                        <p className="text-xs text-gray-500">
                          {transaction.orderTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
                          {transaction.orderType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">${transaction.totalAmount.toFixed(2)}</p>
                        <Badge className={getStatusColor(transaction.status || "completed")}>
                          {transaction.status || "completed"}
                        </Badge>
                      </div>
                      {transaction.status === "completed" && (
                        <Button variant="outline" size="sm" onClick={() => handleRefund(transaction.id)}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refund
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
                <CardDescription>Today's financial overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-bold text-green-600">${orderStats.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cash Payments</span>
                    <span className="font-medium">
                      $
                      {workflowOrders
                        .filter((t) => t.orderType === "dine-in" && t.status === "completed")
                        .reduce((sum, t) => sum + t.totalAmount, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Card Payments</span>
                    <span className="font-medium">
                      $
                      {workflowOrders
                        .filter((t) => t.orderType === "room-service" && t.status === "completed")
                        .reduce((sum, t) => sum + t.totalAmount, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Digital Payments</span>
                    <span className="font-medium">
                      $
                      {workflowOrders
                        .filter((t) => t.orderType === "takeaway" && t.status === "completed")
                        .reduce((sum, t) => sum + t.totalAmount, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["room-service", "dine-in", "takeaway"].map((method) => {
                    const count = workflowOrders.filter(
                      (t) => t.orderType === method && t.status === "completed",
                    ).length
                    const percentage = workflowOrders.length > 0 ? (count / workflowOrders.length) * 100 : 0
                    return (
                      <div key={method} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm capitalize text-gray-600">{method.replace("-", " ")}</span>
                          <span className="text-sm font-medium">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface OrderApprovalCardProps {
  order: any // Renamed to any to avoid redeclaration
  onApprove: () => void
  onReject: () => void
}

function OrderApprovalCard({ order, onApprove, onReject }: OrderApprovalCardProps) {
  const chefType = determineChefType(order.items)

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{order.orderNumber}</h3>
          <p className="text-gray-600">{order.guestName}</p>
          <p className="text-sm text-gray-500">
            {order.roomNumber
              ? `Room ${order.roomNumber}`
              : order.tableNumber
                ? `Table ${order.tableNumber}`
                : "Takeaway"}
          </p>
          <p className="text-xs text-gray-500">
            Ordered: {order.orderTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="text-right">
          <Badge variant={order.orderType === "room-service" ? "default" : "secondary"}>
            {order.orderType.replace("-", " ").toUpperCase()}
          </Badge>
          <div className="mt-2 flex items-center space-x-1">
            {chefType === "food" && <ChefHat className="h-4 w-4 text-orange-600" />}
            {chefType === "beverage" && <Coffee className="h-4 w-4 text-blue-600" />}
            {chefType === "snack" && <Cookie className="h-4 w-4 text-purple-600" />}
            <span className="text-xs text-gray-600">
              {chefType === "food" && "Food Chef"}
              {chefType === "beverage" && "Beverage Chef"}
              {chefType === "snack" && "Snack Chef"}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700">Order Items:</h4>
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
            <span>
              {item.quantity}x {item.menuItem.name}
            </span>
            <span className="font-medium">${(item.quantity * item.menuItem.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Special Requests */}
      {order.specialRequests && (
        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-800">Special Requests:</p>
          <p className="text-sm text-yellow-700">{order.specialRequests}</p>
        </div>
      )}

      {/* Order Total */}
      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Subtotal: ${order.subtotal.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Tax: ${order.tax.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Service: ${order.serviceCharge.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">Total: ${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-3 border-t">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
              <DialogDescription>Complete order information and customer details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Customer Information</h4>
                  <p className="text-sm text-gray-600">Name: {order.guestName}</p>
                  {order.guestEmail && <p className="text-sm text-gray-600">Email: {order.guestEmail}</p>}
                  {order.guestPhone && <p className="text-sm text-gray-600">Phone: {order.guestPhone}</p>}
                </div>
                <div>
                  <h4 className="font-medium">Order Information</h4>
                  <p className="text-sm text-gray-600">Type: {order.orderType}</p>
                  <p className="text-sm text-gray-600">Time: {order.orderTime.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Chef Type: {getChefTypeName(chefType)}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={onReject}
            className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
          >
            Reject Order
          </Button>
          <Button onClick={onApprove} className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4 mr-2" />
            Approve & Send to Kitchen
          </Button>
        </div>
      </div>
    </div>
  )
}
