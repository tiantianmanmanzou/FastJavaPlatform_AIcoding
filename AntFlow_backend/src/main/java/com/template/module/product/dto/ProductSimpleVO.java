package com.template.module.product.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductSimpleVO {

    private Long id;
    private String productName;
    private String productType;
    private String description;
    private String mainImageUrl;
    private Integer imageCount;
    private List<String> imageUrls;
}
