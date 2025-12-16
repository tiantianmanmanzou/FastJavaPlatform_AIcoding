package com.template.module.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductImageRequest {

    @NotBlank(message = "产品图URL不能为空")
    private String imageUrl;

    private Boolean primary;
}
