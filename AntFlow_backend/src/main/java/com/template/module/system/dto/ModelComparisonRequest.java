package com.template.module.system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ModelComparisonRequest {

    @NotBlank
    private String comparisonName;

    @NotBlank
    private String prompt;

    private String providerA;
    private String modelA;
    private String providerB;
    private String modelB;
    private String evaluationCriteria;
    private String createdBy;
}
