package com.template.module.content.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContentModuleUpdateRequest {

    @NotBlank(message = "模块标题不能为空")
    private String moduleTitle;

    private Long templateId;
    private String prompt;
    private String tone;
    private String style;
    private String contentLength;
    private String imageStyle;
    private String imageRatio;
    private Integer imageQuantity;
    private String videoStyle;
    private String videoRatio;
    private Integer videoDuration;
    private String apiVendor;
    private Integer sortOrder;
    private String status;
}
