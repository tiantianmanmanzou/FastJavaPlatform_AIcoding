package com.template.module.product.dto;

import lombok.Data;

@Data
public class ProductQueryRequest {

    private long page = 1;

    private long pageSize = 10;

    private String keyword;

    private String productType;

    private Integer status;
}
