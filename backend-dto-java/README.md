# Java Backend DTOs for Company Onboarding

## Overview
Complete Java/Spring Boot backend implementation for the Company Onboarding flow.

## Project Structure

```
backend-dto-java/
├── CompanyOnboardingRequestDTO.java    # Request DTO with validation
├── CompanyOnboardingResponseDTO.java   # Response DTO
├── CompanyOnboardingEntity.java        # JPA Entity
├── CompanyOnboardingController.java    # REST Controller
├── CompanyOnboardingService.java       # Business Logic
├── CompanyOnboardingRepository.java    # JPA Repository
├── pom.xml                             # Maven dependencies
└── README.md                           # This file
```

## Technologies Used

- **Spring Boot 2.7.14**
- **Spring Data JPA** - Database operations
- **Spring Validation** - Request validation
- **Lombok** - Reduce boilerplate code
- **MySQL/PostgreSQL** - Database
- **AWS S3** - File storage
- **Jackson** - JSON serialization

## API Endpoints

### 1. Submit Onboarding Application
```http
POST /api/onboarding/submit
Content-Type: application/json

{
  "companyRegistration": { ... },
  "businessAddress": { ... },
  "contactPerson": { ... },
  "bankingDetails": { ... },
  "documents": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "applicationId": "APP-1702825740000",
    "companyId": "COMP-A1B2C3D4",
    "status": "SUBMITTED",
    "submittedAt": "2024-12-17T15:39:00",
    "estimatedApprovalTime": "24-48 hours"
  }
}
```

### 2. Upload Document
```http
POST /api/onboarding/upload-document
Content-Type: multipart/form-data

file: <binary>
documentType: gstCertificate
```

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "fileName": "gst-certificate.pdf",
    "fileSize": 1048576,
    "fileType": "application/pdf",
    "fileUrl": "https://s3.amazonaws.com/bucket/documents/gst-cert-123.pdf"
  }
}
```

### 3. Get Application Status
```http
GET /api/onboarding/status/{applicationId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "APP-1702825740000",
    "status": "UNDER_REVIEW",
    "submittedAt": "2024-12-17T15:39:00",
    "reviewedAt": "2024-12-18T10:30:00"
  }
}
```

### 4. Validate GST Number
```http
POST /api/onboarding/validate-gst?gstNumber=22AAAAA0000A1Z5
```

### 5. Validate Bank Account
```http
POST /api/onboarding/validate-bank?accountNumber=1234567890&ifscCode=SBIN0001234
```

## Database Schema

```sql
CREATE TABLE company_onboarding (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(50) UNIQUE NOT NULL,
    company_id VARCHAR(50),
    
    -- Company Registration
    legal_name VARCHAR(200) NOT NULL,
    trade_name VARCHAR(200) NOT NULL,
    gst_number VARCHAR(15) UNIQUE NOT NULL,
    pan_number VARCHAR(10) UNIQUE NOT NULL,
    incorporation_date DATE NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    annual_turnover DECIMAL(15,2),
    number_of_employees VARCHAR(50),
    website VARCHAR(255),
    
    -- Business Address
    address_line1 VARCHAR(200) NOT NULL,
    address_line2 VARCHAR(200),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    country VARCHAR(100) NOT NULL,
    
    -- Contact Person
    contact_person_name VARCHAR(100) NOT NULL,
    contact_person_designation VARCHAR(100) NOT NULL,
    contact_person_email VARCHAR(100) NOT NULL,
    contact_person_phone VARCHAR(10) NOT NULL,
    contact_person_alternate_phone VARCHAR(10),
    
    -- Banking Details
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(18) NOT NULL,
    ifsc_code VARCHAR(11) NOT NULL,
    account_holder_name VARCHAR(200) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    branch_name VARCHAR(200) NOT NULL,
    requested_credit_limit DECIMAL(15,2),
    
    -- Document URLs
    gst_certificate_url VARCHAR(500),
    pan_card_url VARCHAR(500),
    incorporation_certificate_url VARCHAR(500),
    bank_statement_url VARCHAR(500),
    address_proof_url VARCHAR(500),
    cancelled_cheque_url VARCHAR(500),
    
    -- Status & Workflow
    status VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason VARCHAR(500),
    reviewed_by VARCHAR(100),
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    INDEX idx_application_id (application_id),
    INDEX idx_gst_number (gst_number),
    INDEX idx_pan_number (pan_number),
    INDEX idx_status (status)
);
```

## Validation Rules

### Company Registration
- **GST Number**: `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`
- **PAN Number**: `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`
- **Business Type**: `manufacturer | wholesaler | distributor | retailer`

### Business Address
- **Pincode**: `^[1-9][0-9]{5}$` (6 digits, not starting with 0)

### Contact Person
- **Email**: Valid email format
- **Phone**: `^[6-9]\\d{9}$` (10 digits, starts with 6-9)

### Banking Details
- **IFSC Code**: `^[A-Z]{4}0[A-Z0-9]{6}$`
- **Account Number**: `^[0-9]{9,18}$`
- **Account Type**: `current | savings`

### Documents
- **File Size**: Max 10MB
- **File Types**: PDF, JPG, JPEG, PNG

## Configuration

### application.properties
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/b2b_fmcg
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB

# AWS S3
aws.s3.bucket-name=b2b-fmcg-documents
aws.s3.region=ap-south-1
aws.access-key-id=YOUR_ACCESS_KEY
aws.secret-access-key=YOUR_SECRET_KEY

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-password
```

## Usage

### 1. Add Dependencies
Copy `pom.xml` to your Spring Boot project.

### 2. Create Package Structure
```
src/main/java/com/example/b2b/
├── controller/
│   └── CompanyOnboardingController.java
├── service/
│   └── CompanyOnboardingService.java
├── repository/
│   └── CompanyOnboardingRepository.java
├── entity/
│   └── CompanyOnboardingEntity.java
└── dto/
    ├── request/
    │   └── CompanyOnboardingRequestDTO.java
    └── response/
        └── CompanyOnboardingResponseDTO.java
```

### 3. Run Application
```bash
mvn spring-boot:run
```

### 4. Test API
```bash
curl -X POST http://localhost:8080/api/onboarding/submit \
  -H "Content-Type: application/json" \
  -d @request.json
```

## Error Handling

All validation errors return:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "companyRegistration.gstNumber",
      "message": "Invalid GST number format",
      "code": "INVALID_GST"
    }
  ]
}
```

## Security Considerations

1. Add Spring Security for authentication
2. Implement JWT tokens
3. Add rate limiting
4. Encrypt sensitive data
5. Use HTTPS in production
6. Implement CORS properly
7. Add request logging
8. Implement audit trails

## Next Steps

1. Add Spring Security
2. Implement file virus scanning
3. Add email notifications
4. Create admin approval workflow
5. Add analytics and reporting
6. Implement caching with Redis
7. Add API documentation with Swagger
8. Write unit and integration tests

## Support

For questions or issues, contact: support@example.com
