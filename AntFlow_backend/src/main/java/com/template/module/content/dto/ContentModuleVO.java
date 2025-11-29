package com.template.module.content.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContentModuleVO {

    private Long id;
    private Long productId;
    private String platform;
    private String moduleType;
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
    private LocalDateTime lastGeneratedAt;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private List<ContentModuleResultVO> results;
}
