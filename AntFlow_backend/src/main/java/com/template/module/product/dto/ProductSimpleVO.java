package com.template.module.product.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductSimpleVO {

    private Long id;
    private String productName;
    private String productType;
    private String coverImageUrl;
    private String originImageUrl;
    private String description;
}
