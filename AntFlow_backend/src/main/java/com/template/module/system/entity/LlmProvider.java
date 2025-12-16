package com.template.module.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import java.util.Map;
import lombok.Data;

@Data
@TableName("sys_llm_provider")
public class LlmProvider {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String providerCode;
    private String providerName;
    private String providerType;
    private String vendor;
    private String modelName;
    private String baseUrl;
    private String apiKey;
    private String apiVersion;
    private Integer status;
    private Integer defaultFlag;
    private Integer concurrencyLimit;
    private Integer timeoutSeconds;
    private String capabilityTags;
    private String description;
    private String metadata;
    private LocalDateTime lastSyncedAt;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    @TableField(exist = false)
    private Map<String, String> apiParams;
}
