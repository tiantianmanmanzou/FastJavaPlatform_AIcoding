package com.template.module.product.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.Data;

@Data
public class ProductCreateRequest {

    @NotBlank(message = "产品名称不能为空")
    private String productName;

    private String productCode;

    @NotBlank(message = "产品类型不能为空")
    private String productType;

    private String description;

    private String coverImageUrl;

    private String originImageUrl;

    private List<String> tags;

    private Integer status;
}
