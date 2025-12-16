package com.template.module.product.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductImageVO {

    private Long id;
    private String imageUrl;
    private Boolean primary;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
