export interface Payment {
  paymentId: string
  transactionId: string
  orderId?: string
  orderNumber?: string
  payerName: string
  payerEmail?: string
  payerPhone?: string
  payeeCompany: {
    companyId: string
    companyName: string
  }
  amount: number
  currency: string
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'CREDIT'
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED'
  paymentDate: string
  dueDate?: string
  completedDate?: string
  referenceNumber?: string
  bankDetails?: {
    bankName: string
    accountNumber: string
    ifscCode: string
  }
  upiDetails?: {
    upiId: string
    transactionRef: string
  }
  chequeDetails?: {
    chequeNumber: string
    chequeDate: string
    bankName: string
  }
  notes?: string
  attachments?: Array<{
    documentId: string
    documentUrl: string
    documentType: string
  }>
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

export interface PaymentInitiateRequest {
  orderId?: string
  payerName: string
  payerEmail?: string
  payerPhone?: string
  amount: number
  currency: string
  paymentMethod: string
  dueDate?: string
  referenceNumber?: string
  bankDetails?: {
    bankName: string
    accountNumber: string
    ifscCode: string
  }
  upiDetails?: {
    upiId: string
  }
  chequeDetails?: {
    chequeNumber: string
    chequeDate: string
    bankName: string
  }
  notes?: string
}

export interface PaymentReceiveRequest {
  paymentId: string
  receivedAmount: number
  receivedDate: string
  referenceNumber: string
  notes?: string
}

export interface PaymentRefundRequest {
  paymentId: string
  refundAmount: number
  refundReason: string
  refundMethod: string
  notes?: string
}

export interface PaymentFilters {
  status?: string
  paymentMethod?: string
  dateFrom?: string
  dateTo?: string
  searchQuery?: string
  minAmount?: number
  maxAmount?: number
}

export interface PaymentSummary {
  totalPayments: number
  totalAmount: number
  pendingAmount: number
  completedAmount: number
  refundedAmount: number
  failedCount: number
}
