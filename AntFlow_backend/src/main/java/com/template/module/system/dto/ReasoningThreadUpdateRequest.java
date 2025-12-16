package com.template.module.system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReasoningThreadUpdateRequest {

    @NotBlank
    private String threadName;

    private String status;
    private String metadata;
}
