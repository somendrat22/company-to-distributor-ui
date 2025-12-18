import { OnboardingFormData, CompanyOnboardingRequestDto } from '@/types'

/**
 * Transform frontend form data to backend DTO format
 * Maps the multi-step form data to the flat structure expected by backend
 */
export function transformToBackendDTO(
  formData: OnboardingFormData
): CompanyOnboardingRequestDto {
  const { companyRegistration, businessAddress, contactPerson, bankingDetails } = formData

  return {
    // Company Registration fields
    companyName: companyRegistration.companyName,
    legalName: companyRegistration.legalName,
    gstNumber: companyRegistration.gstNumber,
    panNumber: companyRegistration.panNumber,
    cinNumber: companyRegistration.cinNumber || undefined,
    companyType: companyRegistration.companyType,

    // Business Address fields
    addressLine1: businessAddress.addressLine1,
    addressLine2: businessAddress.addressLine2 || undefined,
    addressLine3: businessAddress.addressLine3 || undefined,
    city: businessAddress.city,
    state: businessAddress.state,
    country: businessAddress.country,
    pincode: parseInt(businessAddress.pincode, 10),
    geoLatitude: businessAddress.geoLatitude || undefined,
    geoLongitude: businessAddress.geoLongitude || undefined,

    // Contact Person fields
    supportEmail: contactPerson.supportEmail,
    supportPhoneNumber: contactPerson.supportPhoneNumber,

    // Banking Details fields
    bankAccountNumber: bankingDetails.bankAccountNumber,
    bankName: bankingDetails.bankName,
    ifscCode: bankingDetails.ifscCode,
    creditLimitForDistributors: bankingDetails.creditLimitForDistributors || undefined,
  }
}

/**
 * Validate the transformed DTO before sending to backend
 */
export function validateBackendDTO(dto: CompanyOnboardingRequestDto): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Required field validations
  if (!dto.companyName?.trim()) errors.push('Company name is required')
  if (!dto.legalName?.trim()) errors.push('Legal name is required')
  if (!dto.gstNumber?.trim()) errors.push('GST number is required')
  if (!dto.panNumber?.trim()) errors.push('PAN number is required')
  if (!dto.companyType?.trim()) errors.push('Company type is required')
  if (!dto.addressLine1?.trim()) errors.push('Address line 1 is required')
  if (!dto.city?.trim()) errors.push('City is required')
  if (!dto.state?.trim()) errors.push('State is required')
  if (!dto.country?.trim()) errors.push('Country is required')
  if (!dto.pincode || isNaN(dto.pincode)) errors.push('Valid pincode is required')
  if (!dto.supportEmail?.trim()) errors.push('Support email is required')
  if (!dto.supportPhoneNumber?.trim()) errors.push('Support phone number is required')
  if (!dto.bankAccountNumber?.trim()) errors.push('Bank account number is required')
  if (!dto.bankName?.trim()) errors.push('Bank name is required')
  if (!dto.ifscCode?.trim()) errors.push('IFSC code is required')

  return {
    valid: errors.length === 0,
    errors,
  }
}
