export interface Product {
  productId: string
  manufacturerCompany: {
    companyId: string
    companyName: string
  }
  skuCode: string
  brandName: string
  category: string
  status: string
  packType: string
  packSize: string
  unitsPerCase: string
  uom: string
  weightPerUnit: string
  shelfLifeInDays: string
  hsnCode: string
  taxRate: number
  isReturnable: boolean
  description: string
  productImages?: Array<{
    documentId: string
    documentUrl: string
    documentType: string
  }>
  sysId: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

export interface Pricing {
  priceId: string
  product: {
    productId: string
    skuCode: string
  }
  basePrice: number
  tradePrice: number
  purchasePrice: number
  currency: string
  effectiveFrom: string
  effectiveTo: string
  regionCode: string
  priceType: string
  discountType: string
  discountPercentage: number
  isGstIncluded: boolean
  sysId: string
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  skuCode: string
  brandName: string
  category: string
  status: string
  packType: string
  packSize: string
  unitsPerCase: string
  uom: string
  weightPerUnit: string
  shelfLifeInDays: string
  hsnCode: string
  taxRate: number
  isReturnable: boolean
  description: string
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  productId: string
}

export interface CreatePricingRequest {
  productId: string
  basePrice: number
  tradePrice: number
  purchasePrice: number
  currency: string
  effectiveFrom: string
  effectiveTo?: string
  regionCode: string
  priceType: string
  discountType?: string
  discountPercentage: number
  isGstIncluded: boolean
}

export interface ProductFilters {
  category?: string
  status?: string
  searchQuery?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

export interface ProductCategory {
  categoryId: string
  categoryName: string
  description?: string
  subCategories?: string[]
}
