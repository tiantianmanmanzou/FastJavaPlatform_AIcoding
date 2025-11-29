package com.template.module.permission.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PermissionVO {

    private Long id;
    private String permissionName;
    private String permissionCode;
    private String type;
    private Long parentId;
    private String path;
    private String method;
    private Integer sort;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
