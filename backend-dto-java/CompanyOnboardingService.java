package com.example.b2b.service;

import com.example.b2b.dto.request.CompanyOnboardingRequestDTO;
import com.example.b2b.dto.response.CompanyOnboardingResponseDTO;
import com.example.b2b.entity.CompanyOnboardingEntity;
import com.example.b2b.repository.CompanyOnboardingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Service for Company Onboarding Business Logic
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CompanyOnboardingService {

    private final CompanyOnboardingRepository onboardingRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    /**
     * Process company onboarding application
     */
    @Transactional
    public CompanyOnboardingResponseDTO processOnboarding(CompanyOnboardingRequestDTO request) {
        
        log.info("Processing onboarding for company: {}", request.getCompanyRegistration().getLegalName());
        
        // Generate unique IDs
        String applicationId = generateApplicationId();
        String companyId = generateCompanyId();
        
        // Create entity
        CompanyOnboardingEntity entity = mapRequestToEntity(request, applicationId, companyId);
        
        // Save to database
        CompanyOnboardingEntity savedEntity = onboardingRepository.save(entity);
        
        // Send notification email
        notificationService.sendOnboardingSubmissionEmail(savedEntity);
        
        // Build response
        return CompanyOnboardingResponseDTO.builder()
                .success(true)
                .message("Application submitted successfully")
                .data(CompanyOnboardingResponseDTO.OnboardingData.builder()
                        .applicationId(applicationId)
                        .companyId(companyId)
                        .status(CompanyOnboardingEntity.ApplicationStatus.SUBMITTED.name())
                        .submittedAt(LocalDateTime.now())
                        .estimatedApprovalTime("24-48 hours")
                        .build())
                .build();
    }

    /**
     * Upload document to cloud storage
     */
    public String uploadDocument(MultipartFile file, String documentType) throws Exception {
        
        log.info("Uploading document: {} of type: {}", file.getOriginalFilename(), documentType);
        
        // Validate file
        validateFile(file);
        
        // Upload to S3/Cloud Storage
        String fileUrl = fileStorageService.uploadFile(file, documentType);
        
        log.info("Document uploaded successfully: {}", fileUrl);
        
        return fileUrl;
    }

    /**
     * Get application status
     */
    public Map<String, Object> getApplicationStatus(String applicationId) {
        
        CompanyOnboardingEntity entity = onboardingRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        Map<String, Object> status = new HashMap<>();
        status.put("applicationId", entity.getApplicationId());
        status.put("status", entity.getStatus().name());
        status.put("submittedAt", entity.getSubmittedAt());
        status.put("reviewedAt", entity.getReviewedAt());
        status.put("approvedAt", entity.getApprovedAt());
        
        return status;
    }

    /**
     * Get application details
     */
    public Map<String, Object> getApplicationDetails(String applicationId) {
        
        CompanyOnboardingEntity entity = onboardingRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        // Map entity to response map
        Map<String, Object> details = new HashMap<>();
        details.put("applicationId", entity.getApplicationId());
        details.put("companyId", entity.getCompanyId());
        details.put("legalName", entity.getLegalName());
        details.put("tradeName", entity.getTradeName());
        details.put("status", entity.getStatus().name());
        // Add more fields as needed
        
        return details;
    }

    /**
     * Validate GST number (check if already exists)
     */
    public boolean validateGSTNumber(String gstNumber) {
        return !onboardingRepository.existsByGstNumber(gstNumber);
    }

    /**
     * Validate bank account
     */
    public boolean validateBankAccount(String accountNumber, String ifscCode) {
        // Implement bank account validation logic
        // This could call an external API for verification
        return true;
    }

    /**
     * Map request DTO to entity
     */
    private CompanyOnboardingEntity mapRequestToEntity(
            CompanyOnboardingRequestDTO request, 
            String applicationId, 
            String companyId) {
        
        CompanyOnboardingRequestDTO.CompanyRegistrationDTO companyReg = request.getCompanyRegistration();
        CompanyOnboardingRequestDTO.BusinessAddressDTO address = request.getBusinessAddress();
        CompanyOnboardingRequestDTO.ContactPersonDTO contact = request.getContactPerson();
        CompanyOnboardingRequestDTO.BankingDetailsDTO banking = request.getBankingDetails();
        CompanyOnboardingRequestDTO.DocumentsDTO documents = request.getDocuments();
        
        return CompanyOnboardingEntity.builder()
                .applicationId(applicationId)
                .companyId(companyId)
                // Company Registration
                .legalName(companyReg.getLegalName())
                .tradeName(companyReg.getTradeName())
                .gstNumber(companyReg.getGstNumber())
                .panNumber(companyReg.getPanNumber())
                .incorporationDate(companyReg.getIncorporationDate())
                .businessType(companyReg.getBusinessType())
                .annualTurnover(new BigDecimal(companyReg.getAnnualTurnover()))
                .numberOfEmployees(companyReg.getNumberOfEmployees())
                .website(companyReg.getWebsite())
                // Business Address
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .country(address.getCountry())
                // Contact Person
                .contactPersonName(contact.getFullName())
                .contactPersonDesignation(contact.getDesignation())
                .contactPersonEmail(contact.getEmail())
                .contactPersonPhone(contact.getPhone())
                .contactPersonAlternatePhone(contact.getAlternatePhone())
                // Banking Details
                .bankName(banking.getBankName())
                .accountNumber(banking.getAccountNumber())
                .ifscCode(banking.getIfscCode())
                .accountHolderName(banking.getAccountHolderName())
                .accountType(banking.getAccountType())
                .branchName(banking.getBranchName())
                .requestedCreditLimit(banking.getRequestedCreditLimit() != null ? 
                        new BigDecimal(banking.getRequestedCreditLimit()) : null)
                // Documents
                .gstCertificateUrl(documents.getGstCertificate().getFileUrl())
                .panCardUrl(documents.getPanCard().getFileUrl())
                .incorporationCertificateUrl(documents.getIncorporationCertificate().getFileUrl())
                .bankStatementUrl(documents.getBankStatement().getFileUrl())
                .addressProofUrl(documents.getAddressProof().getFileUrl())
                .cancelledChequeUrl(documents.getCancelledCheque().getFileUrl())
                // Status
                .status(CompanyOnboardingEntity.ApplicationStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        // Check file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 10MB limit");
        }
        
        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || 
            (!contentType.equals("application/pdf") && 
             !contentType.startsWith("image/"))) {
            throw new RuntimeException("Invalid file type. Only PDF and images are allowed");
        }
    }

    /**
     * Generate unique application ID
     */
    private String generateApplicationId() {
        return "APP-" + System.currentTimeMillis();
    }

    /**
     * Generate unique company ID
     */
    private String generateCompanyId() {
        return "COMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
