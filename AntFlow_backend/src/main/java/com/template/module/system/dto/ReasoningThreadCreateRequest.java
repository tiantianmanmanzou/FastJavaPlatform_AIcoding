package com.template.module.system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReasoningThreadCreateRequest {

    @NotBlank
    private String threadName;

    private String providerCode;
    private String modelName;
    private String metadata;
}
