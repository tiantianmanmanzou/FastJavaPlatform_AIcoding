package com.template.module.content.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("pm_content_module_result")
public class ContentModuleResult {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long moduleId;
    private String resultType;
    private String content;
    private String assetUrl;
    private Integer sortOrder;
    private LocalDateTime createTime;
}
