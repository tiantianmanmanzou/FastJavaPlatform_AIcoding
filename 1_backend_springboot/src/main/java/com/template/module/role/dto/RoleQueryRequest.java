package com.template.module.role.dto;

import lombok.Data;

@Data
public class RoleQueryRequest {

    private long page = 1;
    private long pageSize = 10;
    private String roleName;
    private Integer status;
}
