package com.template.module.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("pm_product")
public class Product {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String productName;
    private String productCode;
    private String productType;
    private String description;
    private String coverImageUrl;
    private String originImageUrl;
    private String tags;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
