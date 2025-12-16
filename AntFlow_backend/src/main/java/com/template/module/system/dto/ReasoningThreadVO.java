package com.template.module.system.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ReasoningThreadVO {

    private Long id;
    private String threadName;
    private String threadIdentifier;
    private String providerCode;
    private String modelName;
    private String status;
    private Integer messageCount;
    private Integer inputTokens;
    private Integer outputTokens;
    private Integer latencyMillis;
    private String errorMessage;
    private String metadata;
    private LocalDateTime lastActivityTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
