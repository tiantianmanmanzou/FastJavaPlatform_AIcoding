package com.template.module.permission.dto;

import lombok.Data;

@Data
public class PermissionQueryRequest {

    private long page = 1;
    private long pageSize = 10;
    private String permissionName;
    private String permissionCode;
    private String type;
}
