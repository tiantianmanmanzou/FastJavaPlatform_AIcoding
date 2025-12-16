package com.template.module.content.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContentTemplateVO {

    private Long id;
    private String templateName;
    private String platform;
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
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
