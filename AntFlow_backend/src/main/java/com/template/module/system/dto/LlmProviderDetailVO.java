package com.template.module.system.dto;

import java.time.LocalDateTime;
import java.util.Map;
import lombok.Data;

@Data
public class LlmProviderDetailVO {

    private Long id;
    private String providerCode;
    private String providerName;
    private String providerType;
    private String vendor;
    private String modelName;
    private String baseUrl;
    private String apiKey;
    private String apiVersion;
    private Integer status;
    private Integer defaultFlag;
    private Integer concurrencyLimit;
    private Integer timeoutSeconds;
    private String capabilityTags;
    private String description;
    private String metadata;
    private LocalDateTime lastSyncedAt;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Map<String, String> apiParams;
}
