package com.template.module.system.dto;

import lombok.Data;

@Data
public class LlmProviderQueryRequest {

    private long page = 1;
    private long pageSize = 10;
    private String keyword;
    private Integer status;
    private String providerType;
}
