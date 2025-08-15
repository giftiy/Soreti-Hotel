"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Search, Trash2, DollarSign, Clock, CheckCircle, AlertCircle, User } from "lucide-react"

interface Cashier {
  id: string
  name: string
  email: string
  phone: string
  shift: "morning" | "afternoon" | "night"
  status: "active" | "inactive" | "on_break"
  totalTransactions: number
  totalRevenue: number
  joinDate: Date
  lastActive: Date
}

export function CashierManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null)

  // Mock cashier data
  const [cashiers, setCashiers] = useState<Cashier[]>([
    {
      id: "C001",
      name: "Sarah Johnson",
      email: "sarah.johnson@hotel.com",
      phone: "+1234567895",
      shift: "morning",
      status: "active",
      totalTransactions: 156,
      totalRevenue: 12450.75,
      joinDate: new Date("2024-01-15"),
      lastActive: new Date(),
    },
    {
      id: "C002",
      name: "Mike Chen",
      email: "mike.chen@hotel.com",
      phone: "+1234567896",
      shift: "afternoon",
      status: "active",
      totalTransactions: 203,
      totalRevenue: 18920.5,
      joinDate: new Date("2023-11-20"),
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "C003",
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@hotel.com",
      phone: "+1234567897",
      shift: "night",
      status: "on_break",
      totalTransactions: 89,
      totalRevenue: 7650.25,
      joinDate: new Date("2024-02-01"),
      lastActive: new Date(Date.now() - 1000 * 60 * 15),
    },
  ])

  const [newCashier, setNewCashier] = useState({
    name: "",
    email: "",
    phone: "",
    shift: "morning" as const,
  })

  const handleAddCashier = () => {
    const cashier: Cashier = {
      id: `C${String(cashiers.length + 1).padStart(3, "0")}`,
      ...newCashier,
      status: "active",
      totalTransactions: 0,
      totalRevenue: 0,
      joinDate: new Date(),
      lastActive: new Date(),
    }
    setCashiers([...cashiers, cashier])
    setNewCashier({ name: "", email: "", phone: "", shift: "morning" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteCashier = (id: string) => {
    setCashiers(cashiers.filter((c) => c.id !== id))
  }

  const handleStatusChange = (id: string, status: Cashier["status"]) => {
    setCashiers(cashiers.map((c) => (c.id === id ? { ...c, status, lastActive: new Date() } : c)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "on_break":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "inactive":
        return <AlertCircle className="h-4 w-4" />
      case "on_break":
        return <Clock className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const filteredCashiers = cashiers.filter(
    (cashier) =>
      cashier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalCashiers: cashiers.length,
    activeCashiers: cashiers.filter((c) => c.status === "active").length,
    totalRevenue: cashiers.reduce((sum, c) => sum + c.totalRevenue, 0),
    totalTransactions: cashiers.reduce((sum, c) => sum + c.totalTransactions, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Cashier Management</h3>
          <p className="text-gray-600">Manage cashier staff and monitor performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Cashier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Cashier</DialogTitle>
              <DialogDescription>Create a new cashier account for the hotel system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newCashier.name}
                  onChange={(e) => setNewCashier({ ...newCashier, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCashier.email}
                  onChange={(e) => setNewCashier({ ...newCashier, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCashier.phone}
                  onChange={(e) => setNewCashier({ ...newCashier, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="shift">Shift</Label>
                <Select
                  value={newCashier.shift}
                  onValueChange={(value: any) => setNewCashier({ ...newCashier, shift: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6AM - 2PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2PM - 10PM)</SelectItem>
                    <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCashier}>Add Cashier</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cashiers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCashiers}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCashiers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Cashier List</CardTitle>
          <CardDescription>Manage and monitor all cashier staff</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search cashiers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCashiers.map((cashier) => (
              <div key={cashier.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{cashier.name}</p>
                    <p className="text-sm text-gray-600">{cashier.email}</p>
                    <p className="text-xs text-gray-500">
                      {cashier.shift} shift • Joined {cashier.joinDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${cashier.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{cashier.totalTransactions} transactions</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(cashier.status)}>
                      {getStatusIcon(cashier.status)}
                      <span className="ml-1 capitalize">{cashier.status.replace("_", " ")}</span>
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Select
                      value={cashier.status}
                      onValueChange={(value: any) => handleStatusChange(cashier.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on_break">On Break</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCashier(cashier.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
