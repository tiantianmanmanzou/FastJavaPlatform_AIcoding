package com.template.module.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("pm_product_image")
public class ProductImage {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private String imageUrl;
    private Boolean primaryFlag;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
