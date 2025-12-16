package com.template.module.system.dto;

import lombok.Data;

@Data
public class ModelComparisonQueryRequest {

    private long page = 1;
    private long pageSize = 10;
    private String keyword;
    private String status;
}
