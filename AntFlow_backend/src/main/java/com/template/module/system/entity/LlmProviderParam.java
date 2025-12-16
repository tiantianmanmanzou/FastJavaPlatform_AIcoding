package com.template.module.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("sys_llm_provider_param")
public class LlmProviderParam {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long providerId;
    private String paramKey;
    private String paramValue;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
