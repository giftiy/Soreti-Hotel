"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Hotel,
  Calendar,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  BarChart3,
  Target,
} from "lucide-react"
import { mockStaff, mockRooms, mockOrders } from "@/lib/mock-data"
import { mockRoomBookings, mockHallBookings } from "@/lib/booking-data"

export function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate comprehensive statistics
  const stats = {
    // Staff metrics
    totalStaff: mockStaff.length,
    activeStaff: mockStaff.filter((s) => s.status === "active").length,
    avgSalary: Math.round(mockStaff.reduce((sum, s) => sum + s.salary, 0) / mockStaff.length),

    // Room metrics
    totalRooms: mockRooms.length,
    occupiedRooms: mockRooms.filter((r) => r.status === "occupied").length,
    availableRooms: mockRooms.filter((r) => r.status === "available").length,
    maintenanceRooms: mockRooms.filter((r) => r.status === "maintenance").length,
    occupancyRate: Math.round((mockRooms.filter((r) => r.status === "occupied").length / mockRooms.length) * 100),

    // Booking metrics
    totalBookings: mockRoomBookings.length + mockHallBookings.length,
    roomBookings: mockRoomBookings.length,
    hallBookings: mockHallBookings.length,
    pendingBookings: [...mockRoomBookings, ...mockHallBookings].filter((b) => b.status === "pending").length,

    // Order metrics
    totalOrders: mockOrders.length,
    pendingOrders: mockOrders.filter((o) => o.status === "pending" || o.status === "preparing").length,
    completedOrders: mockOrders.filter((o) => o.status === "delivered").length,

    // Revenue metrics
    roomRevenue: mockRoomBookings.reduce((sum, b) => sum + b.totalAmount, 0),
    hallRevenue: mockHallBookings.reduce((sum, b) => sum + b.totalAmount, 0),
    orderRevenue: mockOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    totalRevenue: 0,
  }

  stats.totalRevenue = stats.roomRevenue + stats.hallRevenue + stats.orderRevenue

  const departmentStats = [
    { name: "Front Desk", staff: mockStaff.filter((s) => s.department === "Front Desk").length, efficiency: 92 },
    { name: "Restaurant", staff: mockStaff.filter((s) => s.department === "Restaurant").length, efficiency: 88 },
    { name: "Housekeeping", staff: mockStaff.filter((s) => s.department === "Housekeeping").length, efficiency: 95 },
    { name: "Management", staff: mockStaff.filter((s) => s.department === "Management").length, efficiency: 90 },
  ]

  const recentAlerts = [
    {
      id: 1,
      type: "maintenance",
      message: "Room 201 requires urgent maintenance",
      priority: "high",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "staff",
      message: "Housekeeping department understaffed today",
      priority: "medium",
      time: "4 hours ago",
    },
    { id: 3, type: "booking", message: "VIP guest checking in tomorrow", priority: "high", time: "6 hours ago" },
    { id: 4, type: "inventory", message: "Restaurant supplies running low", priority: "medium", time: "8 hours ago" },
  ]

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manager Dashboard</h2>
        <p className="text-gray-600">Comprehensive hotel operations overview and management tools</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
                    <p className="text-xs text-green-600">+5% from last month</p>
                  </div>
                  <Hotel className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Staff</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeStaff}</p>
                    <p className="text-xs text-gray-600">of {stats.totalStaff} total</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                    <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                    <p className="text-xs text-green-600">+0.2 from last month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue sources for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Hotel className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Room Bookings</span>
                    </div>
                    <span className="text-sm font-bold">${stats.roomRevenue.toLocaleString()}</span>
                  </div>
                  <Progress value={(stats.roomRevenue / stats.totalRevenue) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Event Halls</span>
                    </div>
                    <span className="text-sm font-bold">${stats.hallRevenue.toLocaleString()}</span>
                  </div>
                  <Progress value={(stats.hallRevenue / stats.totalRevenue) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Food & Beverage</span>
                    </div>
                    <span className="text-sm font-bold">${stats.orderRevenue.toLocaleString()}</span>
                  </div>
                  <Progress value={(stats.orderRevenue / stats.totalRevenue) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Important notifications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {alert.type === "maintenance" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                        {alert.type === "staff" && <Users className="h-5 w-5 text-yellow-600" />}
                        {alert.type === "booking" && <Calendar className="h-5 w-5 text-blue-600" />}
                        {alert.type === "inventory" && <ShoppingCart className="h-5 w-5 text-orange-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                        </div>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          {/* Operations Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hotel className="h-5 w-5 mr-2 text-blue-600" />
                  Room Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Occupied</span>
                    <span className="font-medium text-blue-600">{stats.occupiedRooms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Available</span>
                    <span className="font-medium text-green-600">{stats.availableRooms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Maintenance</span>
                    <span className="font-medium text-red-600">{stats.maintenanceRooms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cleaning</span>
                    <span className="font-medium text-yellow-600">
                      {mockRooms.filter((r) => r.status === "cleaning").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Bookings Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Check-ins</span>
                    <span className="font-medium text-blue-600">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Check-outs</span>
                    <span className="font-medium text-green-600">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Reservations</span>
                    <span className="font-medium text-purple-600">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cancellations</span>
                    <span className="font-medium text-red-600">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
                  F&B Operations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Orders</span>
                    <span className="font-medium text-orange-600">{stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed Today</span>
                    <span className="font-medium text-green-600">{stats.completedOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Prep Time</span>
                    <span className="font-medium text-blue-600">18 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer Rating</span>
                    <span className="font-medium text-purple-600">4.7/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Staff Schedule</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Hotel className="h-6 w-6" />
                  <span className="text-sm">Room Assignments</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Generate Report</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Target className="h-6 w-6" />
                  <span className="text-sm">Set Goals</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Staff efficiency and performance metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departmentStats.map((dept) => (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-sm text-gray-600">{dept.staff} staff members</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{dept.efficiency}%</p>
                        <p className="text-sm text-gray-600">Efficiency</p>
                      </div>
                    </div>
                    <Progress value={dept.efficiency} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Staff Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Staff</span>
                    <span className="font-medium">{stats.totalStaff}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Today</span>
                    <span className="font-medium text-green-600">{stats.activeStaff}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Salary</span>
                    <span className="font-medium">${stats.avgSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Departments</span>
                    <span className="font-medium">{departmentStats.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    View All Staff
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Clock className="h-4 w-4 mr-2" />
                    Manage Schedules
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Performance Reviews
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payroll Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Monthly Target</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                  <p className="text-xs text-green-600">Occupancy Goal</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Current Achievement</p>
                  <p className="text-2xl font-bold text-green-600">{stats.occupancyRate}%</p>
                  <p className="text-xs text-green-600">Above Target</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                  <p className="text-2xl font-bold text-blue-600">+12%</p>
                  <p className="text-xs text-blue-600">vs Last Month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Guest Satisfaction</p>
                  <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                  <p className="text-xs text-purple-600">Excellent Rating</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
              <CardDescription>Track progress towards monthly and quarterly targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Occupancy Rate Target</span>
                    <span className="text-sm text-gray-600">{stats.occupancyRate}% / 85%</span>
                  </div>
                  <Progress value={(stats.occupancyRate / 85) * 100} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Revenue Target</span>
                    <span className="text-sm text-gray-600">${stats.totalRevenue.toLocaleString()} / $15,000</span>
                  </div>
                  <Progress value={(stats.totalRevenue / 15000) * 100} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Customer Satisfaction</span>
                    <span className="text-sm text-gray-600">4.8 / 4.5</span>
                  </div>
                  <Progress value={(4.8 / 5) * 100} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Staff Efficiency</span>
                    <span className="text-sm text-gray-600">91% / 90%</span>
                  </div>
                  <Progress value={91} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
