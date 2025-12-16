package com.template.module.system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReasoningThreadMessageCreateRequest {

    @NotBlank
    private String role;

    @NotBlank
    private String content;

    private Integer tokenUsage;

    private Integer latencyMillis;
}
