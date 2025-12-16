package com.template.module.content.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContentTemplateUpdateRequest {

    @NotBlank(message = "模板名称不能为空")
    private String templateName;

    @NotBlank(message = "平台不能为空")
    private String platform;

    @NotBlank(message = "模块类型不能为空")
    private String moduleType;

    private String description;
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
    private String apiName;
}
