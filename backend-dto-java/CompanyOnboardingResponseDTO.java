package com.example.b2b.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for Company Onboarding
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyOnboardingResponseDTO {

    @JsonProperty("success")
    private Boolean success;

    @JsonProperty("message")
    private String message;

    @JsonProperty("data")
    private OnboardingData data;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OnboardingData {

        @JsonProperty("applicationId")
        private String applicationId;

        @JsonProperty("companyId")
        private String companyId;

        @JsonProperty("status")
        private String status;

        @JsonProperty("submittedAt")
        private LocalDateTime submittedAt;

        @JsonProperty("estimatedApprovalTime")
        private String estimatedApprovalTime;
    }
}
