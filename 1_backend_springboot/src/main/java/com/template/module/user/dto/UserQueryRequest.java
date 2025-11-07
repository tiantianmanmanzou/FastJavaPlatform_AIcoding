package com.template.module.user.dto;

import lombok.Data;

@Data
public class UserQueryRequest {

    private long page = 1;
    private long pageSize = 10;
    private String username;
    private String email;
    private String roleCode;
    private Integer status;
}
