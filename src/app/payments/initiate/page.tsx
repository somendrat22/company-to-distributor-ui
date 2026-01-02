'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { canInitiatePayment } from '@/lib/permissions'
import { CreditCard, ArrowLeft, XCircle } from 'lucide-react'
import Link from 'next/link'

function InitiatePaymentContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Payment details
  const [orderId, setOrderId] = useState('')
  const [payerName, setPayerName] = useState('')
  const [payerEmail, setPayerEmail] = useState('')
  const [payerPhone, setPayerPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER')
  const [dueDate, setDueDate] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [notes, setNotes] = useState('')

  // Bank details
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')

  // UPI details
  const [upiId, setUpiId] = useState('')

  // Cheque details
  const [chequeNumber, setChequeNumber] = useState('')
  const [chequeDate, setChequeDate] = useState('')
  const [chequeBankName, setChequeBankName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    // Validation
    if (!payerName || !amount || parseFloat(amount) <= 0) {
      setError('Please fill in all required fields with valid values')
      return
    }

    if (paymentMethod === 'BANK_TRANSFER' && (!bankName || !accountNumber || !ifscCode)) {
      setError('Please provide complete bank details')
      return
    }

    if (paymentMethod === 'UPI' && !upiId) {
      setError('Please provide UPI ID')
      return
    }

    if (paymentMethod === 'CHEQUE' && (!chequeNumber || !chequeDate || !chequeBankName)) {
      setError('Please provide complete cheque details')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccessMessage('Payment initiated successfully!')
      setTimeout(() => {
        router.push('/payments')
      }, 2000)
    } catch (err) {
      setError('Failed to initiate payment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || !canInitiatePayment(user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You don't have permission to initiate payments.
              </p>
              <Link href="/payments">
                <Button>Back to Payments</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/payments" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payments
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary-600" />
            Initiate Payment
          </h1>
          <p className="text-gray-600 mt-1">Create a new payment transaction</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Payer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payer Information</CardTitle>
                <CardDescription>Enter payer details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Order ID (Optional)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="SO-2024-001"
                />
                <Input
                  label="Payer Name *"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter payment amount and method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Amount *"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method *
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="CREDIT">Credit</option>
                    </select>
                  </div>
                  <Input
                    label="Due Date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <Input
                  label="Reference Number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="REF123456"
                />
              </CardContent>
            </Card>

            {/* Payment Method Specific Details */}
            {paymentMethod === 'BANK_TRANSFER' && (
              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>Enter bank account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Bank Name *"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Account Number *"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                    />
                    <Input
                      label="IFSC Code *"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === 'UPI' && (
              <Card>
                <CardHeader>
                  <CardTitle>UPI Details</CardTitle>
                  <CardDescription>Enter UPI information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    label="UPI ID *"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="user@upi"
                    required
                  />
                </CardContent>
              </Card>
            )}

            {paymentMethod === 'CHEQUE' && (
              <Card>
                <CardHeader>
                  <CardTitle>Cheque Details</CardTitle>
                  <CardDescription>Enter cheque information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Cheque Number *"
                      value={chequeNumber}
                      onChange={(e) => setChequeNumber(e.target.value)}
                      required
                    />
                    <Input
                      label="Cheque Date *"
                      type="date"
                      value={chequeDate}
                      onChange={(e) => setChequeDate(e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    label="Bank Name *"
                    value={chequeBankName}
                    onChange={(e) => setChequeBankName(e.target.value)}
                    required
                  />
                </CardContent>
              </Card>
            )}

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add any additional notes..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                Initiate Payment
              </Button>
              <Link href="/payments" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function InitiatePaymentPage() {
  return (
    <ProtectedRoute>
      <InitiatePaymentContent />
    </ProtectedRoute>
  )
}
