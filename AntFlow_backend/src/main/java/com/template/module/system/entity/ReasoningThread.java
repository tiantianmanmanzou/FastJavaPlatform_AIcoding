package com.template.module.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("sys_reasoning_thread")
public class ReasoningThread {

    @TableId(type = IdType.AUTO)
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
