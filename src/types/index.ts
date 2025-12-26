export type CompanyType = 'Manufacturer' | 'Supplier' | 'Brand Owner'

// Backend DTO structure - matches CompanyOnboardingRequestDto
export interface CompanyOnboardingRequestDto {
  companyName: string
  legalName: string
  gstNumber: string
  panNumber: string
  cinNumber?: string
  companyType: string
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  city: string
  state: string
  country: string
  pincode: number
  geoLatitude?: string
  geoLongitude?: string
  supportEmail: string
  supportPhoneNumber: string
  bankAccountNumber: string
  bankName: string
  ifscCode: string
  creditLimitForDistributors?: string
}

// Frontend form data structures (for step-by-step collection)
export interface CompanyRegistrationData {
  companyName: string
  legalName: string
  companyType: CompanyType
  gstNumber: string
  panNumber: string
  cinNumber?: string
}

export interface BusinessAddressData {
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  city: string
  state: string
  pincode: string
  country: string
  geoLatitude?: string
  geoLongitude?: string
}

export interface ContactPersonData {
  supportEmail: string
  supportPhoneNumber: string
}

export interface BankingDetailsData {
  bankName: string
  bankAccountNumber: string
  ifscCode: string
  creditLimitForDistributors?: string
}

export interface UploadedDocument {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  file: File
}

export interface DocumentUploadData {
  gstCertificate?: UploadedDocument
  panCard?: UploadedDocument
  registrationDocument?: UploadedDocument
  companyLogo?: UploadedDocument
}

export interface OnboardingFormData {
  companyRegistration: CompanyRegistrationData
  businessAddress: BusinessAddressData
  contactPerson: ContactPersonData
  bankingDetails: BankingDetailsData
  documents: DocumentUploadData
}

export type OnboardingStep = 
  | 'landing'
  | 'company-registration'
  | 'business-address'
  | 'contact-person'
  | 'banking-details'
  | 'document-upload'
  | 'review'
  | 'success'

export interface StepConfig {
  id: OnboardingStep
  title: string
  description: string
  stepNumber?: number
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface Operation {
  sys_id: string
  operationName: string
  operationType: string
}

export interface Role {
  roleId: string
  roleName: string
  operations: Operation[]
  createdAt: string
  sysId: string
  updatedAt: string
}

export interface CompanyLoginResponse {
  addressLine1: string
  addressLine2: string
  addressLine3: string
  city: string
  companyId: string
  companyLogoUrl: string
  companyName: string
  companyType: string
  country: string
  geoLatitude: string
  geoLongitude: string
  legalName: string
  pincode: number
  state: string
}

export interface LoginResponse {
  addressLine1: string
  addressLine2: string
  addressLine3: string
  companyLoginResp: CompanyLoginResponse
  companyUser: boolean
  email: string
  fullName: string
  phoneNumber: string
  pincode: number
  roles: Role[]
  token: string
}

export interface User {
  email: string
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  addressLine3: string
  pincode: number
  companyUser: boolean
  roles: Role[]
  company?: CompanyLoginResponse
  token: string
}

// Employee Invitation types
export interface CreateRoleRequest {
  roleName: string
  operationIds: string[]
}

export interface CreateRoleResponse {
  roleId: string
  roleName: string
  operations: Operation[]
  createdAt: string
  sysId: string
  updatedAt: string
}

export interface InviteEmployeeRequest {
  email: string
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  addressLine3?: string
  pincode: number
  roleIds: string[]
}

export interface InviteEmployeeResponse {
  success: boolean
  message: string
  userId?: string
}

export interface OperationGroup {
  type: string
  operations: Operation[]
}
