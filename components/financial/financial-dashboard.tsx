"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  mockTransactions,
  mockFinancialSummary,
  mockExpenseCategories,
  type Transaction,
  type FinancialSummary,
  type ExpenseCategory,
} from "@/lib/financial-data"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Plus,
  Download,
  Calendar,
  CreditCard,
} from "lucide-react"

export function FinancialDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [summary] = useState<FinancialSummary>(mockFinancialSummary)
  const [expenseCategories] = useState<ExpenseCategory[]>(mockExpenseCategories)
  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const [showAddTransaction, setShowAddTransaction] = useState(false)

  const [newTransaction, setNewTransaction] = useState({
    type: "expense" as "income" | "expense",
    category: "utilities",
    amount: "",
    description: "",
    paymentMethod: "cash" as "cash" | "card" | "bank_transfer" | "online",
  })

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) return

    const transaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: newTransaction.type,
      category: newTransaction.category as any,
      amount: Number.parseFloat(newTransaction.amount),
      description: newTransaction.description,
      date: new Date(),
      paymentMethod: newTransaction.paymentMethod,
      status: "completed",
    }

    setTransactions([transaction, ...transactions])
    setNewTransaction({
      type: "expense",
      category: "utilities",
      amount: "",
      description: "",
      paymentMethod: "cash",
    })
    setShowAddTransaction(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "room_booking":
        return "🏨"
      case "hall_booking":
        return "🏛️"
      case "food_service":
        return "🍽️"
      case "utilities":
        return "⚡"
      case "salaries":
        return "👥"
      case "maintenance":
        return "🔧"
      case "supplies":
        return "📦"
      case "marketing":
        return "📢"
      default:
        return "💼"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
          <p className="text-muted-foreground">Track revenue, expenses, and financial performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -3.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${summary.netProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +18.7% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +5.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Button onClick={() => setShowAddTransaction(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {showAddTransaction && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Transaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newTransaction.type}
                      onValueChange={(value: "income" | "expense") =>
                        setNewTransaction({ ...newTransaction, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTransaction.category}
                      onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room_booking">Room Booking</SelectItem>
                        <SelectItem value="hall_booking">Hall Booking</SelectItem>
                        <SelectItem value="food_service">Food Service</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="salaries">Salaries</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Method</Label>
                    <Select
                      value={newTransaction.paymentMethod}
                      onValueChange={(value: any) => setNewTransaction({ ...newTransaction, paymentMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Transaction description..."
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTransaction}>Add Transaction</Button>
                  <Button variant="outline" onClick={() => setShowAddTransaction(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getCategoryIcon(transaction.category)}</div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {transaction.date.toLocaleDateString()}
                          <CreditCard className="h-3 w-3 ml-2" />
                          {transaction.paymentMethod}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </p>
                      <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Room Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summary.roomRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((summary.roomRevenue / summary.totalRevenue) * 100).toFixed(1)}% of total revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Hall Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summary.hallRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((summary.hallRevenue / summary.totalRevenue) * 100).toFixed(1)}% of total revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Food Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summary.foodRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((summary.foodRevenue / summary.totalRevenue) * 100).toFixed(1)}% of total revenue
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Average Room Rate</p>
                  <p className="text-2xl font-bold">${summary.averageRoomRate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Revenue per Available Room</p>
                  <p className="text-2xl font-bold">
                    ${((summary.averageRoomRate * summary.occupancyRate) / 100).toFixed(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Budget vs actual expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.category}</span>
                      <div className="text-right">
                        <span className="font-semibold">${category.actual.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          / ${category.budgeted.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${category.variance <= 0 ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min((category.actual / category.budgeted) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{category.percentage}% of total expenses</span>
                      <span className={category.variance <= 0 ? "text-green-600" : "text-red-600"}>
                        {category.variance <= 0 ? "" : "+"}${category.variance.toLocaleString()} variance
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profit & Loss Summary</CardTitle>
                <CardDescription>{summary.period}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-semibold text-green-600">+${summary.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses</span>
                    <span className="font-semibold text-red-600">-${summary.totalExpenses.toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net Profit</span>
                    <span className={summary.netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                      ${summary.netProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Profit Margin: {((summary.netProfit / summary.totalRevenue) * 100).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Occupancy Rate</span>
                    <span className="font-semibold">{summary.occupancyRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Daily Rate</span>
                    <span className="font-semibold">${summary.averageRoomRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue per Available Room</span>
                    <span className="font-semibold">
                      ${((summary.averageRoomRate * summary.occupancyRate) / 100).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Occupied Room</span>
                    <span className="font-semibold">
                      ${(summary.totalExpenses / ((summary.occupancyRate * 30) / 100)).toFixed(0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export Financial Reports</CardTitle>
              <CardDescription>Generate detailed financial reports for accounting and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  P&L Statement
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Cash Flow Report
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Tax Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
