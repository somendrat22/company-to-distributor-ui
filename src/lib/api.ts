import { OnboardingFormData, UploadedDocument, CompanyOnboardingRequestDto, LoginRequest, LoginResponse, User, CreateRoleRequest, CreateRoleResponse, InviteEmployeeRequest, InviteEmployeeResponse, Operation, Role } from '@/types'
import { transformToBackendDTO, validateBackendDTO } from './transformers'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': token }),
  }
}

// Auth API: Login user
export async function loginUser(credentials: LoginRequest): Promise<{
  success: boolean
  message: string
  user?: User
}> {
  try {
    const baseUrl = API_BASE_URL.replace(/\/api$/, '')
    const response = await fetch(`${baseUrl}/c2d/api/v1/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Invalid email or password')
    }

    const data: LoginResponse = await response.json()

    // Transform response to User object
    const user: User = {
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      addressLine3: data.addressLine3,
      pincode: data.pincode,
      companyUser: data.companyUser,
      roles: data.roles,
      company: data.companyLoginResp,
      token: data.token,
    }

    // Store token and user in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(user))
    }

    return {
      success: true,
      message: 'Login successful',
      user,
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed. Please try again.',
    }
  }
}

// Auth API: Logout user
export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }
}

// Auth API: Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

// Auth API: Get auth token
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

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

// Employee & Role Management API

// Fetch all available operations
export async function fetchAllOperations(): Promise<Operation[]> {
  try {
    const baseUrl = API_BASE_URL.replace(/\/api$/, '')
    const response = await fetch(`${baseUrl}/c2d/api/v1/operations/all`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch operations')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching operations:', error)
    throw error
  }
}

// Create a new role with selected operations
export async function createRole(roleData: CreateRoleRequest): Promise<CreateRoleResponse> {
  try {
    const baseUrl = API_BASE_URL.replace(/\/api$/, '')
    const response = await fetch(`${baseUrl}/c2d/api/v1/auth/create-role`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create role')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating role:', error)
    throw error
  }
}

// Fetch all roles for the company
export async function fetchCompanyRoles(): Promise<Role[]> {
  try {
    const baseUrl = API_BASE_URL.replace(/\/api$/, '')
    const response = await fetch(`${baseUrl}/c2d/api/v1/company/get-roles`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch roles')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error
  }
}

// Invite an employee
export async function inviteEmployee(employeeData: InviteEmployeeRequest): Promise<InviteEmployeeResponse> {
  try {
    const token = getAuthToken()
    console.log('Token exists:', !!token)
    console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'null')
    
    const baseUrl = API_BASE_URL.replace(/\/api$/, '')
    const headers = getAuthHeaders()
    console.log('Request headers:', headers)
    console.log('Request body:', JSON.stringify(employeeData, null, 2))
    
    const response = await fetch(`${baseUrl}/c2d/api/v1/company/invite-employee`, {
      method: 'POST',
      headers,
      body: JSON.stringify(employeeData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to invite employee')
    }

    const result = await response.json()
    return {
      success: true,
      message: 'Employee invited successfully',
      userId: result.sysId || result.userId,
    }
  } catch (error) {
    console.error('Error inviting employee:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to invite employee',
    }
  }
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
