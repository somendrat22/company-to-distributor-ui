'use client'

import React from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { AppLayout } from '@/components/layout/AppLayout'
import { BarChart, LineChart, PieChart, DonutChart } from '@/components/ui/Chart'
import { Building2, LogOut, User, Shield, Package, UserPlus, ShoppingCart, CreditCard, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { canInviteEmployee, canViewSalesOrders, canViewProducts, canViewPayments } from '@/lib/permissions'

// Mock statistics data
const productStats = [
  { label: 'Electronics', value: 45, color: '#3B82F6' },
  { label: 'Hardware', value: 32, color: '#10B981' },
  { label: 'Accessories', value: 28, color: '#F59E0B' },
  { label: 'Others', value: 15, color: '#6366F1' },
]

const salesTrendData = [
  { label: 'Jan', value: 125000 },
  { label: 'Feb', value: 145000 },
  { label: 'Mar', value: 135000 },
  { label: 'Apr', value: 165000 },
  { label: 'May', value: 185000 },
  { label: 'Jun', value: 195000 },
]

const orderStatusData = [
  { label: 'Pending', value: 12, color: '#F59E0B' },
  { label: 'Confirmed', value: 25, color: '#3B82F6' },
  { label: 'Dispatched', value: 18, color: '#8B5CF6' },
  { label: 'Delivered', value: 45, color: '#10B981' },
]

const paymentMethodData = [
  { label: 'Bank Transfer', value: 450000, color: '#3B82F6' },
  { label: 'UPI', value: 280000, color: '#10B981' },
  { label: 'Cash', value: 150000, color: '#F59E0B' },
  { label: 'Card', value: 120000, color: '#8B5CF6' },
]

const revenueData = [
  { label: 'Products', value: 540000, color: '#3B82F6' },
  { label: 'Services', value: 280000, color: '#10B981' },
  { label: 'Others', value: 180000, color: '#F59E0B' },
]

function DashboardContent() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Header with Company Logo */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {user.company?.companyLogoUrl ? (
                <img
                  src={user.company.companyLogoUrl}
                  alt={user.company.companyName}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {user.company?.companyName || 'Company Portal'}
                </h1>
                <p className="text-xs text-gray-500">{user.company?.companyType}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.fullName}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Quick Actions */}
        {(canInviteEmployee(user) || canViewSalesOrders(user) || canViewProducts(user) || canViewPayments(user)) && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              {canViewProducts(user) && (
                <Link href="/products">
                  <Button>
                    <Package className="w-4 h-4 mr-2" />
                    Products
                  </Button>
                </Link>
              )}
              {canViewSalesOrders(user) && (
                <Link href="/sales">
                  <Button>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Sales Orders
                  </Button>
                </Link>
              )}
              {canViewPayments(user) && (
                <Link href="/payments">
                  <Button>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payments
                  </Button>
                </Link>
              )}
              {canInviteEmployee(user) && (
                <Link href="/employees/invite">
                  <Button variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Employee
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Statistics & Analytics Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-semibold text-gray-900">Business Analytics</h3>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sales Trend Chart */}
            {canViewSalesOrders(user) && (
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend (Last 6 Months)</CardTitle>
                  <CardDescription>Monthly sales revenue in INR</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart data={salesTrendData} height={250} color="#3B82F6" />
                </CardContent>
              </Card>
            )}

            {/* Product Categories Chart */}
            {canViewProducts(user) && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Distribution</CardTitle>
                  <CardDescription>Products by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart data={productStats} height={250} />
                </CardContent>
              </Card>
            )}

            {/* Order Status Chart */}
            {canViewSalesOrders(user) && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Overview</CardTitle>
                  <CardDescription>Current orders by status</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <PieChart data={orderStatusData} size={250} showLegend={true} />
                </CardContent>
              </Card>
            )}

            {/* Payment Methods Chart */}
            {canViewPayments(user) && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Revenue by payment method</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <DonutChart 
                    data={paymentMethodData} 
                    size={250}
                    centerText="Total"
                    centerValue="₹10L"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Revenue Breakdown */}
          {(canViewSalesOrders(user) || canViewProducts(user)) && (
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue distribution by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <BarChart data={revenueData} height={200} />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="space-y-4 w-full">
                      {revenueData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-medium text-gray-900">{item.label}</span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{(item.value / 1000).toFixed(0)}K
                          </span>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">Total Revenue</span>
                          <span className="text-xl font-bold text-primary-600">
                            ₹{(revenueData.reduce((sum, item) => sum + item.value, 0) / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{user.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">
                    {user.addressLine1}
                    {user.addressLine2 && `, ${user.addressLine2}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Card with Logo */}
          {user.company && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {user.company.companyLogoUrl ? (
                    <img
                      src={user.company.companyLogoUrl}
                      alt={user.company.companyName}
                      className="w-5 h-5 rounded object-cover"
                    />
                  ) : (
                    <Building2 className="w-5 h-5 text-primary-600" />
                  )}
                  <CardTitle className="text-lg">Company Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Legal Name</p>
                    <p className="font-medium text-gray-900">{user.company.legalName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Company ID</p>
                    <p className="font-medium text-gray-900 text-xs">{user.company.companyId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {user.company.city}, {user.company.state}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Roles Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                <CardTitle className="text-lg">Roles & Permissions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.roles.map((role) => (
                  <div key={role.roleId} className="bg-primary-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-primary-900">{role.roleName}</p>
                    <p className="text-xs text-primary-700 mt-1">
                      {role.operations.length} permissions
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operations Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              <CardTitle>Available Operations</CardTitle>
            </div>
            <CardDescription>
              Operations you have access to based on your roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {user.roles.flatMap(role => role.operations).map((operation) => (
                <div
                  key={operation.sys_id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <p className="text-xs font-medium text-gray-900">{operation.operationName}</p>
                  <p className="text-xs text-gray-500 mt-1">{operation.operationType}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </AppLayout>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
