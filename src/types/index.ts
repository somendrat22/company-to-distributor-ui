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
  companyType: string
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
