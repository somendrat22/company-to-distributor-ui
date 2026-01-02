'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { canViewProducts, canUpdateProduct, canDeleteProduct, canUpdateProductPrice, canUpdateProductStock } from '@/lib/permissions'
import { Package, ArrowLeft, Edit, Trash2, XCircle, TrendingUp, Archive, DollarSign, Calendar } from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockProduct = {
  productId: '1',
  productName: 'Premium Widget A',
  productCode: 'PWA-001',
  description: 'High-quality premium widget with advanced features and superior build quality. Perfect for demanding applications.',
  category: 'Electronics',
  subCategory: 'Components',
  brand: 'TechBrand',
  unitOfMeasure: 'PIECE',
  basePrice: 5000,
  sellingPrice: 5500,
  taxRate: 18,
  discount: 0,
  stockQuantity: 150,
  minStockLevel: 50,
  maxStockLevel: 500,
  reorderPoint: 75,
  status: 'ACTIVE',
  imageUrl: null,
  specifications: {
    'Weight': '500g',
    'Dimensions': '10cm x 5cm x 2cm',
    'Material': 'Aluminum Alloy',
    'Warranty': '2 Years',
  },
  tags: ['premium', 'electronics', 'bestseller'],
  createdAt: '2024-01-15T10:30:00',
  updatedAt: '2024-12-20T14:45:00',
  createdBy: 'Admin User',
}

function ProductDetailsContent() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState(mockProduct)
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'DISCONTINUED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStockStatusColor = () => {
    if (product.stockQuantity === 0) return 'text-red-600'
    if (product.stockQuantity < product.minStockLevel) return 'text-yellow-600'
    return 'text-green-600'
  }

  const profitMargin = product.sellingPrice - product.basePrice
  const profitPercentage = ((profitMargin / product.basePrice) * 100).toFixed(2)

  if (!user || !canViewProducts(user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You don't have permission to view products.
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
          <Link href="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-primary-600" />
                {product.productName}
              </h1>
              <p className="text-gray-600 mt-1">{product.productCode}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
              {canUpdateProduct(user) && (
                <Link href={`/products/${product.productId}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Product
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <Card>
              <CardContent className="pt-6">
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Package className="w-32 h-32 text-gray-400" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{product.description}</p>
              </CardContent>
            </Card>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">{key}:</span>
                        <span className="text-sm font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pricing Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  Pricing Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Base Price</p>
                      <p className="text-xl font-bold text-gray-900">₹{product.basePrice.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <p className="text-sm text-primary-600 mb-1">Selling Price</p>
                      <p className="text-xl font-bold text-primary-900">₹{product.sellingPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-600 mb-1">Tax Rate</p>
                      <p className="text-lg font-semibold text-gray-900">{product.taxRate}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-600 mb-1">Discount</p>
                      <p className="text-lg font-semibold text-gray-900">{product.discount}%</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-xs text-green-600 mb-1">Profit</p>
                      <p className="text-lg font-semibold text-green-900">{profitPercentage}%</p>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Profit Margin per Unit</p>
                    <p className="text-2xl font-bold text-green-900">₹{profitMargin.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{product.category}</p>
                </div>
                {product.subCategory && (
                  <div>
                    <p className="text-sm text-gray-500">Sub-Category</p>
                    <p className="font-medium text-gray-900">{product.subCategory}</p>
                  </div>
                )}
                {product.brand && (
                  <div>
                    <p className="text-sm text-gray-500">Brand</p>
                    <p className="font-medium text-gray-900">{product.brand}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Unit of Measure</p>
                  <p className="font-medium text-gray-900">{product.unitOfMeasure}</p>
                </div>
              </CardContent>
            </Card>

            {/* Stock Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5 text-primary-600" />
                  Stock Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                  <p className={`text-3xl font-bold ${getStockStatusColor()}`}>
                    {product.stockQuantity}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{product.unitOfMeasure}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Level:</span>
                    <span className="font-medium text-gray-900">{product.minStockLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Level:</span>
                    <span className="font-medium text-gray-900">{product.maxStockLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reorder Point:</span>
                    <span className="font-medium text-gray-900">{product.reorderPoint}</span>
                  </div>
                </div>
                {product.stockQuantity < product.reorderPoint && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      ⚠️ Stock below reorder point. Consider restocking.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Created By</p>
                  <p className="font-medium text-gray-900">{product.createdBy}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created At</p>
                  <p className="font-medium text-gray-900">
                    {new Date(product.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {new Date(product.updatedAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {canDeleteProduct(user) && (
              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailsPage() {
  return (
    <ProtectedRoute>
      <ProductDetailsContent />
    </ProtectedRoute>
  )
}
