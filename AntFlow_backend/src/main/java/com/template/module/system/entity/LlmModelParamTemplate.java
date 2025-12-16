package com.template.module.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("sys_llm_model_param_template")
public class LlmModelParamTemplate {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String vendor;
    private String generationType;
    private String paramKey;
    private String paramLabel;
    private String inputType;
    private Integer required;
    private String placeholder;
    private String defaultValue;
    private String options;
    private String description;
    private Integer sortOrder;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
