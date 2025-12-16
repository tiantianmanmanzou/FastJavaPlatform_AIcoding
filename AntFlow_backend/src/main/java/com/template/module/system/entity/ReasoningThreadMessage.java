package com.template.module.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("sys_reasoning_thread_message")
public class ReasoningThreadMessage {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long threadId;
    private String role;
    private String content;
    private Integer tokenUsage;
    private Integer latencyMillis;
    private LocalDateTime createdAt;
}
