package com.template.module.permission.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PermissionCreateRequest {

    @NotBlank(message = "权限名称不能为空")
    private String permissionName;

    @NotBlank(message = "权限编码不能为空")
    private String permissionCode;

    @NotBlank(message = "权限类型不能为空")
    private String type;

    private Long parentId;
    private String path;
    private String method;
    private Integer sort;
}
