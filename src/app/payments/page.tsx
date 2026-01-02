'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { AppLayout } from '@/components/layout/AppLayout'
import { canViewPayments, canInitiatePayment, canReceivePayment, canRefundPayment } from '@/lib/permissions'
import { CreditCard, Plus, Search, Eye, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

// Mock data for demonstration
const mockPayments = [
  {
    paymentId: '1',
    transactionId: 'TXN-2024-001',
    orderId: '1',
    orderNumber: 'SO-2024-001',
    payerName: 'ABC Distributors',
    amount: 125000,
    currency: 'INR',
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'COMPLETED',
    paymentDate: '2024-12-25',
    completedDate: '2024-12-26',
    referenceNumber: 'REF123456',
  },
  {
    paymentId: '2',
    transactionId: 'TXN-2024-002',
    orderId: '2',
    orderNumber: 'SO-2024-002',
    payerName: 'XYZ Retail',
    amount: 85000,
    currency: 'INR',
    paymentMethod: 'UPI',
    paymentStatus: 'PENDING',
    paymentDate: '2024-12-28',
    dueDate: '2024-12-30',
    referenceNumber: 'REF789012',
  },
  {
    paymentId: '3',
    transactionId: 'TXN-2024-003',
    orderId: '3',
    orderNumber: 'SO-2024-003',
    payerName: 'PQR Wholesale',
    amount: 250000,
    currency: 'INR',
    paymentMethod: 'CHEQUE',
    paymentStatus: 'PROCESSING',
    paymentDate: '2024-12-29',
    referenceNumber: 'CHQ345678',
  },
  {
    paymentId: '4',
    transactionId: 'TXN-2024-004',
    payerName: 'LMN Trading',
    amount: 50000,
    currency: 'INR',
    paymentMethod: 'CASH',
    paymentStatus: 'FAILED',
    paymentDate: '2024-12-27',
    referenceNumber: 'CASH001',
  },
  {
    paymentId: '5',
    transactionId: 'TXN-2024-005',
    orderId: '5',
    orderNumber: 'SO-2024-005',
    payerName: 'DEF Enterprises',
    amount: 30000,
    currency: 'INR',
    paymentMethod: 'CARD',
    paymentStatus: 'REFUNDED',
    paymentDate: '2024-12-20',
    completedDate: '2024-12-21',
    referenceNumber: 'CARD567890',
  },
]

function PaymentsContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [payments, setPayments] = useState(mockPayments)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [methodFilter, setMethodFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'PROCESSING':
        return <AlertCircle className="w-4 h-4" />
      case 'FAILED':
        return <XCircle className="w-4 h-4" />
      case 'REFUNDED':
        return <TrendingDown className="w-4 h-4" />
      default:
        return null
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER':
        return '🏦'
      case 'UPI':
        return '📱'
      case 'CARD':
        return '💳'
      case 'CASH':
        return '💵'
      case 'CHEQUE':
        return '📝'
      case 'CREDIT':
        return '🏷️'
      default:
        return '💰'
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || payment.paymentStatus === statusFilter
    const matchesMethod = methodFilter === 'ALL' || payment.paymentMethod === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    completed: payments.filter(p => p.paymentStatus === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.paymentStatus === 'PENDING').reduce((sum, p) => sum + p.amount, 0),
    failed: payments.filter(p => p.paymentStatus === 'FAILED').length,
    refunded: payments.filter(p => p.paymentStatus === 'REFUNDED').reduce((sum, p) => sum + p.amount, 0),
  }

  if (!user || !canViewPayments(user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You don't have permission to view payments.
              </p>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-primary-600" />
                Payments
              </h1>
              <p className="text-gray-600 mt-1">Manage and track payment transactions</p>
            </div>
            {canInitiatePayment(user) && (
              <Link href="/payments/initiate">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Initiate Payment
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.total.toLocaleString('en-IN')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.completed.toLocaleString('en-IN')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">₹{stats.pending.toLocaleString('en-IN')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Refunded</p>
                <p className="text-2xl font-bold text-gray-600">₹{stats.refunded.toLocaleString('en-IN')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by transaction ID, payer, order, or reference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="md:w-48">
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ALL">All Methods</option>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CREDIT">Credit</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({filteredPayments.length})</CardTitle>
            <CardDescription>View and manage all payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No payments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.paymentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                          {payment.referenceNumber && (
                            <div className="text-xs text-gray-500">{payment.referenceNumber}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.payerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payment.orderNumber ? (
                            <div className="text-sm text-gray-900">{payment.orderNumber}</div>
                          ) : (
                            <div className="text-sm text-gray-400">-</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{payment.amount.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <span>{getMethodIcon(payment.paymentMethod)}</span>
                            {payment.paymentMethod.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(payment.paymentDate).toLocaleDateString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.paymentStatus)}`}>
                            {getStatusIcon(payment.paymentStatus)}
                            {payment.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/payments/${payment.paymentId}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <PaymentsContent />
    </ProtectedRoute>
  )
}
