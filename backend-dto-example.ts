/**
 * Backend DTO (Data Transfer Object) for Company Onboarding
 * This can be used in Node.js/Express, NestJS, or any TypeScript backend
 */

// ============================================
// REQUEST DTO - What frontend sends to backend
// ============================================

export interface CompanyOnboardingRequestDTO {
  // Step 1: Company Registration
  companyRegistration: {
    legalName: string;              // e.g., "ABC Manufacturing Pvt Ltd"
    tradeName: string;              // e.g., "ABC Products"
    gstNumber: string;              // Format: 22AAAAA0000A1Z5
    panNumber: string;              // Format: AAAAA0000A
    incorporationDate: string;      // ISO date string: "2020-01-15"
    businessType: string;           // "manufacturer" | "wholesaler" | "distributor" | "retailer"
    annualTurnover: string;         // e.g., "50000000"
    numberOfEmployees: string;      // e.g., "50-100"
    website?: string;               // Optional
  };

  // Step 2: Business Address
  businessAddress: {
    addressLine1: string;           // e.g., "123, Industrial Area"
    addressLine2?: string;          // Optional
    city: string;                   // e.g., "Mumbai"
    state: string;                  // e.g., "Maharashtra"
    pincode: string;                // e.g., "400001"
    country: string;                // Default: "India"
  };

  // Step 3: Contact Person
  contactPerson: {
    fullName: string;               // e.g., "John Doe"
    designation: string;            // e.g., "Managing Director"
    email: string;                  // e.g., "john@example.com"
    phone: string;                  // e.g., "9876543210"
    alternatePhone?: string;        // Optional
  };

  // Step 4: Banking Details
  bankingDetails: {
    bankName: string;               // e.g., "State Bank of India"
    accountNumber: string;          // e.g., "1234567890"
    ifscCode: string;               // Format: SBIN0001234
    accountHolderName: string;      // e.g., "ABC Manufacturing Pvt Ltd"
    accountType: string;            // "current" | "savings"
    branchName: string;             // e.g., "Mumbai Main Branch"
    requestedCreditLimit?: string;  // Optional, e.g., "5000000"
  };

  // Step 5: Documents
  documents: {
    gstCertificate: FileUploadDTO;
    panCard: FileUploadDTO;
    incorporationCertificate: FileUploadDTO;
    bankStatement: FileUploadDTO;
    addressProof: FileUploadDTO;
    cancelledCheque: FileUploadDTO;
  };
}

export interface FileUploadDTO {
  fileName: string;                 // e.g., "gst-certificate.pdf"
  fileSize: number;                 // Size in bytes
  fileType: string;                 // MIME type: "application/pdf", "image/jpeg", etc.
  fileUrl?: string;                 // S3/Cloud storage URL (if already uploaded)
  base64Data?: string;              // Base64 encoded file data (if sending inline)
  uploadedAt?: string;              // ISO timestamp
}

// ============================================
// RESPONSE DTO - What backend sends to frontend
// ============================================

export interface CompanyOnboardingResponseDTO {
  success: boolean;
  message: string;
  data: {
    applicationId: string;          // e.g., "APP-2024-001234"
    companyId?: string;             // Generated company ID
    status: ApplicationStatus;
    submittedAt: string;            // ISO timestamp
    estimatedApprovalTime: string;  // e.g., "24-48 hours"
  };
}

export enum ApplicationStatus {
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING_DOCUMENTS = "pending_documents"
}

// ============================================
// DATABASE ENTITY - For backend storage
// ============================================

export interface CompanyOnboardingEntity {
  id: string;                       // Primary key
  applicationId: string;            // Unique application ID
  
  // Company Information
  legalName: string;
  tradeName: string;
  gstNumber: string;
  panNumber: string;
  incorporationDate: Date;
  businessType: string;
  annualTurnover: number;
  numberOfEmployees: string;
  website?: string;
  
  // Address
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  
  // Contact Person
  contactPersonName: string;
  contactPersonDesignation: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  contactPersonAlternatePhone?: string;
  
  // Banking
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  accountType: string;
  branchName: string;
  requestedCreditLimit?: number;
  
  // Documents (Store URLs)
  gstCertificateUrl: string;
  panCardUrl: string;
  incorporationCertificateUrl: string;
  bankStatementUrl: string;
  addressProofUrl: string;
  cancelledChequeUrl: string;
  
  // Metadata
  status: ApplicationStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  reviewedBy?: string;
  
