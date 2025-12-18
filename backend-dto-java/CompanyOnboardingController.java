package com.example.b2b.controller;

import com.example.b2b.dto.request.CompanyOnboardingRequestDTO;
import com.example.b2b.dto.response.CompanyOnboardingResponseDTO;
import com.example.b2b.service.CompanyOnboardingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for Company Onboarding
 */
@Slf4j
@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
@Validated
public class CompanyOnboardingController {

    private final CompanyOnboardingService onboardingService;

    /**
     * Submit company onboarding application
     * POST /api/onboarding/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<CompanyOnboardingResponseDTO> submitOnboarding(
            @Valid @RequestBody CompanyOnboardingRequestDTO request) {
        
        log.info("Received onboarding request for company: {}", request.getCompanyRegistration().getLegalName());
        
        try {
            CompanyOnboardingResponseDTO response = onboardingService.processOnboarding(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Error processing onboarding: ", e);
            
            CompanyOnboardingResponseDTO errorResponse = CompanyOnboardingResponseDTO.builder()
                    .success(false)
                    .message("Failed to process onboarding: " + e.getMessage())
                    .build();
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Upload document
     * POST /api/onboarding/upload-document
     */
    @PostMapping("/upload-document")
    public ResponseEntity<Map<String, Object>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType) {
        
        log.info("Uploading document: {} of type: {}", file.getOriginalFilename(), documentType);
        
        try {
            String fileUrl = onboardingService.uploadDocument(file, documentType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Document uploaded successfully");
            
            Map<String, Object> data = new HashMap<>();
            data.put("fileName", file.getOriginalFilename());
            data.put("fileSize", file.getSize());
            data.put("fileType", file.getContentType());
            data.put("fileUrl", fileUrl);
            
            response.put("data", data);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error uploading document: ", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to upload document: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get application status
     * GET /api/onboarding/status/{applicationId}
     */
    @GetMapping("/status/{applicationId}")
    public ResponseEntity<Map<String, Object>> getApplicationStatus(
            @PathVariable String applicationId) {
        
        log.info("Fetching status for application: {}", applicationId);
        
        try {
            Map<String, Object> status = onboardingService.getApplicationStatus(applicationId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", status);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching application status: ", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Application not found");
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    /**
     * Get application details
     * GET /api/onboarding/{applicationId}
     */
    @GetMapping("/{applicationId}")
    public ResponseEntity<Map<String, Object>> getApplicationDetails(
            @PathVariable String applicationId) {
        
        log.info("Fetching details for application: {}", applicationId);
        
        try {
            Map<String, Object> details = onboardingService.getApplicationDetails(applicationId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", details);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching application details: ", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Application not found");
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    /**
     * Validate GST number
     * POST /api/onboarding/validate-gst
     */
    @PostMapping("/validate-gst")
    public ResponseEntity<Map<String, Object>> validateGST(
            @RequestParam String gstNumber) {
        
        log.info("Validating GST number: {}", gstNumber);
        
        try {
            boolean isValid = onboardingService.validateGSTNumber(gstNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("valid", isValid);
            response.put("message", isValid ? "GST number is valid" : "GST number already exists");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error validating GST: ", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Validation failed");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Validate bank account
     * POST /api/onboarding/validate-bank
     */
    @PostMapping("/validate-bank")
    public ResponseEntity<Map<String, Object>> validateBankAccount(
            @RequestParam String accountNumber,
            @RequestParam String ifscCode) {
        
        log.info("Validating bank account: {} with IFSC: {}", accountNumber, ifscCode);
        
        try {
            boolean isValid = onboardingService.validateBankAccount(accountNumber, ifscCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("valid", isValid);
            response.put("message", isValid ? "Bank account is valid" : "Invalid bank account details");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error validating bank account: ", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Validation failed");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
