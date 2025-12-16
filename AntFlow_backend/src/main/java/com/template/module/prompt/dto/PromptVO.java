package com.template.module.prompt.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class PromptVO {
    private Long id;
    private String name;
    private String content;
    private String type;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