  // Audit fields
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

// ============================================
// VALIDATION DTO - For backend validation
// ============================================

export interface ValidationErrorDTO {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResponseDTO {
  valid: boolean;
  errors?: ValidationErrorDTO[];
}

// ============================================
// EXAMPLE USAGE IN EXPRESS/NESTJS
// ============================================

/**
 * Example Express Controller
 */
export class CompanyOnboardingController {
  
  // POST /api/onboarding/submit
  async submitOnboarding(req: any, res: any) {
    try {
      const requestData: CompanyOnboardingRequestDTO = req.body;
      
      // Validate the request
      const validation = this.validateRequest(requestData);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.errors
        });
      }
      
      // Process the onboarding
      const result = await this.processOnboarding(requestData);
      
      // Return response
      const response: CompanyOnboardingResponseDTO = {
        success: true,
        message: "Application submitted successfully",
        data: {
          applicationId: result.applicationId,
          companyId: result.companyId,
          status: ApplicationStatus.SUBMITTED,
          submittedAt: new Date().toISOString(),
          estimatedApprovalTime: "24-48 hours"
        }
      };
      
      return res.status(201).json(response);
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  // POST /api/onboarding/upload-document
  async uploadDocument(req: any, res: any) {
    try {
      const file = req.file; // Multer middleware
      const { documentType } = req.body;
      
      // Upload to S3/Cloud Storage
      const fileUrl = await this.uploadToCloud(file);
      
      return res.status(200).json({
        success: true,
        message: "Document uploaded successfully",
        data: {
          fileName: file.originalname,
          fileSize: file.size,
          fileType: file.mimetype,
          fileUrl: fileUrl
        }
      });
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message
      });
    }
  }
  
  // GET /api/onboarding/status/:applicationId
  async getApplicationStatus(req: any, res: any) {
    try {
      const { applicationId } = req.params;
      
      const application = await this.findByApplicationId(applicationId);
      
      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          applicationId: application.applicationId,
          status: application.status,
          submittedAt: application.submittedAt,
          reviewedAt: application.reviewedAt,
          approvedAt: application.approvedAt
        }
      });
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }
  
  private validateRequest(data: CompanyOnboardingRequestDTO): ValidationResponseDTO {
    const errors: ValidationErrorDTO[] = [];
    
    // GST validation
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(data.companyRegistration.gstNumber)) {
      errors.push({
        field: "companyRegistration.gstNumber",
        message: "Invalid GST number format",
        code: "INVALID_GST"
      });
    }
    
    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(data.companyRegistration.panNumber)) {
      errors.push({
        field: "companyRegistration.panNumber",
        message: "Invalid PAN number format",
        code: "INVALID_PAN"
      });
    }
    
    // IFSC validation
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(data.bankingDetails.ifscCode)) {
      errors.push({
        field: "bankingDetails.ifscCode",
        message: "Invalid IFSC code format",
        code: "INVALID_IFSC"
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactPerson.email)) {
      errors.push({
        field: "contactPerson.email",
        message: "Invalid email format",
        code: "INVALID_EMAIL"
      });
    }
    
    // Phone validation (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.contactPerson.phone)) {
      errors.push({
        field: "contactPerson.phone",
        message: "Invalid phone number format",
        code: "INVALID_PHONE"
      });
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
  
  private async processOnboarding(data: CompanyOnboardingRequestDTO): Promise<any> {
    // Implementation: Save to database, send notifications, etc.
    return {
      applicationId: `APP-${Date.now()}`,
      companyId: `COMP-${Date.now()}`
    };
  }
  
  private async uploadToCloud(file: any): Promise<string> {
    // Implementation: Upload to S3/Cloud Storage
    return `https://storage.example.com/${file.filename}`;
  }
  
  private async findByApplicationId(applicationId: string): Promise<any> {
    // Implementation: Query database
    return null;
  }
}

// ============================================
// EXAMPLE API ROUTES
// ============================================

/**
 * API Endpoints:
 * 
 * POST   /api/onboarding/submit
 * POST   /api/onboarding/upload-document
 * GET    /api/onboarding/status/:applicationId
 * GET    /api/onboarding/:applicationId
 * PUT    /api/onboarding/:applicationId
 * DELETE /api/onboarding/:applicationId
 * 
 * POST   /api/onboarding/validate-gst
 * POST   /api/onboarding/validate-bank
 * 
 * GET    /api/admin/onboarding/pending
 * PUT    /api/admin/onboarding/:applicationId/approve
 * PUT    /api/admin/onboarding/:applicationId/reject
 */
