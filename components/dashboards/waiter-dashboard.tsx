"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  CheckCircle,
  Clock,
  Truck,
  ChefHat,
  Coffee,
  Cookie,
  Eye,
  BookMarkedIcon as MarkAsRead,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { mockWorkflowOrders, mockNotifications, type WorkflowOrder, type Notification } from "@/lib/workflow-data"
import { getChefTypeName } from "@/lib/chef-type-utils"

export function WaiterDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<WorkflowOrder[]>(mockWorkflowOrders)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [unreadCount, setUnreadCount] = useState(0)

  // Calculate unread notifications
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read && n.recipientRole === "waiter").length
    setUnreadCount(unread)
  }, [notifications])

  // Filter orders assigned to this waiter
  const myOrders = orders.filter(
    (order) => order.assignedWaiter === user?.name || order.assignedWaiter === "Mike Waiter", // Default for demo
  )

  const readyOrders = myOrders.filter((order) => order.workflowStatus === "chef-completed" && order.status === "ready")

  const deliveredOrders = myOrders.filter(
    (order) => order.workflowStatus === "delivered" || order.status === "delivered",
  )

  const preparingOrders = myOrders.filter((order) => order.workflowStatus === "chef-preparing")

  const markOrderDelivered = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              workflowStatus: "delivered" as const,
              status: "delivered" as const,
              actualDelivery: new Date(),
              waiterNotified: true,
            }
          : order,
      ),
    )
  }

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.recipientRole === "waiter" ? { ...notification, read: true } : notification,
      ),
    )
  }

  const orderStats = {
    readyForDelivery: readyOrders.length,
    preparing: preparingOrders.length,
    deliveredToday: deliveredOrders.length,
    totalRevenue: deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0),
  }

  const waiterNotifications = notifications.filter((n) => n.recipientRole === "waiter")

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Waiter Dashboard</h2>
          <p className="text-gray-600">Manage orders, deliveries, and customer service</p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllNotificationsRead}
              className="text-blue-600 bg-transparent"
            >
              <MarkAsRead className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready for Delivery</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.readyForDelivery}</p>
                <p className="text-xs text-green-600">Orders completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Preparing</p>
                <p className="text-2xl font-bold text-orange-600">{orderStats.preparing}</p>
                <p className="text-xs text-orange-600">In kitchen</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered Today</p>
                <p className="text-2xl font-bold text-blue-600">{orderStats.deliveredToday}</p>
                <p className="text-xs text-blue-600">Completed orders</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                <p className="text-2xl font-bold text-gray-900">${orderStats.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-purple-600">From deliveries</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ready" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ready">Ready for Delivery ({orderStats.readyForDelivery})</TabsTrigger>
          <TabsTrigger value="preparing">Preparing ({orderStats.preparing})</TabsTrigger>
          <TabsTrigger value="notifications">Notifications ({unreadCount})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered Today ({orderStats.deliveredToday})</TabsTrigger>
        </TabsList>

        <TabsContent value="ready" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Orders Ready for Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {readyOrders.map((order) => (
                  <OrderDeliveryCard
                    key={order.id}
                    order={order}
                    onMarkDelivered={() => markOrderDelivered(order.id)}
                  />
                ))}
                {readyOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No orders ready for delivery</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preparing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Orders in Preparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {preparingOrders.map((order) => (
                  <OrderStatusCard key={order.id} order={order} />
                ))}
                {preparingOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No orders currently in preparation</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {waiterNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkRead={() => markNotificationRead(notification.id)}
                  />
                ))}
                {waiterNotifications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-blue-600" />
                Delivered Orders Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveredOrders.map((order) => (
                  <DeliveredOrderCard key={order.id} order={order} />
                ))}
                {deliveredOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Truck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No orders delivered today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface OrderDeliveryCardProps {
  order: WorkflowOrder
  onMarkDelivered: () => void
}

function OrderDeliveryCard({ order, onMarkDelivered }: OrderDeliveryCardProps) {
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
    <Card className="border-l-4 border-l-green-500 bg-green-50">
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
            <Badge className="bg-green-100 text-green-800">Ready</Badge>
            <div className="mt-2 flex items-center space-x-1">
              {getChefTypeIcon(order.chefType || "food")}
              <span className="text-xs text-gray-600">{getChefTypeName(order.chefType || "food")}</span>
            </div>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""} • ${order.totalAmount.toFixed(2)}
          </p>
          <div className="text-xs text-gray-500">
            {order.items.slice(0, 2).map((item, index) => (
              <span key={index}>
                {item.quantity}x {item.menuItem.name}
                {index < Math.min(order.items.length, 2) - 1 ? ", " : ""}
              </span>
            ))}
            {order.items.length > 2 && ` +${order.items.length - 2} more`}
          </div>
        </div>

        {/* Special Requests */}
        {order.specialRequests && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">Special Requests:</p>
            <p className="text-sm text-yellow-700">{order.specialRequests}</p>
          </div>
        )}

        {/* Timing Information */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>
            Completed: {order.chefCompletedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span>Ordered: {order.orderTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
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
                <DialogDescription>Complete order information for delivery</DialogDescription>
              </DialogHeader>
              <OrderDetailsView order={order} />
            </DialogContent>
          </Dialog>

          <Button onClick={onMarkDelivered} className="bg-green-600 hover:bg-green-700">
            <Truck className="h-4 w-4 mr-2" />
            Mark as Delivered
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface OrderStatusCardProps {
  order: WorkflowOrder
}

function OrderStatusCard({ order }: OrderStatusCardProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (order.chefStartedAt) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - order.chefStartedAt!.getTime()) / 1000 / 60)
        setElapsedTime(elapsed)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [order.chefStartedAt])

  const estimatedTime = Math.max(...order.items.map((item) => item.menuItem.preparationTime))
  const isOverdue = elapsedTime > estimatedTime

  return (
    <Card className={`border-l-4 ${isOverdue ? "border-l-red-500" : "border-l-orange-500"}`}>
      <CardContent className="p-6">
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
          </div>
          <div className="text-right">
            <Badge className="bg-orange-100 text-orange-800">Preparing</Badge>
            <div className="mt-2 flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span className={`text-sm ${isOverdue ? "text-red-600 font-bold" : "text-gray-600"}`}>
                {elapsedTime}m / {estimatedTime}m
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Chef: {order.assignedChef || "Assigned"}</p>
          <p>Started: {order.chefStartedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface NotificationCardProps {
  notification: Notification
  onMarkRead: () => void
}

function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order-ready":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "payment-approved":
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      case "chef-assigned":
        return <ChefHat className="h-5 w-5 text-orange-600" />
      case "order-completed":
        return <Truck className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <Card className={`${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{notification.title}</h4>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.createdAt.toLocaleString()}</p>
              </div>
              {!notification.read && (
                <Button variant="ghost" size="sm" onClick={onMarkRead} className="text-blue-600 hover:text-blue-700">
                  Mark Read
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DeliveredOrderCardProps {
  order: WorkflowOrder
}

function DeliveredOrderCard({ order }: DeliveredOrderCardProps) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{order.orderNumber}</h3>
            <p className="text-sm text-gray-600">{order.guestName}</p>
            <p className="text-xs text-gray-500">
              {order.roomNumber
                ? `Room ${order.roomNumber}`
                : order.tableNumber
                  ? `Table ${order.tableNumber}`
                  : "Takeaway"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
            <p className="text-xs text-gray-500">
              Delivered: {order.actualDelivery?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface OrderDetailsViewProps {
  order: WorkflowOrder
}

function OrderDetailsView({ order }: OrderDetailsViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">Customer Information</h4>
          <p className="text-sm text-gray-600">Name: {order.guestName}</p>
          {order.guestEmail && <p className="text-sm text-gray-600">Email: {order.guestEmail}</p>}
          {order.guestPhone && <p className="text-sm text-gray-600">Phone: {order.guestPhone}</p>}
        </div>
        <div>
          <h4 className="font-medium">Delivery Information</h4>
          <p className="text-sm text-gray-600">Type: {order.orderType}</p>
          <p className="text-sm text-gray-600">
            Location:{" "}
            {order.roomNumber
              ? `Room ${order.roomNumber}`
              : order.tableNumber
                ? `Table ${order.tableNumber}`
                : "Takeaway"}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Order Items</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>
                {item.quantity}x {item.menuItem.name}
              </span>
              <span className="font-medium">${(item.quantity * item.menuItem.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {order.specialRequests && (
        <div>
          <h4 className="font-medium mb-2">Special Requests</h4>
          <p className="text-sm text-gray-600 p-3 bg-yellow-50 rounded">{order.specialRequests}</p>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between items-center font-bold">
          <span>Total Amount:</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
