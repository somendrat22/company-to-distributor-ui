package com.example.b2b.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.time.LocalDate;

/**
 * Main DTO for Company Onboarding Request
 * Receives data from frontend and validates it
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyOnboardingRequestDTO {

    @Valid
    @NotNull(message = "Company registration details are required")
    @JsonProperty("companyRegistration")
    private CompanyRegistrationDTO companyRegistration;

    @Valid
    @NotNull(message = "Business address is required")
    @JsonProperty("businessAddress")
    private BusinessAddressDTO businessAddress;

    @Valid
    @NotNull(message = "Contact person details are required")
    @JsonProperty("contactPerson")
    private ContactPersonDTO contactPerson;

    @Valid
    @NotNull(message = "Banking details are required")
    @JsonProperty("bankingDetails")
    private BankingDetailsDTO bankingDetails;

    @Valid
    @NotNull(message = "Documents are required")
    @JsonProperty("documents")
    private DocumentsDTO documents;

    /**
     * Nested DTO for Company Registration
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyRegistrationDTO {

        @NotBlank(message = "Legal name is required")
        @Size(min = 3, max = 200, message = "Legal name must be between 3 and 200 characters")
        @JsonProperty("legalName")
        private String legalName;

        @NotBlank(message = "Trade name is required")
        @Size(min = 3, max = 200, message = "Trade name must be between 3 and 200 characters")
        @JsonProperty("tradeName")
        private String tradeName;

        @NotBlank(message = "GST number is required")
        @Pattern(regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", 
                 message = "Invalid GST number format")
        @JsonProperty("gstNumber")
        private String gstNumber;

        @NotBlank(message = "PAN number is required")
        @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", 
                 message = "Invalid PAN number format")
        @JsonProperty("panNumber")
        private String panNumber;

        @NotNull(message = "Incorporation date is required")
        @PastOrPresent(message = "Incorporation date cannot be in the future")
        @JsonProperty("incorporationDate")
        private LocalDate incorporationDate;

        @NotBlank(message = "Business type is required")
        @Pattern(regexp = "^(manufacturer|wholesaler|distributor|retailer)$", 
                 message = "Invalid business type")
        @JsonProperty("businessType")
        private String businessType;

        @NotBlank(message = "Annual turnover is required")
        @Pattern(regexp = "^[0-9]+$", message = "Annual turnover must be numeric")
        @JsonProperty("annualTurnover")
        private String annualTurnover;

        @NotBlank(message = "Number of employees is required")
        @JsonProperty("numberOfEmployees")
        private String numberOfEmployees;

        @Pattern(regexp = "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$", 
                 message = "Invalid website URL")
        @JsonProperty("website")
        private String website;
    }

    /**
     * Nested DTO for Business Address
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BusinessAddressDTO {

        @NotBlank(message = "Address line 1 is required")
        @Size(min = 5, max = 200, message = "Address line 1 must be between 5 and 200 characters")
        @JsonProperty("addressLine1")
        private String addressLine1;

        @Size(max = 200, message = "Address line 2 must not exceed 200 characters")
        @JsonProperty("addressLine2")
        private String addressLine2;

        @NotBlank(message = "City is required")
        @Size(min = 2, max = 100, message = "City must be between 2 and 100 characters")
        @JsonProperty("city")
        private String city;

        @NotBlank(message = "State is required")
        @Size(min = 2, max = 100, message = "State must be between 2 and 100 characters")
        @JsonProperty("state")
        private String state;

        @NotBlank(message = "Pincode is required")
        @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Invalid pincode format")
        @JsonProperty("pincode")
        private String pincode;

        @NotBlank(message = "Country is required")
        @JsonProperty("country")
        private String country;
    }

    /**
     * Nested DTO for Contact Person
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContactPersonDTO {

        @NotBlank(message = "Full name is required")
        @Size(min = 3, max = 100, message = "Full name must be between 3 and 100 characters")
        @JsonProperty("fullName")
        private String fullName;

        @NotBlank(message = "Designation is required")
        @Size(min = 2, max = 100, message = "Designation must be between 2 and 100 characters")
        @JsonProperty("designation")
        private String designation;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @JsonProperty("email")
        private String email;

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number format")
        @JsonProperty("phone")
        private String phone;

        @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid alternate phone number format")
        @JsonProperty("alternatePhone")
        private String alternatePhone;
    }

    /**
     * Nested DTO for Banking Details
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BankingDetailsDTO {

        @NotBlank(message = "Bank name is required")
        @Size(min = 3, max = 100, message = "Bank name must be between 3 and 100 characters")
        @JsonProperty("bankName")
        private String bankName;

        @NotBlank(message = "Account number is required")
        @Pattern(regexp = "^[0-9]{9,18}$", message = "Invalid account number format")
        @JsonProperty("accountNumber")
        private String accountNumber;

        @NotBlank(message = "IFSC code is required")
        @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC code format")
        @JsonProperty("ifscCode")
        private String ifscCode;

        @NotBlank(message = "Account holder name is required")
        @Size(min = 3, max = 200, message = "Account holder name must be between 3 and 200 characters")
        @JsonProperty("accountHolderName")
        private String accountHolderName;

        @NotBlank(message = "Account type is required")
        @Pattern(regexp = "^(current|savings)$", message = "Account type must be 'current' or 'savings'")
        @JsonProperty("accountType")
        private String accountType;

        @NotBlank(message = "Branch name is required")
        @Size(min = 3, max = 200, message = "Branch name must be between 3 and 200 characters")
        @JsonProperty("branchName")
        private String branchName;

        @Pattern(regexp = "^[0-9]+$", message = "Credit limit must be numeric")
        @JsonProperty("requestedCreditLimit")
        private String requestedCreditLimit;
    }

    /**
     * Nested DTO for Documents
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocumentsDTO {

        @Valid
        @NotNull(message = "GST certificate is required")
        @JsonProperty("gstCertificate")
        private FileUploadDTO gstCertificate;

        @Valid
        @NotNull(message = "PAN card is required")
        @JsonProperty("panCard")
        private FileUploadDTO panCard;

        @Valid
        @NotNull(message = "Incorporation certificate is required")
        @JsonProperty("incorporationCertificate")
        private FileUploadDTO incorporationCertificate;

        @Valid
        @NotNull(message = "Bank statement is required")
        @JsonProperty("bankStatement")
        private FileUploadDTO bankStatement;

        @Valid
        @NotNull(message = "Address proof is required")
        @JsonProperty("addressProof")
        private FileUploadDTO addressProof;

        @Valid
        @NotNull(message = "Cancelled cheque is required")
        @JsonProperty("cancelledCheque")
        private FileUploadDTO cancelledCheque;
    }

    /**
     * Nested DTO for File Upload
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileUploadDTO {

        @NotBlank(message = "File name is required")
        @JsonProperty("fileName")
        private String fileName;

        @NotNull(message = "File size is required")
        @Min(value = 1, message = "File size must be greater than 0")
        @Max(value = 10485760, message = "File size must not exceed 10MB")
        @JsonProperty("fileSize")
        private Long fileSize;

        @NotBlank(message = "File type is required")
        @JsonProperty("fileType")
        private String fileType;

        @JsonProperty("fileUrl")
        private String fileUrl;

        @JsonProperty("base64Data")
        private String base64Data;

        @JsonProperty("uploadedAt")
        private String uploadedAt;
    }
}
