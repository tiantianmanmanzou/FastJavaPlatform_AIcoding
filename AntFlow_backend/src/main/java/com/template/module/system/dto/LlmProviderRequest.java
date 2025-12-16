package com.template.module.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import lombok.Data;

@Data
public class LlmProviderRequest {

    @NotBlank
    private String providerCode;

    @NotBlank
    private String providerName;

    @NotBlank
    private String providerType;

    private String vendor;
    private String modelName;
    private String baseUrl;
    private String apiKey;
    private String apiVersion;

    @NotNull
    private Integer status;

    private Integer defaultFlag;
    private Integer concurrencyLimit;
    private Integer timeoutSeconds;
    private String capabilityTags;
    private String description;
    private String metadata;
    private Map<String, String> apiParams;
}
