'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { canViewSalesOrders, canUpdateSalesOrder, canCancelSalesOrder, canDispatchSalesOrder, canDeliverSalesOrder } from '@/lib/permissions'
import { ShoppingCart, ArrowLeft, Package, Truck, CheckCircle, XCircle, Edit, Calendar, User, Phone, Mail, MapPin, CreditCard } from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockOrder = {
  orderId: '1',
  orderNumber: 'SO-2024-001',
  customerName: 'ABC Distributors',
  customerEmail: 'contact@abcdist.com',
  customerPhone: '+91 98765 43210',
  orderDate: '2024-12-25',
  deliveryDate: '2024-12-30',
  status: 'CONFIRMED',
  paymentStatus: 'PENDING',
  paymentMethod: 'BANK_TRANSFER',
  items: [
    {
      productId: '1',
      productName: 'Product A - Premium Quality',
      quantity: 10,
      unitPrice: 5000,
      discount: 5,
      taxRate: 18,
      totalAmount: 55650,
    },
    {
      productId: '2',
      productName: 'Product B - Standard',
      quantity: 20,
      unitPrice: 3000,
      discount: 10,
      taxRate: 18,
      totalAmount: 63720,
    },
    {
      productId: '3',
      productName: 'Product C - Economy',
      quantity: 5,
      unitPrice: 1000,
      discount: 0,
      taxRate: 18,
      totalAmount: 5900,
    },
  ],
  subtotal: 115000,
  discountAmount: 8500,
  taxAmount: 19170,
  totalAmount: 125670,
  shippingAddress: {
    addressLine1: '123 Business Park',
    addressLine2: 'Sector 5',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  },
  billingAddress: {
    addressLine1: '123 Business Park',
    addressLine2: 'Sector 5',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  },
  notes: 'Please deliver between 10 AM - 5 PM',
  createdAt: '2024-12-25T10:30:00',
  updatedAt: '2024-12-25T10:30:00',
  createdBy: 'John Doe',
}

function SalesOrderDetailsContent() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(mockOrder)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DISPATCHED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PARTIAL':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setActionLoading(newStatus)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder({ ...order, status: newStatus as any })
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setActionLoading('')
    }
  }

  if (!user || !canViewSalesOrders(user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You don't have permission to view sales orders.
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
          <Link href="/sales" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sales Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-primary-600" />
                {order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1">Order details and status</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              {canUpdateSalesOrder(user) && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Order
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>{order.items.length} items in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.productId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-500 mt-1">Product ID: {item.productId}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{item.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Quantity</p>
                          <p className="font-medium text-gray-900">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Unit Price</p>
                          <p className="font-medium text-gray-900">₹{item.unitPrice.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Discount</p>
                          <p className="font-medium text-gray-900">{item.discount}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Tax</p>
                          <p className="font-medium text-gray-900">{item.taxRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-600">-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">₹{order.taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total Amount:</span>
                      <span className="font-bold text-xl text-primary-600">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.pincode}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{order.billingAddress.addressLine1}</p>
                    {order.billingAddress.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
                    <p>{order.billingAddress.city}, {order.billingAddress.state}</p>
                    <p>{order.billingAddress.pincode}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{order.customerPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                {order.deliveryDate && (
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Delivery Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.deliveryDate).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-900">{order.paymentMethod.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.status === 'PENDING' && canUpdateSalesOrder(user) && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleStatusUpdate('CONFIRMED')}
                    isLoading={actionLoading === 'CONFIRMED'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Order
                  </Button>
                )}
                {order.status === 'CONFIRMED' && canDispatchSalesOrder(user) && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleStatusUpdate('DISPATCHED')}
                    isLoading={actionLoading === 'DISPATCHED'}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Mark as Dispatched
                  </Button>
                )}
                {order.status === 'DISPATCHED' && canDeliverSalesOrder(user) && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleStatusUpdate('DELIVERED')}
                    isLoading={actionLoading === 'DELIVERED'}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Mark as Delivered
                  </Button>
                )}
                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && canCancelSalesOrder(user) && (
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    isLoading={actionLoading === 'CANCELLED'}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Order
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
                  <p className="font-medium text-gray-900">{order.createdBy}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created At</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.updatedAt).toLocaleString('en-IN')}
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

export default function SalesOrderDetailsPage() {
  return (
    <ProtectedRoute>
      <SalesOrderDetailsContent />
    </ProtectedRoute>
  )
}
