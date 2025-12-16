package com.template.module.system.dto;

import java.util.List;
import lombok.Data;

@Data
public class LlmParamTemplateVO {
    private String vendor;
    private String generationType;
    private String paramKey;
    private String paramLabel;
    private String inputType;
    private Integer required;
    private String placeholder;
    private String defaultValue;
    private String description;
    private List<LlmParamOptionVO> options;
    private Integer sortOrder;
}
