package com.template.module.content.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("pm_content_template")
public class ContentTemplate {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String templateName;
    private String platform;
    private String moduleType;
    private String description;
    private String prompt;
    private String tone;
    private String style;
    private String contentLength;
    private String imageStyle;
    private String imageRatio;
    private Integer imageQuantity;
    private String videoStyle;
    private String videoRatio;
    private Integer videoDuration;
    private String apiVendor;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
