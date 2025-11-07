package com.template.module.role.dto;

import java.util.List;
import lombok.Data;

@Data
public class RolePermissionRequest {

    private List<Long> permissionIds;
}
