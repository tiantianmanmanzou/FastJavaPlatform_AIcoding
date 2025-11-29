package com.template.module.content.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("pm_content_module")
public class ContentModule {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private String platform;
    private String moduleType;
    private String moduleTitle;
    private Long templateId;
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
    private Integer sortOrder;
    private String status;
    private LocalDateTime lastGeneratedAt;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
