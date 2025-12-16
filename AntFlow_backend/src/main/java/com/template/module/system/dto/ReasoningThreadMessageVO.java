package com.template.module.system.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ReasoningThreadMessageVO {

    private Long id;
    private Long threadId;
    private String role;
    private String content;
    private Integer tokenUsage;
    private Integer latencyMillis;
    private LocalDateTime createdAt;
}
