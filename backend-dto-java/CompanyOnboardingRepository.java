package com.example.b2b.repository;

import com.example.b2b.entity.CompanyOnboardingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * JPA Repository for Company Onboarding
 */
@Repository
public interface CompanyOnboardingRepository extends JpaRepository<CompanyOnboardingEntity, Long> {

    /**
     * Find by application ID
     */
    Optional<CompanyOnboardingEntity> findByApplicationId(String applicationId);

    /**
     * Find by company ID
     */
    Optional<CompanyOnboardingEntity> findByCompanyId(String companyId);

    /**
     * Check if GST number exists
     */
    boolean existsByGstNumber(String gstNumber);

    /**
     * Check if PAN number exists
     */
    boolean existsByPanNumber(String panNumber);

    /**
     * Find by GST number
     */
    Optional<CompanyOnboardingEntity> findByGstNumber(String gstNumber);

    /**
     * Find by PAN number
     */
    Optional<CompanyOnboardingEntity> findByPanNumber(String panNumber);

    /**
     * Find by status
     */
    java.util.List<CompanyOnboardingEntity> findByStatus(CompanyOnboardingEntity.ApplicationStatus status);

    /**
     * Find by contact email
     */
    Optional<CompanyOnboardingEntity> findByContactPersonEmail(String email);
}
