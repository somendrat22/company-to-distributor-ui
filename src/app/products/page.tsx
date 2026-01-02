'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { AppLayout } from '@/components/layout/AppLayout'
import { canViewProducts, canCreateProduct, canUpdateProduct, canDeleteProduct } from '@/lib/permissions'
import { Package, Plus, Search, Filter, Eye, Edit, Trash2, XCircle, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

// Mock data for demonstration
const mockProducts = [
  {
    productId: '1',
    skuCode: 'PWA-001',
    brandName: 'TechBrand',
    category: 'Electronics',
    status: 'ACTIVE',
    packType: 'Box',
    packSize: '500g',
    unitsPerCase: '12',
    uom: 'PIECE',
    weightPerUnit: '500g',
    shelfLifeInDays: '365',
    hsnCode: '8471',
    taxRate: 18,
    isReturnable: true,
    description: 'Premium Widget A - High quality electronic component',
    productImages: [],
    basePrice: 5000,
    tradePrice: 5500,
    stockQuantity: 150,
  },
  {
    productId: '2',
    skuCode: 'SWB-002',
    brandName: 'TechBrand',
    category: 'Electronics',
    status: 'ACTIVE',
    packType: 'Box',
    packSize: '300g',
    unitsPerCase: '24',
    uom: 'PIECE',
    weightPerUnit: '300g',
    shelfLifeInDays: '365',
    hsnCode: '8471',
    taxRate: 18,
    isReturnable: true,
    description: 'Standard Widget B - Reliable electronic component',
    productImages: [],
    basePrice: 3000,
    tradePrice: 3300,
    stockQuantity: 200,
  },
  {
    productId: '3',
    skuCode: 'EWC-003',
    brandName: 'BuildPro',
    category: 'Hardware',
    status: 'ACTIVE',
    packType: 'Carton',
    packSize: '1kg',
    unitsPerCase: '10',
    uom: 'PIECE',
    weightPerUnit: '1kg',
    shelfLifeInDays: '730',
    hsnCode: '7326',
    taxRate: 18,
    isReturnable: false,
    description: 'Economy Widget C - Cost-effective hardware solution',
    productImages: [],
    basePrice: 1000,
    tradePrice: 1100,
    stockQuantity: 50,
  },
  {
    productId: '4',
    skuCode: 'DWD-004',
    brandName: 'TechBrand',
    category: 'Electronics',
    status: 'ACTIVE',
    packType: 'Box',
    packSize: '800g',
    unitsPerCase: '6',
    uom: 'PIECE',
    weightPerUnit: '800g',
    shelfLifeInDays: '365',
    hsnCode: '8471',
    taxRate: 18,
    isReturnable: true,
    description: 'Deluxe Widget D - Premium electronic component',
    productImages: [],
    basePrice: 8000,
    tradePrice: 8800,
    stockQuantity: 5,
  },
  {
    productId: '5',
    skuCode: 'LWE-005',
    brandName: 'OldBrand',
    category: 'Hardware',
    status: 'INACTIVE',
    packType: 'Box',
    packSize: '400g',
    unitsPerCase: '20',
    uom: 'PIECE',
    weightPerUnit: '400g',
    shelfLifeInDays: '180',
    hsnCode: '7326',
    taxRate: 18,
    isReturnable: false,
    description: 'Legacy Widget E - Discontinued product',
    productImages: [],
    basePrice: 2000,
    tradePrice: 2200,
    stockQuantity: 0,
  },
]

function ProductsContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [products, setProducts] = useState(mockProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
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

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: 'Out of Stock', color: 'text-red-600', icon: <XCircle className="w-4 h-4" /> }
    } else if (quantity < 50) {
      return { label: 'Low Stock', color: 'text-yellow-600', icon: <AlertCircle className="w-4 h-4" /> }
    } else {
      return { label: 'In Stock', color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> }
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brandName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter
    const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'ACTIVE').length,
    lowStock: products.filter(p => p.stockQuantity < 50 && p.stockQuantity > 0).length,
    outOfStock: products.filter(p => p.stockQuantity === 0).length,
  }

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))]

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
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-primary-600" />
                Products
              </h1>
              <p className="text-gray-600 mt-1">Manage your product catalog</p>
            </div>
            {canCreateProduct(user) && (
              <Link href="/products/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
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
                    placeholder="Search by name, code, or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
                  ))}
                </select>
              </div>
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DISCONTINUED">Discontinued</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stockQuantity)
              return (
                <Card key={product.productId} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    {/* Product Image Placeholder */}
                    <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      {product.productImages && product.productImages.length > 0 ? (
                        <img src={product.productImages[0].documentUrl} alt={product.description} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="w-16 h-16 text-gray-400" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.brandName} - {product.packSize}</h3>
                        <p className="text-sm text-gray-500">{product.skuCode}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-gray-900">{product.category}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Brand:</span>
                        <span className="font-medium text-gray-900">{product.brandName}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Trade Price:</span>
                        <span className="font-bold text-primary-600">₹{product.tradePrice.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Stock:</span>
                        <span className={`flex items-center gap-1 font-medium ${stockStatus.color}`}>
                          {stockStatus.icon}
                          {product.stockQuantity} units
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <Link href={`/products/${product.productId}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        {canUpdateProduct(user) && (
                          <Link href={`/products/${product.productId}/edit`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsContent />
    </ProtectedRoute>
  )
}
