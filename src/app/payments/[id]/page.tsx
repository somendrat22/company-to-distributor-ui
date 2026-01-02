'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { canViewPayments, canReceivePayment, canRefundPayment } from '@/lib/permissions'
import { CreditCard, ArrowLeft, CheckCircle, XCircle, Clock, Download, User, Phone, Mail, Calendar, DollarSign, FileText } from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockPayment = {
  paymentId: '1',
  transactionId: 'TXN-2024-001',
  orderId: '1',
  orderNumber: 'SO-2024-001',
  payerName: 'ABC Distributors',
  payerEmail: 'contact@abcdist.com',
  payerPhone: '+91 98765 43210',
  amount: 125000,
  currency: 'INR',
  paymentMethod: 'BANK_TRANSFER',
  paymentStatus: 'COMPLETED',
  paymentDate: '2024-12-25T10:30:00',
  dueDate: '2024-12-30',
  completedDate: '2024-12-26T14:20:00',
  referenceNumber: 'REF123456',
  bankDetails: {
    bankName: 'HDFC Bank',
    accountNumber: '1234567890',
    ifscCode: 'HDFC0001234',
  },
  notes: 'Payment for order SO-2024-001',
  createdAt: '2024-12-25T10:30:00',
  updatedAt: '2024-12-26T14:20:00',
  createdBy: 'Admin User',
}

function PaymentDetailsContent() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [payment, setPayment] = useState(mockPayment)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')

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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5" />
      case 'PENDING':
        return <Clock className="w-5 h-5" />
      case 'FAILED':
        return <XCircle className="w-5 h-5" />
      default:
        return null
    }
  }

  const handleMarkAsReceived = async () => {
    setActionLoading('RECEIVE')
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPayment({ ...payment, paymentStatus: 'COMPLETED', completedDate: new Date().toISOString() })
    } catch (err) {
      console.error('Failed to mark as received:', err)
    } finally {
      setActionLoading('')
    }
  }

  const handleRefund = async () => {
    setActionLoading('REFUND')
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPayment({ ...payment, paymentStatus: 'REFUNDED' })
    } catch (err) {
      console.error('Failed to process refund:', err)
    } finally {
      setActionLoading('')
    }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/payments" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payments
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-primary-600" />
                {payment.transactionId}
              </h1>
              <p className="text-gray-600 mt-1">Payment transaction details</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(payment.paymentStatus)}`}>
                {getStatusIcon(payment.paymentStatus)}
                {payment.paymentStatus}
              </span>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Amount */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600 mb-2">Payment Amount</p>
                  <p className="text-5xl font-bold text-primary-600">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{payment.currency}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{payment.payerName}</p>
                  </div>
                </div>
                {payment.payerEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{payment.payerEmail}</p>
                    </div>
                  </div>
                )}
                {payment.payerPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{payment.payerPhone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method Details */}
            {payment.bankDetails && (
              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bank Name:</span>
                    <span className="text-sm font-medium text-gray-900">{payment.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Account Number:</span>
                    <span className="text-sm font-medium text-gray-900">{payment.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">IFSC Code:</span>
                    <span className="text-sm font-medium text-gray-900">{payment.bankDetails.ifscCode}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {payment.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{payment.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium text-gray-900">{payment.transactionId}</p>
                </div>
                {payment.orderNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <Link href={`/sales/${payment.orderId}`} className="font-medium text-primary-600 hover:text-primary-700">
                      {payment.orderNumber}
                    </Link>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Reference Number</p>
                  <p className="font-medium text-gray-900">{payment.referenceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">{payment.paymentMethod.replace('_', ' ')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Payment Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(payment.paymentDate).toLocaleString('en-IN')}
                  </p>
                </div>
                {payment.dueDate && (
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(payment.dueDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
                {payment.completedDate && (
                  <div>
                    <p className="text-sm text-gray-500">Completed Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(payment.completedDate).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payment.paymentStatus === 'PENDING' && canReceivePayment(user) && (
                  <Button 
                    className="w-full" 
                    onClick={handleMarkAsReceived}
                    isLoading={actionLoading === 'RECEIVE'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Received
                  </Button>
                )}
                {payment.paymentStatus === 'COMPLETED' && canRefundPayment(user) && (
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    onClick={handleRefund}
                    isLoading={actionLoading === 'REFUND'}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Process Refund
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-500">Created By</p>
                  <p className="font-medium text-gray-900">{payment.createdBy}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created At</p>
                  <p className="font-medium text-gray-900">
                    {new Date(payment.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {new Date(payment.updatedAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentDetailsPage() {
  return (
    <ProtectedRoute>
      <PaymentDetailsContent />
    </ProtectedRoute>
  )
}
