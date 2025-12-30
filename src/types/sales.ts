export interface SalesOrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  taxRate: number
  totalAmount: number
}

export interface SalesOrder {
  orderId: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  orderDate: string
  deliveryDate?: string
  status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED'
  items: SalesOrderItem[]
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  shippingAddress: {
    addressLine1: string
    addressLine2?: string
    addressLine3?: string
    city: string
    state: string
    pincode: string
  }
  billingAddress: {
    addressLine1: string
    addressLine2?: string
    addressLine3?: string
    city: string
    state: string
    pincode: string
  }
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED'
  paymentMethod?: string
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

export interface CreateSalesOrderRequest {
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryDate?: string
  items: {
    productId: string
    quantity: number
    unitPrice: number
    discount: number
    taxRate: number
  }[]
  shippingAddress: {
    addressLine1: string
    addressLine2?: string
    addressLine3?: string
    city: string
    state: string
    pincode: string
  }
  billingAddress: {
    addressLine1: string
    addressLine2?: string
    addressLine3?: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod?: string
  notes?: string
}

export interface SalesOrderFilters {
  status?: string
  customerId?: string
  dateFrom?: string
  dateTo?: string
  searchQuery?: string
}
