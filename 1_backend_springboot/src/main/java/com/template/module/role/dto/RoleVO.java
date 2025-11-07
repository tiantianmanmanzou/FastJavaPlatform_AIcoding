package com.template.module.role.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleVO {

    private Long id;
    private String roleName;
    private String roleCode;
    private String description;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private List<Long> permissionIds;
}
