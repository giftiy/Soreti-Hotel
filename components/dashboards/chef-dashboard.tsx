"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertCircle, ChefHat, Coffee, Cookie, Timer, Play, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { mockWorkflowOrders, type WorkflowOrder, type Notification } from "@/lib/workflow-data"

export function ChefDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<WorkflowOrder[]>(mockWorkflowOrders)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Determine chef type based on user (in real app, this would come from user profile)
  const chefType = user?.role === "chef" ? "food" : "food" // Default to food chef

  // Filter orders for this chef type
  const myOrders = orders.filter(
    (order) =>
      order.chefType === chefType &&
      ["cashier-approved", "chef-assigned", "chef-preparing"].includes(order.workflowStatus),
  )

  const startOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              workflowStatus: "chef-preparing" as const,
              chefStartedAt: new Date(),
              assignedChef: user?.name || "Current Chef",
            }
          : order,
      ),
    )
  }

  const completeOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              workflowStatus: "chef-completed" as const,
              chefCompletedAt: new Date(),
              status: "ready" as const,
            }
          : order,
      ),
    )

    // Create notification for waiter
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      const notification: Notification = {
        id: Date.now().toString(),
        type: "order-ready",
        title: "Order Ready for Pickup",
        message: `Order ${order.orderNumber} is ready for delivery`,
        orderId,
        recipientRole: "waiter",
        createdAt: new Date(),
        read: false,
      }
      setNotifications((prev) => [notification, ...prev])
    }
  }

  const orderStats = {
    pending: myOrders.filter((o) => o.workflowStatus === "cashier-approved").length,
    preparing: myOrders.filter((o) => o.workflowStatus === "chef-preparing").length,
    completed: orders.filter((o) => o.chefType === chefType && o.workflowStatus === "chef-completed").length,
  }

  const getChefIcon = (type: string) => {
    switch (type) {
      case "food":
        return <ChefHat className="h-8 w-8" />
      case "beverage":
        return <Coffee className="h-8 w-8" />
      case "snack":
        return <Cookie className="h-8 w-8" />
      default:
        return <ChefHat className="h-8 w-8" />
    }
  }

  const getChefTitle = (type: string) => {
    switch (type) {
      case "food":
        return "Food Chef"
      case "beverage":
        return "Beverage Chef"
      case "snack":
        return "Snack Chef"
      default:
        return "Chef"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getChefIcon(chefType)}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{getChefTitle(chefType)} Dashboard</h2>
            <p className="text-gray-600">Manage your kitchen orders and preparation</p>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-orange-600">{orderStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Preparing</p>
                <p className="text-2xl font-bold text-blue-600">{orderStats.preparing}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending ({orderStats.pending})</TabsTrigger>
              <TabsTrigger value="preparing">Preparing ({orderStats.preparing})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {myOrders
                .filter((o) => o.workflowStatus === "cashier-approved")
                .map((order) => (
                  <OrderCard key={order.id} order={order} onStart={() => startOrder(order.id)} showStartButton />
                ))}
              {myOrders.filter((o) => o.workflowStatus === "cashier-approved").length === 0 && (
                <p className="text-gray-500 text-center py-8">No pending orders</p>
              )}
            </TabsContent>

            <TabsContent value="preparing" className="space-y-4">
              {myOrders
                .filter((o) => o.workflowStatus === "chef-preparing")
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onComplete={() => completeOrder(order.id)}
                    showCompleteButton
                  />
                ))}
              {myOrders.filter((o) => o.workflowStatus === "chef-preparing").length === 0 && (
                <p className="text-gray-500 text-center py-8">No orders in preparation</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface OrderCardProps {
  order: WorkflowOrder
  onStart?: () => void
  onComplete?: () => void
  showStartButton?: boolean
  showCompleteButton?: boolean
}

function OrderCard({ order, onStart, onComplete, showStartButton, showCompleteButton }: OrderCardProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (order.chefStartedAt && order.workflowStatus === "chef-preparing") {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - order.chefStartedAt!.getTime()) / 1000 / 60)
        setElapsedTime(elapsed)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [order.chefStartedAt, order.workflowStatus])

  const estimatedTime = Math.max(...order.items.map((item) => item.menuItem.preparationTime))
  const isOverdue = elapsedTime > estimatedTime

  return (
    <Card className={`border-l-4 ${isOverdue ? "border-l-red-500" : "border-l-blue-500"}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
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
          </div>
          <div className="text-right">
            <Badge variant={order.orderType === "room-service" ? "default" : "secondary"}>
              {order.orderType.replace("-", " ").toUpperCase()}
            </Badge>
            {order.workflowStatus === "chef-preparing" && (
              <div className="mt-2 flex items-center space-x-1">
                <Timer className="h-4 w-4" />
                <span className={`text-sm ${isOverdue ? "text-red-600 font-bold" : "text-gray-600"}`}>
                  {elapsedTime}m / {estimatedTime}m
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>
                <span className="font-medium">
                  {item.quantity}x {item.menuItem.name}
                </span>
                {item.specialInstructions && <p className="text-sm text-blue-600">Note: {item.specialInstructions}</p>}
              </div>
              <span className="text-sm text-gray-500">{item.menuItem.preparationTime}min</span>
            </div>
          ))}
        </div>

        {/* Special Requests */}
        {order.specialRequests && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">Special Requests:</p>
            <p className="text-sm text-yellow-700">{order.specialRequests}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Ordered: {order.orderTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            {order.cashierApprovedAt && (
              <span className="ml-2">
                • Approved: {order.cashierApprovedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
          <div className="space-x-2">
            {showStartButton && (
              <Button onClick={onStart} className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Start Preparing
              </Button>
            )}
            {showCompleteButton && (
              <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
