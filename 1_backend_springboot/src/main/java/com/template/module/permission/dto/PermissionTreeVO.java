package com.template.module.permission.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PermissionTreeVO {

    private Long id;
    private String permissionName;
    private String permissionCode;
    private String type;
    private String path;
    private String method;
    private List<PermissionTreeVO> children;
}
