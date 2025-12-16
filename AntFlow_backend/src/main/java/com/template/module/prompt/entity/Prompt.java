package com.template.module.prompt.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("pm_prompt")
public class Prompt {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String promptName;
    private String promptContent;
    private String promptType;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
