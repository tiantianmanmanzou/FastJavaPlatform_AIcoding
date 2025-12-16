package com.template.module.product.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductVO {

    private Long id;
    private String productName;
    private String productCode;
    private String productType;
    private String description;
    private List<String> tags;
    private Integer status;
    private List<ProductImageVO> images;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
