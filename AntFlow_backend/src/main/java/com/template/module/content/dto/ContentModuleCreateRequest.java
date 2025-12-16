package com.template.module.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ContentModuleCreateRequest {

    @NotNull(message = "产品ID不能为空")
    private Long productId;

    @NotBlank(message = "平台不能为空")
    private String platform;

    @NotBlank(message = "模块类型不能为空")
    private String moduleType;

    @NotBlank(message = "模块标题不能为空")
    private String moduleTitle;

    private Long templateId;
    private String prompt;
    private String tone;
    private String style;
    private String contentLength;
    private String subjectImageUrl;
    private String imageStyle;
    private String imageRatio;
    private Integer imageQuantity;
    private String videoStyle;
    private String videoRatio;
    private Integer videoDuration;
    private String apiVendor;
    private String apiName;
    private Integer sortOrder;
}
