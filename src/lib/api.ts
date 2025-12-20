import { OnboardingFormData, UploadedDocument, CompanyOnboardingRequestDto } from '@/types'
import { transformToBackendDTO, validateBackendDTO } from './transformers'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Simulate API delay (for mock mode)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API: Upload file
export async function uploadFile(file: File): Promise<UploadedDocument> {
  await delay(1500) // Simulate upload time
  
  return {
    id: Math.random().toString(36).substring(7),
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
    uploadedAt: new Date(),
    file: file,
  }
}

// Real API: Submit onboarding data to backend
export async function submitOnboarding(data: OnboardingFormData): Promise<{
  success: boolean
  message: string
  applicationId?: string
}> {
  try {
    // Transform frontend form data to backend DTO
    const backendDTO: CompanyOnboardingRequestDto = transformToBackendDTO(data)
    
    // Validate before sending
    const validation = validateBackendDTO(backendDTO)
    if (!validation.valid) {
      return {
        success: false,
        message: `Validation failed: ${validation.errors.join(', ')}`,
      }
    }
    
    // Validate required documents
    if (!data.documents?.gstCertificate) {
      return {
        success: false,
        message: 'GST Certificate is required',
      }
    }
    if (!data.documents?.panCard) {
      return {
        success: false,
        message: 'PAN Card is required',
      }
    }
    
    console.log('Sending to backend:', backendDTO)
    console.log('Backend DTO JSON:', JSON.stringify(backendDTO, null, 2))
    
    // Create FormData for multipart request
    const formData = new FormData()
    
    // Add files using the stored File objects
    formData.append('gstCertificate', data.documents.gstCertificate.file)
    formData.append('panCard', data.documents.panCard.file)
    
    // Add optional documents
    if (data.documents.registrationDocument) {
      formData.append('companyRegistrationDocument', data.documents.registrationDocument.file)
    }
    
    if (data.documents.companyLogo) {
      formData.append('companyLogo', data.documents.companyLogo.file)
    }
    
    // Add company info as JSON string
    const companyInfoJson = JSON.stringify(backendDTO)
    formData.append('companyInfo', companyInfoJson)
    
    console.log('FormData entries:')
    console.log('- gstCertificate:', data.documents.gstCertificate.file.name)
    console.log('- panCard:', data.documents.panCard.file.name)
    console.log('- companyInfo length:', companyInfoJson.length)
    
    // Send to backend API
    // Remove /api from base URL since backend path already includes it
    const baseUrl = API_BASE_URL.replace(/\/api$/, '')
    const response = await fetch(`${baseUrl}/c2d/api/v1/company/start-onboarding`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }
    
    const result = await response.json()
    
    return {
      success: true,
      message: result.message || 'Company Details uploaded successfully',
      applicationId: result.applicationId || `APP${Date.now()}`,
    }
  } catch (error) {
    console.error('Error submitting onboarding:', error)
    throw error
  }
}

// Mock API: Check GST number
export async function checkGSTExists(gstNumber: string): Promise<boolean> {
  await delay(500)
  // Simulate: GST already exists if it starts with '29'
  return gstNumber.startsWith('29')
}

// Mock API: Validate bank account
export async function validateBankAccount(
  accountNumber: string,
  ifscCode: string
): Promise<{ valid: boolean; bankName?: string; branchName?: string }> {
  await delay(800)
  
  // Simulate validation
  return {
    valid: true,
    bankName: 'State Bank of India',
    branchName: 'Mumbai Main Branch',
  }
}
