"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Clock, CheckCircle, AlertCircle, DollarSign, Eye } from "lucide-react"
import { mockDetailedOrders, mockMenuItems, type DetailedOrder, type MenuItem, type OrderItem } from "@/lib/menu-data"
import { useAuth } from "@/contexts/auth-context"

export function OrderManagement() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<DetailedOrder[]>(mockDetailedOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.roomNumber && order.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getPaymentBadgeColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      refunded: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const updateOrderStatus = (orderId: string, newStatus: DetailedOrder["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              actualDelivery: newStatus === "delivered" ? new Date() : order.actualDelivery,
            }
          : order,
      ),
    )
  }

  const updatePaymentStatus = (orderId: string, newStatus: DetailedOrder["paymentStatus"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, paymentStatus: newStatus } : order)))
  }

  const addNewOrder = (newOrder: Omit<DetailedOrder, "id" | "orderNumber">) => {
    const order: DetailedOrder = {
      ...newOrder,
      id: Date.now().toString(),
      orderNumber: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
    }
    setOrders((prev) => [order, ...prev])
    setIsNewOrderDialogOpen(false)
  }

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending" || o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  const canManageOrders = user?.role === "admin" || user?.role === "manager" || user?.role === "waiter"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">Manage restaurant and room service orders</p>
        </div>
        {canManageOrders && (
          <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>Take a new order for a guest</DialogDescription>
              </DialogHeader>
              <NewOrderForm onSubmit={addNewOrder} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Preparing</p>
                <p className="text-2xl font-bold text-orange-600">{orderStats.preparing}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.ready}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-600">{orderStats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by number, guest name, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.guestName}</TableCell>
                  <TableCell>
                    {order.roomNumber ? `Room ${order.roomNumber}` : order.tableNumber || "Takeaway"}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index}>
                          {item.quantity}x {item.menuItem.name}
                        </div>
                      ))}
                      {order.items.length > 2 && <div className="text-gray-500">+{order.items.length - 2} more</div>}
                    </div>
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentBadgeColor(order.paymentStatus)}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {order.orderTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                          </DialogHeader>
                          <OrderDetailsView
                            order={order}
                            onStatusUpdate={updateOrderStatus}
                            onPaymentUpdate={updatePaymentStatus}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

interface NewOrderFormProps {
  onSubmit: (order: Omit<DetailedOrder, "id" | "orderNumber">) => void
}

function NewOrderForm({ onSubmit }: NewOrderFormProps) {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomNumber: "",
    tableNumber: "",
    orderType: "room-service" as DetailedOrder["orderType"],
    specialRequests: "",
  })
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])

  const addMenuItem = (menuItem: MenuItem) => {
    const existingItem = selectedItems.find((item) => item.menuItem.id === menuItem.id)
    if (existingItem) {
      setSelectedItems((prev) =>
        prev.map((item) => (item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setSelectedItems((prev) => [...prev, { menuItem, quantity: 1 }])
    }
  }

  const removeMenuItem = (menuItemId: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.menuItem.id !== menuItemId))
  }

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeMenuItem(menuItemId)
    } else {
      setSelectedItems((prev) => prev.map((item) => (item.menuItem.id === menuItemId ? { ...item, quantity } : item)))
    }
  }

  const subtotal = selectedItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const serviceCharge = subtotal * 0.125
  const totalAmount = subtotal + tax + serviceCharge

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedItems.length === 0) return

    const estimatedDelivery = new Date()
    const maxPrepTime = Math.max(...selectedItems.map((item) => item.menuItem.preparationTime))
    estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + maxPrepTime + 10) // Add 10 min buffer

    onSubmit({
      guestName: formData.guestName,
      guestEmail: formData.guestEmail || undefined,
      guestPhone: formData.guestPhone || undefined,
      roomNumber: formData.orderType === "room-service" ? formData.roomNumber : undefined,
      tableNumber: formData.orderType === "restaurant" ? formData.tableNumber : undefined,
      orderType: formData.orderType,
      items: selectedItems,
      subtotal,
      tax,
      serviceCharge,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
      orderTime: new Date(),
      estimatedDelivery,
      specialRequests: formData.specialRequests || undefined,
    })
  }

  const menuByCategory = mockMenuItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="guestName">Guest Name *</Label>
          <Input
            id="guestName"
            value={formData.guestName}
            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="orderType">Order Type</Label>
          <Select
            value={formData.orderType}
            onValueChange={(value) => setFormData({ ...formData, orderType: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="room-service">Room Service</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="takeaway">Takeaway</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="guestEmail">Email</Label>
          <Input
            id="guestEmail"
            type="email"
            value={formData.guestEmail}
            onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="guestPhone">Phone</Label>
          <Input
            id="guestPhone"
            value={formData.guestPhone}
            onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {formData.orderType === "room-service" && (
          <div>
            <Label htmlFor="roomNumber">Room Number *</Label>
            <Input
              id="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              required={formData.orderType === "room-service"}
            />
          </div>
        )}
        {formData.orderType === "restaurant" && (
          <div>
            <Label htmlFor="tableNumber">Table Number</Label>
            <Input
              id="tableNumber"
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Menu Selection */}
      <div>
        <Label>Menu Items</Label>
        <Tabs defaultValue="breakfast" className="mt-2">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="appetizer">Appetizers</TabsTrigger>
            <TabsTrigger value="main">Main</TabsTrigger>
            <TabsTrigger value="dessert">Desserts</TabsTrigger>
            <TabsTrigger value="beverage">Beverages</TabsTrigger>
            <TabsTrigger value="selected">Selected ({selectedItems.length})</TabsTrigger>
          </TabsList>

          {Object.entries(menuByCategory).map(([category, items]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm font-medium text-green-600">${item.price}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addMenuItem(item)}
                      disabled={!item.available}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="selected" className="space-y-4">
            {selectedItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items selected</p>
            ) : (
              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.menuItem.name}</h4>
                      <p className="text-sm text-gray-600">${item.menuItem.price} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMenuItem(item.menuItem.id)}
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge (12.5%):</span>
                    <span>${serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Special Requests */}
      <div>
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Textarea
          id="specialRequests"
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          placeholder="Any special dietary requirements or preparation instructions..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={selectedItems.length === 0}>
        Create Order (${totalAmount.toFixed(2)})
      </Button>
    </form>
  )
}

interface OrderDetailsViewProps {
  order: DetailedOrder
  onStatusUpdate: (orderId: string, status: DetailedOrder["status"]) => void
  onPaymentUpdate: (orderId: string, status: DetailedOrder["paymentStatus"]) => void
}

function OrderDetailsView({ order, onStatusUpdate, onPaymentUpdate }: OrderDetailsViewProps) {
  const { user } = useAuth()
  const canUpdateStatus = user?.role === "admin" || user?.role === "manager" || user?.role === "waiter"

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-gray-900">Order Information</h3>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <span className="font-medium">Order #:</span> {order.orderNumber}
            </p>
            <p>
              <span className="font-medium">Guest:</span> {order.guestName}
            </p>
            <p>
              <span className="font-medium">Type:</span> {order.orderType.replace("-", " ").toUpperCase()}
            </p>
            {order.roomNumber && (
              <p>
                <span className="font-medium">Room:</span> {order.roomNumber}
              </p>
            )}
            {order.tableNumber && (
              <p>
                <span className="font-medium">Table:</span> {order.tableNumber}
              </p>
            )}
            <p>
              <span className="font-medium">Order Time:</span> {order.orderTime.toLocaleString()}
            </p>
            {order.estimatedDelivery && (
              <p>
                <span className="font-medium">Est. Delivery:</span> {order.estimatedDelivery.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Status & Payment</h3>
          <div className="mt-2 space-y-2">
            {canUpdateStatus ? (
              <div>
                <Label>Order Status</Label>
                <Select value={order.status} onValueChange={(value) => onStatusUpdate(order.id, value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p>
                <span className="font-medium">Status:</span> {order.status}
              </p>
            )}

            {canUpdateStatus ? (
              <div>
                <Label>Payment Status</Label>
                <Select value={order.paymentStatus} onValueChange={(value) => onPaymentUpdate(order.id, value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p>
                <span className="font-medium">Payment:</span> {order.paymentStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{item.menuItem.name}</p>
                <p className="text-sm text-gray-600">{item.menuItem.description}</p>
                {item.specialInstructions && <p className="text-sm text-blue-600">Note: {item.specialInstructions}</p>}
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {item.quantity} × ${item.menuItem.price}
                </p>
                <p className="text-sm text-gray-600">${(item.quantity * item.menuItem.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Charge:</span>
            <span>${order.serviceCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      {order.specialRequests && (
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Special Requests</h3>
          <p className="text-sm text-gray-600 p-3 bg-yellow-50 rounded-lg">{order.specialRequests}</p>
        </div>
      )}
    </div>
  )
}
