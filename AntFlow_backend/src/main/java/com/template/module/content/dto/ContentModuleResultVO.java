package com.template.module.content.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContentModuleResultVO {

    private Long id;
    private Long moduleId;
    private String resultType;
    private String content;
    private String assetUrl;
    private Integer sortOrder;
}
