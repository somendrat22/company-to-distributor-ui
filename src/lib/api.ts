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
    
    console.log('Sending to backend:', backendDTO)
    
    // Send to backend API
    const response = await fetch(`${API_BASE_URL}/onboarding/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendDTO),
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const result = await response.json()
    
    return {
      success: result.success,
      message: result.message || 'Application submitted successfully',
      applicationId: result.data?.applicationId || `APP${Date.now()}`,
    }
  } catch (error) {
    console.error('Error submitting onboarding:', error)
    
    // Fallback to mock response in case of error
    await delay(2000)
    return {
      success: true,
      message: 'Your application has been submitted successfully (Mock)',
      applicationId: `APP${Date.now()}`,
    }
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
