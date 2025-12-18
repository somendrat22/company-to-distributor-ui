package com.example.b2b.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA Entity for Company Onboarding
 */
@Entity
@Table(name = "company_onboarding")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyOnboardingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", unique = true, nullable = false, length = 50)
    private String applicationId;

    @Column(name = "company_id", length = 50)
    private String companyId;

    // Company Registration Fields
    @Column(name = "legal_name", nullable = false, length = 200)
    private String legalName;

    @Column(name = "trade_name", nullable = false, length = 200)
    private String tradeName;

    @Column(name = "gst_number", unique = true, nullable = false, length = 15)
    private String gstNumber;

    @Column(name = "pan_number", unique = true, nullable = false, length = 10)
    private String panNumber;

    @Column(name = "incorporation_date", nullable = false)
    private LocalDate incorporationDate;

    @Column(name = "business_type", nullable = false, length = 50)
    private String businessType;

    @Column(name = "annual_turnover", precision = 15, scale = 2)
    private BigDecimal annualTurnover;

    @Column(name = "number_of_employees", length = 50)
    private String numberOfEmployees;

    @Column(name = "website", length = 255)
    private String website;

    // Business Address Fields
    @Column(name = "address_line1", nullable = false, length = 200)
    private String addressLine1;

    @Column(name = "address_line2", length = 200)
    private String addressLine2;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @Column(name = "pincode", nullable = false, length = 6)
    private String pincode;

    @Column(name = "country", nullable = false, length = 100)
    private String country;

    // Contact Person Fields
    @Column(name = "contact_person_name", nullable = false, length = 100)
    private String contactPersonName;

    @Column(name = "contact_person_designation", nullable = false, length = 100)
    private String contactPersonDesignation;

    @Column(name = "contact_person_email", nullable = false, length = 100)
    private String contactPersonEmail;

    @Column(name = "contact_person_phone", nullable = false, length = 10)
    private String contactPersonPhone;

    @Column(name = "contact_person_alternate_phone", length = 10)
    private String contactPersonAlternatePhone;

    // Banking Details Fields
    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName;

    @Column(name = "account_number", nullable = false, length = 18)
    private String accountNumber;

    @Column(name = "ifsc_code", nullable = false, length = 11)
    private String ifscCode;

    @Column(name = "account_holder_name", nullable = false, length = 200)
    private String accountHolderName;

    @Column(name = "account_type", nullable = false, length = 20)
    private String accountType;

    @Column(name = "branch_name", nullable = false, length = 200)
    private String branchName;

    @Column(name = "requested_credit_limit", precision = 15, scale = 2)
    private BigDecimal requestedCreditLimit;

    // Document URLs
    @Column(name = "gst_certificate_url", length = 500)
    private String gstCertificateUrl;

    @Column(name = "pan_card_url", length = 500)
    private String panCardUrl;

    @Column(name = "incorporation_certificate_url", length = 500)
    private String incorporationCertificateUrl;

    @Column(name = "bank_statement_url", length = 500)
    private String bankStatementUrl;

    @Column(name = "address_proof_url", length = 500)
    private String addressProofUrl;

    @Column(name = "cancelled_cheque_url", length = 500)
    private String cancelledChequeUrl;

    // Status and Workflow Fields
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private ApplicationStatus status;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @Column(name = "reviewed_by", length = 100)
    private String reviewedBy;

    // Audit Fields
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    /**
     * Application Status Enum
     */
    public enum ApplicationStatus {
        SUBMITTED,
        UNDER_REVIEW,
        APPROVED,
        REJECTED,
        PENDING_DOCUMENTS
    }
}
